import React from 'react';
import { ArrowLeft, Check, Sparkles, ShieldCheck, Download, Zap, HelpCircle } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';

export default function PricingPage({ onBackToHome, onOpenBuilder, onOpenAiCareer }) {
  return (
    <div className="min-h-screen bg-surface-50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6335F5] hover:text-[#5225e0] bg-white px-3.5 py-1.5 rounded-full border border-purple-100 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-10 shadow-sm space-y-3 text-center">
          <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
            Transparent & Honest Pricing
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827]">
            Simple, Accessible Career Tools
          </h1>
          <p className="text-sm text-[#4B5563] max-w-xl mx-auto">
            No hidden subscriptions, no deceptive countdown timers, and no paywalls on basic document downloads.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Card 1: Free Core Tier */}
          <div className="bg-white rounded-3xl border border-purple-200 p-6 sm:p-8 shadow-sm flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[#6335F5] tracking-wider">
                  Community Edition
                </span>
                <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                  Forever Free
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#111827]">$0</span>
                  <span className="text-xs text-[#6B7280]">/ month</span>
                </div>
                <p className="text-xs text-[#6B7280] mt-1">
                  100% free resume creation, ATS scoring, and multi-format document exporting.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-gray-100 text-xs text-[#374151]">
                {[
                  'Full 7-Step Resume Builder with Real-time Validation',
                  'All 6 Modern & Classic ATS-Tested Templates',
                  'Unlimited Vector PDF & Microsoft Word (.docx) Downloads',
                  'Free Multi-Format Resume Upload (PDF, DOCX, Images, TXT)',
                  'Transparent ATS Readiness Score & Correctness Audit',
                  'Private Browser LocalStorage (No account required)',
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onOpenBuilder && onOpenBuilder(1)}
              className="btn-primary py-3 px-5 text-xs font-bold w-full justify-center shadow-md"
            >
              Start Building Now — $0 Free
            </button>
          </div>

          {/* Card 2: AI Career Intelligence Tier */}
          <div className="bg-gradient-to-b from-purple-50/70 to-white rounded-3xl border-2 border-[#6335F5] p-6 sm:p-8 shadow-md flex flex-col justify-between space-y-6 relative">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-[#6335F5] tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Career Studio</span>
                </span>
                <span className="text-[10px] font-black uppercase bg-[#6335F5] text-white px-2 py-0.5 rounded-full">
                  Included
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-[#111827]">Free Tier</span>
                  <span className="text-xs text-[#6B7280]">/ Daily Credits</span>
                </div>
                <p className="text-xs text-[#6B7280] mt-1">
                  Powered by Advanced Neural AI for resume tailoring and voice interview simulation.
                </p>
              </div>

              <div className="space-y-2.5 pt-2 border-t border-purple-100 text-xs text-[#374151]">
                {[
                  '1-Click Job Description Matching & Gap Audit',
                  'Tailored Resume Cloning (Source resume stays immutable)',
                  'XYZ Formula Achievement Bullet Polishing',
                  'Cover Letter & Recruiter Outreach Drafter',
                  'Voice & Text Mock Interview Simulator (STAR Method)',
                  'Encrypted Cloud Synchronization via Supabase Auth',
                ].map((feat, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Check className="w-4 h-4 text-[#6335F5] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={onOpenAiCareer}
              className="btn-primary py-3 px-5 text-xs font-bold w-full justify-center shadow-md"
            >
              Explore AI Career Studio
            </button>
          </div>
        </div>

        {/* Honesty Callout */}
        <div className="p-4 bg-white rounded-2xl border border-gray-100 text-xs text-gray-500 text-center">
          <p>
            * We believe core job-seeking tools should be free and accessible to everyone. We never charge for basic resume downloads or hold user drafts hostage behind payment gates.
          </p>
        </div>
      </div>
    </div>
  );
}

