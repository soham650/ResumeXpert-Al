import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured, supabaseConfigInfo } from '../lib/supabaseClient.js';
import authService from '../services/authService.js';
import sessionService from '../services/sessionService.js';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('signin'); // 'signin' | 'signup' | 'forgot' | 'update_password'
  const [sessionRevokedError, setSessionRevokedError] = useState('');
  const [isGuest, setIsGuest] = useState(() => {
    try {
      return typeof window !== 'undefined' && localStorage.getItem('resumecraft_guest_mode') === 'true';
    } catch {
      return false;
    }
  });

  /**
   * Fetch profile row for the user.
   */
  const fetchProfile = useCallback(async (userId) => {
    if (!isSupabaseConfigured || !userId) {
      setProfile(null);
      return null;
    }
    try {
      const data = await authService.fetchUserProfile(userId);
      if (data) {
        setProfile(data);
        return data;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  /**
   * Validates single active session on the backend.
   * If revoked, terminates local state and sets sessionRevokedError.
   */
  const checkActiveSessionValidity = useCallback(async () => {
    if (!isSupabaseConfigured) return true;

    try {
      const result = await sessionService.validateActiveSession(supabase);
      if (result && result.valid === false) {
        if (result.reason === 'new_login_on_another_device') {
          const notice = 'Your account was signed in on another device. Please log in again.';
          setSessionRevokedError(notice);
          setUser(null);
          setSession(null);
          setProfile(null);
          sessionService.clearDeviceSessionToken();
          setAuthModalTab('signin');
          setAuthModalOpen(true);
          return false;
        }
      }
      return true;
    } catch (e) {
      console.warn('[AuthContext] Session validity check warning:', e);
      return true;
    }
  }, []);

  // Initialize session and listen for auth state transitions
  useEffect(() => {
    let mounted = true;

    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }

    // 0. Check for OAuth error in URL hash / query params
    if (typeof window !== 'undefined') {
      try {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
        const searchParams = new URLSearchParams(window.location.search);
        const oauthError = hashParams.get('error_description') || searchParams.get('error_description') || hashParams.get('error');
        if (oauthError) {
          console.error('[AuthContext] OAuth error in URL:', oauthError);
          setSessionRevokedError(`Google Sign-In Failed: ${decodeURIComponent(oauthError.replace(/\+/g, ' '))}`);
          setAuthModalTab('signin');
          setAuthModalOpen(true);
        }
      } catch (err) {
        console.warn('[AuthContext] Error parsing URL auth error:', err);
      }
    }

    // 1. Get initial session
    supabase.auth.getSession().then(async ({ data: { session: initialSession } }) => {
      if (!mounted) return;
      if (initialSession?.user) {
        setSession(initialSession);
        setUser(initialSession.user);
        setIsGuest(false);
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('resumecraft_guest_mode');
          }
        } catch {}
        await fetchProfile(initialSession.user.id);
        // Ensure device session is registered for this instance
        await sessionService.registerActiveSession(supabase);
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    // 2. Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mounted) return;

      setSession(currentSession);
      const currentUser = currentSession?.user || null;
      setUser(currentUser);

      if (event === 'SIGNED_IN' && currentUser) {
        setSessionRevokedError('');
        setIsGuest(false);
        try {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('resumecraft_guest_mode');
          }
        } catch {}

        await fetchProfile(currentUser.id);
        // Single Active Session: Register device session & atomically revoke any prior active devices
        await sessionService.registerActiveSession(supabase);
      } else if (event === 'SIGNED_OUT') {
        setProfile(null);
        sessionService.clearDeviceSessionToken();
      } else if (event === 'PASSWORD_RECOVERY') {
        setAuthModalTab('update_password');
        setAuthModalOpen(true);
      } else if (currentUser) {
        await fetchProfile(currentUser.id);
      }
    });

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, [fetchProfile]);

  // Periodic heartbeat & tab focus session validation (Single active device enforcement)
  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;

    // Heartbeat check every 30 seconds
    const interval = setInterval(() => {
      checkActiveSessionValidity();
    }, 30000);

    // Immediate check when tab becomes active / focused
    const handleVisibilityOrFocus = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        checkActiveSessionValidity();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('visibilitychange', handleVisibilityOrFocus);
      window.addEventListener('focus', handleVisibilityOrFocus);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('visibilitychange', handleVisibilityOrFocus);
        window.removeEventListener('focus', handleVisibilityOrFocus);
      }
    };
  }, [user, checkActiveSessionValidity]);

  /**
   * Sign In with Email and Password (connects to Supabase signInWithPassword)
   */
  const signIn = async ({ email, password, rememberMe = true }) => {
    setSessionRevokedError('');
    const result = await authService.login({ email, password, rememberMe });
    if (result.success) {
      setUser(result.user);
      setSession(result.session);
      if (result.profile) setProfile(result.profile);
      setIsGuest(false);
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('resumecraft_guest_mode');
        }
      } catch {}
    }
    return result;
  };

  /**
   * Sign Up with Email, Password and Full Name
   */
  const signUp = async ({ email, password, fullName }) => {
    setSessionRevokedError('');
    const result = await authService.signup({ email, password, fullName });
    if (result.success && result.user && result.session) {
      setUser(result.user);
      setSession(result.session);
      await fetchProfile(result.user.id);
      setIsGuest(false);
      try {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('resumecraft_guest_mode');
        }
      } catch {}
    }
    return result;
  };

  /**
   * Sign In with Google OAuth
   */
  const signInWithGoogle = async () => {
    setSessionRevokedError('');
    return authService.loginWithGoogle();
  };

  /**
   * Continue as Guest (local storage mode without cloud database account)
   */
  const continueAsGuest = () => {
    setIsGuest(true);
    setSessionRevokedError('');
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('resumecraft_guest_mode', 'true');
      }
    } catch (e) {
      console.warn('LocalStorage unavailable for guest mode', e);
    }
    closeAuthModal();
    return { success: true, isGuest: true };
  };

  /**
   * Sign Out
   */
  const signOut = async () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('resumecraft_guest_mode');
      }
    } catch {}
    setIsGuest(false);
    setSessionRevokedError('');
    setUser(null);
    setSession(null);
    setProfile(null);

    return authService.logout();
  };

  /**
   * Send Password Reset Email
   */
  const resetPassword = async (email) => {
    return authService.requestPasswordReset(email);
  };

  /**
   * Update Password (authenticated recovery session)
   */
  const updatePassword = async (newPassword) => {
    return authService.resetPassword(newPassword);
  };

  /**
   * Update User Profile Name
   */
  const updateProfile = async ({ fullName }) => {
    if (!isSupabaseConfigured || !user) {
      return { success: false, error: 'User is not authenticated.' };
    }
    try {
      const updated = await authService.ensureUserProfile(user.id, fullName, user.email);
      if (updated) {
        setProfile(updated);
        return { success: true, data: updated };
      }
      return { success: false, error: 'Could not update profile.' };
    } catch (err) {
      return { success: false, error: err.message || 'Failed to update profile.' };
    }
  };

  const openAuthModal = (tab = 'signin') => {
    setAuthModalTab(tab);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isAuthenticated: Boolean(user),
    isGuest: Boolean(!user && isGuest),
    sessionRevokedError,
    clearSessionRevokedError: () => setSessionRevokedError(''),
    isConfigured: isSupabaseConfigured,
    configInfo: supabaseConfigInfo,
    authModalOpen,
    authModalTab,
    openAuthModal,
    closeAuthModal,
    setAuthModalTab,
    signIn,
    signUp,
    signInWithGoogle,
    continueAsGuest,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
    validateActiveSession: checkActiveSessionValidity,
    refreshProfile: () => user && fetchProfile(user.id),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
