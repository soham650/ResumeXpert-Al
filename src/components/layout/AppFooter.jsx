import React from 'react';
import { Mail, ShieldCheck, Sparkles, FileText, ExternalLink, HelpCircle, Scale, Trash2, ArrowUpRight } from 'lucide-react';
import BrandLogo from '../ui/BrandLogo';
import { APP_CONFIG, SUPPORT_EMAIL, isSupportEmailConfigured } from '../../config/appConfig';

export default function AppFooter({ onNavigate, onOpenBuilder, onOpenAnalyzer, onOpenAiCareer }) {
  return (
    <footer className="bg-white border-t border-purple-100/80 pt-12 sm:pt-16 pb-8 text-[#4B5563] text-xs transition-colors">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 items-start">
          {/* Column 1: Brand & Identity (Spans 2 cols on desktop) */}
          <div className="lg:col-span-2 space-y-4">
            <BrandLogo size="md" showTagline />
            <p className="text-xs text-[#6B7280] leading-relaxed max-w-sm pt-1">
              Engineering-first career intelligence platform. Build single-column ATS-compliant resumes, test parser readability, and simulate technical interviews with Advanced Neural AI.
            </p>

            <div className="pt-2 space-y-1.5">
              <span className="text-[11px] font-black uppercase text-[#111827] tracking-wider block">
                Official Support
              </span>
              {isSupportEmailConfigured ? (
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#6335F5] hover:underline"
                >
                  <Mail className="w-3.5 h-3.5 text-[#6335F5]" />
                  <span>{SUPPORT_EMAIL}</span>
                </a>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 font-mono">
                  <Mail className="w-3.5 h-3.5 text-gray-400" />
                  <span>{SUPPORT_EMAIL}</span>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Product Features (Only real, working features) */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#111827]">
              Product
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenBuilder && onOpenBuilder(1)}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  Resume Builder
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAnalyzer}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  ATS Resume Checker
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAiCareer}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  AI Resume Analyzer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAiCareer}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  AI Cover Letter Generator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAiCareer}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  AI Mock Interview
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAiCareer}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  Career Roadmap
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Help & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#111827]">
              Help & Support
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('help-center')}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('contact-us')}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  Contact Support
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('help-center')}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('contact-us')}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  Report a Problem
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('about')}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  About ResumeXpert AI
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('pricing')}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  Transparent Pricing
                </button>
              </li>
              <li className="pt-2 border-t border-purple-50">
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="inline-flex items-center gap-1.5 font-bold text-[#6335F5] hover:underline"
                >
                  <Mail className="w-3 h-3 text-[#6335F5]" />
                  <span>{SUPPORT_EMAIL}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#111827]">
              Legal & Policy
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('privacy-policy')}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('terms')}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('cookie-policy')}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  Cookie Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('ai-disclaimer')}
                  className="hover:text-[#6335F5] transition-colors text-left"
                >
                  AI Disclaimer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate && onNavigate('data-deletion')}
                  className="hover:text-[#6335F5] transition-colors text-left font-bold text-rose-600"
                >
                  Data Deletion Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer Sub-Bar */}
        <div className="border-t border-purple-50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#6B7280]">
          <p>
            © {new Date().getFullYear()} {APP_CONFIG.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-center sm:text-right">
            <span>Standard ATS-Compliant Layouts</span>
            <span>•</span>
            <span>Zero Tracking Advertisements</span>
            <span>•</span>
            <span>Client-Side Data Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

