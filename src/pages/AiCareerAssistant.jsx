import React, { useState, useEffect } from 'react';
import {
  Sparkles, ShieldCheck, Target, FileText, CheckCircle2, AlertTriangle,
  ArrowRight, RefreshCw, Copy, Check, Lock, Eye, EyeOff, Bot, Zap,
  Briefcase, GraduationCap, ChevronRight, BarChart3, HelpCircle, Layers,
  ExternalLink, ArrowLeft, Wand2, Star, ThumbsUp, MessageSquare
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import {
  executeAiCareerAction,
} from '../lib/aiCareerService';
import {
  getAiConsentStatus,
  setAiConsent,
  getPrivacyMode,
  setPrivacyMode,
} from '../utils/aiPrivacy';
import { getAiQuota } from '../utils/aiRateLimiter';
import CareerJourneyDashboard from '../components/career/CareerJourneyDashboard';
import CentralAiChatModal from '../components/career/CentralAiChatModal';

const TABS = [
  { id: 'job-match', label: 'Job Matcher', icon: Target },
  { id: 'ats-optimizer', label: 'ATS Optimizer', icon: ShieldCheck },
  { id: 'bullet-polish', label: 'Bullet Polish', icon: Wand2 },
  { id: 'summary-generator', label: 'Summary Studio', icon: FileText },
  { id: 'skill-gap', label: 'Skill Gap', icon: Layers },
  { id: 'hr-review', label: 'HR Recruiter Review', icon: Eye },
  { id: 'grammar-proofread', label: 'Grammar & Tone', icon: CheckCircle2 },
  { id: 'resume-tailor', label: 'Tailor Clone', icon: Sparkles },
  { id: 'interview-prep', label: 'Interview Prep', icon: HelpCircle },
  { id: 'diff-comparison', label: 'Diff Comparison', icon: BarChart3 },
];

export default function AiCareerAssistant({ onBackToDashboard, onNavigateBuilder }) {
  const { resumeData, updatePersonalInfo, createCloudResume } = useResume();

  const [ecosystemView, setEcosystemView] = useState('journey'); // 'journey' | 'tools'
  const [chatModalOpen, setChatModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('job-match');
  const [hasConsent, setHasConsent] = useState(false);
  const [privacyEnabled, setPrivacyEnabled] = useState(false);
  const [quota, setQuota] = useState({ used: 0, remaining: 25, limit: 25 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedKey, setCopiedKey] = useState(null);

  // Feature specific states
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState(resumeData?.personalInfo?.jobTitle || 'Frontend Developer');
  const [bulletInput, setBulletInput] = useState('');
  const [summaryTone, setSummaryTone] = useState('professional');
  const [diffOriginal, setDiffOriginal] = useState('');
  const [diffSuggested, setDiffSuggested] = useState('');

  // AI results cache
  const [results, setResults] = useState({});

  useEffect(() => {
    const status = getAiConsentStatus();
    setHasConsent(status.consented);
    setPrivacyEnabled(getPrivacyMode());
    setQuota(getAiQuota());

    // Pre-populate bullet from first experience if available
    const firstBullet = resumeData?.experience?.[0]?.description?.[0] || '';
    if (firstBullet) {
      setBulletInput(firstBullet);
      setDiffOriginal(firstBullet);
    }
  }, [resumeData]);

  const handleGrantConsent = () => {
    setAiConsent(true);
    setHasConsent(true);
    setError(null);
  };

  const handleTogglePrivacy = () => {
    const next = !privacyEnabled;
    setPrivacyMode(next);
    setPrivacyEnabled(next);
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const runAiAction = async (action, payload = {}) => {
    if (!hasConsent) {
      setError('Please accept the AI Privacy Terms to proceed.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const response = await executeAiCareerAction(action, {
        resumeData,
        ...payload,
      });

      setResults((prev) => ({ ...prev, [action]: response.data }));
      setQuota(getAiQuota());
    } catch (err) {
      setError(err.message || 'AI request failed');
    } finally {
      setLoading(false);
    }
  };

  // Helper for applying summary directly
  const applySummary = (text) => {
    if (updatePersonalInfo) {
      updatePersonalInfo('summary', text);
      alert('Professional summary updated in your resume!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8FF] via-white to-[#F5F3FF] py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/90 backdrop-blur-md p-6 rounded-3xl border border-purple-100 shadow-[0_4px_25px_rgba(99,53,245,0.06)]">
          <div className="flex items-center gap-4">
            <button
              onClick={onBackToDashboard}
              className="p-2.5 rounded-2xl bg-purple-50 text-[#6335F5] hover:bg-purple-100 transition-colors"
              title="Return to Resumes"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[#111827]">
                  AI Career Intelligence Studio
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-[#EDE9FE] text-[#6335F5] border border-purple-200">
                  Neural AI Powered
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#6B7280] mt-0.5">
                Target job matching, deep ATS audits, recruiter feedback, and interview coaching.
              </p>
            </div>
          </div>

          {/* Credits & Privacy Status */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-purple-50/80 border border-purple-100 text-xs font-bold text-[#6335F5]">
              <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>{quota.remaining} / {quota.limit} AI Credits Today</span>
            </div>

            <button
              onClick={handleTogglePrivacy}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all border ${
                privacyEnabled
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
              title="When enabled, personal details (name, email, phone) are scrubbed before reaching AI"
            >
              {privacyEnabled ? <EyeOff className="w-3.5 h-3.5 text-emerald-600" /> : <Eye className="w-3.5 h-3.5 text-gray-500" />}
              <span>{privacyEnabled ? 'PII Anonymized' : 'PII Scrubbing Off'}</span>
            </button>

            <button
              onClick={() => setChatModalOpen(true)}
              className="flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-gradient-to-r from-[#6335F5] to-[#7C3AED] text-white text-xs font-bold shadow-sm hover:scale-102 transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Ask AI Assistant</span>
            </button>
          </div>
        </div>

        {/* Master Ecosystem View Switcher */}
        <div className="flex items-center justify-between p-1.5 bg-white/90 backdrop-blur-md rounded-2xl border border-purple-100 shadow-xs max-w-md">
          <button
            onClick={() => setEcosystemView('journey')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              ecosystemView === 'journey'
                ? 'bg-[#6335F5] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#6335F5]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>6-Step Career Journey</span>
          </button>
          <button
            onClick={() => setEcosystemView('tools')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 ${
              ecosystemView === 'tools'
                ? 'bg-[#6335F5] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#6335F5]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Individual AI Tools</span>
          </button>
        </div>

        {/* User Consent Modal / Banner */}
        {!hasConsent && (
          <div className="bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>AI Data Privacy & Responsible Usage Agreement</span>
              </div>
              <h2 className="text-xl font-black">Enable AI Career Intelligence</h2>
              <p className="text-xs text-purple-100 leading-relaxed">
                ResumeXpert AI uses advanced neural language models to analyze your resume and optimize content for ATS compatibility. 
                Your data is processed securely over encrypted channels, never used for AI model training, and never sold to third parties. 
                You may also enable client-side PII scrubbing at any time.
              </p>
            </div>
            <button
              onClick={handleGrantConsent}
              className="px-6 py-3 rounded-2xl bg-white text-[#6335F5] font-black text-sm hover:bg-purple-50 shadow-md transition-all shrink-0 hover:scale-105"
            >
              I Consent & Agree
            </button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError(null)} className="font-bold text-red-800 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {/* View Selection: 6-Step Career Journey vs. Individual AI Tools */}
        {ecosystemView === 'journey' ? (
          <CareerJourneyDashboard
            onBackToDashboard={onBackToDashboard}
            onNavigateBuilder={onNavigateBuilder}
          />
        ) : (
          <>
            {/* Feature Navigation Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#6335F5] text-white shadow-md shadow-purple-500/20'
                    : 'bg-white/80 text-[#4B5563] hover:text-[#6335F5] hover:bg-white border border-purple-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-purple-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* MAIN WORKSPACE CARD */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-[0_4px_30px_rgba(99,53,245,0.04)] min-h-[500px]">
          
          {/* TAB 1: JOB MATCHER */}
          {activeTab === 'job-match' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-[#111827] flex items-center gap-2">
                  <Target className="w-5 h-5 text-[#6335F5]" />
                  Job Description Matcher & Keyword Gap Analysis
                </h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  Paste the job posting to assess role fit, matched terms, missing keywords, and algorithmic ATS alignment.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-[#374151]">Target Job Description</label>
                <textarea
                  rows={5}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job requirements and qualifications here..."
                  className="w-full p-4 rounded-2xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-[#6335F5]/30 text-xs sm:text-sm text-[#111827] resize-none"
                />
                <button
                  disabled={loading || !jobDescription.trim()}
                  onClick={() => runAiAction('job-match', { jobDescription })}
                  className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{loading ? 'Analyzing Alignment...' : 'Calculate Job Match'}</span>
                </button>
              </div>

              {results['job-match'] && (
                <div className="space-y-6 pt-4 border-t border-purple-100 animate-fade-in">
                  <div className="flex items-center gap-6 p-6 rounded-2xl bg-purple-50/70 border border-purple-100">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-purple-200 flex flex-col items-center justify-center shrink-0 shadow-sm">
                      <span className="text-2xl font-black text-[#6335F5]">
                        {results['job-match'].matchScore}%
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Match</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#111827]">Evaluation Summary</h3>
                      <p className="text-xs text-[#4B5563] mt-1 leading-relaxed">
                        {results['job-match'].summary}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                      <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Matched Keywords ({results['job-match'].matchedKeywords.length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {results['job-match'].matchedKeywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-white text-emerald-700 text-[11px] font-semibold border border-emerald-200">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
                      <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        Missing Keywords ({results['job-match'].missingKeywords.length})
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {results['job-match'].missingKeywords.map((kw, i) => (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-white text-amber-700 text-[11px] font-semibold border border-amber-200">
                            {kw}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {results['job-match'].recommendations?.length > 0 && (
                    <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-2">
                      <h4 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                        Strategic Recommendations
                      </h4>
                      <ul className="space-y-1.5">
                        {results['job-match'].recommendations.map((rec, i) => (
                          <li key={i} className="text-xs text-[#4B5563] flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#6335F5] mt-1.5 shrink-0" />
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ATS OPTIMIZER */}
          {activeTab === 'ats-optimizer' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-[#111827] flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    Deep ATS Parser Audit & Risk Diagnostic
                  </h2>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Evaluates single-column parsing stability, standard section headers, and formatting liabilities.
                  </p>
                </div>
                <button
                  disabled={loading}
                  onClick={() => runAiAction('ats-optimizer')}
                  className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                  <span>{loading ? 'Running Audit...' : 'Audit Resume ATS Readiness'}</span>
                </button>
              </div>

              {results['ats-optimizer'] && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-6 p-6 rounded-2xl bg-emerald-50/70 border border-emerald-100">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-emerald-200 flex flex-col items-center justify-center shrink-0 shadow-sm">
                      <span className="text-2xl font-black text-emerald-600">
                        {results['ats-optimizer'].estimatedScore}
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase">Score</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#111827]">Readability Analysis</h3>
                      <p className="text-xs text-[#4B5563] mt-1">
                        {results['ats-optimizer'].readability}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-white border border-purple-100 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Key ATS Strengths
                      </h4>
                      <ul className="space-y-1">
                        {results['ats-optimizer'].strengths.map((str, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-emerald-500">✓</span>
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-purple-100 space-y-2">
                      <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Formatting & Parsing Risks
                      </h4>
                      <ul className="space-y-1">
                        {results['ats-optimizer'].formattingRisks.map((risk, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-amber-500">⚠</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {results['ats-optimizer'].priorityActionPlan?.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-black text-[#111827]">Priority Action Plan</h3>
                      <div className="grid grid-cols-1 gap-3">
                        {results['ats-optimizer'].priorityActionPlan.map((item, i) => (
                          <div key={i} className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-start gap-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase shrink-0 ${
                              item.priority === 'high' ? 'bg-red-100 text-red-700' :
                              item.priority === 'medium' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {item.priority}
                            </span>
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-[#111827]">
                                <span className="text-purple-600 mr-1.5">[{item.section}]</span>
                                {item.action}
                              </p>
                              <p className="text-xs text-gray-500">{item.rationale}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BULLET POLISH */}
          {activeTab === 'bullet-polish' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-[#111827] flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-[#6335F5]" />
                  XYZ Formula Bullet Point Polish
                </h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  Transforms vague task descriptions into high-impact accomplishment statements backed by strong action verbs.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-[#374151]">Your Current Experience Bullet</label>
                <textarea
                  rows={3}
                  value={bulletInput}
                  onChange={(e) => setBulletInput(e.target.value)}
                  placeholder="e.g. Worked on the website front end and improved speed"
                  className="w-full p-4 rounded-2xl border border-purple-100 focus:outline-none focus:ring-2 focus:ring-[#6335F5]/30 text-xs sm:text-sm text-[#111827] resize-none"
                />
                <button
                  disabled={loading || !bulletInput.trim()}
                  onClick={() => runAiAction('bullet-polish', { originalBullet: bulletInput, jobTitle: targetRole })}
                  className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  <span>{loading ? 'Polishing Bullet...' : 'Generate XYZ Bullets'}</span>
                </button>
              </div>

              {results['bullet-polish'] && (
                <div className="space-y-4 pt-4 border-t border-purple-100 animate-fade-in">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    ATS-Enhanced Variations
                  </h3>

                  <div className="grid grid-cols-1 gap-3">
                    {results['bullet-polish'].improvedBullets.map((b, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 transition-all shadow-sm space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-[#6335F5]">
                            {b.style} — Verb: "{b.actionVerb}"
                          </span>
                          <button
                            onClick={() => copyToClipboard(b.text, `bullet-${i}`)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#6335F5] hover:underline"
                          >
                            {copiedKey === `bullet-${i}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedKey === `bullet-${i}` ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                        <p className="text-xs sm:text-sm text-[#111827] font-medium leading-relaxed">
                          • {b.text}
                        </p>
                        <p className="text-[11px] text-gray-400 italic">
                          Why this works: {b.explanation}
                        </p>
                      </div>
                    ))}
                  </div>

                  {results['bullet-polish'].missingMetricsInquiry && (
                    <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-xs text-blue-800 flex items-start gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                      <span>{results['bullet-polish'].missingMetricsInquiry}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SUMMARY GENERATOR */}
          {activeTab === 'summary-generator' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-[#111827] flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#6335F5]" />
                  Professional Summary Studio
                </h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  Craft targeted summary statements tailored to your genuine experience in 3 standard lengths.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-gray-700 mr-2">Select Tone:</span>
                {['professional', 'impact-driven', 'technical', 'executive'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setSummaryTone(t)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold capitalize transition-all ${
                      summaryTone === t
                        ? 'bg-[#6335F5] text-white shadow-sm'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                disabled={loading}
                onClick={() => runAiAction('summary-generator', { tone: summaryTone })}
                className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{loading ? 'Synthesizing...' : 'Generate Summaries'}</span>
              </button>

              {results['summary-generator'] && (
                <div className="grid grid-cols-1 gap-4 pt-4 border-t border-purple-100 animate-fade-in">
                  {/* Short */}
                  <div className="p-5 rounded-2xl bg-white border border-purple-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-purple-600">Short Summary (~200 chars)</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => applySummary(results['summary-generator'].short)}
                          className="px-3 py-1 rounded-lg bg-purple-50 text-[#6335F5] text-xs font-bold hover:bg-purple-100"
                        >
                          Apply to Resume
                        </button>
                        <button
                          onClick={() => copyToClipboard(results['summary-generator'].short, 'sum-short')}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {copiedKey === 'sum-short' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {results['summary-generator'].short}
                    </p>
                  </div>

                  {/* Standard */}
                  <div className="p-5 rounded-2xl bg-white border-2 border-purple-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-purple-700">Standard Summary (Recommended)</span>
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">ATS Optimal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => applySummary(results['summary-generator'].standard)}
                          className="px-3 py-1 rounded-lg bg-[#6335F5] text-white text-xs font-bold hover:bg-purple-700"
                        >
                          Apply to Resume
                        </button>
                        <button
                          onClick={() => copyToClipboard(results['summary-generator'].standard, 'sum-std')}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {copiedKey === 'sum-std' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                      {results['summary-generator'].standard}
                    </p>
                  </div>

                  {/* Detailed */}
                  <div className="p-5 rounded-2xl bg-white border border-purple-100 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase text-purple-600">Detailed (~420 chars)</span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => applySummary(results['summary-generator'].detailed)}
                          className="px-3 py-1 rounded-lg bg-purple-50 text-[#6335F5] text-xs font-bold hover:bg-purple-100"
                        >
                          Apply to Resume
                        </button>
                        <button
                          onClick={() => copyToClipboard(results['summary-generator'].detailed, 'sum-det')}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {copiedKey === 'sum-det' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                      {results['summary-generator'].detailed}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: SKILL GAP ANALYZER */}
          {activeTab === 'skill-gap' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-[#111827] flex items-center gap-2">
                  <Layers className="w-5 h-5 text-[#6335F5]" />
                  Skill Gap & Upskilling Advisor
                </h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  Separates verified demonstrated skills from claimed unproven skills and reveals missing industry competencies.
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700">Target Role / Specialization</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full p-3 rounded-2xl border border-purple-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  disabled={loading}
                  onClick={() => runAiAction('skill-gap', { targetRoleOrJob: targetRole })}
                  className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
                  <span>{loading ? 'Evaluating...' : 'Analyze Skill Gap'}</span>
                </button>
              </div>

              {results['skill-gap'] && (
                <div className="space-y-6 pt-4 border-t border-purple-100 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                        Demonstrated In Projects
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {results['skill-gap'].demonstratedSkills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white text-emerald-700 text-xs font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-2">
                      <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                        Claimed but Unproven
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {results['skill-gap'].claimedUnprovenSkills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white text-amber-700 text-xs font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-red-50/70 border border-red-100 space-y-2">
                      <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider">
                        Missing Required
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {results['skill-gap'].missingRequiredSkills.map((s, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-white text-red-700 text-xs font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {results['skill-gap'].learningRecommendations?.length > 0 && (
                    <div className="p-5 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900">
                        Recommended Learning Priorities
                      </h4>
                      <div className="space-y-2">
                        {results['skill-gap'].learningRecommendations.map((lr, i) => (
                          <div key={i} className="flex items-start gap-3 bg-white p-3 rounded-xl border border-purple-100">
                            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-purple-100 text-[#6335F5] shrink-0">
                              {lr.urgency}
                            </span>
                            <div>
                              <p className="text-xs font-bold text-[#111827]">{lr.topic}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{lr.rationale}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 6: HR RECRUITER REVIEW */}
          {activeTab === 'hr-review' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-[#111827] flex items-center gap-2">
                    <Eye className="w-5 h-5 text-[#6335F5]" />
                    Simulated 6-Second HR Recruiter Screen
                  </h2>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Authentic feedback from the perspective of an executive corporate recruiter reviewing your candidate profile.
                  </p>
                </div>
                <button
                  disabled={loading}
                  onClick={() => runAiAction('hr-review')}
                  className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
                  <span>{loading ? 'Screening...' : 'Get Recruiter Feedback'}</span>
                </button>
              </div>

              {results['hr-review'] && (
                <div className="space-y-6 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-purple-600">Clarity Rating</span>
                      <p className="text-3xl font-black text-[#6335F5]">{results['hr-review'].clarityScore} / 10</p>
                      <p className="text-xs text-gray-500">{results['hr-review'].presentationQuality}</p>
                    </div>

                    <div className="p-5 rounded-2xl bg-white border border-purple-100 md:col-span-2 space-y-1">
                      <span className="text-[10px] font-bold uppercase text-gray-400">First Impression (6-sec scan)</span>
                      <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                        "{results['hr-review'].firstImpression}"
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2">
                      <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Strong Points</h4>
                      <ul className="space-y-1 text-xs text-gray-700">
                        {results['hr-review'].strongPoints.map((sp, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-emerald-500">✓</span>
                            <span>{sp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-5 rounded-2xl bg-red-50/50 border border-red-100 space-y-2">
                      <h4 className="text-xs font-bold text-red-800 uppercase tracking-wider">Recruiter Red Flags</h4>
                      <ul className="space-y-1 text-xs text-gray-700">
                        {results['hr-review'].redFlags.map((rf, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="text-red-500">⚠</span>
                            <span>{rf}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 7: GRAMMAR & TONE */}
          {activeTab === 'grammar-proofread' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-[#111827] flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Grammar, Punctuation & Executive Tone Proofreading
                  </h2>
                  <p className="text-xs text-[#6B7280] mt-1">
                    Detects passive voice, weak phrasing, repetitive words, and grammatical discrepancies.
                  </p>
                </div>
                <button
                  disabled={loading}
                  onClick={() => runAiAction('grammar-proofread')}
                  className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{loading ? 'Proofreading...' : 'Proofread Entire Resume'}</span>
                </button>
              </div>

              {results['grammar-proofread'] && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#111827]">
                        Tone Assessment: <span className="text-[#6335F5]">{results['grammar-proofread'].overallTone}</span>
                      </p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-white border border-purple-200 text-purple-700">
                      {results['grammar-proofread'].correctionsCount} Suggested Fixes
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {results['grammar-proofread'].corrections.map((c, i) => (
                      <div key={i} className="p-4 rounded-2xl bg-white border border-purple-100 space-y-2">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase text-purple-600">
                          <span>{c.type}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                          <div className="p-2.5 rounded-xl bg-red-50 text-red-700 line-through">
                            {c.originalText}
                          </div>
                          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 font-semibold">
                            {c.suggestedText}
                          </div>
                        </div>
                        <p className="text-[11px] text-gray-500 italic">{c.explanation}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: TAILOR RESUME (IMMUTABILITY RULE ENFORCED) */}
          {activeTab === 'resume-tailor' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-[#111827] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#6335F5]" />
                  Job-Specific Resume Tailoring (Immutable Clone)
                </h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  Synthesizes a separate, job-aligned tailored clone for a specific job posting. 
                  <strong className="text-purple-700 ml-1">Your original resume remains 100% untouched.</strong>
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700">Target Role & Requirements</label>
                <textarea
                  rows={4}
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the target job description to customize this clone..."
                  className="w-full p-4 rounded-2xl border border-purple-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                />
                <button
                  disabled={loading || !jobDescription.trim()}
                  onClick={() => runAiAction('resume-tailor', { jobDescription, jobTitle: targetRole })}
                  className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>{loading ? 'Generating Clone...' : 'Create Tailored Clone'}</span>
                </button>
              </div>

              {results['resume-tailor'] && (
                <div className="space-y-6 pt-4 border-t border-purple-100 animate-fade-in">
                  <div className="p-5 rounded-2xl bg-purple-50 border border-purple-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Generated Tailored Profile</span>
                      <h3 className="text-base font-black text-[#111827]">{results['resume-tailor'].tailoredTitle}</h3>
                      <p className="text-xs text-gray-600 mt-1">{results['resume-tailor'].explanationOfChanges}</p>
                    </div>

                    <button
                      onClick={async () => {
                        if (createCloudResume) {
                          const tailoredData = {
                            ...resumeData,
                            personalInfo: {
                              ...resumeData.personalInfo,
                              jobTitle: results['resume-tailor'].targetRole,
                              summary: results['resume-tailor'].tailoredSummary,
                            },
                          };
                          await createCloudResume(results['resume-tailor'].tailoredTitle, tailoredData);
                          alert('Tailored resume saved to your account as a distinct cloud document!');
                        }
                      }}
                      className="btn-primary py-2 px-4 text-xs font-bold shrink-0"
                    >
                      Save as New Cloud Resume
                    </button>
                  </div>

                  <div className="p-5 rounded-2xl bg-white border border-purple-100 space-y-2">
                    <h4 className="text-xs font-bold uppercase text-purple-700">Tailored Summary</h4>
                    <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                      {results['resume-tailor'].tailoredSummary}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 9: INTERVIEW PREP */}
          {activeTab === 'interview-prep' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-[#111827] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-[#6335F5]" />
                  AI Interview Prep Assistant
                </h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  Targeted HR, Technical, and STAR behavioral interview questions derived directly from your resume and target role.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Target Job Title (e.g. Lead React Developer)"
                  className="w-full sm:w-80 p-3 rounded-2xl border border-purple-100 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
                <button
                  disabled={loading}
                  onClick={() => runAiAction('interview-prep', { jobTitle: targetRole })}
                  className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 w-full sm:w-auto justify-center"
                >
                  {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4" />}
                  <span>{loading ? 'Preparing Questions...' : 'Generate Interview Coaching'}</span>
                </button>
              </div>

              {results['interview-prep'] && (
                <div className="space-y-4 pt-4 border-t border-purple-100 animate-fade-in">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="text-xs font-bold text-gray-700 mr-2">Core Concepts to Revise:</span>
                    {results['interview-prep'].coreConceptsToRevise.map((cc, i) => (
                      <span key={i} className="px-2.5 py-0.5 rounded-full bg-purple-50 text-[#6335F5] text-[11px] font-semibold border border-purple-100">
                        {cc}
                      </span>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {results['interview-prep'].questions.map((q, i) => (
                      <div key={q.id || i} className="p-5 rounded-2xl bg-white border border-purple-100 space-y-3 shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-[#EDE9FE] text-[#6335F5]">
                            Category: {q.category}
                          </span>
                          <span className="text-[10px] text-gray-400 font-bold">Question #{i + 1}</span>
                        </div>
                        <h4 className="text-sm font-black text-[#111827] leading-snug">
                          "{q.question}"
                        </h4>
                        <div className="p-3 rounded-xl bg-purple-50/50 text-xs space-y-1">
                          <p className="font-bold text-purple-900">Why recruiters ask this:</p>
                          <p className="text-gray-600">{q.whyAsked}</p>
                        </div>
                        <div className="p-3 rounded-xl bg-emerald-50/50 text-xs space-y-1">
                          <p className="font-bold text-emerald-900">Recommended Answer Structure (STAR / Best Practice):</p>
                          <p className="text-gray-700">{q.suggestedAnswerStructure}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 10: DIFF / SECTION COMPARISON */}
          {activeTab === 'diff-comparison' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-black text-[#111827] flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-[#6335F5]" />
                  Side-by-Side Section Diff & Acceptance Interface
                </h2>
                <p className="text-xs text-[#6B7280] mt-1">
                  Inspect before-and-after improvements section by section with single-click accept or manual edit controls.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700">Original Resume Section</label>
                  <textarea
                    rows={4}
                    value={diffOriginal}
                    onChange={(e) => setDiffOriginal(e.target.value)}
                    placeholder="Original bullet point or section content..."
                    className="w-full p-4 rounded-2xl border border-red-200 bg-red-50/30 text-xs sm:text-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-700">AI Suggested Section</label>
                  <textarea
                    rows={4}
                    value={diffSuggested}
                    onChange={(e) => setDiffSuggested(e.target.value)}
                    placeholder="Suggested enhanced text..."
                    className="w-full p-4 rounded-2xl border border-emerald-200 bg-emerald-50/30 text-xs sm:text-sm focus:outline-none"
                  />
                </div>
              </div>

              <button
                disabled={loading || !diffOriginal.trim()}
                onClick={() => runAiAction('diff-comparison', {
                  originalContent: diffOriginal,
                  suggestedContent: diffSuggested || 'Engineered scalable features driving 25% efficiency boost.',
                  section: 'Experience'
                })}
                className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
                <span>{loading ? 'Evaluating...' : 'Analyze Section Diff'}</span>
              </button>

              {results['diff-comparison'] && (
                <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-purple-700">Impact Analysis</span>
                    <button
                      onClick={() => {
                        copyToClipboard(results['diff-comparison'].suggestedContent, 'diff-copy');
                        alert('Accepted suggested content copied to clipboard!');
                      }}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Accept & Copy
                    </button>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="text-gray-700">
                      <strong>Reasoning:</strong> {results['diff-comparison'].explanationOfChange}
                    </p>
                    <p className="text-emerald-800">
                      <strong>Expected ATS Improvement:</strong> {results['diff-comparison'].expectedImprovement}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
          </>
        )}

        {/* Central Context-Aware AI Chat Assistant Modal */}
        <CentralAiChatModal
          isOpen={chatModalOpen}
          onClose={() => setChatModalOpen(false)}
          contextData={{ targetRole }}
        />
      </div>
    </div>
  );
}

