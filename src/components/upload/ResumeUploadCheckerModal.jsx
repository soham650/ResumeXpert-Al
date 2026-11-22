import React, { useState, useRef } from 'react';
import {
  X, UploadCloud, FileText, CheckCircle2, AlertTriangle, ShieldCheck,
  Sparkles, ArrowRight, RefreshCw, FileCheck, Award, Briefcase,
  GraduationCap, Code2, AlertCircle, Eye, Download, Check
} from 'lucide-react';
import { parseUploadedFile } from '../../utils/fileResumeParser';
import { useResume } from '../../context/ResumeContext';

export default function ResumeUploadCheckerModal({
  isOpen,
  onClose,
  onOpenBuilder,
  onOpenAnalyzer,
  onOpenAiCareer,
}) {
  const { loadResume } = useResume();

  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [imported, setImported] = useState(false);
  const inputRef = useRef(null);

  if (!isOpen) return null;

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = async (selectedFile) => {
    setError(null);
    setFile(selectedFile);
    setLoading(true);
    setResult(null);
    setImported(false);

    try {
      const parsedData = await parseUploadedFile(selectedFile);
      setResult(parsedData);
    } catch (err) {
      console.error('File parsing error:', err);
      setError('Unable to parse this file. Please verify it is a valid PDF, DOCX, TXT, JSON, or Image resume.');
    } finally {
      setLoading(false);
    }
  };

  const handleImportToBuilder = () => {
    if (!result?.parsedResume) return;
    loadResume(result.parsedResume);
    setImported(true);
    setTimeout(() => {
      onClose();
      if (onOpenBuilder) onOpenBuilder(1);
    }, 600);
  };

  const handleOpenDetailedAts = () => {
    if (result?.parsedResume) {
      loadResume(result.parsedResume);
    }
    onClose();
    if (onOpenAnalyzer) onOpenAnalyzer();
  };

  const handleStartCareerJourney = () => {
    if (result?.parsedResume) {
      loadResume(result.parsedResume);
    }
    onClose();
    if (onOpenAiCareer) onOpenAiCareer();
  };

  const handleReset = () => {
    setFile(null);
    setResult(null);
    setError(null);
    setImported(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const audit = result?.audit;
  const p = result?.parsedResume?.personalInfo;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl border border-border-light shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50/50 via-white to-indigo-50/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EDE9FE] text-[#6335F5] flex items-center justify-center shadow-sm">
              <UploadCloud className="w-5 h-5 text-[#6335F5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-[#111827]">
                  Upload Resume & Free ATS Check
                </h3>
                <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full border border-emerald-200">
                  100% Free
                </span>
              </div>
              <p className="text-xs text-[#6B7280]">
                Supports PDF, Word (.docx), Images (JPG/PNG), and Text. Instant correctness audit.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* File Upload Dropzone (When not loaded or reset) */}
          {!result && !loading && (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                dragActive
                  ? 'border-[#6335F5] bg-purple-50/70 scale-[0.99]'
                  : 'border-purple-200 hover:border-[#6335F5] bg-purple-50/30 hover:bg-purple-50/60'
              }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".pdf,.docx,.doc,.jpg,.jpeg,.png,.webp,.txt,.json,.md"
                onChange={handleChange}
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-white border border-purple-100 shadow-md flex items-center justify-center text-[#6335F5] group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-8 h-8 text-[#6335F5]" />
                </div>

                <div>
                  <h4 className="text-base sm:text-lg font-bold text-[#111827]">
                    Drag & drop your resume file here
                  </h4>
                  <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
                    or <span className="text-[#6335F5] font-bold underline">browse files</span> from your computer
                  </p>
                </div>

                {/* Formats badges */}
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-rose-600 border border-rose-200 shadow-xs flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> PDF
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-blue-600 border border-blue-200 shadow-xs flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> DOCX / Word
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-purple-600 border border-purple-200 shadow-xs flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> JPG / PNG Image
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-gray-700 border border-gray-200 shadow-xs flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" /> TXT / JSON
                  </span>
                </div>

                <div className="flex items-center gap-4 text-[11px] text-[#9CA3AF] pt-2">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Private & Secure
                  </span>
                  <span>•</span>
                  <span>No Registration Required</span>
                  <span>•</span>
                  <span>Max File Size 15MB</span>
                </div>
              </div>
            </div>
          )}

          {/* Loading Extraction Progress */}
          {loading && (
            <div className="p-12 text-center bg-purple-50/40 rounded-3xl border border-purple-100 flex flex-col items-center justify-center space-y-4">
              <RefreshCw className="w-10 h-10 text-[#6335F5] animate-spin" />
              <div>
                <h4 className="text-base font-bold text-[#111827]">
                  Extracting & Auditing {file?.name}...
                </h4>
                <p className="text-xs text-[#6B7280] mt-1">
                  Parsing text, structure, skills, and scoring ATS compatibility.
                </p>
              </div>
              <div className="w-48 bg-purple-100 rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#6335F5] h-full w-2/3 animate-pulse rounded-full" />
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-sm">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Parsed & Audited Results View */}
          {result && !loading && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Top Score Banner */}
              <div className="bg-gradient-to-r from-purple-50 via-indigo-50/40 to-white rounded-3xl p-5 border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  {/* Circular Score Badge */}
                  <div className="relative w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-white border border-purple-200 shadow-md flex flex-col items-center justify-center shrink-0">
                    <span
                      className="text-2xl sm:text-3xl font-black"
                      style={{ color: audit?.badgeColor || '#6335F5' }}
                    >
                      {audit?.totalScore || 85}
                    </span>
                    <span className="text-[10px] uppercase font-bold text-[#6B7280]">
                      ATS Score
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#6335F5]">
                        {result.fileName}
                      </span>
                      <span className="text-[10px] bg-purple-100 text-[#6335F5] px-2 py-0.5 rounded-full font-bold uppercase">
                        {audit?.ratingTier || 'Good'}
                      </span>
                    </div>
                    <h4 className="text-base sm:text-lg font-black text-[#111827] mt-0.5">
                      {p?.fullName || 'Candidate Profile'} — {p?.jobTitle || 'Software Engineer'}
                    </h4>
                    <p className="text-xs text-[#4B5563] mt-0.5">
                      {audit?.summaryHeadline || 'Resume parsed successfully with strong structural layout.'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="text-xs font-bold text-[#6B7280] hover:text-[#111827] flex items-center gap-1.5 p-2 rounded-xl hover:bg-white/80 transition-colors shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Check Another File</span>
                </button>
              </div>

              {/* Correctness & ATS Audit Checklist */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h5 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#6335F5]" />
                    <span>Correctness & ATS Audit Checklist</span>
                  </h5>
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {audit?.checklist?.filter((c) => c.status === 'pass').length || 0} / {audit?.checklist?.length || 7} Passed
                  </span>
                </div>

                <div className="divide-y divide-gray-50">
                  {audit?.checklist?.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        {item.status === 'pass' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                        )}
                        <span className="font-bold text-[#111827]">{item.label}</span>
                      </div>
                      <span className="text-[#6B7280] text-right font-medium text-[11px] max-w-[260px] truncate">
                        {item.detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detected Skills Cloud */}
              {audit?.skillsDetected && audit.skillsDetected.length > 0 && (
                <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-xs space-y-2">
                  <h5 className="text-xs font-black text-[#111827] uppercase tracking-wider flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#6335F5]" />
                    <span>Skills & Technologies Identified ({audit.skillsDetected.length})</span>
                  </h5>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {audit.skillsDetected.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-50 text-[#6335F5] border border-purple-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggestions / Formatting Notes */}
              {audit?.formattingNotes && audit.formattingNotes.length > 0 && (
                <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-black text-amber-800 uppercase">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>High-Impact Recommendations</span>
                  </div>
                  <ul className="text-xs text-amber-900 space-y-1 list-disc list-inside">
                    {audit.formattingNotes.map((note, nIdx) => (
                      <li key={nIdx}>{note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer with Action Buttons */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-[#6B7280]">
            {result ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Ready to edit, optimize, or export!
              </span>
            ) : (
              <span>Your file stays on your device. 100% private.</span>
            )}
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            {result && (
              <>
                <button
                  type="button"
                  onClick={handleOpenDetailedAts}
                  className="btn-secondary py-2 px-3 text-xs font-bold flex items-center gap-1.5 shrink-0"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-[#6335F5]" />
                  <span>Full ATS Analyzer</span>
                </button>

                <button
                  type="button"
                  onClick={handleImportToBuilder}
                  disabled={imported}
                  className="btn-primary py-2 px-4 text-xs font-bold flex items-center gap-1.5 shadow-md flex-1 sm:flex-initial justify-center"
                >
                  {imported ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Imported! Opening...</span>
                    </>
                  ) : (
                    <>
                      <ArrowRight className="w-4 h-4" />
                      <span>Import into Resume Builder</span>
                    </>
                  )}
                </button>
              </>
            )}

            {!result && (
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary py-2 px-4 text-xs font-bold"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

