import React, { useState, useEffect, useCallback } from 'react';
import {
  FileText, Sparkles, Download, ArrowRight, Plus, Clock, 
  CheckCircle2, ChevronRight, Shield, Check, User, Briefcase, 
  GraduationCap, Code2, Rocket, Zap, Play, Users, Star, Trophy, 
  X, ExternalLink, Cloud, CloudUpload, Copy, Trash2, Edit3, 
  LogIn, Loader2, AlertCircle
} from 'lucide-react';
import AppHeader from '../components/layout/AppHeader';
import TemplatesModal from '../components/ui/TemplatesModal';
import { stepsList } from '../data/sampleData';
import { useResume } from '../context/ResumeContext';
import { useAuth } from '../context/AuthContext';
import { 
  fetchUserResumes, 
  createCloudResume, 
  deleteCloudResume, 
  duplicateCloudResume, 
  renameCloudResume 
} from '../lib/resumeCloudService';
import { createEmptyResume } from '../store/useResumeStore';
import BrandLogo from '../components/ui/BrandLogo';
import AppFooter from '../components/layout/AppFooter';
import CareerJourney3D from '../components/home3d/CareerJourney3D';
import FloatingResume3D from '../components/home3d/FloatingResume3D';

const Dashboard = ({ onGetStarted, onStepSelect, onOpenAnalyzer, onOpenAiCareer, onOpenUploadModal, onNavigate }) => {
  const { 
    resumeData, 
    calculateCompletion, 
    clearAll,
    activeCloudResumeId,
    setActiveCloudResume,
    setLocalDraftMode,
    activeTemplate,
    cloudResumeTitle
  } = useResume();

  const { user, isAuthenticated, openAuthModal } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [templatesModalOpen, setTemplatesModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);

  // Cloud Resumes State
  const [cloudResumes, setCloudResumes] = useState([]);
  const [loadingCloud, setLoadingCloud] = useState(false);
  const [cloudError, setCloudError] = useState('');

  // Rename Modal State
  const [renameModalOpen, setRenameModalOpen] = useState(false);
  const [resumeToRename, setResumeToRename] = useState(null);
  const [renameInput, setRenameInput] = useState('');

  const { percentage } = calculateCompletion();
  const candidateName = resumeData.personalInfo?.fullName || 'John Doe';
  const roleName = resumeData.personalInfo?.professionalTitle || 'Full Stack Developer';

  // Fetch Cloud Resumes
  const loadCloudResumes = useCallback(async () => {
    if (!user?.id) {
      setCloudResumes([]);
      return;
    }
    setLoadingCloud(true);
    setCloudError('');
    try {
      const result = await fetchUserResumes(user.id);
      if (result.success) {
        setCloudResumes(result.data || []);
      } else {
        setCloudError(result.error);
      }
    } catch (err) {
      setCloudError(err.message || 'Failed to fetch cloud resumes.');
    } finally {
      setLoadingCloud(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadCloudResumes();
    } else {
      setCloudResumes([]);
    }
  }, [isAuthenticated, user?.id, loadCloudResumes]);

  const handleStartFresh = () => {
    if (window.confirm('Start a new blank resume? This will reset all current local fields.')) {
      setLocalDraftMode();
      clearAll();
      onGetStarted(1);
    }
  };

  const handleOpenCloudResume = (resumeRecord) => {
    setActiveCloudResume(resumeRecord);
    onGetStarted(1);
  };

  const handleCreateNewCloudResume = async () => {
    if (!user?.id) {
      openAuthModal('signin');
      return;
    }
    const title = window.prompt('Enter a title for your new resume:', 'Software Engineer Resume');
    if (!title || !title.trim()) return;

    setLoadingCloud(true);
    const result = await createCloudResume({
      userId: user.id,
      title: title.trim(),
      resumeData: createEmptyResume(),
      template: 'classic',
    });

    if (result.success && result.data) {
      await loadCloudResumes();
      setActiveCloudResume(result.data);
      onGetStarted(1);
    } else {
      alert(result.error || 'Failed to create resume in cloud.');
      setLoadingCloud(false);
    }
  };

  const handleSaveDraftToCloud = async () => {
    if (!user?.id) {
      openAuthModal('signin');
      return;
    }
    const defaultTitle = `${candidateName} — ${roleName}`;
    const title = window.prompt('Save current draft to your cloud account as:', defaultTitle);
    if (!title || !title.trim()) return;

    setLoadingCloud(true);
    const result = await createCloudResume({
      userId: user.id,
      title: title.trim(),
      resumeData,
      template: activeTemplate || 'classic',
    });

    if (result.success && result.data) {
      await loadCloudResumes();
      setActiveCloudResume(result.data);
      alert('Draft successfully saved to your cloud account!');
    } else {
      alert(result.error || 'Failed to save draft to cloud.');
    }
    setLoadingCloud(false);
  };

  const handleDuplicate = async (e, resumeRecord) => {
    e.stopPropagation();
    if (!user?.id) return;
    setLoadingCloud(true);
    const result = await duplicateCloudResume(resumeRecord.id, user.id);
    if (result.success) {
      await loadCloudResumes();
    } else {
      alert(result.error || 'Failed to duplicate resume.');
      setLoadingCloud(false);
    }
  };

  const handleDelete = async (e, resumeRecord) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${resumeRecord.title}"? This cannot be undone.`)) {
      return;
    }
    setLoadingCloud(true);
    const result = await deleteCloudResume(resumeRecord.id);
    if (result.success) {
      if (activeCloudResumeId === resumeRecord.id) {
        setLocalDraftMode();
      }
      await loadCloudResumes();
    } else {
      alert(result.error || 'Failed to delete resume.');
      setLoadingCloud(false);
    }
  };

  const openRenameModal = (e, resumeRecord) => {
    e.stopPropagation();
    setResumeToRename(resumeRecord);
    setRenameInput(resumeRecord.title);
    setRenameModalOpen(true);
  };

  const handleRenameSubmit = async (e) => {
    e.preventDefault();
    if (!resumeToRename || !renameInput.trim()) return;

    const result = await renameCloudResume(resumeToRename.id, renameInput.trim());
    if (result.success) {
      setRenameModalOpen(false);
      setResumeToRename(null);
      await loadCloudResumes();
    } else {
      alert(result.error || 'Failed to rename resume.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7FF] text-[#111827] flex flex-col font-sans">
      {/* Hero Section Container with soft lavender background */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#FBF9FE] via-[#F5EEFF] to-[#ECE2FD] pb-16 sm:pb-24 lg:pb-32">
        {/* Floating Capsule Header */}
        <AppHeader 
          onMenuToggle={() => setMenuOpen(!menuOpen)} 
          menuOpen={menuOpen}
          currentView="dashboard"
          onNavigateHome={() => {}}
          onOpenTemplatesModal={() => setTemplatesModalOpen(true)}
          onOpenUploadModal={onOpenUploadModal}
          onOpenAnalyzer={onOpenAnalyzer}
          onOpenAiCareer={onOpenAiCareer}
        />

        {/* Subtle Decorative Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-0">
          <div className="absolute top-10 right-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
          <div className="absolute top-40 left-10 w-[450px] h-[450px] bg-purple-100/50 rounded-full blur-3xl" />
        </div>

        {/* Hero Content Grid (Matching Reference Screenshot) */}
        <div className="relative max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 lg:pt-16 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column Content */}
            <div className="lg:col-span-7 space-y-6">
              {/* ResumeXpert AI Slogan Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FAF5FF] border border-[#E9D5FF] text-xs font-bold text-[#6D28D9] shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-[#FACC15] text-[#FACC15]" />
                <span>Build Smarter. Apply Better. Get Hired.</span>
              </div>

              {/* Main Headline with Hand-Drawn Swoosh Underline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-black text-[#111827] tracking-tight leading-[1.12]">
                Build Your{' '}
                <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#6335F5] via-[#7C3AED] to-[#8B5CF6]">
                  Professional
                  <svg
                    className="absolute -bottom-2.5 left-0 w-full h-3.5 text-[#7C3AED] overflow-visible"
                    viewBox="0 0 260 12"
                    fill="none"
                  >
                    <path
                      d="M3 9C60 2.5 170 2 257 8"
                      stroke="currentColor"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <br />
                Resume
              </h1>

              {/* Subtitle */}
              <p className="text-[#4B5563] text-base sm:text-lg max-w-xl leading-relaxed font-normal">
                Create a Single-Column ATS-friendly resume in minutes with our modern resume builder. Stand out from the crowd and land your dream job!
              </p>

              {/* 3 Pill Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-[0_2px_8px_rgba(99,53,245,0.04)] text-xs sm:text-sm font-semibold text-[#1F2937]">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </div>
                  <span>ATS Optimized</span>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-[0_2px_8px_rgba(99,53,245,0.04)] text-xs sm:text-sm font-semibold text-[#1F2937]">
                  <Zap className="w-4 h-4 text-[#EAB308] fill-[#EAB308]" />
                  <span>Live Preview</span>
                </div>

                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-purple-100 shadow-[0_2px_8px_rgba(99,53,245,0.04)] text-xs sm:text-sm font-semibold text-[#1F2937]">
                  <Download className="w-4 h-4 text-[#3B82F6]" />
                  <span>Download PDF</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {/* Button 1: Start Building Free */}
                <button
                  type="button"
                  onClick={() => onGetStarted(1)}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#6335F5] to-[#7C3AED] hover:from-[#5326DF] hover:to-[#6D28D9] text-white font-bold text-sm sm:text-base shadow-[0_10px_25px_rgba(99,53,245,0.32)] hover:shadow-[0_12px_30px_rgba(99,53,245,0.45)] hover:-translate-y-0.5 transition-all duration-200 group active:scale-[0.98]"
                >
                  <Rocket className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span>Start Building Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Button 2: Upload & Check ATS */}
                <button
                  type="button"
                  onClick={onOpenUploadModal}
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-white hover:bg-purple-50 text-[#6335F5] font-bold text-sm sm:text-base border-2 border-purple-200 hover:border-[#6335F5] shadow-xs hover:shadow hover:-translate-y-0.5 transition-all duration-200 group active:scale-[0.98]"
                >
                  <CloudUpload className="w-4 h-4 text-[#6335F5] group-hover:-translate-y-0.5 transition-transform" />
                  <span>Upload & Check ATS</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">Free</span>
                </button>

                {/* Button 3: Watch Demo */}
                <button
                  type="button"
                  onClick={() => setDemoModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-full hover:bg-white/80 transition-all text-sm sm:text-base font-bold text-[#1F2937] group active:scale-[0.98]"
                >
                  <div className="w-9 h-9 rounded-full bg-white shadow-md border border-purple-100 flex items-center justify-center text-[#6335F5] group-hover:scale-105 transition-transform">
                    <Play className="w-4 h-4 fill-[#6335F5] text-[#6335F5] ml-0.5" />
                  </div>
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Handwritten Doodle Note placed cleanly with proper spacing - zero button collision */}
              <div className="hidden sm:flex items-center gap-2 pt-1 pl-1 select-none pointer-events-none">
                <span className="font-serif italic font-bold text-base text-[#6D28D9] tracking-tight">
                  Your Dream Resume Awaits! ✨
                </span>
                <svg className="w-16 h-6 text-[#7C3AED] transform -rotate-6" viewBox="0 0 80 24" fill="none">
                  <path d="M4 14 C 28 20, 48 8, 72 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  <path d="M64 2 L 74 6 L 66 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>

            {/* Right Column: 3D Animated Floating Resume Card (White Theme) */}
            <div className="lg:col-span-5 hidden lg:flex justify-center items-center relative select-none">
              <FloatingResume3D
                candidateName="Alex Rivera"
                jobTitle="Senior AI Full-Stack Engineer"
                theme="white"
                onInspectATS={onOpenAnalyzer}
              />
            </div>

          </div>
        </div>

        {/* Floating Bottom Trust / Stats Bar (50K+ Happy Users, 4.8/5 Rating, 100% ATS Friendly) */}
        <div className="max-w-4xl mx-auto px-4 mt-12 sm:mt-16 relative z-10">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl md:rounded-full border border-purple-100 shadow-[0_10px_30px_rgba(99,53,245,0.08)] px-6 sm:px-10 py-3.5 flex flex-wrap items-center justify-between gap-4">
            {/* 50K+ Happy Users */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#EDE9FE] flex items-center justify-center text-[#6335F5]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#111827] leading-none">50K+</div>
                <div className="text-[11px] text-[#6B7280] font-medium mt-0.5">Happy Users</div>
              </div>
            </div>

            <div className="hidden sm:block h-7 w-px bg-purple-100" />

            {/* 4.8/5 User Rating */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#FEF3C7] flex items-center justify-center text-[#D97706]">
                <Star className="w-4 h-4 fill-[#F59E0B]" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#111827] leading-none">4.8/5</div>
                <div className="text-[11px] text-[#6B7280] font-medium mt-0.5">User Rating</div>
              </div>
            </div>

            <div className="hidden sm:block h-7 w-px bg-purple-100" />

            {/* 100% ATS Friendly */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#DCFCE7] flex items-center justify-center text-[#16A34A]">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-[#111827] leading-none">100%</div>
                <div className="text-[11px] text-[#6B7280] font-medium mt-0.5">ATS Friendly</div>
              </div>
            </div>

            <div className="hidden md:block h-7 w-px bg-purple-100" />

            {/* Handwritten script slogan */}
            <div className="relative text-center sm:text-right">
              <span className="font-serif italic font-bold text-base sm:text-lg text-[#6D28D9] tracking-tight">
                Your Career, Our Priority ♡
              </span>
              <svg className="w-full h-2 text-[#A78BFA] mt-0.5" viewBox="0 0 160 8" fill="none">
                <path d="M2 5C40 2 110 2 158 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

        {/* Fluid Royal Blue & Deep Purple Bottom Wave SVGs (Restored Iconic Blue Waves) */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden h-24 sm:h-32 -z-0">
          <svg
            className="w-full h-full"
            viewBox="0 0 1440 140"
            fill="none"
            preserveAspectRatio="none"
          >
            <path
              d="M0,80 C240,140 480,20 720,80 C960,140 1200,30 1440,90 L1440,140 L0,140 Z"
              fill="url(#blueWaveGrad1)"
              fillOpacity="0.88"
            />
            <path
              d="M0,105 C320,50 640,130 960,75 C1200,120 1360,95 1440,110 L1440,140 L0,140 Z"
              fill="url(#blueWaveGrad2)"
            />
            <defs>
              <linearGradient id="blueWaveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563EB" />
                <stop offset="45%" stopColor="#4318FF" />
                <stop offset="100%" stopColor="#6335F5" />
              </linearGradient>
              <linearGradient id="blueWaveGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#1D4ED8" />
                <stop offset="50%" stopColor="#3730A3" />
                <stop offset="100%" stopColor="#3B0764" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* 6-Step Career Intelligence Engine ("How ResumeXpert AI Guides Your Career" - Positioned Below Top Wave in White Theme) */}
      <section className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6 sm:mt-10 mb-10 relative z-20">
        <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(99,53,245,0.06),0_1px_3px_rgba(0,0,0,0.02)] border border-purple-100 overflow-hidden text-[#1F2937]">
          <CareerJourney3D
            theme="white"
            onOpenAiCareer={onOpenAiCareer}
            onOpenBuilder={onGetStarted}
            onOpenAnalyzer={onOpenAnalyzer}
            onOpenUploadModal={onOpenUploadModal}
          />
        </div>
      </section>


      {/* Single-Column ATS Resume Builder Stepper Card */}
      <section className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 mb-8 relative z-20">
        <div className="bg-white rounded-3xl border border-purple-100 shadow-[0_10px_35px_rgba(99,53,245,0.06)] p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl sm:text-2xl font-black text-[#111827]">Single-Column ATS Resume Builder</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#EDE9FE] text-[#6335F5] border border-purple-200">
                  ATS Standard
                </span>
              </div>
              <p className="text-sm text-[#6B7280] mt-0.5">Follow the 7 structured steps to create your ATS-optimized resume</p>
            </div>

            <button
              type="button"
              onClick={() => onGetStarted(1)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#6335F5] to-[#7C3AED] hover:from-[#5326DF] hover:to-[#6D28D9] text-white font-bold text-sm shadow-md shadow-purple-500/25 transition-all self-start sm:self-auto"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Stepper Track with 7 Steps */}
          <div className="relative pt-2 pb-4">
            <div className="hidden sm:block absolute top-7 left-8 right-8 h-0.5 bg-purple-100 -z-0" />

            <div className="grid grid-cols-2 sm:grid-cols-7 gap-4 relative z-10">
              {stepsList.map((step) => (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => onStepSelect(step.number)}
                  className="flex flex-col items-center group text-center focus:outline-none"
                >
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-purple-200 group-hover:border-[#6335F5] group-hover:bg-purple-50 flex items-center justify-center text-sm font-bold text-[#111827] group-hover:text-[#6335F5] transition-all duration-200 mb-2 shadow-sm group-hover:scale-105">
                    {step.number}
                  </div>
                  <span className="text-xs font-semibold text-[#4B5563] group-hover:text-[#6335F5] transition-colors">
                    {step.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ATS Readiness Banner */}
      <section className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-6">
        <div className="bg-gradient-to-r from-purple-50/80 via-white to-purple-50/40 rounded-3xl border border-purple-200/80 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6335F5] to-[#7C3AED] text-white flex items-center justify-center shrink-0 shadow-md shadow-purple-500/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-[#111827]">ATS Resume Analyzer & Scoring</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#6D28D9]">100-Point Audit</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#EDE9FE] text-[#6335F5] border border-purple-200" data-engine="Google Gemini">Neural AI</span>{/* Google Gemini AI Engine */}
              </div>
              <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5">
                Inspect contact completeness, action verb strength, quantifiable metrics, and job description keyword matching.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onOpenAnalyzer}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#6335F5] to-[#7C3AED] hover:from-[#5326DF] hover:to-[#6D28D9] text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/20 transition-all shrink-0 whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Resume</span>
          </button>
        </div>
      </section>

      {/* Cloud Account & Storage Status Banner */}
      {!isAuthenticated && (
        <section className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 mt-2 mb-6">
          <div className="bg-gradient-to-r from-[#6335F5]/10 via-purple-50 to-white rounded-3xl border border-purple-200 p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-[#6335F5] text-white flex items-center justify-center shrink-0 shadow-sm">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#111827]">
                  Cloud Resumes & Cross-Device Sync Available
                </h4>
                <p className="text-xs text-[#4B5563] mt-0.5">
                  Sign in or create a free account to manage multiple resumes, autosave to Supabase cloud, and access your drafts anywhere.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal('signin')}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#6335F5] hover:bg-[#5326DF] text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In / Create Account</span>
            </button>
          </div>
        </section>
      )}

      {/* Your Active Resumes & Cards */}
      <section className="max-w-[1360px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[#111827]">
                {isAuthenticated ? 'Your Cloud Resumes' : 'Your Resumes'}
              </h2>
              {isAuthenticated && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-[#6D28D9]">
                  {cloudResumes.length} saved
                </span>
              )}
            </div>
            <p className="text-sm text-[#6B7280] mt-0.5">
              {isAuthenticated 
                ? 'Manage, duplicate, rename and edit all your cloud resumes'
                : 'Pick up where you left off or create a new version'}
            </p>
          </div>

          {isAuthenticated && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraftToCloud}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-purple-200 bg-white hover:bg-purple-50 text-xs font-semibold text-[#6335F5] transition-all shadow-sm"
                title="Save current builder draft as a new cloud resume"
              >
                <CloudUpload className="w-3.5 h-3.5" />
                <span>Save Local Draft to Cloud</span>
              </button>
              <button
                type="button"
                onClick={handleCreateNewCloudResume}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#6335F5] to-[#7C3AED] text-white text-xs font-bold shadow-sm hover:shadow-md transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Resume</span>
              </button>
            </div>
          )}
        </div>

        {/* Cloud Error Alert */}
        {cloudError && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center justify-between">
            <span>{cloudError}</span>
            <button
              type="button"
              onClick={loadCloudResumes}
              className="underline font-bold hover:text-red-900 ml-2"
            >
              Retry
            </button>
          </div>
        )}

        {/* Resumes Grid */}
        {loadingCloud ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-purple-100 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-[#6335F5]" />
            <p className="text-xs text-[#6B7280] font-medium">Loading your cloud resumes...</p>
          </div>
        ) : isAuthenticated && cloudResumes.length > 0 ? (
          /* Authenticated User: Cloud Resumes Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cloudResumes.map((item) => {
              const isActive = activeCloudResumeId === item.id;
              const title = item.title || 'Untitled Resume';
              const lastEdited = item.updated_at 
                ? new Date(item.updated_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
                : 'Recently';

              return (
                <div
                  key={item.id}
                  onClick={() => handleOpenCloudResume(item)}
                  className={`group bg-white rounded-3xl border-2 ${
                    isActive ? 'border-[#6335F5] shadow-[0_10px_25px_rgba(99,53,245,0.12)]' : 'border-purple-100 hover:border-[#6335F5]'
                  } shadow-sm hover:shadow-[0_10px_25px_rgba(99,53,245,0.08)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden cursor-pointer flex flex-col`}
                >
                  <div className="h-40 bg-gradient-to-br from-purple-50/70 to-white p-4 relative flex items-center justify-center border-b border-purple-50">
                    <div className="w-48 h-32 bg-white rounded-xl shadow-sm border border-purple-100 p-3 flex flex-col justify-between">
                      <div>
                        <div className="w-24 h-2 bg-[#111827] rounded mb-1" />
                        <div className="w-16 h-1 bg-[#6335F5] rounded mb-2" />
                        <div className="space-y-1">
                          <div className="w-full h-0.5 bg-gray-200 rounded" />
                          <div className="w-5/6 h-0.5 bg-gray-200 rounded" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-body border-t border-purple-50 pt-1">
                        <span>{item.resume_data?.meta?.template || 'Classic'}</span>
                        <span className="font-bold text-[#6335F5]">Cloud Sync</span>
                      </div>
                    </div>
                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      {isActive && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active In Builder
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-[#6335F5] border border-purple-200 flex items-center gap-1">
                        <Cloud className="w-2.5 h-2.5" />
                        <span>Cloud</span>
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base font-bold text-[#111827] group-hover:text-[#6335F5] transition-colors line-clamp-1">
                        {title}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mt-1 mb-4">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Updated {lastEdited}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <span className="text-xs text-[#6335F5] font-bold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                        Open in Builder <ChevronRight className="w-3 h-3" />
                      </span>

                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => openRenameModal(e, item)}
                          className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Rename Resume"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDuplicate(e, item)}
                          className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 rounded-lg transition-colors"
                          title="Duplicate Resume"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(e, item)}
                          className="p-1.5 text-[#6B7280] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Resume"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* "+ Create New Resume" Action Card */}
            <button
              type="button"
              onClick={handleCreateNewCloudResume}
              className="bg-white border-2 border-dashed border-purple-200 hover:border-[#6335F5] hover:bg-purple-50/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all min-h-[220px] group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center mb-3 transition-colors text-[#6335F5]">
                <Plus className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <p className="text-sm font-bold text-[#111827]">Create New Cloud Resume</p>
              <p className="text-xs text-[#6B7280] mt-1">Start a new blank resume in your cloud library</p>
            </button>
          </div>
        ) : isAuthenticated && cloudResumes.length === 0 ? (
          /* Authenticated User: Empty Cloud Resumes State */
          <div className="bg-white border border-purple-100 rounded-3xl p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6335F5] flex items-center justify-center mx-auto mb-4 border border-purple-100">
              <Cloud className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-[#111827] mb-1">No Cloud Resumes Found</h3>
            <p className="text-xs text-[#6B7280] mb-6">
              You haven't saved any resumes to your cloud account yet. You can create a new blank resume or import your current local draft!
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleCreateNewCloudResume}
                className="btn-primary py-2.5 px-5 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Cloud Resume</span>
              </button>
              <button
                type="button"
                onClick={handleSaveDraftToCloud}
                className="btn-secondary py-2.5 px-5 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <CloudUpload className="w-4 h-4" />
                <span>Upload Local Draft to Cloud</span>
              </button>
            </div>
          </div>
        ) : (
          /* Unauthenticated User: Local Drafts Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Active Primary Resume */}
            <div
              onClick={() => onGetStarted(1)}
              className="group bg-white rounded-3xl border-2 border-purple-200 hover:border-[#6335F5] shadow-sm hover:shadow-[0_10px_25px_rgba(99,53,245,0.08)] transition-all duration-300 hover:-translate-y-0.5 overflow-hidden cursor-pointer flex flex-col"
            >
              <div className="h-40 bg-gradient-to-br from-purple-50/70 to-white p-4 relative flex items-center justify-center">
                <div className="w-48 h-32 bg-white rounded-xl shadow-sm border border-purple-100 p-3 flex flex-col justify-between">
                  <div>
                    <div className="w-24 h-2 bg-[#111827] rounded mb-1" />
                    <div className="w-16 h-1 bg-[#6335F5] rounded mb-2" />
                    <div className="space-y-1">
                      <div className="w-full h-0.5 bg-gray-200 rounded" />
                      <div className="w-5/6 h-0.5 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-body border-t border-purple-50 pt-1">
                    <span>Single-Column ATS</span>
                    <span className="font-bold text-[#6335F5]">{percentage}%</span>
                  </div>
                </div>
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Draft
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#111827] group-hover:text-[#6335F5] transition-colors">
                    {candidateName} — {roleName}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280] mt-1 mb-4">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Saved locally in browser</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-[#6B7280]">Completion</span>
                    <span className="text-[#6335F5] font-bold">{percentage}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#6335F5] to-[#7C3AED] transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Start Blank Resume Card */}
            <button
              type="button"
              onClick={handleStartFresh}
              className="bg-white border-2 border-dashed border-purple-200 hover:border-[#6335F5] hover:bg-purple-50/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all min-h-[220px] group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-purple-100 flex items-center justify-center mb-3 transition-colors text-[#6335F5]">
                <Plus className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
              </div>
              <p className="text-sm font-bold text-[#111827]">Start Blank Resume</p>
              <p className="text-xs text-[#6B7280] mt-1">Clear all fields & start fresh</p>
            </button>
          </div>
        )}
      </section>

      {/* Production 4-Column Footer */}
      <AppFooter
        onNavigate={onNavigate}
        onOpenBuilder={onGetStarted}
        onOpenAnalyzer={onOpenAnalyzer}
        onOpenAiCareer={onOpenAiCareer}
      />

      {/* Templates Switcher Modal */}
      <TemplatesModal
        isOpen={templatesModalOpen}
        onClose={() => setTemplatesModalOpen(false)}
      />

      {/* Watch Demo Modal */}
      {demoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 max-w-lg w-full p-6 sm:p-8 relative">
            <button
              onClick={() => setDemoModalOpen(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#6335F5] flex items-center justify-center mb-4">
              <Sparkles className="w-6 h-6" />
            </div>

            <h3 className="text-xl font-black text-[#111827] mb-2">How ResumeXpert AI Works</h3>
            <p className="text-sm text-[#4B5563] mb-6">
              Create an ATS-optimized resume in under 5 minutes with real-time scoring and cloud backup.
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-[#6335F5] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827]">Enter Details Step-by-Step</h4>
                  <p className="text-[11px] text-[#6B7280]">Fill personal info, work experience, education and skills with real-time Zod validation.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-[#6335F5] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827]">Audit with ATS Analyzer</h4>
                  <p className="text-[11px] text-[#6B7280]">Get instant 100-point feedback on action verbs, metrics, and job keyword matching.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-100 text-[#6335F5] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="text-xs font-bold text-[#111827]">Cloud Sync & Multi-Format Export</h4>
                  <p className="text-[11px] text-[#6B7280]">Autosave to Supabase cloud, export pixel-perfect PDFs or editable Microsoft Word (.docx) files.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setDemoModalOpen(false);
                  onGetStarted(1);
                }}
                className="btn-primary flex-1 justify-center py-3"
              >
                <span>Start Building Free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setDemoModalOpen(false)}
                className="btn-secondary px-5 py-3 text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Resume Modal */}
      {renameModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-purple-100 max-w-sm w-full p-6 relative">
            <button
              onClick={() => setRenameModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-[#111827] mb-2">Rename Resume</h3>
            <form onSubmit={handleRenameSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={renameInput}
                onChange={(e) => setRenameInput(e.target.value)}
                className="input-field"
                placeholder="e.g. Senior Frontend Resume"
                autoFocus
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRenameModalOpen(false)}
                  className="btn-secondary py-2 px-3 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-4 text-xs font-bold"
                >
                  Save Title
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
