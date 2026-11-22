import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Search, ChevronDown, ChevronUp, FileText, ShieldCheck, Sparkles, Download, Mail, Laptop } from 'lucide-react';
import { APP_CONFIG, SUPPORT_EMAIL, isSupportEmailConfigured } from '../../config/appConfig';

const FAQS = [
  {
    category: 'ats',
    question: 'How does the ATS Resume Checker calculate my score?',
    answer: 'Our ATS score evaluates your resume against essential Applicant Tracking System parsing rules: contact detail completeness, standard section naming, single-column chronological structure, action verb ratio, quantifiable metrics density (e.g. %, $), and keyword frequency. It is a heuristic diagnostic engine designed to maximize parser pass-through.',
  },
  {
    category: 'ats',
    question: 'Does a 90%+ ATS score guarantee a job interview?',
    answer: 'No software can guarantee job selection or interview callbacks. Hiring decisions involve competitive candidate volume, human recruiter preferences, and proprietary company requirements. Our score indicates high technical readability, not a hiring guarantee.',
  },
  {
    category: 'export',
    question: 'Should I download PDF or Word (.docx) for job applications?',
    answer: 'Both formats are generated natively. Vector PDF is ideal for human reading and modern ATS platforms like Greenhouse and Lever because it preserves exact font typography and styling. Word (.docx) is best for staffing agencies, headhunters, or legacy systems that specifically request an editable document.',
  },
  {
    category: 'upload',
    question: 'Which file formats can I upload for free resume checking?',
    answer: 'We support PDF (.pdf), Microsoft Word (.docx), Plain Text (.txt, .md), JSON (.json), and resume screenshots/scans (.jpg, .png). All files are processed client-side with native decompression streams for 100% private extraction.',
  },
  {
    category: 'ai',
    question: 'How does AI interact with my resume?',
    answer: 'When you trigger features such as the XYZ Bullet Polisher, Executive Summary Generator, or Mock Interview Simulator, selected text is sent to neural language models via secure encrypted channels. If you enable Privacy Mode, all contact details (email, phone, address) are automatically redacted before transmission.',
  },
  {
    category: 'privacy',
    question: 'Will my resume data be saved on your servers if I do not create an account?',
    answer: 'No. For unauthenticated users, all drafts, templates, and career journeys are saved exclusively in your browser LocalStorage. Only when you explicitly register and sign in are resumes backed up to Supabase Cloud PostgreSQL.',
  },
  {
    category: 'privacy',
    question: 'How can I permanently delete my account and data?',
    answer: 'You can visit our Data Deletion Policy page to execute self-service deletion. You can purge all local device data in one click, and signed-in users can permanently delete their cloud account and all associated documents.',
  },
];

export default function HelpCenter({ onBackToHome, onNavigate }) {
  const [search, setSearch] = useState('');
  const [openIdx, setOpenIdx] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredFaqs = FAQS.filter((faq) => {
    const matchesFilter = activeFilter === 'all' || faq.category === activeFilter;
    const matchesSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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

        {/* Hero Header */}
        <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-10 shadow-sm space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#EDE9FE] text-[#6335F5] flex items-center justify-center mx-auto">
            <HelpCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#111827]">
            Help Center & Knowledgebase
          </h1>
          <p className="text-sm text-[#4B5563] max-w-xl mx-auto">
            Everything you need to know about building ATS-compliant resumes, uploading files, exporting documents, and utilizing AI career features.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search topics (e.g. ATS score, PDF download, privacy)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-purple-100 text-xs text-[#111827] focus:outline-none focus:ring-2 focus:ring-purple-400 shadow-xs bg-surface-50"
              />
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {[
            { id: 'all', label: 'All Questions' },
            { id: 'ats', label: 'ATS & Scoring' },
            { id: 'export', label: 'PDF & Word Export' },
            { id: 'upload', label: 'File Upload & Parsing' },
            { id: 'ai', label: 'AI Features & Studio' },
            { id: 'privacy', label: 'Privacy & Storage' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveFilter(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                activeFilter === cat.id
                  ? 'bg-[#6335F5] text-white shadow-xs'
                  : 'bg-white text-[#4B5563] hover:bg-purple-50 hover:text-[#6335F5] border border-border-light'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl border border-border-light p-6 sm:p-8 shadow-sm space-y-3">
          <h2 className="text-base font-black text-[#111827] mb-4">
            Frequently Asked Questions ({filteredFaqs.length})
          </h2>

          <div className="divide-y divide-gray-100">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIdx === idx;
              return (
                <div key={idx} className="py-3.5">
                  <button
                    onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                    className="w-full flex items-center justify-between text-left gap-4 font-bold text-xs sm:text-sm text-[#111827] hover:text-[#6335F5] transition-colors"
                  >
                    <span>{faq.question}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-[#6335F5] shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="pt-2 text-xs sm:text-sm text-[#4B5563] leading-relaxed animate-fade-in pr-6">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Banner */}
        <div className="bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white rounded-3xl border border-purple-100 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#111827]">
              Still have questions or need technical support?
            </h3>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Email us directly at{' '}
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="font-bold text-[#6335F5] hover:underline"
              >
                {SUPPORT_EMAIL}
              </a>
              {' '}or open our contact desk.
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-purple-50 text-[#6335F5] font-bold text-xs border border-purple-200 shadow-xs transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{SUPPORT_EMAIL}</span>
            </a>
            <button
              onClick={() => onNavigate && onNavigate('contact-us')}
              className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md"
            >
              <span>Contact Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

