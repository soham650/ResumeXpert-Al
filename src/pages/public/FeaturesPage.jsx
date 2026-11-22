import React from 'react';
import { ArrowLeft, FileText, UploadCloud, ShieldCheck, Download, Sparkles, Mic, LayoutGrid, CheckCircle2, ArrowRight } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';

export default function FeaturesPage({ onBackToHome, onOpenBuilder, onOpenAnalyzer, onOpenAiCareer, onOpenUploadModal }) {
  const featuresList = [
    {
      icon: FileText,
      title: '7-Step Validated Resume Builder',
      badge: 'Core Engine',
      description: 'Step-by-step form editor with real-time Zod schema validation, date consistency verification, and instant live preview updates.',
      actionLabel: 'Launch Builder',
      action: () => onOpenBuilder && onOpenBuilder(1),
    },
    {
      icon: UploadCloud,
      title: 'Multi-Format Resume Upload & Correctness Checker',
      badge: 'Free Tool',
      description: 'Upload existing resumes in PDF, Word (.docx), Image (JPG/PNG), or Text formats for instant parser extraction and ATS readiness audit.',
      actionLabel: 'Upload Resume File',
      action: onOpenUploadModal,
    },
    {
      icon: ShieldCheck,
      title: 'Explainable ATS Diagnostic Engine',
      badge: 'Transparent',
      description: 'Detailed category-wise scoring across contact completeness, summary length, chronological continuity, metric density, and skill organization.',
      actionLabel: 'View ATS Analyzer',
      action: onOpenAnalyzer,
    },
    {
      icon: LayoutGrid,
      title: '6 Standardized ATS Templates',
      badge: 'Parser Tested',
      description: 'Six distinct single-column layouts (Classic, Modern Clean, Professional Executive, Minimalist, Technical Specialist, and Academic) engineered to prevent parser parsing crashes.',
      actionLabel: 'Explore Templates',
      action: () => onOpenBuilder && onOpenBuilder(1),
    },
    {
      icon: Download,
      title: 'Vector PDF & Microsoft Word (.docx) Exporters',
      badge: 'Multi-Format',
      description: 'Generate production-ready vector PDFs for direct recruiter distribution and genuine Microsoft Word OpenXML (.docx) files for agency submissions.',
      actionLabel: 'Try Exporters',
      action: () => onOpenBuilder && onOpenBuilder(1),
    },
    {
      icon: Sparkles,
      title: 'AI Career Intelligence Studio',
      badge: 'Neural Engine',
      description: 'Job description matching, XYZ bullet polisher, 3-length executive summaries, 6-second recruiter screeners, and tailored resume cloning.',
      actionLabel: 'Open AI Studio',
      action: onOpenAiCareer,
    },
    {
      icon: Mic,
      title: 'Voice + Text Mock Interview Simulator',
      badge: 'Web Speech API',
      description: 'Interactive turn-by-turn simulation supporting voice microphone input and text answers, scored against the behavioral STAR evaluation framework.',
      actionLabel: 'Practice Interview',
      action: onOpenAiCareer,
    },
  ];

  return (
    <div className="min-h-screen bg-surface-50 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6335F5] hover:text-[#5225e0] bg-white px-3.5 py-1.5 rounded-full border border-purple-100 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-10 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6335F5] flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827]">
            Comprehensive Product Features
          </h1>
          <p className="text-sm text-[#4B5563] leading-relaxed">
            Every feature in {APP_CONFIG.name} is fully engineered, authentic, and operational. We do not advertise mock features or vaporware.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featuresList.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl border border-border-light p-6 shadow-sm hover:border-purple-200 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#6335F5] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-surface-100 text-[#4B5563] border border-border-light">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-[#111827]">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-50">
                  <button
                    onClick={feat.action}
                    className="text-xs font-bold text-[#6335F5] hover:text-[#5225e0] flex items-center gap-1.5 group"
                  >
                    <span>{feat.actionLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

