import React, { useState } from 'react';
import { 
  FileText, Menu, X, Printer, RotateCcw, Trash2, Download, 
  ChevronDown, LayoutTemplate, Sparkles, Check, Briefcase, ExternalLink,
  CheckCircle2, Cloud, ShieldCheck, Home, LayoutGrid, LogIn, LogOut,
  User as UserIcon, CloudUpload, UserCheck, Settings, GraduationCap
} from 'lucide-react';
import { useResume, TEMPLATES } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';
import BrandLogo from '../ui/BrandLogo';
import AccountSettingsModal from '../auth/AccountSettingsModal';

const AppHeader = ({ 
  onMenuToggle, 
  menuOpen, 
  currentView, 
  onNavigateHome,
  onOpenTemplatesModal,
  onOpenUploadModal,
  onOpenAnalyzer,
  onOpenAiCareer
}) => {
  const { 
    resumeData, 
    resetToSample, 
    clearAll, 
    printResume, 
    downloadJson,
    downloadDocx,
    activeTemplate,
    setActiveTemplate,
    saveStatus,
    lastSaved,
    activeCloudResumeId,
    cloudResumeTitle,
    cloudSyncStatus
  } = useResume();

  const { user, profile, isAuthenticated, isGuest, signOut, openAuthModal } = useAuth();

  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);
  const [showAccountModal, setShowAccountModal] = useState(false);
  const isBuilder = typeof currentView === 'number';
  const isDashboard = currentView === 'dashboard';

  const displayName = profile?.full_name || user?.user_metadata?.full_name || resumeData.personalInfo?.fullName || 'John Doe';
  const userInitials = (displayName || 'Soham Jamkar')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'SJ';

  const handleSignOut = async () => {
    setShowActionsDropdown(false);
    await signOut();
  };

  return (
    <header className={isDashboard ? 'relative z-50 w-full pt-4 sm:pt-5 px-4 sm:px-6 max-w-[1380px] mx-auto' : 'sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border-subtle transition-colors'}>
      <div className={isDashboard ? 'w-full' : 'max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8'}>
        <div className={isDashboard ? 'bg-white/95 backdrop-blur-md rounded-2xl md:rounded-full border border-purple-100 shadow-[0_4px_25px_rgba(99,53,245,0.06)] px-5 sm:px-8 h-18 sm:h-20 flex items-center justify-between transition-all' : 'flex items-center justify-between h-18'}>
          {/* ResumeXpert AI Logo */}
          <button
            onClick={onNavigateHome}
            className="flex items-center text-left group focus:outline-none focus:ring-2 focus:ring-purple-500/20 rounded-2xl p-1 shrink-0"
          >
            <BrandLogo size="header" />
          </button>

          {/* Center Navigation Links (Matching Screenshot) */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={onNavigateHome}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                isDashboard
                  ? 'bg-[#EDE9FE] text-[#6335F5] shadow-sm'
                  : 'text-body hover:text-heading hover:bg-surface-100'
              }`}
            >
              <Home className="w-4 h-4 text-[#6335F5]" />
              <span>My Resumes</span>
            </button>

            <button
              onClick={onOpenAiCareer}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all duration-200 ${
                currentView === 'ai-career'
                  ? 'bg-[#6335F5] text-white shadow-md'
                  : 'bg-purple-50 text-[#6335F5] hover:bg-purple-100 border border-purple-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>AI Career Studio</span>
            </button>

            <button
              onClick={onOpenTemplatesModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-[#4B5563] hover:text-[#6335F5] hover:bg-purple-50/70 transition-all duration-200"
            >
              <LayoutGrid className="w-4 h-4 text-[#6B7280]" />
              <span>Templates</span>
            </button>

            <button
              onClick={onOpenUploadModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#6335F5] to-[#7C3AED] hover:from-[#5225e0] hover:to-[#6d28d9] shadow-sm hover:shadow transition-all duration-200"
              title="Upload PDF, Word, or Image resume for instant free ATS analysis"
            >
              <CloudUpload className="w-4 h-4 text-white" />
              <span>Upload Resume</span>
              <span className="hidden lg:inline-block text-[10px] bg-white/25 text-white px-1.5 py-0.5 rounded-full font-black uppercase tracking-wider">Free</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowToolsDropdown(!showToolsDropdown)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-[#4B5563] hover:text-[#6335F5] hover:bg-purple-50/70 transition-all duration-200"
              >
                <Briefcase className="w-4 h-4 text-[#6B7280]" />
                <span>Career Tools</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#9CA3AF]" />
              </button>

              {showToolsDropdown && (
                <div 
                  className="absolute left-0 top-full mt-2 w-56 bg-white border border-purple-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setShowToolsDropdown(false)}
                >
                  <div className="px-4 py-2 border-b border-purple-50">
                    <p className="text-[11px] font-bold text-heading uppercase tracking-wider">ATS Optimization Tools</p>
                  </div>
                  <button
                    onClick={() => {
                      if (onOpenUploadModal) onOpenUploadModal();
                      setShowToolsDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-emerald-700 hover:bg-emerald-50 flex items-center gap-2"
                  >
                    <CloudUpload className="w-3.5 h-3.5 text-emerald-600" />
                    Upload Resume (PDF, Word, JPG) Free
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenAiCareer) onOpenAiCareer();
                      setShowToolsDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#6335F5] hover:bg-purple-50 flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#6335F5]" />
                    AI Career Intelligence Studio
                  </button>
                  <button
                    onClick={() => {
                      if (onOpenAnalyzer) onOpenAnalyzer();
                      setShowToolsDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs font-semibold text-primary-600 hover:bg-primary-50 flex items-center gap-2"
                  >
                    <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
                    ATS Resume Analyzer & Score
                  </button>
                  <button
                    onClick={() => {
                      printResume();
                      setShowToolsDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs text-body hover:text-primary-600 hover:bg-primary-50 flex items-center gap-2"
                  >
                    <Printer className="w-3.5 h-3.5 text-primary-500" />
                    Download Vector PDF
                  </button>
                  <button
                    onClick={() => {
                      downloadDocx();
                      setShowToolsDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs text-body hover:text-primary-600 hover:bg-primary-50 flex items-center gap-2"
                  >
                    <FileText className="w-3.5 h-3.5 text-primary-500" />
                    Download Editable DOCX
                  </button>
                  <button
                    onClick={() => {
                      onOpenTemplatesModal();
                      setShowToolsDropdown(false);
                    }}
                    className="w-full px-4 py-2.5 text-left text-xs text-body hover:text-primary-600 hover:bg-primary-50 flex items-center gap-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-primary-500" />
                    ATS Template Switcher
                  </button>
                </div>
              )}
            </div>
          </nav>

          {/* Right Actions & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {isBuilder && (
              <>
                {/* Autosave Status Pill */}
                <div
                  className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/80 border border-emerald-200/70 text-emerald-700 text-xs font-semibold"
                  title={lastSaved ? `Autosaved to LocalStorage (${new Date(lastSaved).toLocaleTimeString()})` : 'Autosaved'}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{activeCloudResumeId ? 'Cloud Synced' : 'Autosaved'}</span>
                </div>

                {/* PDF Print / Download Button */}
                <button
                  onClick={printResume}
                  className="btn-primary py-2 px-3.5 text-xs sm:text-sm"
                  title="Download / Print PDF"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Download PDF</span>
                </button>

                {/* Resume Data Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                    className="p-2 sm:px-3 sm:py-2 rounded-xl border border-border-light bg-surface-50 hover:bg-surface-100 text-body hover:text-heading transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    title="Resume Data Options"
                  >
                    <span>Data</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>

                  {showActionsDropdown && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-52 bg-white border border-border-light rounded-2xl shadow-xl py-2 z-50 animate-fade-in"
                      onMouseLeave={() => setShowActionsDropdown(false)}
                    >
                      <button
                        onClick={() => {
                          resetToSample();
                          setShowActionsDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-body hover:text-primary-600 hover:bg-primary-50 flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-primary-500" />
                        Reset to Sample Data
                      </button>

                      <button
                        onClick={() => {
                          downloadJson();
                          setShowActionsDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-body hover:text-primary-600 hover:bg-primary-50 flex items-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5 text-primary-500" />
                        Export Data (JSON)
                      </button>

                      <div className="h-px bg-border-subtle my-1" />

                      <button
                        onClick={() => {
                          if (window.confirm('Clear all fields to start blank?')) {
                            clearAll();
                          }
                          setShowActionsDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-red-500 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear All Fields
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Profile Avatar / Auth Trigger */}
            <div className="relative">
              {isAuthenticated ? (
                /* Authenticated User Avatar with Online Dot */
                <div className="relative">
                  <button 
                    onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                    className="w-10 h-10 rounded-full bg-[#EDE9FE] border border-purple-200 flex items-center justify-center text-[#6335F5] font-black text-xs sm:text-sm shadow-sm hover:ring-2 hover:ring-purple-300 transition-all focus:outline-none"
                    title={`${displayName} (${user?.email})`}
                  >
                    {userInitials}
                  </button>
                  {/* Online Green Indicator Dot — Only when truly authenticated */}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#22C55E] border-2 border-white ring-1 ring-emerald-200 pointer-events-none" />
                </div>
              ) : isGuest ? (
                /* Guest Session Mode */
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-purple-50 text-[#6335F5] text-xs font-bold transition-all border border-purple-200 shadow-2xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button 
                    onClick={() => setShowActionsDropdown(!showActionsDropdown)}
                    className="px-2.5 py-1 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-[11px] font-bold border border-gray-200 flex items-center gap-1.5 transition-all"
                    title="Browsing in Local Guest Mode"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>Guest</span>
                  </button>
                </div>
              ) : (
                /* Unauthenticated Visitor: Real Sign In & Sign Up buttons */
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openAuthModal('signin')}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-purple-50 text-[#6335F5] text-xs font-bold transition-all border border-purple-200"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => openAuthModal('signup')}
                    className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#6335F5] to-[#7C3AED] hover:from-[#5025D1] hover:to-[#6D28D9] text-white text-xs font-bold transition-all shadow-xs"
                  >
                    <span>Sign Up</span>
                  </button>
                </div>
              )}

              {/* Quick Actions / Profile Dropdown (Responsive & Device-Friendly) */}
              {showActionsDropdown && (
                <div 
                  className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md border border-purple-100 rounded-2xl shadow-xl py-2 z-50 animate-fade-in"
                  onMouseLeave={() => setShowActionsDropdown(false)}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="px-4 py-2.5 border-b border-purple-50">
                        <p className="text-xs font-bold text-[#111827] truncate">{displayName}</p>
                        <p className="text-[10px] text-[#6B7280] truncate">{user?.email}</p>
                        <div className="flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>Cloud Connected</span>
                        </div>
                      </div>

                      {/* Edit Profile & Education Details */}
                      <button
                        onClick={() => {
                          setShowAccountModal(true);
                          setShowActionsDropdown(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#6335F5] hover:bg-purple-50 flex items-center gap-2 border-b border-purple-50 transition-colors"
                      >
                        <UserCheck className="w-4 h-4 text-[#6335F5]" />
                        <span>Edit Account & Education</span>
                      </button>

                      <button
                        onClick={() => {
                          onNavigateHome();
                          setShowActionsDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-[#4B5563] hover:text-[#6335F5] hover:bg-purple-50 flex items-center gap-2"
                      >
                        <Cloud className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        My Cloud Resumes
                      </button>

                      <button
                        onClick={() => {
                          resetToSample();
                          setShowActionsDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-[#4B5563] hover:text-[#6335F5] hover:bg-purple-50 flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        Reset to Sample Data
                      </button>

                      <button
                        onClick={() => {
                          downloadJson();
                          setShowActionsDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-[#4B5563] hover:text-[#6335F5] hover:bg-purple-50 flex items-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        Export Data (JSON)
                      </button>

                      <div className="h-px bg-purple-50 my-1" />

                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 border-b border-purple-50">
                        <p className="text-xs font-bold text-[#111827]">Local Guest Mode</p>
                        <p className="text-[10px] text-[#6B7280]">Resumes stored in browser</p>
                      </div>

                      <button
                        onClick={() => {
                          setShowAccountModal(true);
                          setShowActionsDropdown(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#6335F5] hover:bg-purple-50 flex items-center gap-2 border-b border-purple-50 transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-[#6335F5]" />
                        <span>Edit Profile & Education</span>
                      </button>

                      <button
                        onClick={() => {
                          openAuthModal('signin');
                          setShowActionsDropdown(false);
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#6335F5] hover:bg-purple-50 flex items-center gap-2"
                      >
                        <LogIn className="w-3.5 h-3.5 text-[#6335F5]" />
                        Sign In / Register
                      </button>

                      <button
                        onClick={() => {
                          resetToSample();
                          setShowActionsDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-[#4B5563] hover:text-[#6335F5] hover:bg-purple-50 flex items-center gap-2"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        Reset to Sample Data
                      </button>

                      <button
                        onClick={() => {
                          downloadJson();
                          setShowActionsDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-[#4B5563] hover:text-[#6335F5] hover:bg-purple-50 flex items-center gap-2"
                      >
                        <Download className="w-3.5 h-3.5 text-[#8B5CF6]" />
                        Export Data (JSON)
                      </button>

                      <div className="h-px bg-purple-50 my-1" />

                      <button
                        onClick={() => {
                          if (window.confirm('Clear all fields to start blank?')) {
                            clearAll();
                          }
                          setShowActionsDropdown(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-red-500 hover:bg-red-50 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear All Fields
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={onMenuToggle}
              className="md:hidden p-2 rounded-xl text-body hover:text-heading hover:bg-purple-50 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X className="w-5 h-5 text-[#6335F5]" /> : <Menu className="w-5 h-5 text-[#4B5563]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-2 border border-purple-100 rounded-2xl bg-white/95 backdrop-blur-md animate-fade-in p-4 space-y-2 shadow-xl">
          {!isAuthenticated && (
            <button
              onClick={() => {
                openAuthModal('signin');
                onMenuToggle();
              }}
              className="w-full btn-primary py-2.5 text-xs justify-center mb-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Create Account</span>
            </button>
          )}

          <button
            onClick={() => {
              onNavigateHome();
              onMenuToggle();
            }}
            className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold ${
              !isBuilder ? 'text-primary-600 bg-primary-50' : 'text-body hover:bg-surface-50'
            }`}
          >
            My Resumes
          </button>
          <button
            onClick={() => {
              if (onOpenAiCareer) onOpenAiCareer();
              onMenuToggle();
            }}
            className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 ${
              currentView === 'ai-career' ? 'text-[#6335F5] bg-purple-50' : 'text-body hover:bg-surface-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#6335F5]" />
            <span>AI Career Studio</span>
          </button>
          <button
            onClick={() => {
              onOpenTemplatesModal();
              onMenuToggle();
            }}
            className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-body hover:bg-surface-50"
          >
            Templates
          </button>
          <button
            onClick={() => {
              if (onOpenAnalyzer) onOpenAnalyzer();
              onMenuToggle();
            }}
            className={`block w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 ${
              currentView === 'analyzer' ? 'text-primary-600 bg-primary-50' : 'text-body hover:bg-surface-50'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-primary-600" />
            <span>ATS Analyzer</span>
          </button>
          <button
            onClick={() => {
              setShowToolsDropdown(!showToolsDropdown);
            }}
            className="block w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-body hover:bg-surface-50"
          >
            Career Tools
          </button>

          <div className="pt-2 border-t border-purple-100 flex flex-col gap-1">
            <button
              onClick={() => {
                setShowAccountModal(true);
                onMenuToggle();
              }}
              className="w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold text-[#6335F5] hover:bg-purple-50 flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-[#6335F5]" />
              <span>Edit Account & Education</span>
            </button>
            {isAuthenticated && (
              <button
                onClick={() => {
                  handleSignOut();
                  onMenuToggle();
                }}
                className="w-full text-left px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out ({displayName})
              </button>
            )}
          </div>

          {isBuilder && (
            <div className="pt-3 border-t border-border-subtle flex flex-col gap-2">
              <button
                onClick={() => {
                  printResume();
                  onMenuToggle();
                }}
                className="btn-primary w-full"
              >
                <Printer className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={() => {
                  downloadDocx();
                  onMenuToggle();
                }}
                className="btn-secondary w-full text-xs"
              >
                <FileText className="w-3.5 h-3.5 text-primary-600" />
                Download DOCX
              </button>
              <button
                onClick={() => {
                  resetToSample();
                  onMenuToggle();
                }}
                className="btn-secondary w-full text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset Sample Data
              </button>
            </div>
          )}
        </div>
      )}

      {/* Account Profile & Education Settings Modal */}
      <AccountSettingsModal 
        isOpen={showAccountModal} 
        onClose={() => setShowAccountModal(false)} 
      />
    </header>
  );
};

export default AppHeader;