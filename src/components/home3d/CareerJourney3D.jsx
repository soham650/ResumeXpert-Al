import React, { useState } from 'react';
import { 
  Upload, Sparkles, Target, FileText, Mic, TrendingUp, 
  ArrowRight, CheckCircle2, ChevronRight, Zap, ShieldCheck 
} from 'lucide-react';

/**
 * CareerJourney3D Component
 * 6-Stage AI Career Workflow Visualization with:
 * - White theme (matching light lavender website style) & Dark theme support
 * - Connected glowing energy paths
 * - Animated particle nodes
 * - Interactive stage details & direct launch actions
 */
export default function CareerJourney3D({ 
  onOpenAiCareer, 
  onOpenBuilder, 
  onOpenAnalyzer, 
  onOpenUploadModal,
  theme = 'white' // 'white' | 'dark'
}) {
  const [activeStage, setActiveStage] = useState(0);

  const isWhite = theme === 'white';

  const stages = [
    {
      id: 'upload',
      number: '01',
      title: 'Upload Resume',
      tagline: 'Multi-Format Ingestion',
      icon: Upload,
      color: 'from-blue-500 to-indigo-600',
      glow: 'rgba(59, 130, 246, 0.25)',
      summary: 'Upload existing PDF, DOCX, or text resume. The system extracts structured education, work experience, and tech stacks with zero data loss.',
      actionLabel: 'Upload Resume File',
      action: onOpenUploadModal,
    },
    {
      id: 'analyze',
      number: '02',
      title: 'Analyze Profile',
      tagline: '100-Point ATS Audit',
      icon: ShieldCheck,
      color: 'from-indigo-500 to-purple-600',
      glow: 'rgba(99, 102, 241, 0.25)',
      summary: 'Instant heuristic evaluation checking single-column formatting, action verb strength, contact completeness, and keyword densities.',
      actionLabel: 'Run Free ATS Audit',
      action: onOpenAnalyzer,
    },
    {
      id: 'match',
      number: '03',
      title: 'Match Target Job',
      tagline: 'Job Description Mapping',
      icon: Target,
      color: 'from-purple-500 to-pink-600',
      glow: 'rgba(168, 85, 247, 0.25)',
      summary: 'Paste target job description to pinpoint required technologies, qualification gaps, and calculate an explainable match coefficient.',
      actionLabel: 'Match Target Job',
      action: onOpenAiCareer,
    },
    {
      id: 'prepare',
      number: '04',
      title: 'Prepare Application',
      tagline: 'Tailored Documents',
      icon: FileText,
      color: 'from-pink-500 to-rose-600',
      glow: 'rgba(236, 72, 153, 0.25)',
      summary: 'Generate tailored resume versions, high-conversion cover letters, and recruiter outreach messages while preserving original master data.',
      actionLabel: 'Tailor Resume Draft',
      action: onOpenAiCareer,
    },
    {
      id: 'interview',
      number: '05',
      title: 'Practice Interview',
      tagline: 'Voice & Text Simulator',
      icon: Mic,
      color: 'from-amber-500 to-orange-600',
      glow: 'rgba(245, 158, 11, 0.25)',
      summary: 'Simulate realistic behavioral and technical interview questions powered by Advanced Neural AI, complete with voice recording and rubric feedback.',
      actionLabel: 'Launch Mock Interview',
      action: onOpenAiCareer,
    },
    {
      id: 'improve',
      number: '06',
      title: 'Improve Skills',
      tagline: 'Personalized Roadmap',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-600',
      glow: 'rgba(16, 185, 129, 0.25)',
      summary: 'Receive an actionable career skill enhancement roadmap with curated documentation links and portfolio project recommendations.',
      actionLabel: 'View Career Roadmap',
      action: onOpenAiCareer,
    },
  ];

  const current = stages[activeStage];
  const CurrentIcon = current.icon;

  return (
    <section className="relative w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${
          isWhite 
            ? 'bg-[#FAF5FF] border border-[#E9D5FF] text-[#6D28D9] shadow-2xs' 
            : 'bg-purple-500/10 border border-purple-500/30 text-[#A78BFA] backdrop-blur-md'
        }`}>
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          <span>The 6-Step Career Intelligence Engine</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
          isWhite ? 'text-[#111827]' : 'text-white'
        }`}>
          How ResumeXpert AI Guides Your Career
        </h2>
        <p className={`text-sm sm:text-base font-normal ${
          isWhite ? 'text-[#6B7280]' : 'text-gray-400'
        }`}>
          A seamless, continuous workflow designed to transform your raw experience into job offers with Advanced Neural AI.
        </p>
      </div>

      {/* 6-Stage Pipeline Track (Horizontal on Desktop, Stacked on Mobile) */}
      <div className="relative mb-10">
        {/* Connection Energy Line (Desktop) */}
        <div className={`hidden lg:block absolute top-10 left-12 right-12 h-1.5 rounded-full overflow-hidden -z-0 ${
          isWhite ? 'bg-[#EDE9FE]' : 'bg-white/10'
        }`}>
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 transition-all duration-500 shadow-xs"
            style={{ width: `${((activeStage + 1) / stages.length) * 100}%` }}
          />
        </div>

        {/* Stages Node Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 relative z-10">
          {stages.map((stage, index) => {
            const Icon = stage.icon;
            const isActive = activeStage === index;
            const isPassed = activeStage > index;

            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStage(index)}
                className={`group relative text-left p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between min-h-[140px] focus:outline-none ${
                  isWhite
                    ? isActive
                      ? 'bg-white border-2 border-[#6335F5] shadow-[0_12px_28px_rgba(99,53,245,0.14)] ring-4 ring-purple-100 scale-[1.02]'
                      : 'bg-[#FAF9FF] hover:bg-white border-purple-100 hover:border-purple-200 shadow-2xs hover:shadow-xs'
                    : isActive
                      ? 'bg-[#181534] border-purple-400 shadow-[0_10px_30px_rgba(99,53,245,0.35)] scale-102 ring-1 ring-purple-400/50'
                      : 'bg-[#110E24]/70 hover:bg-[#15122D] border-white/10 hover:border-white/20'
                }`}
              >
                {/* Stage Number & Status */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-mono font-bold ${
                    isWhite 
                      ? isActive ? 'text-[#6D28D9]' : 'text-[#6B7280]' 
                      : isActive ? 'text-purple-300' : 'text-gray-500'
                  }`}>
                    STEP {stage.number}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      isActive
                        ? `bg-gradient-to-tr ${stage.color} text-white shadow-md`
                        : isPassed
                        ? isWhite ? 'bg-[#EDE9FE] text-[#6335F5]' : 'bg-purple-900/60 text-purple-300'
                        : isWhite ? 'bg-purple-50 text-[#8B5CF6] group-hover:bg-[#EDE9FE]' : 'bg-white/5 text-gray-400 group-hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                {/* Stage Title */}
                <div>
                  <h3 className={`text-xs sm:text-sm font-bold leading-snug transition-colors ${
                    isWhite
                      ? isActive ? 'text-[#111827] font-black' : 'text-[#374151] group-hover:text-[#111827]'
                      : isActive ? 'text-white font-extrabold' : 'text-gray-300 group-hover:text-white'
                  }`}>
                    {stage.title}
                  </h3>
                  <p className={`text-[10px] mt-0.5 line-clamp-1 ${isWhite ? 'text-[#6B7280]' : 'text-gray-400'}`}>
                    {stage.tagline}
                  </p>
                </div>

                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute -bottom-px left-4 right-4 h-1 bg-gradient-to-r from-[#6335F5] to-[#8B5CF6] rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Deep-Dive Card */}
      <div className={`rounded-3xl p-6 sm:p-10 shadow-[0_15px_40px_rgba(99,53,245,0.06)] relative overflow-hidden transition-colors ${
        isWhite 
          ? 'bg-gradient-to-br from-[#FAF7FF] via-white to-[#F5EEFF] border border-purple-100' 
          : 'bg-[#13102B]/90 backdrop-blur-xl border border-purple-500/30'
      }`}>
        {/* Glowing backdrop spotlight */}
        <div 
          className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full blur-3xl opacity-30 pointer-events-none"
          style={{ background: current.glow }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center relative z-10">
          {/* Left Details */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${current.color} text-white flex items-center justify-center shadow-lg shadow-purple-500/20`}>
                <CurrentIcon className="w-6 h-6" />
              </div>
              <div>
                <span className={`text-xs font-mono font-bold uppercase tracking-wider ${
                  isWhite ? 'text-[#6D28D9]' : 'text-[#A78BFA]'
                }`}>
                  Stage {current.number} of 06
                </span>
                <h3 className={`text-xl sm:text-2xl font-black ${
                  isWhite ? 'text-[#111827]' : 'text-white'
                }`}>
                  {current.title} — {current.tagline}
                </h3>
              </div>
            </div>

            <p className={`text-sm sm:text-base leading-relaxed max-w-2xl ${
              isWhite ? 'text-[#4B5563]' : 'text-gray-300'
            }`}>
              {current.summary}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={current.action}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r ${current.color} text-white font-bold text-xs sm:text-sm shadow-md shadow-purple-500/20 hover:scale-102 transition-all active:scale-[0.98]`}
              >
                <span>{current.actionLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenAiCareer}
                className={`inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-xs sm:text-sm transition-all ${
                  isWhite 
                    ? 'bg-white hover:bg-purple-50 text-[#6335F5] font-bold border border-purple-200 shadow-2xs' 
                    : 'bg-white/10 hover:bg-white/15 text-white border border-white/15'
                }`}
              >
                <span>Open Full Career Journey</span>
                <ChevronRight className={`w-4 h-4 ${isWhite ? 'text-[#6335F5]' : 'text-purple-300'}`} />
              </button>
            </div>
          </div>

          {/* Right Stage Highlights */}
          <div className={`lg:col-span-5 xl:col-span-4 w-full rounded-2xl p-5 sm:p-6 border space-y-3.5 transition-colors ${
            isWhite 
              ? 'bg-white border-purple-100 shadow-sm' 
              : 'bg-white/5 border-white/10'
          }`}>
            <h4 className={`text-xs font-black uppercase tracking-wider ${
              isWhite ? 'text-[#6D28D9]' : 'text-purple-300'
            }`}>
              Stage Highlights
            </h4>
            <ul className={`space-y-2.5 text-xs ${isWhite ? 'text-[#374151]' : 'text-gray-300'}`}>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">Zero fabrication — improves genuine career data</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">Client-side privacy & GDPR right-to-erasure</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">Vector PDF and PKZIP Word DOCX exports</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
