import { createClient } from '@supabase/supabase-js';

/**
 * Safely resolves environment variables in both Vite (browser) and Node.js (test) environments.
 */
const getEnvVariable = (key) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
};

const supabaseUrl = getEnvVariable('VITE_SUPABASE_URL') || getEnvVariable('SUPABASE_URL');
const supabaseAnonKey = getEnvVariable('VITE_SUPABASE_ANON_KEY') || 
                        getEnvVariable('VITE_SUPABASE_PUBLISHABLE_KEY') || 
                        getEnvVariable('SUPABASE_PUBLISHABLE_KEY');

/**
 * Check if valid Supabase credentials have been configured.
 * A valid URL is an https URL that is not a default dummy placeholder.
 */
export const checkIsConfigured = (url, key) => {
  if (!url || !key) return false;
  if (typeof url !== 'string' || typeof key !== 'string') return false;
  const trimmedUrl = url.trim();
  const trimmedKey = key.trim();
  if (trimmedUrl.length < 15 || trimmedKey.length < 10) return false;
  if (trimmedUrl.includes('your-project') || trimmedKey.includes('your-anon-key')) return false;
  try {
    const parsed = new URL(trimmedUrl);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:';
  } catch {
    return false;
  }
};

export const isSupabaseConfigured = checkIsConfigured(supabaseUrl, supabaseAnonKey);

/**
 * Fallback dummy client for when Supabase is not configured yet.
 * Allows the React application to render normally in offline/local-only mode.
 */
const createDummyClient = () => {
  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      getUser: async () => ({ data: { user: null }, error: null }),
      signInWithPassword: async () => ({ 
        data: { user: null, session: null }, 
        error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.') 
      }),
      signInWithOAuth: async () => ({ 
        data: { provider: 'google', url: null }, 
        error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.') 
      }),
      signUp: async () => ({ 
        data: { user: null, session: null }, 
        error: new Error('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.') 
      }),
      signOut: async () => ({ error: null }),
      resetPasswordForEmail: async () => ({ 
        data: null, 
        error: new Error('Supabase is not configured.') 
      }),
      updateUser: async () => ({ 
        data: { user: null }, 
        error: new Error('Supabase is not configured.') 
      }),
      onAuthStateChange: () => ({
        data: {
          subscription: {
            unsubscribe: () => {},
          },
        },
      }),
    },
    from: () => {
      const chain = {
        select: () => chain,
        insert: () => ({
          select: () => ({
            single: () => Promise.resolve({ data: null, error: new Error('Supabase is not configured.') }),
          }),
        }),
        upsert: () => Promise.resolve({ data: null, error: null }),
        update: () => chain,
        delete: () => chain,
        eq: () => chain,
        order: () => chain,
        limit: () => chain,
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
      };
      return chain;
    },
    functions: {
      invoke: async () => ({
        data: null,
        error: new Error('Supabase functions are not configured in local environment.'),
      }),
    },
    rpc: async (fnName) => {
      if (fnName === 'validate_user_session') {
        return { data: { valid: true }, error: null };
      }
      if (fnName === 'register_user_session') {
        return { data: { success: true, session_id: 'dummy-session-id', previous_sessions_revoked: 0 }, error: null };
      }
      if (fnName === 'revoke_user_session' || fnName === 'revoke_all_user_sessions') {
        return { data: { success: true, revoked_count: 1 }, error: null };
      }
      return { data: null, error: null };
    },
  };
};

/**
 * Instantiated Supabase Client.
 */
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createDummyClient();

export const supabaseConfigInfo = {
  isConfigured: isSupabaseConfigured,
  url: supabaseUrl ? (supabaseUrl.includes('your-project') ? '[PLACEHOLDER]' : supabaseUrl) : '[MISSING]',
  hasKey: Boolean(supabaseAnonKey && !supabaseAnonKey.includes('your-anon-key')),
};

export default supabase;
