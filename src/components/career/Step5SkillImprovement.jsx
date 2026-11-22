import React, { useState } from 'react';
import {
  Layers, CheckCircle2, Clock, Sparkles, ArrowRight, RefreshCw,
  FolderGit2, Code, BookOpen, ExternalLink, Check, Copy
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { executePhase13AiAction, saveJourney } from '../../lib/careerJourneyService';

export default function Step5SkillImprovement({ journey, onUpdateJourney, onNextStep }) {
  const { resumeData } = useResume();
  const targetRole = journey?.targetRole || 'Senior Frontend Engineer';

  const [duration, setDuration] = useState('60-day');
  const [weeklyHours, setWeeklyHours] = useState(10);
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(journey?.activeRoadmap || null);
  const [activeTab, setActiveTab] = useState('roadmap'); // 'roadmap' | 'portfolio'
  const [copiedKey, setCopiedKey] = useState(null);

  // Portfolio generator states
  const [projectName, setProjectName] = useState('Cloud Telemetry Dashboard');
  const [projectTech, setProjectTech] = useState('React, TypeScript, Tailwind, Chart.js');
  const [generatedReadme, setGeneratedReadme] = useState('');

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerateRoadmap = async () => {
    setLoading(true);
    try {
      const skills = (resumeData?.skills || []).flatMap((g) => g.skills || []);
      const result = await executePhase13AiAction('generate-roadmap', {
        targetRole,
        currentSkills: skills,
        duration,
        weeklyHours,
      });

      setRoadmap(result);

      // Save to journey state
      const completed = Array.from(new Set([...(journey?.completedSteps || []), 5]));
      const updatedJourney = {
        ...journey,
        currentStep: 6,
        completedSteps: completed,
        activeRoadmap: result,
      };

      await saveJourney(updatedJourney);
      onUpdateJourney(updatedJourney);
    } catch (err) {
      console.warn('Roadmap error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (weekIdx, taskId) => {
    if (!roadmap) return;
    const updatedMilestones = [...roadmap.milestones];
    const task = updatedMilestones[weekIdx].tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
    }

    // Calculate total completed tasks
    const allTasks = updatedMilestones.flatMap((m) => m.tasks);
    const completedTasks = allTasks.filter((t) => t.completed).length;
    const pct = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;

    const updatedRoadmap = {
      ...roadmap,
      milestones: updatedMilestones,
      completionPercentage: pct,
    };

    setRoadmap(updatedRoadmap);

    const updatedJourney = {
      ...journey,
      activeRoadmap: updatedRoadmap,
    };

    await saveJourney(updatedJourney);
    onUpdateJourney(updatedJourney);
  };

  const handleGenerateReadme = () => {
    const readme = `# ${projectName}

## Problem Statement
High-throughput web applications require real-time telemetry rendering without dropping frames or bottlenecking CPU resources.

## Tech Stack
${projectTech}

## Architectural Highlights
- **Modular Component Design**: Decoupled rendering layers ensuring 60fps throughput.
- **Optimized State Lifecycles**: Memoized selectors preventing redundant Virtual DOM diffing.
- **Automated CI/CD**: Integrated Vitest unit tests verifying telemetry calculation boundaries.

## Key Outcomes
- Decreased initial load time by 30%.
- Handled 10K+ telemetry points with zero frame drops.
`;
    setGeneratedReadme(readme);
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-[#6335F5] text-white flex items-center justify-center text-xs font-black">
            5
          </span>
          <h2 className="text-xl font-black text-[#111827]">
            Skill Improvement & Personalized Learning Roadmap
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Targeted 30/60/90-day learning curriculum tailored to bridge the exact skill gaps for <strong className="text-[#6335F5]">{targetRole}</strong>.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-purple-100 pb-2">
        <button
          onClick={() => setActiveTab('roadmap')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'roadmap' ? 'bg-[#6335F5] text-white shadow-sm' : 'text-gray-600 hover:bg-purple-50'
          }`}
        >
          1. Learning Roadmap & Milestones
        </button>
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'portfolio' ? 'bg-[#6335F5] text-white shadow-sm' : 'text-gray-600 hover:bg-purple-50'
          }`}
        >
          2. Portfolio Project & README Builder
        </button>
      </div>

      {/* TAB 1: ROADMAP */}
      {activeTab === 'roadmap' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 bg-purple-50 p-1 rounded-2xl border border-purple-100">
                {['30-day', '60-day', '90-day'].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDuration(d)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      duration === d ? 'bg-[#6335F5] text-white' : 'text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1 text-xs text-gray-500 font-semibold">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span>{weeklyHours} hrs/week</span>
              </div>
            </div>

            <button
              onClick={handleGenerateRoadmap}
              disabled={loading}
              className="btn-primary py-2 px-5 text-xs font-bold flex items-center gap-2"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{roadmap ? 'Regenerate Curriculum' : 'Generate Career Roadmap'}</span>
            </button>
          </div>

          {roadmap && (
            <div className="space-y-6 animate-fade-in">
              {/* Progress Bar Header */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-purple-50 via-white to-purple-50 border border-purple-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-purple-600">Roadmap Milestone Progress</span>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-48 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#6335F5] to-emerald-500 transition-all duration-300"
                        style={{ width: `${roadmap.completionPercentage || 0}%` }}
                      />
                    </div>
                    <span className="text-sm font-black text-[#111827]">
                      {roadmap.completionPercentage || 0}% Complete
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (onNextStep) onNextStep(6);
                  }}
                  className="btn-primary py-2 px-5 text-xs font-bold flex items-center gap-2 shrink-0 hover:scale-102"
                >
                  <span>Proceed to Career Tracker</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Milestones list */}
              <div className="space-y-4">
                {roadmap.milestones?.map((m, mIdx) => (
                  <div key={mIdx} className="p-5 rounded-2xl bg-white border border-purple-100 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-purple-100 text-[#6335F5]">
                          Week {m.week}
                        </span>
                        <h4 className="text-sm font-bold text-[#111827]">{m.focusArea}</h4>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">{m.objective}</p>

                    <div className="space-y-1.5 pt-1">
                      {m.tasks?.map((task) => (
                        <label
                          key={task.id}
                          className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-purple-50/50 cursor-pointer transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleTask(mIdx, task.id)}
                            className="mt-0.5 w-4 h-4 rounded text-[#6335F5] focus:ring-purple-400"
                          />
                          <span className={`text-xs ${task.completed ? 'line-through text-gray-400' : 'text-gray-700 font-medium'}`}>
                            {task.description}
                          </span>
                        </label>
                      ))}
                    </div>

                    {m.suggestedProject && (
                      <div className="p-3 rounded-xl bg-purple-50/40 border border-purple-100 text-xs text-purple-900 flex items-start gap-2">
                        <FolderGit2 className="w-3.5 h-3.5 text-[#6335F5] mt-0.5 shrink-0" />
                        <span><strong>Demonstration Project:</strong> {m.suggestedProject}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PORTFOLIO & README BUILDER */}
      {activeTab === 'portfolio' && (
        <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-5 animate-fade-in">
          <div>
            <h3 className="text-base font-extrabold text-[#111827]">
              Portfolio Project & README Scaffolding
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Turn your roadmap deliverables into credible, well-documented portfolio projects with verified engineering outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Project Name</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-3 rounded-2xl border border-purple-100 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Tech Stack</label>
              <input
                type="text"
                value={projectTech}
                onChange={(e) => setProjectTech(e.target.value)}
                className="w-full p-3 rounded-2xl border border-purple-100 text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateReadme}
            className="btn-primary py-2 px-5 text-xs font-bold flex items-center gap-2"
          >
            <Code className="w-3.5 h-3.5" />
            <span>Generate GitHub README</span>
          </button>

          {generatedReadme && (
            <div className="p-5 rounded-2xl bg-gray-900 text-gray-100 font-mono text-xs space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-gray-400 border-b border-gray-800 pb-2">
                <span>README.md</span>
                <button
                  onClick={() => copyToClipboard(generatedReadme, 'readme-copy')}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-sans font-bold"
                >
                  {copiedKey === 'readme-copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'readme-copy' ? 'Copied' : 'Copy Markdown'}</span>
                </button>
              </div>
              <pre className="whitespace-pre-line leading-relaxed">{generatedReadme}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

