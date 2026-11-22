import React, { useState } from 'react';
import {
  FileText, Sparkles, CheckCircle2, ShieldAlert, Copy, Check, ArrowRight,
  RefreshCw, Eye, Edit3, Send, Layers, HelpCircle, AlertTriangle
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { executePhase13AiAction, saveJourney, addJobApplication } from '../../lib/careerJourneyService';

export default function Step3ApplicationPreparation({ journey, onUpdateJourney, onNextStep }) {
  const { resumeData, createCloudResume } = useResume();
  const targetRole = journey?.targetRole || 'Software Engineer';
  const company = journey?.companyName || 'Target Company';

  const [activeSubTab, setActiveSubTab] = useState('tailored-resume');
  const [loading, setLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState(null);

  // States
  const [tailoredResume, setTailoredResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(journey?.activeCoverLetter || null);
  const [recruiterEmail, setRecruiterEmail] = useState(null);
  const [truthAudit, setTruthAudit] = useState(null);

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // 1. Generate Tailored Clone (Never modifies original)
  const handleGenerateTailoredResume = async () => {
    setLoading(true);
    try {
      const result = await executePhase13AiAction('resume-tailor', {
        resumeData,
        jobDescription: journey?.jobDescription || '',
        jobTitle: targetRole,
      });
      setTailoredResume(result);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  // 2. Generate Cover Letter
  const handleGenerateCoverLetter = async () => {
    setLoading(true);
    try {
      const result = await executePhase13AiAction('generate-communication', {
        category: 'cover_letter',
        resumeData,
        jobDescription: journey?.jobDescription || '',
        companyName: company,
        tone: 'professional',
      });
      setCoverLetter(result);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Generate Recruiter Email
  const handleGenerateRecruiterEmail = async () => {
    setLoading(true);
    try {
      const result = await executePhase13AiAction('generate-communication', {
        category: 'recruiter_email',
        resumeData,
        jobDescription: journey?.jobDescription || '',
        companyName: company,
        tone: 'professional',
      });
      setRecruiterEmail(result);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  // 4. Run Truth Checker
  const handleRunTruthCheck = async () => {
    setLoading(true);
    try {
      const result = await executePhase13AiAction('truth-check', { resumeData });
      setTruthAudit(result);
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  // Approve & Save Application Package
  const handleApproveAndProceed = async () => {
    const completed = Array.from(new Set([...(journey?.completedSteps || []), 3]));
    const updatedJourney = {
      ...journey,
      currentStep: 4,
      completedSteps: completed,
      activeCoverLetter: coverLetter,
    };

    // Also auto-record into Job Applications pipeline if not already present
    await addJobApplication({
      company,
      role: targetRole,
      status: 'applied',
      appliedDate: new Date().toISOString().split('T')[0],
      compatibilityScore: journey?.compatibilityAudit?.compatibilityScore || 85,
      notes: `Tailored application package prepared with ResumeXpert AI.`,
    });

    await saveJourney(updatedJourney);
    onUpdateJourney(updatedJourney);
    if (onNextStep) onNextStep(4);
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#6335F5] text-white flex items-center justify-center text-xs font-black">
            3
          </span>
          <h2 className="text-xl font-black text-[#111827]">
            Application Preparation & Tailored Package
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Synthesize a separate tailored resume clone, cover letter, and recruiter emails while verifying factual claims.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
        <button
          onClick={() => setActiveSubTab('tailored-resume')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'tailored-resume' ? 'bg-[#6335F5] text-white shadow-sm' : 'text-gray-600 hover:bg-purple-50'
          }`}
        >
          1. Tailored Resume Clone
        </button>
        <button
          onClick={() => setActiveSubTab('cover-letter')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'cover-letter' ? 'bg-[#6335F5] text-white shadow-sm' : 'text-gray-600 hover:bg-purple-50'
          }`}
        >
          2. Cover Letter & Email Studio
        </button>
        <button
          onClick={() => setActiveSubTab('truth-check')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeSubTab === 'truth-check' ? 'bg-[#6335F5] text-white shadow-sm' : 'text-gray-600 hover:bg-purple-50'
          }`}
        >
          3. Truth & Evidence Checker
        </button>
      </div>

      {/* SUB TAB 1: TAILORED RESUME CLONE */}
      {activeSubTab === 'tailored-resume' && (
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-50">
            <div>
              <h3 className="text-base font-extrabold text-[#111827]">
                Job-Specific Resume Clone
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Target Role: <strong className="text-[#6335F5]">{targetRole}</strong> at <strong>{company}</strong>
              </p>
            </div>
            <button
              onClick={handleGenerateTailoredResume}
              disabled={loading}
              className="btn-primary py-2 px-5 text-xs font-bold flex items-center gap-2 shrink-0"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{tailoredResume ? 'Regenerate Clone' : 'Generate Tailored Resume'}</span>
            </button>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
            <span className="font-black text-amber-700">Strict Immutability Rule:</span>
            <span>Your original master resume remains 100% untouched. This creates a dedicated cloned version.</span>
          </div>

          {tailoredResume ? (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100">
                <span className="text-[10px] font-black uppercase text-purple-600">Tailored Executive Summary</span>
                <p className="text-xs sm:text-sm text-gray-800 font-medium mt-1 leading-relaxed">
                  {tailoredResume.tailoredSummary}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Targeted Experience Achievements
                </h4>
                {tailoredResume.tailoredExperience?.map((exp, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-gray-100 bg-white space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827]">{exp.jobTitle} • {exp.companyName}</span>
                    </div>
                    <ul className="space-y-1">
                      {exp.suggestedAchievements?.map((ach, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="text-[#6335F5] font-bold">•</span>
                          <span>{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-10 text-center text-xs text-gray-500">
              Click "Generate Tailored Resume" to synthesize an optimized clone for {targetRole}.
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 2: COVER LETTER STUDIO */}
      {activeSubTab === 'cover-letter' && (
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-50">
            <div>
              <h3 className="text-base font-extrabold text-[#111827]">
                Tailored Cover Letter & Recruiter Outreach
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Generates authentic, high-impact letters based solely on your verified career achievements.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleGenerateCoverLetter}
                disabled={loading}
                className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{coverLetter ? 'Regenerate Cover Letter' : 'Draft Cover Letter'}</span>
              </button>
              <button
                onClick={handleGenerateRecruiterEmail}
                disabled={loading}
                className="btn-secondary py-2 px-4 text-xs font-bold flex items-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Cold Email Draft</span>
              </button>
            </div>
          </div>

          {coverLetter && (
            <div className="p-5 rounded-2xl bg-purple-50/40 border border-purple-100 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-purple-700">Cover Letter Draft</span>
                <button
                  onClick={() => copyToClipboard(coverLetter.content, 'cl-copy')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#6335F5] hover:underline"
                >
                  {copiedKey === 'cl-copy' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'cl-copy' ? 'Copied' : 'Copy Letter'}</span>
                </button>
              </div>
              <textarea
                rows={10}
                value={coverLetter.content}
                onChange={(e) => setCoverLetter({ ...coverLetter, content: e.target.value })}
                className="w-full p-4 rounded-xl border border-purple-200 bg-white text-xs sm:text-sm text-gray-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-purple-400 font-mono"
              />
            </div>
          )}

          {recruiterEmail && (
            <div className="p-5 rounded-2xl bg-white border border-purple-100 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">Subject: {recruiterEmail.subject}</span>
                <button
                  onClick={() => copyToClipboard(recruiterEmail.body, 'email-copy')}
                  className="text-xs font-bold text-[#6335F5] hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Body</span>
                </button>
              </div>
              <p className="text-xs text-gray-700 whitespace-pre-line bg-gray-50 p-4 rounded-xl font-mono">
                {recruiterEmail.body}
              </p>
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 3: TRUTH & EVIDENCE CHECKER */}
      {activeSubTab === 'truth-check' && (
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-purple-50">
            <div>
              <h3 className="text-base font-extrabold text-[#111827]">
                AI Resume Truth & Evidence Checker
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Classifies resume claims to identify unsubstantiated metrics or skills lacking project context.
              </p>
            </div>
            <button
              onClick={handleRunTruthCheck}
              disabled={loading}
              className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-2"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldAlert className="w-3.5 h-3.5" />}
              <span>Audit Resume Evidence</span>
            </button>
          </div>

          {truthAudit && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-purple-50 border border-purple-100">
                <div>
                  <span className="text-xs font-bold text-gray-600">Factual Credibility Index</span>
                  <p className="text-2xl font-black text-[#6335F5]">{truthAudit.overallCredibilityScore}%</p>
                </div>
                <p className="text-xs text-gray-600 max-w-md">{truthAudit.summary}</p>
              </div>

              <div className="space-y-3">
                {truthAudit.findings?.map((finding, i) => (
                  <div key={i} className="p-4 rounded-2xl border border-purple-100 bg-white space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111827]">"{finding.claimText}"</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                        finding.classification === 'supported' ? 'bg-emerald-100 text-emerald-800' :
                        finding.classification === 'needs_verification' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {finding.classification.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">{finding.rationale}</p>
                    <p className="text-xs text-purple-700 font-medium">Recommendation: {finding.remediationAdvice}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completion & Next Step Bar */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50 via-white to-purple-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-black text-[#111827]">
            Save Application Package & Continue
          </h4>
          <p className="text-xs text-[#6B7280]">
            Saves your tailored clone, cover letter, and application record, then proceeds to mock interview prep.
          </p>
        </div>

        <button
          onClick={handleApproveAndProceed}
          className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 hover:scale-102"
        >
          <span>Confirm & Start Interview Prep</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

