import React from 'react';
import { 
  FileText, ShieldCheck, Sparkles, Send, Mic, TrendingUp, 
  Mail, Compass, ArrowRight, Check, Zap, Layers 
} from 'lucide-react';

/**
 * FeatureShowcase3D Component
 * 8-Feature Interactive Showcase with:
 * - White theme & Dark theme support
 * - Clean cards with interactive hover depth and subtle glow
 * - Realistic illustrative UI preview mockups
 * - Real functional triggers for all 8 capabilities
 */
export default function FeatureShowcase3D({
  onOpenBuilder,
  onOpenAnalyzer,
  onOpenAiCareer,
  onOpenUploadModal,
  theme = 'white' // 'white' | 'dark'
}) {
  const isWhite = theme === 'white';

  const features = [
    {
      id: 'builder',
      title: 'AI Resume Builder',
      badge: 'Single-Column ATS',
      description: 'Step-by-step 7-section editor with live split-screen preview, Zod validation, and multi-template vector PDF & DOCX export.',
      icon: FileText,
      gradient: 'from-blue-600 to-indigo-600',
      actionText: 'Build My Resume',
      onAction: () => onOpenBuilder(1),
      previewMockup: (
        <div className={`rounded-xl p-3 border space-y-2 ${isWhite ? 'bg-white border-purple-100 shadow-2xs' : 'bg-[#0D0B1C] border-white/10'}`}>
          <div className={`flex items-center justify-between text-[10px] border-b pb-1.5 ${isWhite ? 'border-gray-100 text-gray-500' : 'border-white/10 text-gray-400'}`}>
            <span className={`font-bold ${isWhite ? 'text-[#111827]' : 'text-white'}`}>Live Split-Screen</span>
            <span className="text-emerald-600 font-semibold">Autosaved</span>
          </div>
          <div className="space-y-1">
            <div className="w-2/3 h-2 bg-purple-500/80 rounded-xs" />
            <div className={`w-1/2 h-1.5 rounded-xs ${isWhite ? 'bg-purple-200' : 'bg-gray-500'}`} />
            <div className={`w-full h-1 rounded-xs ${isWhite ? 'bg-gray-200' : 'bg-gray-700'}`} />
          </div>
        </div>
      ),
    },
    {
      id: 'checker',
      title: 'Free ATS Resume Checker',
      badge: 'Multi-Format Ingestion',
      description: 'Upload your current resume in PDF, DOCX, or text to test machine readability, section identification, and parsing accuracy.',
      icon: ShieldCheck,
      gradient: 'from-emerald-600 to-teal-600',
      actionText: 'Check My ATS Score',
      onAction: onOpenUploadModal,
      previewMockup: (
        <div className={`rounded-xl p-3 border space-y-2 ${isWhite ? 'bg-white border-purple-100 shadow-2xs' : 'bg-[#0D0B1C] border-white/10'}`}>
          <div className="flex items-center justify-between text-[10px]">
            <span className={isWhite ? 'text-gray-600 font-medium' : 'text-gray-300'}>Parser Score</span>
            <span className="font-black text-emerald-600">92 / 100</span>
          </div>
          <div className={`w-full h-1.5 rounded-full overflow-hidden ${isWhite ? 'bg-gray-100' : 'bg-gray-800'}`}>
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
          </div>
        </div>
      ),
    },
    {
      id: 'analyzer',
      title: 'AI Resume Analyzer',
      badge: '100-Point Heuristic',
      description: 'Instant feedback engine evaluating action verbs, quantifiable metrics, contact completeness, and keyword densities.',
      icon: Sparkles,
      gradient: 'from-purple-600 to-pink-600',
      actionText: 'Launch Analyzer',
      onAction: onOpenAnalyzer,
      previewMockup: (
        <div className={`rounded-xl p-3 border space-y-1.5 text-[10px] ${isWhite ? 'bg-white border-purple-100 shadow-2xs' : 'bg-[#0D0B1C] border-white/10'}`}>
          <div className={`flex justify-between ${isWhite ? 'text-gray-600' : 'text-gray-300'}`}>
            <span>Action Verbs</span>
            <span className="text-emerald-600 font-bold">15/15</span>
          </div>
          <div className={`flex justify-between ${isWhite ? 'text-gray-600' : 'text-gray-300'}`}>
            <span>Metrics & Impact</span>
            <span className={`font-bold ${isWhite ? 'text-[#6D28D9]' : 'text-purple-300'}`}>20/20</span>
          </div>
        </div>
      ),
    },
    {
      id: 'copilot',
      title: 'AI Job Application Copilot',
      badge: 'Target Job Matching',
      description: 'Paste any job posting to calculate match percentages, uncover missing qualifications, and generate tailored resume versions.',
      icon: Send,
      gradient: 'from-blue-500 to-cyan-600',
      actionText: 'Tailor For a Job',
      onAction: onOpenAiCareer,
      previewMockup: (
        <div className={`rounded-xl p-3 border space-y-1.5 ${isWhite ? 'bg-white border-purple-100 shadow-2xs' : 'bg-[#0D0B1C] border-white/10'}`}>
          <div className={`text-[10px] ${isWhite ? 'text-gray-500 font-medium' : 'text-gray-400'}`}>Target Match</div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-[#2563EB]">88% Match</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${isWhite ? 'bg-blue-50 text-blue-700' : 'bg-cyan-950 text-cyan-300'}`}>3 Missing Skills</span>
          </div>
        </div>
      ),
    },
    {
      id: 'interview',
      title: 'AI Mock Interview — Voice & Text',
      badge: 'Neural AI Powered',
      description: 'Simulate realistic HR and technical interview rounds with speech-to-text voice mode and structured rubric feedback.',
      icon: Mic,
      gradient: 'from-amber-600 to-orange-600',
      actionText: 'Practice Mock Interview',
      onAction: onOpenAiCareer,
      previewMockup: (
        <div className={`rounded-xl p-3 border space-y-1.5 ${isWhite ? 'bg-white border-purple-100 shadow-2xs' : 'bg-[#0D0B1C] border-white/10'}`}>
          <div className="flex items-center gap-1.5 text-[10px] text-amber-600 font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            <span>Voice Audio Recording Active</span>
          </div>
          <div className={`text-[10px] truncate ${isWhite ? 'text-gray-600' : 'text-gray-300'}`}>Q: Explain your experience scaling...</div>
        </div>
      ),
    },
    {
      id: 'roadmap',
      title: 'AI Career Roadmap',
      badge: 'Skill Gap Engine',
      description: 'Custom learning pathways designed to bridge qualification deficits with practical projects and verified documentation.',
      icon: TrendingUp,
      gradient: 'from-rose-600 to-red-600',
      actionText: 'Generate Roadmap',
      onAction: onOpenAiCareer,
      previewMockup: (
        <div className={`rounded-xl p-3 border space-y-1.5 ${isWhite ? 'bg-white border-purple-100 shadow-2xs' : 'bg-[#0D0B1C] border-white/10'}`}>
          <div className={`text-[10px] font-bold ${isWhite ? 'text-[#111827]' : 'text-gray-300'}`}>Milestone 1: Distributed Cache</div>
          <div className={`text-[9px] ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>Redis & Cluster architecture project</div>
        </div>
      ),
    },
    {
      id: 'coverletter',
      title: 'AI Cover Letter Generator',
      badge: 'Context-Aware',
      description: 'Generate high-impact, authentic cover letters directly mapped to your actual career achievements and company objectives.',
      icon: Mail,
      gradient: 'from-violet-600 to-indigo-600',
      actionText: 'Draft Cover Letter',
      onAction: onOpenAiCareer,
      previewMockup: (
        <div className={`rounded-xl p-3 border space-y-1 text-[10px] ${isWhite ? 'bg-white border-purple-100 shadow-2xs' : 'bg-[#0D0B1C] border-white/10'}`}>
          <div className={`font-mono ${isWhite ? 'text-gray-500' : 'text-gray-400'}`}>Dear Hiring Manager,</div>
          <div className={`truncate ${isWhite ? 'text-gray-700' : 'text-gray-300'}`}>I am writing to express my strong...</div>
        </div>
      ),
    },
    {
      id: 'journey',
      title: 'Career Journey Dashboard',
      badge: 'End-to-End Tracking',
      description: 'Track applications, stage completions, tailored resumes, and mock interview performance history in one unified view.',
      icon: Compass,
      gradient: 'from-pink-600 to-purple-600',
      actionText: 'Open Dashboard',
      onAction: onOpenAiCareer,
      previewMockup: (
        <div className={`rounded-xl p-3 border space-y-1 text-[10px] ${isWhite ? 'bg-white border-purple-100 shadow-2xs' : 'bg-[#0D0B1C] border-white/10'}`}>
          <div className={`flex justify-between ${isWhite ? 'text-gray-600' : 'text-gray-300'}`}>
            <span>Overall Readiness</span>
            <span className={`font-bold ${isWhite ? 'text-[#6D28D9]' : 'text-purple-300'}`}>Stage 4 / 6</span>
          </div>
          <div className={`w-full h-1.5 rounded-full ${isWhite ? 'bg-purple-100' : 'bg-purple-500/40'}`}>
            <div className="h-full bg-[#6335F5] rounded-full" style={{ width: '66%' }} />
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="relative w-full max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold ${
          isWhite 
            ? 'bg-[#FAF5FF] border border-[#E9D5FF] text-[#6D28D9] shadow-2xs' 
            : 'bg-purple-500/10 border border-purple-500/30 text-[#A78BFA] backdrop-blur-md'
        }`}>
          <Layers className={`w-3.5 h-3.5 ${isWhite ? 'text-[#6335F5]' : 'text-purple-400'}`} />
          <span>Full-Stack Career Intelligence</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight ${
          isWhite ? 'text-[#111827]' : 'text-white'
        }`}>
          Everything You Need to Land Your Next Role
        </h2>
        <p className={`text-sm sm:text-base font-normal ${
          isWhite ? 'text-[#6B7280]' : 'text-gray-400'
        }`}>
          Eight integrated AI tools working harmoniously to build, optimize, and verify your professional candidacy.
        </p>
      </div>

      {/* 8-Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;

          return (
            <div
              key={feature.id}
              className={`group rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between ${
                isWhite
                  ? 'bg-white border border-purple-100 hover:border-purple-300 shadow-xs hover:shadow-[0_20px_45px_rgba(99,53,245,0.1)]'
                  : 'bg-[#13102A]/85 backdrop-blur-xl border border-white/10 hover:border-purple-400/50 shadow-lg hover:shadow-[0_20px_45px_rgba(99,53,245,0.25)]'
              }`}
            >
              <div className="space-y-4">
                {/* Header Icon + Badge */}
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${feature.gradient} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    isWhite 
                      ? 'bg-purple-50 border border-purple-100 text-[#6D28D9]' 
                      : 'bg-white/5 border border-white/10 text-purple-300'
                  }`}>
                    {feature.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className={`text-base sm:text-lg font-bold transition-colors ${
                    isWhite 
                      ? 'text-[#111827] group-hover:text-[#6335F5]' 
                      : 'text-white group-hover:text-purple-300'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-xs leading-relaxed mt-1.5 ${
                    isWhite ? 'text-[#4B5563]' : 'text-gray-400'
                  }`}>
                    {feature.description}
                  </p>
                </div>

                {/* Illustrative Product Mockup Preview */}
                <div className="pt-1">
                  {feature.previewMockup}
                </div>
              </div>

              {/* Action Button */}
              <div className={`pt-5 border-t mt-5 ${isWhite ? 'border-gray-100' : 'border-white/10'}`}>
                <button
                  type="button"
                  onClick={feature.onAction}
                  className={`w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-200 group-hover:shadow-md ${
                    isWhite
                      ? 'bg-purple-50 hover:bg-[#6335F5] text-[#6335F5] hover:text-white border border-purple-200/80'
                      : 'bg-white/10 hover:bg-[#6335F5] text-white'
                  }`}
                >
                  <span>{feature.actionText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
