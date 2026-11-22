import React, { useState, useEffect, useRef } from 'react';
import {
  FileText, CheckCircle2, ShieldCheck, RefreshCw, Sparkles, User, Briefcase,
  GraduationCap, Award, ChevronRight, Edit3, ArrowRight, AlertCircle, UploadCloud
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { executePhase13AiAction, saveJourney } from '../../lib/careerJourneyService';
import { careerProfileSchema } from '../../schema/careerJourneySchemas';
import { parseUploadedFile } from '../../utils/fileResumeParser';

export default function Step1ResumeUnderstanding({ journey, onUpdateJourney, onNextStep }) {
  const { resumeData, loadResume } = useResume();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(journey?.careerProfile || null);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedSummary, setEditedSummary] = useState('');
  const [uploadNotice, setUploadNotice] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLoading(true);
      setUploadNotice(`Parsing ${file.name}...`);
      try {
        const parsed = await parseUploadedFile(file);
        if (parsed.parsedResume) {
          loadResume(parsed.parsedResume);
          const result = await executePhase13AiAction('career-profile-extract', { resumeData: parsed.parsedResume });
          setProfile(result);
          setEditedTitle(result.currentTitle);
          setEditedSummary(result.summary);
          setUploadNotice(`✓ Successfully extracted from ${file.name}!`);
        }
      } catch (err) {
        console.error('File parsing error:', err);
        setUploadNotice('Failed to extract file. Please check file format.');
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (journey?.careerProfile) {
      setProfile(journey.careerProfile);
      setEditedTitle(journey.careerProfile.currentTitle);
      setEditedSummary(journey.careerProfile.summary);
    } else {
      extractProfile();
    }
  }, [resumeData]);

  const extractProfile = async () => {
    setLoading(true);
    try {
      const result = await executePhase13AiAction('career-profile-extract', { resumeData });
      setProfile(result);
      setEditedTitle(result.currentTitle);
      setEditedSummary(result.summary);
    } catch (err) {
      console.warn('Extraction error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyAndApprove = async () => {
    if (!profile) return;
    const verifiedProfile = {
      ...profile,
      currentTitle: editedTitle || profile.currentTitle,
      summary: editedSummary || profile.summary,
      verifiedByUser: true,
    };

    // Mark Step 1 as completed
    const completed = Array.from(new Set([...(journey?.completedSteps || []), 1]));
    const updatedJourney = {
      ...journey,
      currentStep: 2,
      completedSteps: completed,
      careerProfile: verifiedProfile,
    };

    await saveJourney(updatedJourney);
    onUpdateJourney(updatedJourney);
    if (onNextStep) onNextStep(2);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-[#6335F5] text-white flex items-center justify-center text-xs font-black">
              1
            </span>
            <h2 className="text-xl font-black text-[#111827]">
              Resume Understanding & Career Profile Verification
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            We extract and structure your core skills, domain expertise, and career highlights from your active resume.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto flex-wrap">
          <label className="btn-primary py-2 px-3 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-sm">
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Resume File</span>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.webp,.txt,.json,.md"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            onClick={extractProfile}
            disabled={loading}
            className="btn-secondary py-2 px-3 text-xs font-bold flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-Extract from Active Resume</span>
          </button>
        </div>
      </div>

      {uploadNotice && (
        <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl flex items-center gap-2 text-xs font-bold text-[#6335F5]">
          <Sparkles className="w-4 h-4 text-[#6335F5]" />
          <span>{uploadNotice}</span>
        </div>
      )}

      {loading && (
        <div className="p-12 text-center bg-purple-50/50 rounded-3xl border border-purple-100 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-8 h-8 text-[#6335F5] animate-spin" />
          <p className="text-sm font-bold text-[#111827]">Analyzing active resume structure...</p>
          <p className="text-xs text-gray-500">Extracting skills, accomplishments, and seniority indicators.</p>
        </div>
      )}

      {!loading && profile && (
        <div className="space-y-5 animate-fade-in">
          {/* Candidate Card */}
          <div className="p-6 rounded-3xl bg-white border border-purple-100 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-purple-50">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#6335F5] font-black text-lg flex items-center justify-center shrink-0">
                  {profile.fullName?.charAt(0) || 'C'}
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#111827]">{profile.fullName}</h3>
                  {editMode ? (
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="mt-1 px-3 py-1 rounded-xl border border-purple-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-400"
                    />
                  ) : (
                    <p className="text-xs font-semibold text-[#6335F5]">{profile.currentTitle}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {profile.seniorityLevel} Level • ~{profile.totalYearsExperience} Yrs Exp
                </span>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-[#6335F5] hover:bg-purple-50"
                  title="Toggle Edit Mode"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Executive Career Summary</label>
              {editMode ? (
                <textarea
                  rows={3}
                  value={editedSummary}
                  onChange={(e) => setEditedSummary(e.target.value)}
                  className="w-full p-3 rounded-2xl border border-purple-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              ) : (
                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                  {profile.summary}
                </p>
              )}
            </div>

            {/* Skills & Domain Expertise Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-purple-50/60 border border-purple-100 space-y-2">
                <h4 className="text-xs font-bold text-[#6335F5] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Extracted Core Skills ({profile.topSkills?.length || 0})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.topSkills?.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white text-purple-900 text-[11px] font-semibold border border-purple-100 shadow-2xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Domain Expertise Areas
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {profile.domainExpertise?.map((area, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white text-emerald-800 text-[11px] font-semibold border border-emerald-100 shadow-2xs">
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Key Achievements */}
            {profile.keyAchievements?.length > 0 && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Key Demonstrated Achievements</h4>
                <ul className="space-y-1">
                  {profile.keyAchievements.map((ach, i) => (
                    <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Verification Call to Action */}
          <div className="p-5 rounded-3xl bg-gradient-to-r from-purple-50 via-white to-purple-50 border border-purple-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <h4 className="text-sm font-black text-[#111827]">
                  {journey?.completedSteps?.includes(1) ? 'Career Profile Verified' : 'Confirm & Save Career Profile'}
                </h4>
                <p className="text-xs text-[#6B7280]">
                  Approving this profile locks your baseline experience for target job matching and interview simulation.
                </p>
              </div>
            </div>

            <button
              onClick={handleVerifyAndApprove}
              className="btn-primary py-2.5 px-6 text-xs sm:text-sm font-bold flex items-center gap-2 shrink-0 hover:scale-102"
            >
              <span>{journey?.completedSteps?.includes(1) ? 'Update & Proceed to Step 2' : 'Verify & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

