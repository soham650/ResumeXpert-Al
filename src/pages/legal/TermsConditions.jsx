import React from 'react';
import { FileText, ArrowLeft, ShieldCheck, Scale, CheckCircle2, AlertTriangle, Mail } from 'lucide-react';
import { APP_CONFIG, SUPPORT_EMAIL, isSupportEmailConfigured } from '../../config/appConfig';

export default function TermsConditions({ onBackToHome, onNavigate }) {
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

        <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-10 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6335F5] flex items-center justify-center">
            <Scale className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827]">
            Terms & Conditions
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Effective Date: {APP_CONFIG.legalEffectiveDate} • Last Updated: {APP_CONFIG.lastUpdatedDate}
          </p>
          <p className="text-sm text-[#374151] leading-relaxed">
            Please read these Terms & Conditions carefully before using the {APP_CONFIG.name} platform. By accessing or using our website, resume builder, ATS checkers, or AI services, you agree to be bound by these terms.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-10 shadow-sm space-y-8 text-sm text-[#374151] leading-relaxed">
          {/* 1. Account & Eligibility */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">1</span>
              Account Registration & Eligibility
            </h2>
            <p>
              You must be at least 16 years of age (or the minimum legal age in your jurisdiction) to use our services. When registering an account, you agree to provide truthful, accurate, and current information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities conducted through your account.
            </p>
          </section>

          {/* 2. User Resume Ownership */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">2</span>
              Resume Content Ownership
            </h2>
            <p>
              <strong>You retain 100% intellectual property ownership</strong> of all resume text, work experience, educational history, project portfolio details, and documents you create or upload to {APP_CONFIG.name}. We do not claim any ownership rights over your personal career documents.
            </p>
            <p>
              By using our service, you grant us only the limited, revocable license strictly necessary to store, format, render PDF/DOCX files, and transmit text to our AI processing providers upon your request.
            </p>
          </section>

          {/* 3. Acceptable Use Policy */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">3</span>
              Acceptable Use & User Responsibilities
            </h2>
            <p>You agree not to misuse {APP_CONFIG.name}. Specifically, you shall not:</p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4B5563]">
              <li>Submit fabricated employment records, fraudulent credentials, or impersonate other professionals.</li>
              <li>Attempt to reverse-engineer, decompile, scrape, or probe vulnerabilities in our APIs or Supabase infrastructure.</li>
              <li>Bypass or attempt to defeat authentication controls, rate limiters, or Row-Level Security policies.</li>
              <li>Upload malicious code, corrupted files, or automated bot scripts.</li>
              <li>Use the platform for spamming recruiters or transmitting unsolicited commercial communications.</li>
            </ul>
          </section>

          {/* 4. AI-Generated Suggestions & ATS Scorer Disclaimer */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">4</span>
              AI Assistance & No Employment Guarantees
            </h2>
            <p>
              {APP_CONFIG.name} provides automated tools to assist job seekers. However:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2 text-[#4B5563]">
              <li><strong>ATS Scores Are Heuristic Estimates:</strong> Different applicant tracking systems (Workday, Taleo, Greenhouse, Lever, etc.) utilize varying algorithms. No score on our platform guarantees candidate screening pass-through.</li>
              <li><strong>No Guarantee of Interviews or Employment:</strong> Hiring decisions are made solely by prospective employers. We make zero warranties or guarantees regarding job offers or interviews.</li>
              <li><strong>User Responsibility for Accuracy:</strong> AI suggestions (including bullet improvements, summary generation, and interview feedback) are generated probabilistically and may contain inaccuracies. You must review and approve all content before sharing with employers.</li>
            </ul>
          </section>

          {/* 5. Service Availability & Termination */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">5</span>
              Service Availability & Account Termination
            </h2>
            <p>
              We strive for continuous platform availability, but our services are provided on an "AS IS" and "AS AVAILABLE" basis. We reserve the right to suspend or terminate accounts that violate our acceptable use policy or attempt to compromise system integrity.
            </p>
            <p>
              You may terminate your account at any time using our self-service deletion tools.
            </p>
          </section>

          {/* 6. Limitation of Liability */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">6</span>
              Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, {APP_CONFIG.name} and its contributors shall not be liable for any indirect, incidental, consequential, special, or punitive damages, including loss of profits, employment opportunities, or data, arising from your use of or inability to use our platform.
            </p>
          </section>

          {/* 7. Contact Information */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">7</span>
              Questions & Contact Information
            </h2>
            <p>
              For legal inquiries or questions concerning these Terms & Conditions, please contact us at:
            </p>
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#6335F5] shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#111827]">Legal & Compliance Email:</p>
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

