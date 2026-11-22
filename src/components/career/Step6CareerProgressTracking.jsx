import React, { useState, useEffect } from 'react';
import {
  Briefcase, CheckCircle2, Clock, Plus, BarChart2, TrendingUp,
  AlertCircle, Building2, ExternalLink, Calendar, ArrowRight, ShieldCheck,
  Send, Award
} from 'lucide-react';
import {
  getLocalApplications,
  saveLocalApplications,
  addJobApplication,
  calculatePipelineAnalytics,
  saveJourney,
} from '../../lib/careerJourneyService';

const STATUS_COLUMNS = [
  { id: 'interested', label: 'Interested', bg: 'bg-gray-100 text-gray-700' },
  { id: 'applied', label: 'Applied', bg: 'bg-blue-100 text-blue-700' },
  { id: 'interview', label: 'Interviewing', bg: 'bg-purple-100 text-purple-700' },
  { id: 'offer', label: 'Offers', bg: 'bg-emerald-100 text-emerald-800' },
];

export default function Step6CareerProgressTracking({ journey, onUpdateJourney }) {
  const [applications, setApplications] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New Application Form
  const [company, setCompany] = useState('');
  const [role, setRole] = useState(journey?.targetRole || 'Software Engineer');
  const [location, setLocation] = useState('Remote');
  const [status, setStatus] = useState('applied');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    let apps = getLocalApplications();
    if (apps.length === 0) {
      // Seed with initial realistic application from Step 3 if none exists
      apps = [
        {
          id: 'app-seed-1',
          company: journey?.companyName || 'NextGen Digital',
          role: journey?.targetRole || 'Senior Frontend Engineer',
          location: 'Remote',
          applicationUrl: 'https://example.com/careers',
          status: 'interview',
          appliedDate: new Date().toISOString().split('T')[0],
          followUpDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
          compatibilityScore: journey?.compatibilityAudit?.compatibilityScore || 86,
          notes: 'Tailored resume submitted with Cover Letter via ResumeXpert AI.',
        },
      ];
      saveLocalApplications(apps);
    }
    setApplications(apps);
    setAnalytics(calculatePipelineAnalytics(apps));
  };

  const handleAddApp = async (e) => {
    e.preventDefault();
    if (!company.trim() || !role.trim()) return;

    await addJobApplication({
      company: company.trim(),
      role: role.trim(),
      location: location.trim(),
      status,
      appliedDate: new Date().toISOString().split('T')[0],
      followUpDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      compatibilityScore: 85,
    });

    setCompany('');
    setShowAddModal(false);
    loadData();
  };

  const handleStatusChange = async (appId, newStatus) => {
    const updated = applications.map((a) => (a.id === appId ? { ...a, status: newStatus } : a));
    saveLocalApplications(updated);
    setApplications(updated);
    setAnalytics(calculatePipelineAnalytics(updated));

    // Ensure Step 6 is marked complete in Journey
    const completed = Array.from(new Set([...(journey?.completedSteps || []), 6]));
    const updatedJourney = {
      ...journey,
      completedSteps: completed,
    };
    await saveJourney(updatedJourney);
    onUpdateJourney(updatedJourney);
  };

  const handleCompleteJourney = async () => {
    const completed = Array.from(new Set([...(journey?.completedSteps || []), 6]));
    const updatedJourney = {
      ...journey,
      completedSteps: completed,
    };
    await saveJourney(updatedJourney);
    onUpdateJourney(updatedJourney);
    alert('Congratulations! All 6 Steps of your AI Career Journey are complete and actively tracking.');
  };

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#6335F5] text-white flex items-center justify-center text-xs font-black">
              6
            </span>
            <h2 className="text-xl font-black text-[#111827]">
              Career Progress Tracking & Pipeline Analytics
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Track active applications, conversion ratios, follow-up milestones, and actionable recommendations.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-2 shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Analytics KPI Ribbon */}
      {analytics && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Total Tracked</span>
            <p className="text-2xl font-black text-[#111827] mt-0.5">{analytics.totalApplications}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase">In Progress</span>
            <p className="text-2xl font-black text-blue-600 mt-0.5">{analytics.inProgress}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Interviews</span>
            <p className="text-2xl font-black text-[#6335F5] mt-0.5">{analytics.interviewsScheduled}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm text-center">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Offers</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">{analytics.offersReceived}</p>
          </div>
          <div className="p-4 rounded-2xl bg-white border border-purple-100 shadow-sm text-center col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-gray-500 uppercase">Conversion</span>
            <p className="text-2xl font-black text-purple-700 mt-0.5">{analytics.conversionRate}%</p>
          </div>
        </div>
      )}

      {/* Dynamic Next-Action Advisor Banner */}
      {analytics && (
        <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-100 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#6335F5] text-white flex items-center justify-center shrink-0 shadow-sm">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#6335F5]">
              AI Career Next-Action Advisor
            </h4>
            <p className="text-xs sm:text-sm text-[#111827] font-medium mt-0.5 leading-relaxed">
              {analytics.nextRecommendedAction}
            </p>
          </div>
        </div>
      )}

      {/* Visual Kanban Pipeline Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {STATUS_COLUMNS.map((col) => {
          const colApps = applications.filter((a) => {
            if (col.id === 'interview') return ['interview', 'assessment', 'shortlisted'].includes(a.status);
            return a.status === col.id;
          });

          return (
            <div key={col.id} className="p-4 rounded-2xl bg-gray-50/70 border border-gray-100 space-y-3 min-h-[300px]">
              <div className="flex items-center justify-between pb-2 border-b border-gray-200">
                <span className="text-xs font-black text-[#111827]">{col.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${col.bg}`}>
                  {colApps.length}
                </span>
              </div>

              <div className="space-y-2.5">
                {colApps.map((app) => (
                  <div key={app.id} className="p-3.5 rounded-xl bg-white border border-purple-100 shadow-2xs space-y-2">
                    <div>
                      <h5 className="text-xs font-bold text-[#111827]">{app.role}</h5>
                      <p className="text-[11px] text-gray-500">{app.company} • {app.location}</p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-gray-50 text-[10px]">
                      <span className="text-purple-600 font-bold">{app.compatibilityScore}% Match</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="text-[10px] font-semibold bg-purple-50 text-purple-700 rounded-lg px-2 py-0.5 border border-purple-200 focus:outline-none"
                      >
                        <option value="interested">Interested</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Milestone Completion Callout */}
      <div className="p-5 rounded-3xl bg-gradient-to-r from-emerald-50 via-white to-purple-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Award className="w-6 h-6 text-emerald-600 shrink-0" />
          <div>
            <h4 className="text-sm font-black text-[#111827]">
              Continuous Career Journey Active
            </h4>
            <p className="text-xs text-[#6B7280]">
              All 6 stages of your AI Career Journey are interconnected. You can revisit any step or launch a new target role at any time.
            </p>
          </div>
        </div>

        <button
          onClick={handleCompleteJourney}
          className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 hover:scale-102"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Finalize Journey Progress</span>
        </button>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-purple-100 space-y-4">
            <h3 className="text-base font-black text-[#111827]">Add Target Job Application</h3>
            <form onSubmit={handleAddApp} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700">Company Name</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Google, Stripe"
                  className="w-full p-2.5 rounded-xl border border-purple-100 text-xs text-gray-800 mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Job Title</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead React Engineer"
                  className="w-full p-2.5 rounded-xl border border-purple-100 text-xs text-gray-800 mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Remote / City"
                  className="w-full p-2.5 rounded-xl border border-purple-100 text-xs text-gray-800 mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Current Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-purple-100 text-xs text-gray-800 mt-1"
                >
                  <option value="interested">Interested</option>
                  <option value="applied">Applied</option>
                  <option value="interview">Interview</option>
                  <option value="offer">Offer</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary py-2 px-5 text-xs font-bold"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

