import React, { useState, useEffect } from 'react';
import {
  FileText, Target, Send, Mic, Layers, TrendingUp, CheckCircle2,
  Clock, ArrowRight, Sparkles, RefreshCw, Award, Bot, ShieldCheck,
  ChevronRight, ArrowLeft
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useAuth } from '../../context/AuthContext';
import { loadActiveJourney, saveJourney, getLocalApplications } from '../../lib/careerJourneyService';

import Step1ResumeUnderstanding from './Step1ResumeUnderstanding';
import Step2TargetJobSelection from './Step2TargetJobSelection';
import Step3ApplicationPreparation from './Step3ApplicationPreparation';
import Step4InterviewPreparation from './Step4InterviewPreparation';
import Step5SkillImprovement from './Step5SkillImprovement';
import Step6CareerProgressTracking from './Step6CareerProgressTracking';

const JOURNEY_STEPS = [
  { id: 1, title: 'Resume Understanding', icon: FileText, desc: 'Verify baseline career profile' },
  { id: 2, title: 'Target Job Selection', icon: Target, desc: 'Analyze requirements & compatibility' },
  { id: 3, title: 'Application Prep', icon: Send, desc: 'Tailored clone & cover letter' },
  { id: 4, title: 'Interview Simulator', icon: Mic, desc: 'Voice & text mock interviews' },
  { id: 5, title: 'Skill Roadmap', icon: Layers, desc: '30/60/90-day learning curriculum' },
  { id: 6, title: 'Career Progress', icon: TrendingUp, desc: 'Application pipeline & analytics' },
];

