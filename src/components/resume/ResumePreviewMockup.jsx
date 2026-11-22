import React, { useState, useEffect, useMemo } from 'react';
import { 
  ZoomIn, ZoomOut, Maximize2, Minimize2, Download, Copy, Check, 
  Palette, FileText, Eye, Edit3, X, Minus, Plus, Loader2, AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { useResume, TEMPLATES, ACCENT_COLORS } from '../../context/ResumeContext';
import ResumeDocument from '../../templates/ResumeDocument';
import { downloadResumePdf } from '../../utils/pdfDownload';
import { downloadResumeDocx } from '../../utils/docxExport';
import { evaluateResumeATS } from '../../utils/atsAnalyzer';

const ResumePreviewMockup = ({ className = '' }) => {
  const { 
    resumeData, 
    activeTemplate, 
    accentColor, 
    setAccentColor,
    getPlainTextForATS
  } = useResume();

  const [zoom, setZoom] = useState(100);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [docxSuccess, setDocxSuccess] = useState(false);

  // ATS Evaluation
  const atsReport = useMemo(() => {
    try {
      return evaluateResumeATS(resumeData);
    } catch {
      return { totalScore: 0, ratingTier: 'Needs Review' };
    }
  }, [resumeData]);

  // Dynamic estimated page calculation based on content sections
  const estimatedPages = useMemo(() => {
    let score = 0;
    // Header & summary
    score += 150;
    if (resumeData.summary || resumeData.professionalSummary) score += 80;
    
    // Experience entries (each ~120 units + 30 per bullet)
    const exps = resumeData.workExperience || resumeData.experience || [];
    exps.forEach(e => {
      score += 80;
      score += (e.achievements || []).filter(Boolean).length * 25;
    });

    // Education
    score += (resumeData.education || []).length * 60;

    // Skills
    score += (resumeData.skills || []).length * 40;

    // Projects
    const projs = resumeData.projects || [];
    projs.forEach(p => {
      score += 70;
      score += (p.achievements || []).filter(Boolean).length * 20;
    });

    // Certifications
    score += (resumeData.certifications || []).length * 25;

    // A4 standard printable units threshold ~720
    return Math.max(1, Math.ceil(score / 700));
  }, [resumeData]);

  const handleCopyText = () => {
    const text = getPlainTextForATS();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPdf = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadError(null);
    setDownloadSuccess(false);

    try {
      await downloadResumePdf(resumeData, activeTemplate, accentColor);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('PDF Download failed:', err);
      setDownloadError(err.message || 'Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (isDownloadingDocx) return;
    setIsDownloadingDocx(true);
    setDownloadError(null);
    setDocxSuccess(false);

    try {
      await downloadResumeDocx(resumeData, activeTemplate, accentColor);
      setDocxSuccess(true);
      setTimeout(() => setDocxSuccess(false), 3000);
    } catch (err) {
      console.error('DOCX Download failed:', err);
      setDownloadError(err.message || 'Failed to generate Word document. Please try again.');
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  return (
    <>
      <div className={`flex flex-col rounded-2xl overflow-hidden border border-border-subtle shadow-card bg-[#1E1B2E] ${className}`}>
        {/* Dark Preview Toolbar */}
        <div className="bg-[#171527] px-4 py-2.5 flex items-center justify-between border-b border-[#2C2844] text-white">
          {/* Left: Preview Title & Pagination & Zoom */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-white tracking-wide">
              Preview
            </span>
            <div className="flex items-center gap-2 bg-[#25223C] px-2 py-0.5 rounded-md text-[11px] text-[#A09EB0] font-mono border border-[#353154]">
              <span title="Estimated PDF pages based on content">
                {estimatedPages} {estimatedPages === 1 ? 'Page' : 'Pages'}
              </span>
              <span className="text-[#55507A]">•</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setZoom(Math.max(60, zoom - 10))}
                  className="hover:text-white transition-colors p-0.5"
                  title="Zoom Out"
                  aria-label="Zoom Out"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-9 text-center text-white font-medium">{zoom}%</span>
                <button
                  type="button"
                  onClick={() => setZoom(Math.min(140, zoom + 10))}
                  className="hover:text-white transition-colors p-0.5"
                  title="Zoom In"
                  aria-label="Zoom In"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* ATS Score Indicator */}
            <div 
              className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#25223C] text-[11px] font-semibold border border-[#353154] text-purple-200"
              title={`ATS Compatibility Score: ${atsReport.totalScore}/100 (${atsReport.ratingTier})`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-primary-400" />
              <span>ATS: <strong className="text-white font-mono">{atsReport.totalScore}</strong>/100</span>
            </div>
          </div>

          {/* Right: Actions (Template / Palette / ATS Copy / PDF / Fullscreen) */}
          <div className="flex items-center gap-1.5">
            {/* Color accent indicator */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="p-1.5 rounded-lg hover:bg-[#25223C] text-[#A09EB0] hover:text-white transition-colors"
                title="Accent Color"
                aria-label="Change Accent Color"
              >
                <div 
                  className="w-3.5 h-3.5 rounded-full border border-white/50 shadow-sm"
                  style={{ backgroundColor: accentColor }}
                />
              </button>

              {showColorPicker && (
                <div className="absolute right-0 top-full mt-2 z-40 bg-[#1E1B2E] border border-[#353154] rounded-xl p-2.5 shadow-2xl flex items-center gap-2 animate-fade-in">
                  {ACCENT_COLORS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => {
                        setAccentColor(color.hex);
                        setShowColorPicker(false);
                      }}
                      className={`w-5 h-5 rounded-full transition-transform hover:scale-125 border ${
                        accentColor === color.hex ? 'ring-2 ring-white scale-110' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Copy ATS Text */}
            <button
              type="button"
              onClick={handleCopyText}
              className="p-1.5 rounded-lg hover:bg-[#25223C] text-[#A09EB0] hover:text-white transition-colors text-xs flex items-center gap-1"
              title="Copy ATS-Friendly Plain Text"
              aria-label="Copy ATS-Friendly Plain Text"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Real PDF Download Button via @react-pdf/renderer */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="px-2.5 py-1 rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Download ATS-Friendly PDF"
              aria-label="Download ATS-Friendly PDF"
              aria-busy={isDownloading}
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>PDF Saved</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </>
              )}
            </button>

            {/* Editable DOCX Download Button via docx */}
            <button
              type="button"
              onClick={handleDownloadDocx}
              disabled={isDownloadingDocx}
              className="px-2.5 py-1 rounded-lg bg-[#25223C] hover:bg-[#322d4f] border border-[#3D385E] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Download Editable Microsoft Word DOCX"
              aria-label="Download Editable Word Document (.docx)"
              aria-busy={isDownloadingDocx}
            >
              {isDownloadingDocx ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-300" />
                  <span>DOCX...</span>
                </>
              ) : docxSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>DOCX Saved</span>
                </>
              ) : (
                <>
                  <FileText className="w-3.5 h-3.5 text-blue-300" />
                  <span>DOCX</span>
                </>
              )}
            </button>

            {/* Fullscreen Preview */}
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-1.5 rounded-lg hover:bg-[#25223C] text-[#A09EB0] hover:text-white transition-colors"
              title="Open Fullscreen View"
              aria-label="Open Fullscreen View"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Error notification banner if PDF download fails */}
        {downloadError && (
          <div className="bg-rose-900/80 border-b border-rose-700 px-4 py-2 text-rose-200 text-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-rose-300 shrink-0" />
              <span>{downloadError}</span>
            </div>
            <button
              type="button"
              onClick={() => setDownloadError(null)}
              className="text-rose-300 hover:text-white text-xs ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Paper Container Canvas */}
        <div className="p-4 sm:p-6 overflow-auto max-h-[calc(100vh-210px)] min-h-[500px] flex justify-center bg-[#242138]/60">
          <div
            className="w-full max-w-[560px] bg-white rounded-md shadow-2xl transition-transform duration-200 origin-top overflow-hidden border border-white/20 select-text"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
            }}
          >
            <ResumeDocument 
              data={resumeData} 
              template={activeTemplate} 
              accentColor={accentColor} 
            />
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen Resume Preview"
        >
          <div className="flex items-center justify-between pb-4 max-w-5xl w-full mx-auto">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center text-white">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {resumeData.personalInfo?.fullName || 'Resume'} — Live ATS Preview
                </h3>
                <p className="text-xs text-[#A09EB0]">
                  Template: {TEMPLATES[activeTemplate]?.name || 'Classic ATS'} • {estimatedPages} {estimatedPages === 1 ? 'Page' : 'Pages'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isDownloading}
                className="btn-primary flex items-center gap-2"
              >
                {isDownloading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Generating PDF...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                title="Close Fullscreen"
                aria-label="Close Fullscreen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-auto flex justify-center p-4">
            <div className="bg-white rounded-md shadow-2xl max-w-[850px] w-full h-fit my-auto select-text">
              <ResumeDocument 
                data={resumeData} 
                template={activeTemplate} 
                accentColor={accentColor} 
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Mobile Toggle (Edit Mode vs Preview Mode)
export const MobilePreviewToggle = ({ activeTab, onTabChange }) => (
  <div className="lg:hidden flex bg-white rounded-xl border border-border-light p-1 mb-4 shadow-subtle">
    <button
      type="button"
      onClick={() => onTabChange('edit')}
      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
        activeTab === 'edit'
          ? 'bg-primary-600 text-white shadow-sm'
          : 'text-body hover:text-heading'
      }`}
    >
      <Edit3 className="w-4 h-4" />
      Edit Form
    </button>
    <button
      type="button"
      onClick={() => onTabChange('preview')}
      className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all ${
        activeTab === 'preview'
          ? 'bg-primary-600 text-white shadow-sm'
          : 'text-body hover:text-heading'
      }`}
    >
      <Eye className="w-4 h-4" />
      Live Preview
    </button>
  </div>
);

export default ResumePreviewMockup;
