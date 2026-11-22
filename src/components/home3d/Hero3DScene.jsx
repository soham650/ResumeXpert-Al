import React from 'react';
import { 
  Rocket, ShieldCheck, Sparkles, Download, ArrowRight, Check, 
  Users, Star, Trophy, CloudUpload, Play 
} from 'lucide-react';
import FloatingResume3D from './FloatingResume3D';

/**
 * Hero3DScene Component
 * Premium 3D animated hero section for ResumeXpert AI:
 * - Headline: "Build a Resume That Gets You Noticed."
 * - Subheadline: "Create ATS-friendly resumes, analyze your career profile, and prepare for your next opportunity with AI-powered career intelligence."
 * - Primary CTA: "Build My Resume"
 * - Secondary CTA: "Check My ATS Score"
 * - 3D floating resume document with continuous laser scanner & floating score panel
 * - 50K+ Happy Users / 4.8 Rating / 100% ATS trust bar with dark glassmorphism
 */
export default function Hero3DScene({
  onGetStarted,
  onOpenAnalyzer,
  onOpenUploadModal,
  onOpenDemo,
}) {
  return (
    <section className="relative pt-8 sm:pt-14 pb-16 lg:pb-24 overflow-hidden z-10">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
          
          {/* Left Column: Premium SaaS Copy & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#6335F5]/15 border border-[#8B5CF6]/30 text-xs font-bold text-[#C4B5FD] backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Next-Gen Career Intelligence Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black text-white tracking-tight leading-[1.08]">
              Build a Resume That{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#38BDF8]">
                Gets You Noticed.
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-gray-300 text-base sm:text-lg lg:text-xl max-w-xl leading-relaxed font-normal">
              Create ATS-friendly resumes, analyze your career profile, and prepare for your next opportunity with AI-powered career intelligence.
            </p>

            {/* 3 Value Proposition Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-200 backdrop-blur-md">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 stroke-[3.5]" />
                </div>
                <span>ATS Optimized</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-200 backdrop-blur-md">
                <div className="w-4 h-4 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5" />
                </div>
                <span>Advanced Neural AI</span>
              </div>

              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-200 backdrop-blur-md">
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>Vector PDF & DOCX</span>
              </div>
            </div>

            {/* Primary & Secondary Action CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              {/* Primary CTA */}
              <button
                type="button"
                onClick={() => onGetStarted(1)}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#6335F5] to-[#7C3AED] hover:from-[#5225E0] hover:to-[#6D28D9] text-white font-bold text-sm sm:text-base shadow-[0_12px_30px_rgba(99,53,245,0.45)] hover:shadow-[0_16px_35px_rgba(99,53,245,0.6)] hover:-translate-y-0.5 transition-all duration-200 group active:scale-[0.98]"
              >
                <Rocket className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                <span>Build My Resume</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              {/* Secondary CTA */}
              <button
                type="button"
                onClick={onOpenAnalyzer}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-[#181534]/80 hover:bg-[#201C45] text-white font-bold text-sm sm:text-base border border-purple-400/40 hover:border-purple-400 shadow-sm hover:shadow hover:-translate-y-0.5 transition-all duration-200 backdrop-blur-md group active:scale-[0.98]"
              >
                <ShieldCheck className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                <span>Check My ATS Score</span>
              </button>

              {/* Watch Demo CTA */}
              <button
                type="button"
                onClick={onOpenDemo}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-all text-xs sm:text-sm font-semibold active:scale-[0.98]"
              >
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-purple-300">
                  <Play className="w-3 h-3 fill-current ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>
          </div>

          {/* Right Column: Floating 3D Animated Resume Visualization */}
          <div className="lg:col-span-5 flex justify-center items-center">
            <FloatingResume3D onInspectATS={onOpenAnalyzer} />
          </div>

        </div>

        {/* 50K+ Happy Users / 4.8 Rating / 100% ATS Friendly Trust Bar (Dark Glassmorphic) */}
        <div className="max-w-4xl mx-auto mt-14 sm:mt-18 relative z-20">
          <div className="bg-[#120F2A]/90 backdrop-blur-xl rounded-2xl md:rounded-full border border-purple-500/25 shadow-[0_15px_35px_rgba(0,0,0,0.5),0_0_25px_rgba(99,53,245,0.15)] px-6 sm:px-10 py-4 flex flex-wrap items-center justify-between gap-5">
            {/* 50K+ Happy Users */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#6335F5]/25 border border-purple-400/30 flex items-center justify-center text-[#A78BFA]">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-black text-white leading-none">50K+</div>
                <div className="text-[11px] text-gray-400 font-medium mt-0.5">Happy Users</div>
              </div>
            </div>

            <div className="hidden sm:block h-7 w-px bg-white/10" />

            {/* 4.8/5 Rating */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <div>
                <div className="text-sm font-black text-white leading-none">4.8/5</div>
                <div className="text-[11px] text-gray-400 font-medium mt-0.5">User Rating</div>
              </div>
            </div>

            <div className="hidden sm:block h-7 w-px bg-white/10" />

            {/* 100% ATS Friendly */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400">
                <Trophy className="w-4 h-4" />
              </div>
              <div>
                <div className="text-sm font-black text-white leading-none">100%</div>
                <div className="text-[11px] text-gray-400 font-medium mt-0.5">ATS Friendly</div>
              </div>
            </div>

            <div className="hidden md:block h-7 w-px bg-white/10" />

            {/* Script Slogan */}
            <div className="relative text-center sm:text-right">
              <span className="font-serif italic font-bold text-base sm:text-lg text-purple-300 tracking-tight">
                Your Career, Our Priority ♡
              </span>
              <svg className="w-full h-2 text-[#8B5CF6] mt-0.5" viewBox="0 0 160 8" fill="none">
                <path d="M2 5C40 2 110 2 158 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
