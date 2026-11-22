import React, { useState, useEffect } from 'react';
import { ResumeProvider, useResume } from './context/ResumeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthModal from './components/auth/AuthModal';
import AppHeader from './components/layout/AppHeader';
import ProgressIndicator from './components/layout/ProgressIndicator';
import ResumePreviewMockup, { MobilePreviewToggle } from './components/resume/ResumePreviewMockup';
import TemplatesModal from './components/ui/TemplatesModal';
import ResumeUploadCheckerModal from './components/upload/ResumeUploadCheckerModal';
import ResumeDocument from './templates/ResumeDocument';
import ErrorBoundary from './components/ui/ErrorBoundary';

import Dashboard from './pages/Dashboard';
import PersonalInfo from './pages/PersonalInfo';
import ProfessionalSummary from './pages/ProfessionalSummary';
import WorkExperience from './pages/WorkExperience';
import Education from './pages/Education';
import Skills from './pages/Skills';
import Projects from './pages/Projects';
import Certifications from './pages/Certifications';
import AtsAnalyzer from './pages/AtsAnalyzer';
import AiCareerAssistant from './pages/AiCareerAssistant';

// Legal & Policy Pages
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsConditions from './pages/legal/TermsConditions';
import CookiePolicy from './pages/legal/CookiePolicy';
import AiDisclaimer from './pages/legal/AiDisclaimer';
import DataDeletionPolicy from './pages/legal/DataDeletionPolicy';

// Public & Help Pages
import ContactUs from './pages/public/ContactUs';
import HelpCenter from './pages/public/HelpCenter';
import AboutUs from './pages/public/AboutUs';
import FeaturesPage from './pages/public/FeaturesPage';
import PricingPage from './pages/public/PricingPage';
import AppFooter from './components/layout/AppFooter';

import { validateStepData } from './schema/validation';
import { updateCloudResume } from './lib/resumeCloudService';

