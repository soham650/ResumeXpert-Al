import React from 'react';
import { ArrowLeft, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2, Info, Mail } from 'lucide-react';
import { APP_CONFIG, SUPPORT_EMAIL, isSupportEmailConfigured } from '../../config/appConfig';

export default function AiDisclaimer({ onBackToHome }) {
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
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827]">
            Artificial Intelligence & ATS Scoring Disclaimer
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Effective Date: {APP_CONFIG.legalEffectiveDate} • Last Updated: {APP_CONFIG.lastUpdatedDate}
          </p>
          <p className="text-sm text-[#374151] leading-relaxed">
            {APP_CONFIG.name} utilizes advanced machine learning and natural language processing (powered by Advanced Neural AI) alongside deterministic parsing heuristics. This document provides clear, honest disclosures regarding the capabilities, boundaries, and legal disclaimers of our AI features.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-10 shadow-sm space-y-8 text-sm text-[#374151] leading-relaxed">
          {/* Key Callout Box */}
          <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-start gap-3.5">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-amber-900 space-y-1">
              <p className="font-bold">Essential Notice for Job Seekers:</p>
              <p>
                AI is designed to enhance your genuine background — <strong>never to fabricate credentials</strong>. You are legally and professionally responsible for the accuracy of every word on your resume when submitting it to employers.
              </p>
            </div>
          </div>

          {/* Point 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">1</span>
              ATS Scores Are Heuristic Estimates, Not Official Results
            </h2>
            <p>
              Our ATS Readiness Engine analyzes resumes based on widely accepted industry formatting conventions (single-column layout, standard section headers, chronological continuity, keyword density, and action verb frequency).
            </p>
            <p>
              However:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#4B5563]">
              <li>Different Applicant Tracking Systems (e.g. Workday, Taleo, iCIMS, Greenhouse, Lever, BambooHR) employ proprietary, proprietary parsing rules and distinct ranking models.</li>
              <li>Employers frequently configure custom filters, knocking questions, or localized weighting criteria.</li>
              <li>A score of 90%+ on our platform reflects high adherence to ATS readability best practices, but <strong>does not guarantee that an employer's specific system will parse or accept your application</strong>.</li>
            </ul>
          </section>

          {/* Point 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">2</span>
              No Guarantee of Interviews, Screening Pass, or Employment
            </h2>
            <p>
              ResumeXpert AI makes <strong>zero promises, warranties, or guarantees</strong> regarding job interviews, recruiter callbacks, test screenings, or employment offers. Final hiring decisions are subject to human recruiters, economic factors, competitive applicant pools, and organizational requirements beyond the scope of any resume software.
            </p>
          </section>

          {/* Point 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">3</span>
              AI Content Verification & Truthfulness Mandate
            </h2>
            <p>
              Our AI content improver, bullet generator, and cover letter drafts are assistive drafting tools. While our system prompt strictly prohibits AI from inventing qualifications, LLM systems can occasionally hallucinate or output inaccurate phrasing.
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#4B5563]">
              <li><strong>You must manually verify all AI-generated content</strong> before sending it to recruiters.</li>
              <li><strong>Do not claim metrics you did not achieve:</strong> If the AI suggests an XYZ template (e.g., "Increased conversion by [X%]"), always insert your genuine, substantiated figures.</li>
              <li><strong>Never invent titles or skills:</strong> Claiming false skills or experience on a job application can lead to disqualification or legal termination.</li>
            </ul>
          </section>

          {/* Point 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">4</span>
              Mock Interview Feedback & Career Roadmaps
            </h2>
            <p>
              The Voice and Text Mock Interview Simulator generates turn-by-turn evaluation scores using structured behavioral criteria (STAR framework: Situation, Task, Action, Result).
            </p>
            <p>
              This evaluation is strictly intended for self-improvement and practice:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#4B5563]">
              <li>It does not represent an actual hiring manager's assessment.</li>
              <li>Actual interview questions and evaluation rubrics differ significantly across companies.</li>
              <li>Career roadmaps are algorithmic suggestions for skill acquisition and do not represent accredited academic degrees or professional certifications.</li>
            </ul>
          </section>

          {/* Point 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-100 text-[#6335F5] flex items-center justify-center text-xs font-black">5</span>
              Contact Our AI Safety Team
            </h2>
            <p>
              If you observe hallucinated outputs, inappropriate suggestions, or system errors from our AI features, please notify our development team:
            </p>
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#6335F5] shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#111827]">AI Feedback & Safety Email:</p>
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

