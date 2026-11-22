import React from 'react';
import { ArrowLeft, Cookie, ShieldCheck, CheckCircle2, Lock, Mail } from 'lucide-react';
import { APP_CONFIG, SUPPORT_EMAIL, isSupportEmailConfigured } from '../../config/appConfig';

export default function CookiePolicy({ onBackToHome }) {
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
            <Cookie className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827]">
            Cookie & Storage Policy
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Effective Date: {APP_CONFIG.legalEffectiveDate} • Last Updated: {APP_CONFIG.lastUpdatedDate}
          </p>
          <p className="text-sm text-[#374151] leading-relaxed">
            This Cookie Policy explains how {APP_CONFIG.name} uses cookies, local browser storage, and related technologies to provide a fast, secure, and personalized resume creation experience.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-10 shadow-sm space-y-8 text-sm text-[#374151] leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827]">1. What Are Cookies and Local Storage?</h2>
            <p>
              Cookies are small text files placed on your device to maintain session states. Browser Local Storage is a modern web standard allowing web applications to store structured data directly on your local device without sending it to a remote server on every request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827]">2. How We Use Storage Technologies</h2>
            <p>
              We prioritize user privacy and strictly avoid invasive behavioral tracking or third-party advertising cookies. We categorize our storage usage as follows:
            </p>

            <div className="space-y-4 pt-1">
              <div className="p-4 rounded-2xl bg-surface-50 border border-border-light space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Essential Authentication Tokens (Strictly Necessary)</span>
                </div>
                <p className="text-xs text-[#6B7280]">
                  Managed by Supabase Authentication to keep you signed in securely across page reloads. These cookies are strictly required for account access and cannot be turned off.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-50 border border-border-light space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
                  <ShieldCheck className="w-4 h-4 text-[#6335F5]" />
                  <span>Local Resume Draft Storage (Functional)</span>
                </div>
                <p className="text-xs text-[#6B7280]">
                  Stored in your browser's LocalStorage under <code>resumecraft-resume-storage</code> and <code>resumexpert_active_career_journey</code>. This preserves your unfinished resume draft, selected template, and ATS audit results even if your internet connection drops.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-surface-50 border border-border-light space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#111827]">
                  <CheckCircle2 className="w-4 h-4 text-purple-600" />
                  <span>Privacy & Rate Limit Preferences (Functional)</span>
                </div>
                <p className="text-xs text-[#6B7280]">
                  Stores your explicit AI consent selection (<code>resumexpert_ai_consent</code>), privacy anonymization toggle, and client-side quota counters to prevent unintended API requests.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827]">3. Advertising & Third-Party Tracking Disclosure</h2>
            <p>
              <strong>We do not install advertising trackers or third-party cross-site data broker pixels.</strong> No user data is harvested or auctioned to ad exchanges. If performance analytics are introduced in the future, they will be strictly privacy-preserving and documented here with explicit consent controls.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827]">4. Managing and Clearing Your Storage</h2>
            <p>
              You maintain total control over your local browser data. You can clear all cached resumes, preferences, and session tokens at any time by:
            </p>
            <ul className="list-disc list-inside space-y-1 pl-2 text-[#4B5563]">
              <li>Using the "Clear Saved Resume" option in the Resume Builder.</li>
              <li>Visiting our <span className="font-bold text-[#6335F5]">Data Deletion Policy</span> page to purge all device records in one click.</li>
              <li>Clearing site data via your browser settings (Chrome: Settings &rarr; Privacy &rarr; Clear browsing data).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#111827]">5. Inquiries Regarding Cookies</h2>
            <p>
              For questions regarding our use of storage standards or session management, please reach out:
            </p>
            <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center gap-3">
              <Mail className="w-5 h-5 text-[#6335F5] shrink-0" />
              <div>
                <p className="text-xs font-bold text-[#111827]">Support Email:</p>
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

