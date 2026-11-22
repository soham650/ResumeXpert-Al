import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, AlertTriangle, CheckCircle2, XCircle, Sparkles, 
  ArrowLeft, Search, Briefcase, FileText, Target, Award, Code2, 
  GraduationCap, User, Layers, ArrowRight, Check, X, ChevronDown, 
  ChevronUp, ExternalLink, RefreshCw, UploadCloud 
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { evaluateResumeATS } from '../utils/atsAnalyzer';
import { parseUploadedFile } from '../utils/fileResumeParser';

const STEP_NAV_MAP = {
  'Contact Information': 1,
  'Professional Summary': 2,
  'Work Experience': 3,
  'Education': 4,
  'Skills': 5,
  'Projects': 6,
  'Certifications': 7,
  'ATS Formatting': 1,
};

const CATEGORY_ICONS = {
  'Contact Information': User,
  'Professional Summary': FileText,
  'Work Experience': Briefcase,
  'Skills': Code2,
  'Education': GraduationCap,
  'Projects': Layers,
  'Certifications': Award,
  'ATS Formatting': ShieldCheck,
};

const AtsAnalyzer = ({ onBackToBuilder, onJumpToStep }) => {
  const { resumeData, loadResume } = useResume();

  // Active Tab: 'overview' | 'bullets' | 'jobmatch' | 'suggestions'
  const [activeTab, setActiveTab] = useState('overview');
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setUploading(true);
      try {
        const parsed = await parseUploadedFile(selected);
        if (parsed.parsedResume) {
          loadResume(parsed.parsedResume);
          setUploadedFileName(selected.name);
        }
      } catch (err) {
        console.error('Failed to parse uploaded resume in ATS Analyzer:', err);
      } finally {
        setUploading(false);
      }
    }
  };

  // Job Matcher State
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [dismissedSuggestions, setDismissedSuggestions] = useState(new Set());
  const [appliedSuggestions, setAppliedSuggestions] = useState(new Set());

  // Run ATS analysis memoized
  const analysis = useMemo(() => {
    return evaluateResumeATS(resumeData, targetJobTitle, jobDescription);
  }, [resumeData, targetJobTitle, jobDescription]);

  const {
    totalScore,
    ratingTier,
    badgeColor,
    summaryHeadline,
    categories,
    bulletAudit,
    jobMatch,
    suggestions,
    disclaimer,
  } = analysis;

  const handleDismissSuggestion = (id) => {
    setDismissedSuggestions((prev) => new Set([...prev, id]));
  };

  const handleApplySuggestion = (id) => {
    setAppliedSuggestions((prev) => new Set([...prev, id]));
  };

  const visibleSuggestions = suggestions.filter(
    (s) => !dismissedSuggestions.has(s.id)
  );

  return (
    <div className="min-h-screen bg-surface-50 pb-16">
      {/* Top Banner Navigation */}
      <div className="bg-white border-b border-border-light sticky top-0 z-30 shadow-subtle">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={onBackToBuilder}
            className="flex items-center gap-2 text-sm font-semibold text-heading hover:text-primary-600 transition-colors p-1.5 rounded-xl hover:bg-surface-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Builder</span>
          </button>

          <div className="flex items-center gap-3">
            <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#6335F5] text-white hover:bg-[#5225e0] transition-all shadow-xs">
              <UploadCloud className={`w-3.5 h-3.5 ${uploading ? 'animate-spin' : ''}`} />
              <span>{uploading ? 'Analyzing...' : uploadedFileName ? `Analyzed: ${uploadedFileName}` : 'Upload Any Resume (PDF/Word/JPG)'}</span>
              <span className="hidden md:inline-block text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-black uppercase">Free</span>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.webp,.txt,.json,.md"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-200">
              <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
              <span>ATS Readiness Engine</span>
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-6">
        {/* Main ATS Score Card */}
        <div className="bg-white rounded-3xl border border-border-subtle p-6 sm:p-8 shadow-card overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Score Ring / Dial */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-surface-50 rounded-2xl border border-border-light">
              <div className="relative w-32 h-32 flex items-center justify-center mb-3">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    className="stroke-surface-200"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke={badgeColor}
                    strokeWidth="8"
                    strokeDasharray={2 * Math.PI * 40}
                    strokeDashoffset={2 * Math.PI * 40 * (1 - totalScore / 100)}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-heading tracking-tight">
                    {totalScore}
                  </span>
                  <span className="text-[11px] font-bold text-body/80 uppercase tracking-wider">
                    out of 100
                  </span>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white mb-1 shadow-sm" style={{ backgroundColor: badgeColor }}>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>{ratingTier} Readiness</span>
              </div>
              <p className="text-xs text-body mt-1">
                Based on 8 ATS criteria weights
              </p>
            </div>

            {/* Score Headline & Quick Summary */}
            <div className="lg:col-span-8 space-y-4">
              <div>
                <span className="text-xs font-bold text-primary-600 uppercase tracking-wider">
                  Analysis Summary
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-heading mt-1">
                  Resume ATS Health & Keyword Report
                </h1>
                <p className="text-sm text-body mt-1.5 leading-relaxed">
                  {summaryHeadline}
                </p>
              </div>

              {/* Category Mini-Pills */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                {categories.map((cat) => {
                  const pct = Math.round((cat.score / cat.weight) * 100);
                  const isGood = pct >= 80;

                  return (
                    <div
                      key={cat.category}
                      className="p-2.5 rounded-xl border border-border-light bg-surface-50/70"
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-semibold text-heading truncate">
                          {cat.category}
                        </span>
                        <span
                          className={`font-bold ${
                            isGood ? 'text-emerald-600' : 'text-amber-600'
                          }`}
                        >
                          {cat.score}/{cat.weight}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isGood ? 'bg-emerald-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Disclaimer */}
              <div className="pt-2 text-[11px] text-body/80 italic border-t border-border-subtle">
                💡 <span className="font-semibold">Disclaimer:</span> {disclaimer}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-border-light overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-body hover:text-heading hover:bg-surface-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Category Breakdown</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bullets')}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'bullets'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-body hover:text-heading hover:bg-surface-100'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Bullet Quality ({bulletAudit.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('jobmatch')}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'jobmatch'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-body hover:text-heading hover:bg-surface-100'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Job Target Match {jobMatch.hasJobTarget && `(${jobMatch.matchPercentage}%)`}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('suggestions')}
            className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'suggestions'
                ? 'bg-primary-600 text-white shadow-sm'
                : 'text-body hover:text-heading hover:bg-surface-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Actionable Suggestions ({visibleSuggestions.length})</span>
          </button>
        </div>

        {/* TAB 1: CATEGORY BREAKDOWN OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {categories.map((cat) => {
                const IconComponent = CATEGORY_ICONS[cat.category] || FileText;
                const pct = Math.round((cat.score / cat.weight) * 100);
                const stepTarget = STEP_NAV_MAP[cat.category] || 1;

                return (
                  <div
                    key={cat.category}
                    className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shrink-0">
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-heading">
                              {cat.category}
                            </h3>
                            <span className="text-xs text-body">
                              Weight: {cat.weight} points
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-extrabold text-heading">
                            {cat.score}
                          </span>
                          <span className="text-xs text-body font-bold">
                            /{cat.weight}
                          </span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="w-full h-2 bg-surface-200 rounded-full overflow-hidden mb-4">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            pct >= 80
                              ? 'bg-emerald-500'
                              : pct >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>

                      {/* Strengths */}
                      {cat.strengths.length > 0 && (
                        <div className="space-y-1.5 mb-3">
                          {cat.strengths.map((str, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-emerald-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                              <span>{str}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Deductions / Opportunities */}
                      {cat.deductions.length > 0 && (
                        <div className="space-y-1.5 pt-2 border-t border-border-subtle">
                          {cat.deductions.map((ded, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-amber-800">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
                              <span>
                                <strong className="font-semibold text-amber-900">
                                  -{ded.points} pts:
                                </strong>{' '}
                                {ded.reason}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Edit Section Jump Button */}
                    <button
                      type="button"
                      onClick={() => onJumpToStep && onJumpToStep(stepTarget)}
                      className="mt-4 pt-3 border-t border-border-light flex items-center justify-between text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      <span>Improve {cat.category}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: BULLET QUALITY AUDIT */}
        {activeTab === 'bullets' && (
          <div className="bg-white rounded-2xl border border-border-subtle p-6 sm:p-8 shadow-card space-y-5">
            <div>
              <h2 className="text-lg font-bold text-heading">
                Achievement Bullet Point Audit
              </h2>
              <p className="text-xs text-body mt-0.5">
                Evaluates opening verbs, measurable results (%, numbers), and conciseness for every bullet point.
              </p>
            </div>

            {bulletAudit.length === 0 ? (
              <div className="py-10 text-center text-body">
                <Briefcase className="w-10 h-10 text-body/40 mx-auto mb-2" />
                <p className="text-sm font-semibold text-heading">No bullet points detected</p>
                <p className="text-xs mt-1">Add achievements in Work Experience or Projects to inspect bullet quality.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bulletAudit.map((b) => (
                  <div
                    key={b.id}
                    className={`p-4 rounded-xl border transition-all ${
                      b.quality === 'strong'
                        ? 'bg-emerald-50/40 border-emerald-200'
                        : b.quality === 'acceptable'
                        ? 'bg-surface-50 border-border-light'
                        : 'bg-amber-50/50 border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold text-body uppercase tracking-wider">
                        {b.source}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {b.hasActionVerb && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800">
                            ✓ Action Verb
                          </span>
                        )}
                        {b.hasMetric && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary-100 text-primary-800">
                            ✓ Metric
                          </span>
                        )}
                        {b.quality === 'needs-improvement' && (
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800">
                            Needs Polish
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-heading leading-relaxed mb-2 font-medium">
                      "{b.text}"
                    </p>

                    {b.issues.length > 0 && (
                      <div className="space-y-1 pt-2 border-t border-border-subtle">
                        {b.issues.map((issue, idx) => (
                          <div key={idx} className="text-xs text-amber-900 flex items-start gap-1.5">
                            <span className="font-bold">• {issue.message}</span>
                            <span className="text-body font-normal">{issue.suggestion}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: JOB DESCRIPTION TARGET MATCH */}
        {activeTab === 'jobmatch' && (
          <div className="bg-white rounded-2xl border border-border-subtle p-6 sm:p-8 shadow-card space-y-6">
            <div>
              <h2 className="text-lg font-bold text-heading">
                Target Job Description Keyword Matching
              </h2>
              <p className="text-xs text-body mt-0.5">
                Paste a target job posting below to identify matched and missing keywords. 100% private and analyzed locally in your browser.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-heading uppercase mb-1.5">
                  Target Job Title (Optional)
                </label>
                <input
                  type="text"
                  value={targetJobTitle}
                  onChange={(e) => setTargetJobTitle(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer, Cloud Architect"
                  className="w-full rounded-xl border border-border-light bg-surface-50 px-4 py-2.5 text-sm text-heading placeholder:text-body/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
                />
              </div>
              <div className="flex items-end">
                <span className="text-xs text-body italic">
                  Tip: Copy the "Requirements" or "Responsibilities" section directly from LinkedIn, Indeed, or company job portals.
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-heading uppercase mb-1.5">
                Job Description Requirements Text
              </label>
              <textarea
                rows={5}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description or required skills here..."
                className="w-full rounded-xl border border-border-light bg-surface-50 p-4 text-sm text-heading placeholder:text-body/50 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-600"
              />
            </div>

            {/* Keyword Match Results */}
            {jobMatch.hasJobTarget && (
              <div className="pt-4 border-t border-border-light space-y-5 animate-fade-in">
                {/* Match percentage gauge */}
                <div className="p-5 rounded-2xl bg-surface-50 border border-border-light flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold text-body uppercase">
                      Job Description Keyword Coverage
                    </span>
                    <h3 className="text-2xl font-extrabold text-heading mt-0.5">
                      {jobMatch.matchPercentage}% Alignment
                    </h3>
                    <p className="text-xs text-body mt-1">
                      Matched {jobMatch.matchedKeywords.length} of {jobMatch.totalKeywordsDetected} technical keywords detected in posting.
                    </p>
                  </div>

                  <div className="w-full sm:w-48 h-3 bg-surface-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        jobMatch.matchPercentage >= 75
                          ? 'bg-emerald-500'
                          : jobMatch.matchPercentage >= 50
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${jobMatch.matchPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Matched Keywords */}
                <div>
                  <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Matched Keywords in Resume ({jobMatch.matchedKeywords.length})</span>
                  </h4>
                  {jobMatch.matchedKeywords.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {jobMatch.matchedKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                        >
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-body italic">No direct keyword matches found yet.</p>
                  )}
                </div>

                {/* Missing Keywords */}
                {jobMatch.missingKeywords.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span>Keywords Mentioned in Job Posting But Missing in Resume ({jobMatch.missingKeywords.length})</span>
                    </h4>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {jobMatch.missingKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-3 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-900 border border-amber-200"
                        >
                          + {kw}
                        </span>
                      ))}
                    </div>
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 leading-relaxed">
                      ⚠️ <strong className="font-semibold">Ethical ATS Rule:</strong> Never engage in "keyword stuffing" or list tools you haven't used. If you possess experience with these missing technologies, add them to your Skills and reference them in a relevant project or work bullet point.
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: ACTIONABLE IMPROVEMENTS & CONTENT SUGGESTIONS */}
        {activeTab === 'suggestions' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-heading">
                Actionable Resume Improvements
              </h2>
              <p className="text-xs text-body mt-0.5">
                Specific, explainable guidance to improve recruiter engagement and ATS ranking.
              </p>
            </div>

            {visibleSuggestions.length === 0 ? (
              <div className="bg-white rounded-2xl border border-border-subtle p-10 text-center shadow-card">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <h3 className="text-base font-bold text-heading">
                  All Suggestions Addressed!
                </h3>
                <p className="text-xs text-body mt-1 max-w-md mx-auto">
                  Your resume has addressed all primary recommendations for summary, metrics, and skills.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {visibleSuggestions.map((sugg) => {
                  const isApplied = appliedSuggestions.has(sugg.id);

                  return (
                    <div
                      key={sugg.id}
                      className="bg-white rounded-2xl border border-border-subtle p-5 sm:p-6 shadow-card space-y-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-primary-50 text-primary-700 border border-primary-200">
                          {sugg.category}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDismissSuggestion(sugg.id)}
                          className="text-xs text-body hover:text-rose-600 transition-colors"
                          title="Dismiss this suggestion"
                        >
                          Dismiss
                        </button>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-heading">
                          {sugg.issue}
                        </h4>
                        <p className="text-xs text-body mt-1">
                          <strong className="text-heading">Why it matters:</strong> {sugg.whyItMatters}
                        </p>
                      </div>

                      <div className="p-3.5 bg-surface-50 rounded-xl border border-border-light text-xs text-heading leading-relaxed">
                        <p className="font-semibold text-primary-700 mb-1">Recommended Improvement:</p>
                        <p className="text-body mb-2">{sugg.recommendation}</p>
                        {sugg.example && (
                          <div className="p-2.5 bg-white rounded-lg border border-border-subtle text-[12px] text-heading font-mono">
                            <span className="font-bold text-primary-600">Example: </span>
                            {sugg.example}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            const step = STEP_NAV_MAP[sugg.category] || 1;
                            if (onJumpToStep) onJumpToStep(step);
                          }}
                          className="btn-primary py-1.5 px-4 text-xs font-bold inline-flex items-center gap-1.5"
                        >
                          <span>Go to Step & Edit</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          type="button"
                          onClick={() => handleApplySuggestion(sugg.id)}
                          disabled={isApplied}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            isApplied
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'text-body hover:text-heading hover:bg-surface-100 border border-border-light'
                          }`}
                        >
                          {isApplied ? '✓ Mark Done' : 'Mark as Done'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AtsAnalyzer;