export default function CareerJourneyDashboard({ onBackToDashboard, onNavigateBuilder }) {
  const { resumeData } = useResume();
  const { user } = useAuth();

  const [journey, setJourney] = useState(null);
  const [activeStepTab, setActiveStepTab] = useState(1);
  const [loading, setLoading] = useState(true);
  const [appCount, setAppCount] = useState(0);

  useEffect(() => {
    loadJourney();
  }, [user]);

  const loadJourney = async () => {
    setLoading(true);
    try {
      const active = await loadActiveJourney(user?.id);
      setJourney(active);
      setActiveStepTab(active.currentStep || 1);
      const apps = getLocalApplications();
      setAppCount(apps.length);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateJourney = (updated) => {
    setJourney(updated);
  };

  const handleStepJump = (stepId) => {
    setActiveStepTab(stepId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading || !journey) {
    return (
      <div className="p-16 text-center flex flex-col items-center justify-center space-y-3">
        <RefreshCw className="w-8 h-8 text-[#6335F5] animate-spin" />
        <p className="text-sm font-bold text-gray-700">Loading AI Career Journey...</p>
      </div>
    );
  }

  const completedCount = journey.completedSteps?.length || 0;
  const progressPercent = Math.min(100, Math.round((completedCount / 6) * 100));

  return (
    <div className="space-y-6">
      {/* Top Overview & Master Progress Bar */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-950 text-white shadow-xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-purple-500/30 text-purple-200 border border-purple-400/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                Six-Step Career Ecosystem
              </span>
              <span className="text-xs text-purple-200 font-bold">
                {journey.targetRole ? `Targeting: ${journey.targetRole}` : 'No Target Role Selected'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              AI Career Journey System
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 leading-relaxed">
              From resume analysis and job matching to multi-modal voice interview coaching and skill roadmaps — track every milestone on real persisted records.
            </p>
          </div>

          {/* Progress Dial Box */}
          <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-4 shrink-0">
            <div className="w-14 h-14 rounded-2xl bg-white text-[#6335F5] font-black text-xl flex items-center justify-center shadow-md">
              {progressPercent}%
            </div>
            <div>
              <span className="text-[11px] font-bold text-purple-200 uppercase tracking-wider">Overall Progress</span>
              <p className="text-sm font-black text-white">{completedCount} of 6 Steps Done</p>
            </div>
          </div>
        </div>

        {/* 6 Step Track Pills */}
        <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-6 gap-2.5">
          {JOURNEY_STEPS.map((s) => {
            const isCompleted = journey.completedSteps?.includes(s.id);
            const isCurrent = activeStepTab === s.id;
            const Icon = s.icon;

            return (
              <button
                key={s.id}
                onClick={() => handleStepJump(s.id)}
                className={`p-3 rounded-2xl text-left transition-all duration-200 flex flex-col justify-between h-20 ${
                  isCurrent
                    ? 'bg-white text-[#111827] shadow-lg shadow-black/20 ring-2 ring-purple-300'
                    : isCompleted
                    ? 'bg-white/15 text-white hover:bg-white/20 border border-emerald-400/30'
                    : 'bg-white/5 text-purple-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`text-[10px] font-black uppercase ${isCurrent ? 'text-[#6335F5]' : isCompleted ? 'text-emerald-400' : 'text-purple-300'}`}>
                    Step {s.id}
                  </span>
                  {isCompleted ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Icon className={`w-3.5 h-3.5 ${isCurrent ? 'text-[#6335F5]' : 'text-purple-300'}`} />
                  )}
                </div>
                <p className={`text-xs font-black truncate ${isCurrent ? 'text-[#111827]' : 'text-white'}`}>
                  {s.title}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Real-Time Career Journey Metrics Overview Panel (Real Data Only) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Current Stage</span>
          <p className="text-xs font-black text-[#6335F5] truncate">Stage {activeStepTab}: {JOURNEY_STEPS[activeStepTab - 1].title}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Completed / Pending</span>
          <p className="text-xs font-black text-[#111827]">{completedCount} Done • {6 - completedCount} Pending</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Target Role</span>
          <p className="text-xs font-black text-[#111827] truncate">{journey.targetRole || 'Not Selected'}</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Resume Readiness</span>
          <p className={`text-xs font-black ${journey.careerProfile?.verifiedByUser ? 'text-emerald-600' : 'text-amber-600'}`}>
            {journey.careerProfile?.verifiedByUser ? 'Verified (100%)' : 'Needs Verification'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Job Compatibility</span>
          <p className="text-xs font-black text-[#6335F5]">
            {journey.compatibilityAudit?.compatibilityScore ? `${journey.compatibilityAudit.compatibilityScore}% Match` : 'Audit Pending'}
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Pipeline Activity</span>
          <p className="text-xs font-black text-purple-900">{appCount} Tracked Jobs</p>
        </div>
      </div>

      {/* Active Step Workspace */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-purple-100 shadow-[0_4px_30px_rgba(99,53,245,0.04)] min-h-[500px]">
        {activeStepTab === 1 && (
          <Step1ResumeUnderstanding
            journey={journey}
            onUpdateJourney={handleUpdateJourney}
            onNextStep={handleStepJump}
          />
        )}
        {activeStepTab === 2 && (
          <Step2TargetJobSelection
            journey={journey}
            onUpdateJourney={handleUpdateJourney}
            onNextStep={handleStepJump}
          />
        )}
        {activeStepTab === 3 && (
          <Step3ApplicationPreparation
            journey={journey}
            onUpdateJourney={handleUpdateJourney}
            onNextStep={handleStepJump}
          />
        )}
        {activeStepTab === 4 && (
          <Step4InterviewPreparation
            journey={journey}
            onUpdateJourney={handleUpdateJourney}
            onNextStep={handleStepJump}
          />
        )}
        {activeStepTab === 5 && (
          <Step5SkillImprovement
            journey={journey}
            onUpdateJourney={handleUpdateJourney}
            onNextStep={handleStepJump}
          />
        )}
        {activeStepTab === 6 && (
          <Step6CareerProgressTracking
            journey={journey}
            onUpdateJourney={handleUpdateJourney}
          />
        )}
      </div>
    </div>
  );
}

