import React, { useState } from 'react';
import { ArrowLeft, Mail, MessageSquare, Bug, HelpCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { APP_CONFIG, SUPPORT_EMAIL, isSupportEmailConfigured } from '../../config/appConfig';

export default function ContactUs({ onBackToHome, onNavigate }) {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('support');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (isSupportEmailConfigured) {
      const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(`[${category.toUpperCase()}] ${subject}`)}&body=${encodeURIComponent(message)}`;
      window.location.href = mailtoUrl;
    }
    setSubmitted(true);
  };

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
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827]">
            Contact Us & Support
          </h1>
          <p className="text-sm text-[#4B5563] leading-relaxed">
            Need help with resume exports, ATS analysis, or account questions? Reach out to our technical support and development team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Left Column: Official Channels */}
          <div className="md:col-span-5 space-y-4">
            <div className="bg-white rounded-3xl border border-border-light p-6 shadow-sm space-y-5">
              <h2 className="text-sm font-black text-[#111827] uppercase tracking-wider">
                Official Support Channel
              </h2>

              <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 space-y-2">
                <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block">
                  Support Email
                </span>
                {isSupportEmailConfigured ? (
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="text-sm font-black text-[#6335F5] hover:underline break-all block"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                ) : (
                  <span className="text-xs font-mono font-bold text-gray-500 block break-all">
                    {SUPPORT_EMAIL}
                  </span>
                )}
                <p className="text-[11px] text-[#6B7280]">
                  {isSupportEmailConfigured
                    ? 'Average response time: 24 to 48 business hours.'
                    : 'Configure VITE_SUPPORT_EMAIL in environment variables to activate live mailto routing.'}
                </p>
              </div>

              <div className="space-y-3 text-xs text-[#4B5563] pt-2 border-t border-gray-100">
                <div className="flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#6335F5] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#111827]">Help Center & FAQs:</strong>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">
                      Check our comprehensive guide for instant answers on ATS formatting, PDF downloads, and AI features.
                    </p>
                    <button
                      onClick={() => onNavigate && onNavigate('help-center')}
                      className="text-[11px] font-bold text-[#6335F5] hover:underline mt-1"
                    >
                      Visit Help Center &rarr;
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-2">
                  <Bug className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-[#111827]">Bug Reporting:</strong>
                    <p className="text-[11px] text-[#6B7280] mt-0.5">
                      Please include your browser version, device, and steps to reproduce when reporting interface bugs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Message / Mailto Launcher */}
          <div className="md:col-span-7">
            <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-8 shadow-sm space-y-5">
              <h2 className="text-base font-bold text-[#111827]">
                Send a Message or Problem Report
              </h2>

              {submitted ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 animate-fade-in">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h3 className="text-sm font-bold text-emerald-900">
                    Message Prepared
                  </h3>
                  <p className="text-xs text-emerald-700">
                    {isSupportEmailConfigured
                      ? `Your default email client was opened to transmit your inquiry to ${SUPPORT_EMAIL}.`
                      : `Your message was drafted. Set VITE_SUPPORT_EMAIL to enable direct transmission.`}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                      setSubject('');
                    }}
                    className="btn-secondary py-1.5 px-3 text-xs font-bold"
                  >
                    Draft Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-border-subtle text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                    >
                      <option value="support">General Support & Question</option>
                      <option value="bug">Bug or Technical Problem</option>
                      <option value="ats">ATS Score & Correctness Inquiry</option>
                      <option value="privacy">Privacy & Data Deletion</option>
                      <option value="feedback">Product Feedback & Feature Request</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. Question regarding PDF font rendering in ATS scanners"
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-border-subtle text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#374151] mb-1">
                      Details / Message
                    </label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Please provide details about your issue or question..."
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary py-2.5 px-5 text-xs font-bold flex items-center justify-center gap-2 w-full shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Launch Support Email</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

