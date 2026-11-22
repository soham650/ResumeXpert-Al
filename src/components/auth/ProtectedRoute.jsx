import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { ShieldAlert, LogIn, Loader2 } from 'lucide-react';

/**
 * ProtectedRoute Component
 * Guards private SaaS views, checking:
 * 1. Authentication status
 * 2. Active session validity (enforcing Single-Active-Device rule)
 * 3. Graceful fallback & login trigger
 */
export const ProtectedRoute = ({ children, fallback = null }) => {
  const { 
    isAuthenticated, 
    loading, 
    sessionRevokedError, 
    openAuthModal, 
    isGuest 
  } = useAuth();

  // 1. Initial auth resolution loading state
  if (loading) {
    return (
      <div className="min-h-[300px] flex flex-col items-center justify-center p-8 text-center">
        <Loader2 className="w-8 h-8 text-[#6335F5] animate-spin mb-3" />
        <p className="text-xs font-semibold text-gray-500">Verifying security session...</p>
      </div>
    );
  }

  // 2. Active Session Revoked by another device
  if (sessionRevokedError) {
    return (
      <div className="max-w-md mx-auto my-12 p-6 rounded-3xl bg-amber-50 border border-amber-200 shadow-sm text-center">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-3 shadow-xs">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-extrabold text-[#111827]">Session Terminated</h3>
        <p className="text-xs text-amber-900 mt-1 leading-relaxed">
          {sessionRevokedError}
        </p>
        <button
          type="button"
          onClick={() => openAuthModal('signin')}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6335F5] hover:bg-[#5025D1] text-white text-xs font-bold transition-all shadow-sm"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Sign In on This Device</span>
        </button>
      </div>
    );
  }

  // 3. Unauthenticated (and not in guest mode)
  if (!isAuthenticated && !isGuest) {
    if (fallback) return fallback;

    return (
      <div className="max-w-md mx-auto my-12 p-8 rounded-3xl bg-white border border-purple-100 shadow-lg text-center">
        <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#6335F5] flex items-center justify-center mx-auto mb-3 shadow-xs">
          <LogIn className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-black text-[#111827]">Sign In Required</h3>
        <p className="text-xs text-gray-500 mt-1 mb-5 leading-relaxed">
          This area requires an active ResumeCraft account to save and manage cloud resumes.
        </p>
        <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
          <button
            type="button"
            onClick={() => openAuthModal('signin')}
            className="btn-primary py-2.5 px-5 text-xs font-bold"
          >
            Sign In Now
          </button>
          <button
            type="button"
            onClick={() => openAuthModal('signup')}
            className="btn-secondary py-2.5 px-5 text-xs font-bold"
          >
            Create Free Account
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;

