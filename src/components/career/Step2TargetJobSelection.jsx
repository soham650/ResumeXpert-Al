import React, { useState } from 'react';
import {
  Target, CheckCircle2, AlertTriangle, Sparkles, ArrowRight, RefreshCw,
  Building2, Briefcase, FileText, ChevronRight, BarChart2
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { executePhase13AiAction, saveJourney } from '../../lib/careerJourneyService';

const SAMPLE_JOB_PRESETS = [
  {
    role: 'Senior Frontend Engineer',
    company: 'NextGen Digital',
    desc: 'Seeking a Senior Frontend Engineer proficient in React, TypeScript, and modern component systems. Must have strong understanding of responsive layout architecture, state management with Zustand/Redux, and CI/CD automated deployment pipelines. Nice to have: Docker basics, Jest/Vitest testing.',
  },
  {
    role: 'Full Stack JavaScript Developer',
    company: 'CloudScale Labs',
    desc: 'Looking for a Full Stack Developer with 3+ years experience in React, Node.js, REST APIs, and PostgreSQL. Responsible for developing scalable client applications, database schema optimization, and third-party API integrations.',
  },
];

export default function Step2TargetJobSelection({ journey, onUpdateJourney, onNextStep }) {
  const { resumeData } = useResume();
  const [role, setRole] = useState(journey?.targetRole || 'Senior Frontend Engineer');
  const [company, setCompany] = useState(journey?.companyName || 'NextGen Digital');
  const [jobDescription, setJobDescription] = useState(journey?.jobDescription || SAMPLE_JOB_PRESETS[0].desc);
  const [loading, setLoading] = useState(false);
  const [audit, setAudit] = useState(journey?.compatibilityAudit || null);

  const handleRunAudit = async () => {
    if (!role.trim()) return;
    setLoading(true);
    try {
      const result = await executePhase13AiAction('job-insights', {
        resumeData,
        targetRole: role,
        companyName: company,
        jobDescription,
      });

      setAudit(result);

      // Save to journey state
      const completed = Array.from(new Set([...(journey?.completedSteps || []), 2]));
      const updatedJourney = {
        ...journey,
        targetRole: role,
        companyName: company,
        jobDescription,
        completedSteps: completed,
        compatibilityAudit: result,
      };

      await saveJourney(updatedJourney);
      onUpdateJourney(updatedJourney);
    } catch (err) {
      console.warn('Audit error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset) => {
    setRole(preset.role);
    setCompany(preset.company);
    setJobDescription(preset.desc);
  };

  const handleProceed = () => {
    if (onNextStep) onNextStep(3);
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#6335F5] text-white flex items-center justify-center text-xs font-black">
            2
          </span>
          <h2 className="text-xl font-black text-[#111827]">
            Target Job Selection & Compatibility Audit
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Provide your target role and job description to run an ATS keyword audit, identify missing skills, and calculate genuine compatibility.
        </p>
      </div>

      {/* Preset Pill Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-gray-500 mr-1">Sample Job Roles:</span>
        {SAMPLE_JOB_PRESETS.map((preset, i) => (
          <button
            key={i}
            onClick={() => handleApplyPreset(preset)}
            className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-[#6335F5] hover:bg-purple-100 border border-purple-200 transition-colors"
          >
            {preset.role} ({preset.company})
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#6335F5]" />
              Target Job Title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Lead React Engineer"
              className="w-full p-3 rounded-2xl border border-purple-100 text-xs sm:text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#6335F5]" />
              Company Name (Optional)
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Stripe, Acme Corp"
              className="w-full p-3 rounded-2xl border border-purple-100 text-xs sm:text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#6335F5]" />
            Target Job Description & Requirements
          </label>
          <textarea
            rows={5}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job posting requirements and responsibilities here..."
            className="w-full p-3.5 rounded-2xl border border-purple-100 text-xs sm:text-sm text-[#111827] focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
          />
        </div>

        <button
          onClick={handleRunAudit}
          disabled={loading || !role.trim()}
          className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 disabled:opacity-50"
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          <span>{loading ? 'Evaluating Alignment...' : 'Analyze Compatibility & Skill Gaps'}</span>
        </button>
      </div>

      {/* Audit Output Card */}
      {audit && (
        <div className="space-y-6 animate-fade-in">
          {/* Compatibility Gauge Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-3xl bg-gradient-to-r from-purple-50 via-white to-purple-50 border border-purple-200">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white border border-purple-200 flex flex-col items-center justify-center shrink-0 shadow-sm">
                <span className="text-2xl font-black text-[#6335F5]">{audit.compatibilityScore}%</span>
                <span className="text-[10px] font-bold text-gray-500 uppercase">Match</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-purple-100 text-[#6335F5]">
                  AI Compatibility Diagnostic
                </span>
                <h3 className="text-base font-extrabold text-[#111827] mt-1">{audit.targetRole}</h3>
                <p className="text-xs text-[#4B5563] mt-0.5 leading-relaxed max-w-xl">
                  {audit.executiveSummary}
                </p>
              </div>
            </div>

            <button
              onClick={handleProceed}
              className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 self-start sm:self-auto hover:scale-102"
            >
              <span>Proceed to Application Prep</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Matched vs Missing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mandatory Matched */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-100 space-y-2">
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Mandatory Skills Met ({audit.mandatoryMatched?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {audit.mandatoryMatched?.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white text-emerald-700 text-xs font-semibold border border-emerald-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Mandatory Missing */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-100 space-y-2">
              <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Missing Core Requirements ({audit.mandatoryMissing?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {audit.mandatoryMissing?.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white text-amber-700 text-xs font-semibold border border-amber-200">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {audit.immediateRecommendations?.length > 0 && (
            <div className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-2">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Immediate Strategic Recommendations
              </h4>
              <ul className="space-y-1.5">
                {audit.immediateRecommendations.map((rec, i) => (
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
  );
}

