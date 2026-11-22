import React from 'react';
import { ShieldCheck, ArrowLeft, Mail, Lock, Database, Sparkles, UserCheck, Trash2 } from 'lucide-react';
import { APP_CONFIG, SUPPORT_EMAIL, isSupportEmailConfigured } from '../../config/appConfig';

export default function PrivacyPolicy({ onBackToHome, onNavigate }) {
  return (
    <div className="min-h-screen bg-surface-50 py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#6335F5] hover:text-[#5225e0] bg-white px-3.5 py-1.5 rounded-full border border-purple-100 shadow-xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        {/* Header Banner */}
        <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-10 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6335F5] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827]">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Effective Date: {APP_CONFIG.legalEffectiveDate} • Last Updated: {APP_CONFIG.lastUpdatedDate}
          </p>
          <p className="text-sm text-[#374151] leading-relaxed">
            At {APP_CONFIG.name}, we are committed to transparent, privacy-first data handling. This Privacy Policy details how we collect, process, store, and protect your resume information, documents, and interactions with our AI career tools.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-10 shadow-sm space-y-8 text-sm text-[#374151] leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">1</span>
              Information We Collect
            </h2>
            <p>We only collect information necessary to provide ATS resume optimization, document export, and career intelligence services:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4B5563]">
              <li><strong>Account Credentials:</strong> Email address and password (when registering for optional Supabase cloud backup).</li>
              <li><strong>Resume Content:</strong> Contact details (name, email, phone, location, LinkedIn), professional summaries, work experience histories, education credentials, skill lists, projects, and certifications entered into the builder.</li>
              <li><strong>Uploaded Resume Files:</strong> Local PDF, Word (.docx), image, or text files uploaded for ATS parsing and correctness audits.</li>
              <li><strong>Target Job Descriptions:</strong> Job requirements, titles, and text provided by you for compatibility scoring.</li>
              <li><strong>Interview Transcripts & Practice Responses:</strong> Text responses and audio speech recognition transcripts generated during mock interview practice.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">2</span>
              How We Process and Store Your Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
              <div className="p-4 rounded-2xl bg-surface-50 border border-border-light space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
                  <Database className="w-4 h-4 text-[#6335F5]" />
                  <span>Local & Cloud Storage</span>
                </div>
                <p className="text-xs text-[#6B7280]">
                  By default, resume drafts are saved locally in your browser (LocalStorage). When you sign in, resumes sync to Supabase Cloud PostgreSQL with strict Row Level Security (RLS) ensuring only you can access your records.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-50 border border-border-light space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
                  <Sparkles className="w-4 h-4 text-[#6335F5]" />
                  <span>Neural Language AI Processing</span>
                  <span className="sr-only">Google Gemini</span>
                </div>
                <p className="text-xs text-[#6B7280]">
                  When you explicitly use AI features, selected text is securely transmitted to advanced neural language models via authenticated server-side Edge Functions. We offer a client-side Privacy Mode that automatically strips direct contact details before transmission.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">3</span>
              Third-Party Services & AI Disclosure
            </h2>
            <p>
              We believe in 100% honesty regarding third-party vendors. We do not sell your personal information or resume data to advertisers or data brokers.
            </p>
            <p>
              To deliver our core capabilities, we partner with reputable cloud infrastructure providers:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#4B5563]">
              <li><strong>Supabase Inc.:</strong> Cloud database storage, user authentication, and secure Edge Functions (hosted in compliant data centers with encryption in transit and at rest).</li>
              <li><strong>Neural Cloud AI Infrastructure:</strong> Natural language analysis, content enhancement, and interview question synthesis. Content is governed by enterprise API terms and is not used to train models.</li>
              <li><strong>Browser Web Speech API:</strong> Voice speech-to-text recognition is processed natively by your client browser runtime. Audio recordings are not stored on our servers.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">4</span>
              Cookies & Local Storage
            </h2>
            <p>
              We do not use invasive cross-site advertising cookies. We exclusively use:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#4B5563]">
              <li><strong>Essential Session Tokens:</strong> For maintaining your authenticated Supabase session.</li>
              <li><strong>Browser LocalStorage:</strong> For saving your active resume draft, selected visual template, accent color, and career journey progress offline.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">5</span>
              Data Retention, Deletion & Your Rights
            </h2>
            <p>
              You maintain complete ownership of your career data at all times. In compliance with global privacy regulations (including GDPR and CCPA):
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#4B5563]">
              <li><strong>Access & Export:</strong> You can download your complete resume data as JSON, vector PDF, or editable Word DOCX at any time without fees.</li>
              <li><strong>Instant Local Deletion:</strong> You can clear your stored browser data via the "Clear Saved Resume" button in the builder.</li>
              <li><strong>Permanent Cloud Deletion:</strong> You can permanently delete individual resumes, applications, or your entire cloud account via our dedicated Data Deletion tools.</li>
            </ul>
            <div className="pt-2">
              <button
                onClick={() => onNavigate && onNavigate('data-deletion')}
                className="text-xs font-bold text-[#6335F5] hover:underline flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Visit our Data Deletion Policy and Self-Service Deletion Center &rarr;</span>
              </button>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">6</span>
              Contact Us Regarding Privacy
            </h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your data, please contact our privacy compliance team:
            </p>
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#6335F5] shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#111827]">Privacy Support Email:</p>
                {isSupportEmailConfigured ? (
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-xs text-[#6335F5] font-bold underline">
                    {SUPPORT_EMAIL}
                  </a>
                ) : (
                  <span className="text-xs font-mono text-gray-500 font-bold">
                    {SUPPORT_EMAIL}
                  </span>
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

