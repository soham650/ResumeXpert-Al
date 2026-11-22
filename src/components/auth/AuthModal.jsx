import React, { useState, useEffect } from 'react';
import { 
  X, Mail, Lock, User, Eye, EyeOff, Sparkles, AlertCircle, 
  CheckCircle2, ArrowRight, ShieldCheck, BarChart3, FileText, 
  Cloud, TrendingUp, LogIn, KeyRound, Info, ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

/**
 * ResumeCraft Official Authentication Modal
 * Features:
 * - 2-Column Split Layout matching Reference Design
 * - Left Column: Dark violet AI hero showcase with feature list, 3D resume illustration & "Dream Big... Get Hired!"
 * - Right Column: Clean white form with Google OAuth, Email/Password login, Sign Up toggle, and Continue as Guest
 * - Direct Supabase Auth Integration with live error handling and fallback guest persistence
 */
const AuthModal = () => {
  const { 
    authModalOpen, 
    authModalTab, 
    closeAuthModal, 
    setAuthModalTab, 
    signIn, 
    signUp, 
    signInWithGoogle,
    continueAsGuest,
    resetPassword, 
    updatePassword,
    isConfigured,
    configInfo,
    sessionRevokedError
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Reset errors and password fields when switching tabs
  useEffect(() => {
    setErrorMsg('');
    setSuccessMsg('');
    setPassword('');
    setConfirmPassword('');
  }, [authModalTab]);

  if (!authModalOpen) return null;

  // Handle standard email & password form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      if (authModalTab === 'signin') {
        const result = await signIn({ email, password, rememberMe });
        if (!result.success) {
          const errLower = (result.error || '').toLowerCase();
          if (errLower.includes('invalid login credentials') || errLower.includes('invalid_grant') || errLower.includes('user not found')) {
            setErrorMsg("No account found with this email or password incorrect. Please click 'Sign Up' above to create an account first.");
          } else {
            setErrorMsg(result.error);
          }
        } else {
          setSuccessMsg('Signed in successfully! Welcome back.');
          setTimeout(() => {
            closeAuthModal();
          }, 700);
        }
      } else if (authModalTab === 'signup') {
        if (!fullName || fullName.trim().length < 2) {
          setErrorMsg('Please enter your full name.');
          setSubmitting(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match.');
          setSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters.');
          setSubmitting(false);
          return;
        }
        const result = await signUp({ email, password, fullName });
        if (!result.success) {
          setErrorMsg(result.error);
        } else {
          setSuccessMsg(result.message || 'Account created successfully in database!');
          if (!result.requiresEmailConfirmation) {
            setTimeout(() => {
              closeAuthModal();
            }, 900);
          }
        }
      } else if (authModalTab === 'forgot') {
        const result = await resetPassword(email);
        if (!result.success) {
          setErrorMsg(result.error);
        } else {
          setSuccessMsg(result.message || 'Password reset link sent to your email.');
        }
      } else if (authModalTab === 'update_password') {
        if (password !== confirmPassword) {
          setErrorMsg('Passwords do not match.');
          setSubmitting(false);
          return;
        }
        if (password.length < 6) {
          setErrorMsg('Password must be at least 6 characters.');
          setSubmitting(false);
          return;
        }
        const result = await updatePassword(password);
        if (!result.success) {
          setErrorMsg(result.error);
        } else {
          setSuccessMsg('Password updated! You can now sign in with your new password.');
          setTimeout(() => {
            setAuthModalTab('signin');
          }, 1200);
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle Google OAuth Sign In
  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setGoogleLoading(true);

    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('resumecraft_guest_mode');
      }
      const result = await signInWithGoogle();
      if (!result.success) {
        setErrorMsg(result.error);
        setGoogleLoading(false);
      }
      // Supabase redirects to Google login page on success
    } catch (err) {
      setErrorMsg(err.message || 'Google sign-in could not be completed.');
      setGoogleLoading(false);
    }
  };

  // Handle Continue as Guest
  const handleContinueAsGuest = () => {
    setGuestLoading(true);
    setErrorMsg('');
    setSuccessMsg('Continuing as Guest. Resumes will be saved locally on this browser.');
    
    setTimeout(() => {
      continueAsGuest();
      setGuestLoading(false);
    }, 400);
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
      onClick={closeAuthModal}
    >
      <div 
        className="relative bg-white rounded-3xl sm:rounded-[32px] shadow-[0_25px_80px_rgba(27,13,92,0.4)] border border-purple-200/80 max-w-4xl w-full overflow-hidden my-auto animate-scale-up grid grid-cols-1 lg:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ========================================================= */}
        {/* LEFT COLUMN: Dark Violet AI Showcase with 3D Illustration */}
        {/* ========================================================= */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 xl:p-9 bg-gradient-to-br from-[#180b54] via-[#24106e] to-[#3f1190] text-white relative overflow-hidden select-none">
          {/* Ambient Background Glows */}
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-purple-500/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-indigo-500/25 blur-3xl pointer-events-none" />

          {/* Golden Sparkle Stars Decoration */}
          <div className="absolute top-12 right-8 text-amber-300/80 text-xl animate-pulse pointer-events-none">✦</div>
          <div className="absolute top-52 right-12 text-amber-300/70 text-sm animate-pulse pointer-events-none" style={{ animationDelay: '1s' }}>✦</div>
          <div className="absolute bottom-40 left-6 text-amber-300/60 text-xs animate-pulse pointer-events-none" style={{ animationDelay: '1.5s' }}>✦</div>

          {/* Top Brand Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-sm">
                <svg className="w-5 h-5 text-purple-200" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2v6h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <polygon points="12 10 13 12 15 12.5 13.5 14 14 16 12 15 10 16 10.5 14 9 12.5 11 12" fill="#F59E0B" stroke="#F59E0B" strokeWidth="0.5" />
                </svg>
              </div>
              <div>
                <div className="text-xl font-black tracking-tight leading-none text-white">
                  Resume<span className="text-[#C4B5FD]">Craft</span>
                </div>
                <div className="text-[10px] text-purple-200/90 font-semibold tracking-wide mt-0.5">
                  Build • Optimize • Get Hired
                </div>
              </div>
            </div>

            {/* Main Headline */}
            <div className="mt-8 space-y-2">
              <h2 className="text-2xl xl:text-3xl font-extrabold tracking-tight leading-tight text-white">
                Create a Winning <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-amber-200 font-black">
                  Resume with AI
                </span>
              </h2>
              <p className="text-xs text-purple-100/80 leading-relaxed font-normal">
                Your complete AI-powered resume builder for better job opportunities.
              </p>
            </div>

            {/* 4 Feature Points with Icon Badges */}
            <div className="mt-6 space-y-3.5">
              {/* Feature 1 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-purple-200 mt-0.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">AI-Powered Optimization</div>
                  <div className="text-[11px] text-purple-200/75">Get higher ATS scores</div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-purple-200 mt-0.5 shadow-sm">
                  <BarChart3 className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">ATS Analysis</div>
                  <div className="text-[11px] text-purple-200/75">Know your score instantly</div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-purple-200 mt-0.5 shadow-sm">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">Professional Templates</div>
                  <div className="text-[11px] text-purple-200/75">6+ modern templates</div>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 text-purple-200 mt-0.5 shadow-sm">
                  <Cloud className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white leading-tight">Save & Access Anywhere</div>
                  <div className="text-[11px] text-purple-200/75">Your resumes, always safe</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3D Illustration Graphic (Floating Document on Pedestal with ATS 95% Orbit) */}
          <div className="relative mt-6 mb-4 flex items-center justify-center">
            {/* Glowing Cylindrical Stage Pedestal */}
            <div className="relative w-48 h-36 flex items-center justify-center">
              {/* Disc base */}
              <div className="absolute bottom-2 w-36 h-10 rounded-full bg-gradient-to-r from-[#2e137a] via-[#4d16b3] to-[#2e137a] border border-purple-400/30 shadow-[0_15px_30px_rgba(0,0,0,0.6)]" />
              <div className="absolute bottom-4 w-32 h-8 rounded-full bg-[#3c1396] border border-purple-400/20" />

              {/* 3D Floating Mini Resume Sheet */}
              <div className="absolute bottom-8 w-28 h-36 bg-white/95 rounded-xl p-2.5 shadow-2xl border border-purple-200 text-[#1F2937] transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="flex items-center gap-1.5 pb-1.5 border-b border-gray-100">
                  <div className="w-4 h-4 rounded-full bg-purple-600 text-white flex items-center justify-center text-[7px] font-black">
                    U
                  </div>
                  <div className="text-[8px] font-extrabold text-purple-900 leading-none">RESUME</div>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="w-12 h-1 bg-purple-400 rounded-full" />
                  <div className="w-20 h-1 bg-gray-200 rounded-full" />
                  <div className="w-16 h-1 bg-gray-200 rounded-full" />
                  <div className="w-18 h-1 bg-gray-200 rounded-full" />
                </div>
                <div className="mt-2.5 space-y-1">
                  <div className="w-10 h-1 bg-indigo-300 rounded-full" />
                  <div className="w-22 h-1 bg-gray-150 rounded-full" />
                  <div className="w-14 h-1 bg-gray-150 rounded-full" />
                </div>
              </div>

              {/* Orbiting Satin Energy Arrow */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 192 144" fill="none">
                <path 
                  d="M24 100 C 15 60, 45 30, 96 35 C 150 40, 175 80, 160 115" 
                  stroke="url(#orbitArrowGrad)" 
                  strokeWidth="3.5" 
                  strokeLinecap="round" 
                  strokeDasharray="4 2"
                />
                <defs>
                  <linearGradient id="orbitArrowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#A855F7" />
                    <stop offset="50%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#38BDF8" />
                  </linearGradient>
                </defs>
              </svg>

              {/* ATS 95% Floating Badge */}
              <div className="absolute top-2 right-1 bg-[#181142] border border-purple-400/60 rounded-xl px-2.5 py-1 shadow-lg flex items-center gap-1.5 animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="text-right">
                  <div className="text-[7px] font-bold text-purple-300 leading-none">ATS</div>
                  <div className="text-[10px] font-black text-white leading-none">95%</div>
                </div>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 stroke-[3]" />
              </div>
            </div>
          </div>

          {/* Bottom-Left Script Calligraphy Accent: "Dream Big... Get Hired!" */}
          <div className="relative pt-2">
            <div className="inline-block">
              <span className="font-serif italic font-bold text-lg xl:text-xl text-purple-200 tracking-wide drop-shadow-sm">
                Dream Big... <br />
                <span className="text-white">Get Hired!</span>
              </span>
              {/* Golden scribble underline arc */}
              <svg className="w-24 h-3 text-amber-400 mt-0.5" viewBox="0 0 100 12" fill="none">
                <path d="M2 9 C 30 2, 70 2, 98 9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: White Form (Google, Email/Password, Guest)  */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 p-6 sm:p-9 xl:p-10 flex flex-col justify-between bg-white relative">
          {/* Top Bar: Switch to Sign Up / Sign In & Close Button */}
          <div className="flex items-center justify-between pb-2">
            <div>
              {authModalTab === 'signin' && (
                <div className="text-xs text-gray-500 font-medium">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('signup')}
                    className="font-bold text-[#6335F5] hover:text-[#5025D1] hover:underline"
                  >
                    Sign Up &rarr;
                  </button>
                </div>
              )}
              {authModalTab === 'signup' && (
                <div className="text-xs text-gray-500 font-medium">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalTab('signin')}
                    className="font-bold text-[#6335F5] hover:text-[#5025D1] hover:underline"
                  >
                    Sign In &rarr;
                  </button>
                </div>
              )}
              {(authModalTab === 'forgot' || authModalTab === 'update_password') && (
                <button
                  type="button"
                  onClick={() => setAuthModalTab('signin')}
                  className="text-xs font-bold text-[#6335F5] hover:underline flex items-center gap-1"
                >
                  &larr; Back to Sign In
                </button>
              )}
            </div>

            {/* Circular Close Button */}
            <button
              onClick={closeAuthModal}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content Wrapper */}
          <div className="py-2">
            {/* Center Brand Icon + Title */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-[#6335F5] mb-2.5 shadow-sm">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6a2 2 0 00-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2v6h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <polygon points="12 10 13 12 15 12.5 13.5 14 14 16 12 15 10 16 10.5 14 9 12.5 11 12" fill="#7C3AED" stroke="#7C3AED" strokeWidth="0.5" />
                </svg>
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
                Resume<span className="text-[#6335F5]">Craft</span>
              </h3>

              <h4 className="text-lg sm:text-xl font-extrabold text-[#111827] mt-2">
                {authModalTab === 'signin' && 'Welcome Back!'}
                {authModalTab === 'signup' && 'Create Your Account!'}
                {authModalTab === 'forgot' && 'Reset Password'}
                {authModalTab === 'update_password' && 'Set New Password'}
              </h4>

              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                {authModalTab === 'signin' && 'Sign in to continue your journey'}
                {authModalTab === 'signup' && 'Start building your ATS-winning resume today'}
                {authModalTab === 'forgot' && 'Enter your email to receive recovery instructions'}
                {authModalTab === 'update_password' && 'Enter your new secure password below'}
              </p>
            </div>

            {/* Google OAuth Button */}
            {(authModalTab === 'signin' || authModalTab === 'signup') && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={googleLoading || submitting}
                  className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-gray-300 hover:border-purple-300 bg-white hover:bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {/* Authentic 4-Color Google G Logo */}
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.27v3.15C3.25 21.3 7.31 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.27C.46 8.2 0 10.04 0 12s.46 3.8 1.27 5.42l4.01-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.27 6.58l4.01 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                  <span>
                    {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
                  </span>
                </button>

                {/* Horizontal Divider with "or" */}
                <div className="relative flex items-center justify-center my-3">
                  <div className="w-full border-t border-gray-200" />
                  <span className="bg-white px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                    or
                  </span>
                </div>
              </div>
            )}

            {/* Missing Configuration Notice */}
            {!isConfigured && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-start gap-2.5 mb-3">
                <Info className="w-4 h-4 shrink-0 text-amber-600 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold">Offline / Local Mode:</span> Supabase cloud auth is optional. You can <strong>Continue as Guest</strong> below to build and download resumes 100% locally.
                </div>
              </div>
            )}

            {/* Session Revoked by Another Device Alert */}
            {sessionRevokedError && (
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5 mb-3 font-semibold shadow-2xs animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                <div className="flex-1 leading-snug">{sessionRevokedError}</div>
              </div>
            )}

            {/* Error Message Alert */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2.5 mb-3 animate-shake">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                <div className="flex-1 font-medium">{errorMsg}</div>
              </div>
            )}

            {/* Success Message Alert */}
            {successMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start gap-2.5 mb-3">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                <div className="flex-1 font-medium">{successMsg}</div>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Full Name (Sign Up only) */}
              {authModalTab === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#6335F5] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Address (Sign In, Sign Up, Forgot) */}
              {authModalTab !== 'update_password' && (
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      className="w-full text-xs sm:text-sm pl-10 pr-3.5 py-2.5 rounded-xl border border-gray-300 focus:border-[#6335F5] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Password (Sign In, Sign Up, Update Password) */}
              {authModalTab !== 'forgot' && (
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    {authModalTab === 'update_password' ? 'New Password' : 'Password'}
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-[#6335F5] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                      tabIndex="-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Password (Sign Up & Update Password) */}
              {(authModalTab === 'signup' || authModalTab === 'update_password') && (
                <div>
                  <label className="block text-xs font-bold text-[#111827] mb-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="w-full text-xs sm:text-sm pl-10 pr-10 py-2.5 rounded-xl border border-gray-300 focus:border-[#6335F5] focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                      tabIndex="-1"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Options Row: Remember Me & Forgot Password (Sign In only) */}
              {authModalTab === 'signin' && (
                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none text-gray-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[#6335F5] focus:ring-purple-400 border-gray-300"
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setAuthModalTab('forgot')}
                    className="font-medium text-[#6335F5] hover:text-[#4F25CC] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="submit"
                disabled={submitting || googleLoading || guestLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#6335F5] to-[#7C3AED] hover:from-[#5025D1] hover:to-[#6D28D9] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:scale-[1.01]"
              >
                {submitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4" />
                    <span>
                      {authModalTab === 'signin' && 'Sign In'}
                      {authModalTab === 'signup' && 'Create Account'}
                      {authModalTab === 'forgot' && 'Send Recovery Link'}
                      {authModalTab === 'update_password' && 'Update Password'}
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Divider with "or" */}
            <div className="relative flex items-center justify-center my-3.5">
              <div className="w-full border-t border-gray-200" />
              <span className="bg-white px-3 text-[11px] font-medium text-gray-400 uppercase tracking-wider">
                or
              </span>
            </div>

            {/* Continue as Guest Button */}
            <button
              type="button"
              onClick={handleContinueAsGuest}
              disabled={guestLoading || submitting}
              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-purple-300 hover:border-purple-500 bg-purple-50/50 hover:bg-purple-50 text-[#6335F5] font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 hover:shadow-xs"
            >
              <User className="w-4 h-4" />
              <span>
                {guestLoading ? 'Starting Guest Session...' : 'Continue as Guest'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
