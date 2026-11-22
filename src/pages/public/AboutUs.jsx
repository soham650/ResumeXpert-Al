import React from 'react';
import { ArrowLeft, Award, ShieldCheck, Sparkles, Code2, Users, FileCheck, CheckCircle2 } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';

export default function AboutUs({ onBackToHome, onNavigate }) {
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

        <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-10 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6335F5] flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827]">
            About {APP_CONFIG.name}
          </h1>
          <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
            {APP_CONFIG.name} is an engineering-first career platform designed to help job seekers build standardized, ATS-compliant resumes, understand candidate screening systems, and prepare confidently for technical and behavioral interviews.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-10 shadow-sm space-y-8 text-sm text-[#374151] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827]">Our Mission & Philosophy</h2>
            <p>
              The modern hiring landscape is governed by automated Applicant Tracking Systems (ATS) that parse millions of resumes every week. Unfortunately, qualified candidates are frequently filtered out due to minor formatting anomalies — multi-column tables, floating graphics, missing section headers, or unparseable fonts.
            </p>
            <p>
              We built {APP_CONFIG.name} to solve this structural barrier:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#4B5563]">
              <li><strong>Zero Fluff:</strong> Clean, single-column linear hierarchies designed specifically to pass automated parsers with 100% text fidelity.</li>
              <li><strong>Transparent Heuristics:</strong> Explainable ATS scoring based on real formatting rules, not random algorithmic black boxes.</li>
              <li><strong>Ethical AI:</strong> Machine learning that strengthens a candidate’s authentic experience without inventing false claims, fabricated metrics, or ghost credentials.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#111827]">Core Engineering Standards</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-surface-50 border border-border-light space-y-1.5">
                <ShieldCheck className="w-5 h-5 text-[#6335F5]" />
                <h3 className="font-bold text-xs text-[#111827]">Privacy by Default</h3>
                <p className="text-xs text-[#6B7280]">
                  Drafts stay on your device in LocalStorage by default. Cloud backups require explicit account creation with encrypted Supabase PostgreSQL.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-50 border border-border-light space-y-1.5">
                <FileCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-xs text-[#111827]">Native Multi-Format Engines</h3>
                <p className="text-xs text-[#6B7280]">
                  Client-side vector PDF generation and genuine Microsoft Word OpenXML (.docx) exports, ensuring you own your files forever.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-50 border border-border-light space-y-1.5">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="font-bold text-xs text-[#111827]">Neural AI Intelligence</h3>
                <p className="text-xs text-[#6B7280]">
                  Powered by advanced multimodal neural models via secure, authenticated server-side Edge Functions with prompt injection safeguards.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-50 border border-border-light space-y-1.5">
                <Code2 className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-xs text-[#111827]">Transparent Data Deletion</h3>
                <p className="text-xs text-[#6B7280]">
                  One-click local storage purging and cascading server-side account deletion with zero ghost record retention.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

