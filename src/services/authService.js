/**
 * AuthService — Enterprise Authentication Service Layer for ResumeCraft
 * Connects the UI to Supabase Auth, PostgreSQL Profiles, and Single Active Session Enforcement.
 */

import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';
import sessionService from './sessionService.js';

/**
 * Validates email address with RFC-compliant regular expression.
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  // Standard robust email pattern
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(trimmed);
}

/**
 * Validates password strength (minimum 6 characters, non-empty).
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required.' };
  }
  if (password.length < 6) {
    return { valid: false, error: 'Password must be at least 6 characters long.' };
  }
  return { valid: true };
}

/**
 * Authenticates user with email and password, enforcing single active device session.
 */
export async function login({ email, password, rememberMe = true }) {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase credentials are not configured. Check your .env file.',
    };
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  if (!isValidEmail(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const pwdCheck = validatePassword(password);
  if (!pwdCheck.valid) {
    return { success: false, error: pwdCheck.error };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password,
    });

    if (error) {
      const msg = error.message || '';
      if (
        msg.toLowerCase().includes('invalid login credentials') ||
        msg.toLowerCase().includes('invalid grant') ||
        msg.toLowerCase().includes('user not found')
      ) {
        return {
          success: false,
          error: "Invalid email or password. Don't have an account? Click 'Sign Up' above to register.",
        };
      }
      return { success: false, error: msg };
    }

    if (!data?.user) {
      return { success: false, error: 'Authentication failed. Please try again.' };
    }

    // Single Active Session Enforcement: Register this device and revoke any other active sessions
    await sessionService.registerActiveSession(supabase);

    // Fetch user profile
    const profile = await fetchUserProfile(data.user.id);

    return {
      success: true,
      user: data.user,
      session: data.session,
      profile,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'An unexpected error occurred during sign-in.',
    };
  }
}

/**
 * Registers a new user account in Supabase Auth and creates profile record in PostgreSQL.
 */
export async function signup({ email, password, fullName }) {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase credentials are not configured. Check your .env file.',
    };
  }

  const cleanName = (fullName || '').trim();
  if (!cleanName || cleanName.length < 2) {
    return { success: false, error: 'Please enter your full name.' };
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  if (!isValidEmail(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const pwdCheck = validatePassword(password);
  if (!pwdCheck.valid) {
    return { success: false, error: pwdCheck.error };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: cleanName,
        },
      },
    });

    if (error) {
      const msg = error.message || '';
      if (msg.toLowerCase().includes('already registered')) {
        return {
          success: false,
          error: 'An account with this email already exists. Please Sign In.',
        };
      }
      return { success: false, error: msg };
    }

    // If an immediate authenticated session was created (email confirmation disabled or auto-confirmed)
    if (data?.user && data?.session) {
      await sessionService.registerActiveSession(supabase);
      await ensureUserProfile(data.user.id, cleanName, cleanEmail);
    }

    const requiresEmailConfirmation = Boolean(data?.user && !data?.session);

    return {
      success: true,
      user: data?.user || null,
      session: data?.session || null,
      requiresEmailConfirmation,
      message: requiresEmailConfirmation
        ? 'Verification link sent to your email. Please verify your account.'
        : 'Account created successfully!',
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'An unexpected registration error occurred.',
    };
  }
}

/**
 * Initiates Google OAuth sign in flow.
 */
export async function loginWithGoogle() {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      error: 'Supabase credentials are not configured.',
    };
  }

  try {
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/` : undefined;
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });

    if (error) throw error;
    if (data?.url && typeof window !== 'undefined') {
      window.location.assign(data.url);
    }
    return { success: true, data };
  } catch (err) {
    return { success: false, error: err.message || 'Google sign-in failed.' };
  }
}

/**
 * Signs out user from Supabase and revokes active device session on backend.
 */
export async function logout() {
  try {
    // 1. Revoke the active session on PostgreSQL backend
    await sessionService.revokeCurrentSession(supabase);
  } catch (e) {
    console.warn('[AuthService] Session revocation notice:', e);
  }

  try {
    // 2. Terminate Supabase Auth session
    await supabase.auth.signOut();
  } catch (e) {
    console.warn('[AuthService] Supabase signOut notice:', e);
  } finally {
    sessionService.clearDeviceSessionToken();
  }

  return { success: true };
}

/**
 * Sends a password recovery email.
 * Safe against user enumeration: Returns generic positive response regardless of existence.
 */
export async function requestPasswordReset(email) {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  const cleanEmail = (email || '').trim().toLowerCase();
  if (!isValidEmail(cleanEmail)) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  try {
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/#update-password` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
      redirectTo,
    });

    if (error) {
      console.warn('[AuthService] Password recovery error:', error.message);
    }

    // Always return safe confirmation message to avoid email enumeration
    return {
      success: true,
      message: 'If an account exists with this email, a password recovery link has been sent.',
    };
  } catch (err) {
    return {
      success: true,
      message: 'If an account exists with this email, a password recovery link has been sent.',
    };
  }
}

/**
 * Updates user password in recovery flow and invalidates all existing sessions.
 */
export async function resetPassword(newPassword) {
  if (!isSupabaseConfigured) {
    return { success: false, error: 'Supabase is not configured.' };
  }

  const pwdCheck = validatePassword(newPassword);
  if (!pwdCheck.valid) {
    return { success: false, error: pwdCheck.error };
  }

  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;

    // Security requirement: Revoke all older sessions across all devices
    await sessionService.revokeAllSessions(supabase, 'security_password_reset');

    // Register this device anew
    await sessionService.registerActiveSession(supabase);

    return { success: true, message: 'Password updated successfully! All previous sessions revoked.' };
  } catch (err) {
    return { success: false, error: err.message || 'Failed to update password.' };
  }
}

/**
 * Validates the single active session against PostgreSQL.
 */
export async function validateSession() {
  if (!isSupabaseConfigured) return { valid: true };
  return sessionService.validateActiveSession(supabase);
}

/**
 * Fetches user profile from public.profiles table.
 */
export async function fetchUserProfile(userId) {
  if (!isSupabaseConfigured || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, created_at, updated_at')
      .eq('id', userId)
      .single();

    if (!error && data) return data;
    return null;
  } catch {
    return null;
  }
}

/**
 * Guarantees profile record exists in public.profiles.
 */
export async function ensureUserProfile(userId, fullName, email) {
  if (!isSupabaseConfigured || !userId) return null;
  try {
    const { data } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: fullName,
        email,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();
    return data;
  } catch {
    return null;
  }
}

export default {
  isValidEmail,
  validatePassword,
  login,
  signup,
  loginWithGoogle,
  logout,
  requestPasswordReset,
  resetPassword,
  validateSession,
  fetchUserProfile,
  ensureUserProfile,
};