const AppContent = () => {
  const { 
    resumeData, 
    activeTemplate, 
    accentColor,
    activeCloudResumeId,
    cloudResumeTitle,
    setCloudSyncStatus,
    setLastCloudSynced
  } = useResume();
  const { user } = useAuth();

  const [currentView, setCurrentView] = useState('dashboard');
  const [mobileTab, setMobileTab] = useState('edit');
  const [menuOpen, setMenuOpen] = useState(false);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  // Cloud Autosave Synchronization (Debounced)
  useEffect(() => {
    if (!user || !activeCloudResumeId) return;

    setCloudSyncStatus('saving');
    const timer = setTimeout(async () => {
      try {
        const res = await updateCloudResume(activeCloudResumeId, {
          title: cloudResumeTitle,
          resumeData,
          template: activeTemplate,
        });
        if (res.success) {
          setCloudSyncStatus('synced');
          setLastCloudSynced(new Date().toISOString());
        } else {
          setCloudSyncStatus('offline');
        }
      } catch {
        setCloudSyncStatus('offline');
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [resumeData, activeTemplate, cloudResumeTitle, activeCloudResumeId, user, setCloudSyncStatus, setLastCloudSynced]);

  const handleGetStarted = (step = 1) => {
    setCurrentView(step);
    setMobileTab('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (typeof currentView === 'number' && currentView < 7) {
      setCurrentView(currentView + 1);
      setMobileTab('edit');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentView === 7) {
      // Completed — return to dashboard
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (typeof currentView === 'number' && currentView > 1) {
      setCurrentView(currentView - 1);
      setMobileTab('edit');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentView === 1) {
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStepClick = (stepNumber) => {
    // If navigating backward, always allow
    if (typeof currentView === 'number' && stepNumber < currentView) {
      setCurrentView(stepNumber);
      setMobileTab('edit');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // If navigating forward, ensure current step is valid
    if (typeof currentView === 'number' && stepNumber > currentView) {
      const isCurrentStepValid = validateStepData(currentView, resumeData);
      if (!isCurrentStepValid) {
        return;
      }
    }

    setCurrentView(stepNumber);
    setMobileTab('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Dedicated Print / PDF Generation Area (Hidden on screen, Visible on print) */}
      <div id="print-resume-area" className="hidden print:block">
        <ResumeDocument 
          data={resumeData} 
          template={activeTemplate} 
          accentColor={accentColor} 
        />
      </div>

      {/* Main Screen Application */}
      <div className="min-h-screen bg-surface-50 flex flex-col print:hidden antialiased">
        {/* Main Views: AI Career Studio, Analyzer, Dashboard, or Step Builder */}
        {currentView === 'ai-career' ? (
          <AiCareerAssistant
            onBackToDashboard={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateBuilder={(step = 1) => {
              setCurrentView(step);
              setMobileTab('edit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'analyzer' ? (
          <AtsAnalyzer
            onBackToBuilder={() => {
              setCurrentView('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onJumpToStep={(stepNum) => {
              setCurrentView(stepNum);
              setMobileTab('edit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : currentView === 'dashboard' ? (
          <Dashboard 
            onGetStarted={handleGetStarted} 
            onStepSelect={handleGetStarted}
            onOpenAnalyzer={() => {
              setCurrentView('analyzer');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenAiCareer={() => {
              setCurrentView('ai-career');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenUploadModal={() => setUploadModalOpen(true)}
            onNavigate={(view) => {
              setCurrentView(view);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        ) : [
            'privacy-policy', 'terms', 'cookie-policy', 'ai-disclaimer', 
            'data-deletion', 'help-center', 'contact-us', 'about', 
            'features', 'pricing'
          ].includes(currentView) ? (
          <div className="flex flex-col min-h-screen">
            <AppHeader 
              onMenuToggle={() => setMenuOpen(!menuOpen)} 
              menuOpen={menuOpen} 
              currentView={currentView}
              onNavigateHome={() => {
                setCurrentView('dashboard');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenTemplatesModal={() => setTemplatesModalOpen(true)}
              onOpenUploadModal={() => setUploadModalOpen(true)}
              onOpenAnalyzer={() => {
                setCurrentView('analyzer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAiCareer={() => {
                setCurrentView('ai-career');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
            <main className="flex-1">
              {currentView === 'privacy-policy' && (
                <PrivacyPolicy onBackToHome={() => setCurrentView('dashboard')} />
              )}
              {currentView === 'terms' && (
                <TermsConditions onBackToHome={() => setCurrentView('dashboard')} />
              )}
              {currentView === 'cookie-policy' && (
                <CookiePolicy onBackToHome={() => setCurrentView('dashboard')} />
              )}
              {currentView === 'ai-disclaimer' && (
                <AiDisclaimer onBackToHome={() => setCurrentView('dashboard')} />
              )}
              {currentView === 'data-deletion' && (
                <DataDeletionPolicy onBackToHome={() => setCurrentView('dashboard')} />
              )}
              {currentView === 'help-center' && (
                <HelpCenter 
                  onBackToHome={() => setCurrentView('dashboard')} 
                  onNavigate={(v) => {
                    setCurrentView(v);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} 
                />
              )}
              {currentView === 'contact-us' && (
                <ContactUs onBackToHome={() => setCurrentView('dashboard')} />
              )}
              {currentView === 'about' && (
                <AboutUs onBackToHome={() => setCurrentView('dashboard')} />
              )}
              {currentView === 'features' && (
                <FeaturesPage 
                  onBackToHome={() => setCurrentView('dashboard')} 
                  onOpenBuilder={handleGetStarted}
                  onOpenAnalyzer={() => {
                    setCurrentView('analyzer');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onOpenAiCareer={() => {
                    setCurrentView('ai-career');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
              {currentView === 'pricing' && (
                <PricingPage 
                  onBackToHome={() => setCurrentView('dashboard')} 
                  onOpenBuilder={handleGetStarted} 
                />
              )}
            </main>
            <AppFooter
              onNavigate={(v) => {
                setCurrentView(v);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenBuilder={handleGetStarted}
              onOpenAnalyzer={() => {
                setCurrentView('analyzer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAiCareer={() => {
                setCurrentView('ai-career');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        ) : (
          /* Step Pages (1-7) Workspace Layout */
          <div className="flex flex-col min-h-screen">
            {/* Header */}
            <AppHeader 
              onMenuToggle={() => setMenuOpen(!menuOpen)} 
              menuOpen={menuOpen} 
              currentView={currentView}
              onNavigateHome={() => setCurrentView('dashboard')}
              onOpenTemplatesModal={() => setTemplatesModalOpen(true)}
              onOpenUploadModal={() => setUploadModalOpen(true)}
              onOpenAnalyzer={() => {
                setCurrentView('analyzer');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenAiCareer={() => {
                setCurrentView('ai-career');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Stepper Bar */}
            <ProgressIndicator 
              currentStep={currentView} 
              onStepClick={handleStepClick}
            />

            {/* Main Workspace: 2-Column Split (Form & Live Preview) */}
            <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
              {/* Mobile Edit/Preview Tabs Toggle */}
              <MobilePreviewToggle activeTab={mobileTab} onTabChange={setMobileTab} />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column — Active Step Form */}
                <div
                  className={`lg:col-span-6 xl:col-span-6 ${
                    mobileTab === 'preview' ? 'hidden lg:block' : 'block'
                  }`}
                >
                  <div className="transition-opacity duration-300">
                    {currentView === 1 && (
                      <PersonalInfo onNext={handleNext} onPrevious={handlePrevious} />
                    )}
                    {currentView === 2 && (
                      <ProfessionalSummary onNext={handleNext} onPrevious={handlePrevious} />
                    )}
                    {currentView === 3 && (
                      <WorkExperience onNext={handleNext} onPrevious={handlePrevious} />
                    )}
                    {currentView === 4 && (
                      <Education onNext={handleNext} onPrevious={handlePrevious} />
                    )}
                    {currentView === 5 && (
                      <Skills onNext={handleNext} onPrevious={handlePrevious} />
                    )}
                    {currentView === 6 && (
                      <Projects onNext={handleNext} onPrevious={handlePrevious} />
                    )}
                    {currentView === 7 && (
                      <Certifications 
                        onNext={handleNext} 
                        onPrevious={handlePrevious} 
                        onStepSelect={handleStepClick}
                        onOpenAnalyzer={() => {
                          setCurrentView('analyzer');
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Right Column — Sticky Live ATS Resume Preview */}
                <div
                  className={`lg:col-span-6 xl:col-span-6 ${
                    mobileTab === 'edit' ? 'hidden lg:block' : 'block'
                  }`}
                >
                  <div className="sticky top-24">
                    <ResumePreviewMockup />
                  </div>
                </div>
              </div>
            </main>
          </div>
        )}

        {/* Global Resume Upload & Free ATS Checker Modal */}
        <ResumeUploadCheckerModal
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onOpenBuilder={handleGetStarted}
          onOpenAnalyzer={() => {
            setCurrentView('analyzer');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenAiCareer={() => {
            setCurrentView('ai-career');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Global Templates Modal */}
        <TemplatesModal
          isOpen={templatesModalOpen}
          onClose={() => setTemplatesModalOpen(false)}
        />

        {/* Global Auth Modal */}
        <AuthModal />
      </div>
    </>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ResumeProvider>
          <AppContent />
        </ResumeProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App;