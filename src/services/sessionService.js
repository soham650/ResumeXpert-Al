/**
 * SessionService — Enterprise Single-Active-Session Architecture for ResumeCraft
 * Handles:
 * - Cryptographic device session token generation
 * - SHA-256 hashing for database lookup without storing raw tokens
 * - Atomic registration of new active sessions & revocation of older devices
 * - Periodic and on-demand session validity heartbeats
 * - Revocation detection and broadcast
 */

const DEVICE_SESSION_KEY = 'resumecraft_device_session_token';

/**
 * Generates a cryptographically strong unique random identifier for this device/browser session.
 */
export function generateDeviceSessionToken() {
  if (typeof crypto !== 'undefined') {
    if (typeof crypto.randomUUID === 'function') {
      return `rc_sess_${crypto.randomUUID()}_${Date.now()}`;
    }
    if (typeof crypto.getRandomValues === 'function') {
      const bytes = new Uint8Array(24);
      crypto.getRandomValues(bytes);
      const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
      return `rc_sess_${hex}_${Date.now()}`;
    }
  }
  // Math.random fallback (e.g. legacy/mock runtimes)
  const rand = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);
  return `rc_sess_${rand}_${Date.now()}`;
}

/**
 * Computes a SHA-256 hash string from a given session token.
 * Uses Web Crypto in modern browsers and Node's crypto module in test environments.
 */
export async function hashSessionToken(token) {
  if (!token) return '';

  // 1. Web Crypto API (Browser)
  if (typeof crypto !== 'undefined' && crypto.subtle && typeof crypto.subtle.digest === 'function') {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  // 2. Node.js crypto module (Test suites)
  if (typeof window === 'undefined') {
    try {
      const nodeCrypto = await import(/* @vite-ignore */ 'crypto');
      return nodeCrypto.createHash('sha256').update(token).digest('hex');
    } catch {}
  }

  // Basic deterministic hash fallback for legacy environments
  let hash = 0;
  for (let i = 0; i < token.length; i++) {
    hash = (hash << 5) - hash + token.charCodeAt(i);
    hash |= 0;
  }
  return `hash_${Math.abs(hash)}_${token.length}`;
}

/**
 * Retrieves or initializes the device session token for this browser instance.
 */
export function getOrCreateDeviceSessionToken() {
  if (typeof window === 'undefined') {
    return generateDeviceSessionToken();
  }

  try {
    // Prefer sessionStorage so each browser profile / separate window/device has a distinct session
    let token = window.sessionStorage?.getItem(DEVICE_SESSION_KEY);
    if (!token) {
      token = generateDeviceSessionToken();
      window.sessionStorage?.setItem(DEVICE_SESSION_KEY, token);
    }
    return token;
  } catch {
    return generateDeviceSessionToken();
  }
}

/**
 * Clears the local device session token.
 */
export function clearDeviceSessionToken() {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage?.removeItem(DEVICE_SESSION_KEY);
    window.localStorage?.removeItem(DEVICE_SESSION_KEY);
  } catch (e) {
    console.warn('[SessionService] Could not clear session token storage', e);
  }
}

/**
 * Registers this device session with the Supabase database.
 * Atomically revokes all previous active sessions for this user.
 */
export async function registerActiveSession(supabaseClient, tokenOverride = null) {
  if (!supabaseClient) {
    return { success: false, error: 'Supabase client is not available.' };
  }

  const token = tokenOverride || getOrCreateDeviceSessionToken();
  const tokenHash = await hashSessionToken(token);
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Node/Test';

  try {
    const { data, error } = await supabaseClient.rpc('register_user_session', {
      p_session_identifier_hash: tokenHash,
      p_user_agent: userAgent.slice(0, 500),
      p_ip_address: null,
    });

    if (error) {
      console.warn('[SessionService] RPC register_user_session error:', error.message);
      return { success: false, error: error.message };
    }

    return { 
      success: true, 
      token, 
      tokenHash,
      sessionId: data?.session_id,
      previousRevoked: data?.previous_sessions_revoked || 0 
    };
  } catch (err) {
    console.warn('[SessionService] Unexpected error during session registration:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Validates whether this device's session is still active and valid.
 * If the account was logged into from another device, this returns valid: false with reason: 'new_login_on_another_device'.
 */
export async function validateActiveSession(supabaseClient, tokenOverride = null) {
  if (!supabaseClient) {
    return { valid: true }; // offline fallback
  }

  const token = tokenOverride || (typeof window !== 'undefined' ? window.sessionStorage?.getItem(DEVICE_SESSION_KEY) : null);
  if (!token) {
    // No device session token registered yet
    return { valid: false, reason: 'missing_device_token' };
  }

  const tokenHash = await hashSessionToken(token);

  try {
    const { data, error } = await supabaseClient.rpc('validate_user_session', {
      p_session_identifier_hash: tokenHash,
    });

    if (error) {
      console.warn('[SessionService] RPC validate_user_session error:', error.message);
      return { valid: true }; // Avoid blocking on transient network drop
    }

    if (!data || data.valid === false) {
      return {
        valid: false,
        reason: data?.reason || 'session_revoked',
        revokedAt: data?.revoked_at,
      };
    }

    return { valid: true };
  } catch (err) {
    console.warn('[SessionService] Error validating active session:', err);
    return { valid: true };
  }
}

/**
 * Revokes the current device session on logout.
 */
export async function revokeCurrentSession(supabaseClient, tokenOverride = null) {
  if (!supabaseClient) return { success: true };

  const token = tokenOverride || (typeof window !== 'undefined' ? window.sessionStorage?.getItem(DEVICE_SESSION_KEY) : null);
  if (!token) return { success: true };

  const tokenHash = await hashSessionToken(token);

  try {
    await supabaseClient.rpc('revoke_user_session', {
      p_session_identifier_hash: tokenHash,
      p_reason: 'user_logged_out',
    });
  } catch (err) {
    console.warn('[SessionService] Could not revoke session on server:', err);
  } finally {
    clearDeviceSessionToken();
  }

  return { success: true };
}

/**
 * Revokes all sessions for the current user (e.g. after password reset).
 */
export async function revokeAllSessions(supabaseClient, reason = 'security_password_reset') {
  if (!supabaseClient) return { success: true };

  try {
    const { data, error } = await supabaseClient.rpc('revoke_all_user_sessions', {
      p_reason: reason,
    });
    if (error) throw error;
    return { success: true, count: data?.revoked_count || 0 };
  } catch (err) {
    console.warn('[SessionService] Error revoking all sessions:', err);
    return { success: false, error: err.message };
  }
}

export default {
  generateDeviceSessionToken,
  hashSessionToken,
  getOrCreateDeviceSessionToken,
  clearDeviceSessionToken,
  registerActiveSession,
  validateActiveSession,
  revokeCurrentSession,
  revokeAllSessions,
};
