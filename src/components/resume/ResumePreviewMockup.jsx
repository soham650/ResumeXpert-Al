import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ZoomIn, ZoomOut, Maximize2, Minimize2, Download, Copy, Check, 
  Palette, FileText, Eye, Edit3, X, Minus, Plus, Loader2, AlertCircle,
  ShieldCheck, LayoutTemplate, ChevronDown, CheckCircle2, Sparkles, CheckCheck
} from 'lucide-react';
import { useResume, TEMPLATES, ACCENT_COLORS } from '../../context/ResumeContext';
import ResumeDocument from '../../templates/ResumeDocument';
import { downloadResumePdf } from '../../utils/pdfDownload';
import { downloadResumeDocx } from '../../utils/docxExport';
import { evaluateResumeATS } from '../../utils/atsAnalyzer';

const TEMPLATE_FONT_META = {
  modern: {
    fontName: 'Inter',
    fontCategory: 'Sans-Serif',
    description: 'Clean modern sans-serif with bold headers, favored by high-growth tech & startups.',
    atsBadge: '100% ATS Favorite',
  },
  professional: {
    fontName: 'Calibri / Segoe UI',
    fontCategory: 'Sans-Serif',
    description: 'Executive corporate layout with balanced line-heights, standard for Fortune 500.',
    atsBadge: '100% ATS Executive',
  },
  classic: {
    fontName: 'Times New Roman',
    fontCategory: 'Serif',
    description: 'Ivy League traditional standard with horizontal dividers, universally parsed.',
    atsBadge: '100% ATS Benchmark',
  },
  minimal: {
    fontName: 'System Clean Sans',
    fontCategory: 'Sans-Serif',
    description: 'Understated elegance with deliberate whitespace and compact reading lines.',
    atsBadge: '100% ATS Clean',
  },
  technical: {
    fontName: 'Consolas / Roboto',
    fontCategory: 'Tech Sans',
    description: 'Prominently surfaces programming languages, cloud stacks, and architecture.',
    atsBadge: '100% ATS Tech',
  },
  academic: {
    fontName: 'Georgia / Garamond',
    fontCategory: 'Serif',
    description: 'Scholarly CV format emphasizing research, education, and credentials.',
    atsBadge: '100% ATS Academic',
  },
};

const ResumePreviewMockup = ({ className = '' }) => {
  const { 
    resumeData, 
    activeTemplate, 
    setActiveTemplate,
    accentColor, 
    setAccentColor,
    getPlainTextForATS
  } = useResume();

  const [zoom, setZoom] = useState(85);
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [showAtsModal, setShowAtsModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [docxSuccess, setDocxSuccess] = useState(false);

  const paperRef = useRef(null);
  const containerRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(877);

  // Dynamically observe and measure unscaled paper content height
  useEffect(() => {
    if (!paperRef.current) return;
    const updateSize = () => {
      if (paperRef.current) {
        setContentHeight(Math.max(877, paperRef.current.scrollHeight));
      }
    };
    updateSize();
    const observer = new ResizeObserver(updateSize);
    observer.observe(paperRef.current);
    return () => observer.disconnect();
  }, [resumeData, activeTemplate]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.template-dropdown-container') && !e.target.closest('.color-picker-container')) {
        setShowTemplateDropdown(false);
        setShowColorPicker(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

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
    
    // Experience entries
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

    return Math.max(1, Math.ceil(score / 700));
  }, [resumeData]);

  // Auto-fit A4 width to viewport container
  const handleFitA4 = () => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 40;
      const fitZoom = Math.min(100, Math.max(50, Math.floor((containerWidth / 620) * 100)));
      setZoom(fitZoom);
    } else {
      setZoom(75);
    }
  };

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
        <div className="bg-[#171527] px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b border-[#2C2844] text-white">
          {/* Left: Template / Font Selector & ATS Badge */}
          <div className="flex items-center gap-2">
            {/* Template & Font Dropdown */}
            <div className="relative template-dropdown-container">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTemplateDropdown(!showTemplateDropdown);
                  setShowColorPicker(false);
                }}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#25223C] hover:bg-[#322c54] border border-[#3D385E] text-white text-xs font-semibold transition-all shadow-sm"
                title="Select ATS Template & Font Family"
                aria-label="Select Template & Font"
              >
                <LayoutTemplate className="w-3.5 h-3.5 text-primary-400 shrink-0" />
                <span className="max-w-[110px] sm:max-w-[130px] truncate text-[11.5px] text-slate-100 font-medium">
                  {TEMPLATES[activeTemplate]?.name || 'Template'}
                </span>
                <span className="text-[10px] text-purple-300 font-normal hidden xl:inline">
                  • {TEMPLATE_FONT_META[activeTemplate]?.fontName || 'Inter'}
                </span>
                <ChevronDown className="w-3 h-3 text-[#A09EB0] shrink-0" />
              </button>

              {showTemplateDropdown && (
                <div className="absolute left-0 top-full mt-2 z-50 w-72 sm:w-80 bg-[#1B182E] border border-[#3B3660] rounded-xl p-2 shadow-2xl animate-fade-in divide-y divide-white/5">
                  <div className="px-2 py-1.5 text-[11px] font-bold text-purple-300 flex items-center justify-between">
                    <span>ATS Layout & Typography</span>
                    <span className="text-[9px] bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-1.5 py-0.5 rounded font-mono">
                      100% ATS FREE
                    </span>
                  </div>
                  <div className="py-1 space-y-1 max-h-80 overflow-y-auto">
                    {Object.values(TEMPLATES).map((tpl) => {
                      const meta = TEMPLATE_FONT_META[tpl.id] || {};
                      const isSelected = activeTemplate === tpl.id;
                      return (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => {
                            setActiveTemplate(tpl.id);
                            setShowTemplateDropdown(false);
                          }}
                          className={`w-full text-left p-2 rounded-lg text-xs transition-colors flex items-start gap-2.5 ${
                            isSelected 
                              ? 'bg-primary-600/30 border border-primary-500/50 text-white' 
                              : 'hover:bg-[#262240] text-slate-300'
                          }`}
                        >
                          <div 
                            className="w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0" 
                            style={{ borderColor: tpl.badgeColor || '#6335F5' }}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-primary-400" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-white">{tpl.name}</span>
                              <span className="text-[10px] text-emerald-400 font-mono">100% ATS</span>
                            </div>
                            <p className="text-[10.5px] text-purple-200 font-mono mt-0.5">
                              Font: {meta.fontName} ({meta.fontCategory})
                            </p>
                            <p className="text-[10px] text-[#A09EB0] line-clamp-1 mt-0.5">
                              {tpl.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ATS Score Indicator */}
            <button
              type="button"
              onClick={() => setShowAtsModal(true)}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#25223C] hover:bg-[#322c54] text-[11px] font-semibold border border-[#353154] text-purple-200 transition-colors cursor-pointer"
              title="Click to view 100% ATS Compatibility Checklist"
              aria-label="View ATS Score & Verification"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>ATS: <strong className="text-white font-mono">{atsReport.totalScore}</strong>/100</span>
              <span className="hidden sm:inline text-[10px] text-emerald-300 font-normal">• 100% Free</span>
            </button>
          </div>

          {/* Center/Right: Zoom Controls & Actions */}
          <div className="flex items-center gap-1.5">
            {/* Zoom Controls with Fit Button */}
            <div className="flex items-center gap-1 bg-[#25223C] px-2 py-0.5 rounded-md text-[11px] text-[#A09EB0] font-mono border border-[#353154]">
              <button
                type="button"
                onClick={handleFitA4}
                className="hover:text-white transition-colors px-1 text-[10px] font-semibold text-purple-300 hover:underline"
                title="Fit A4 Page to Screen Width"
              >
                Fit
              </button>
              <span className="text-[#55507A]">•</span>
              <button
                type="button"
                onClick={() => setZoom(Math.max(50, zoom - 10))}
                className="hover:text-white transition-colors p-0.5"
                title="Zoom Out"
                aria-label="Zoom Out"
              >
                <Minus className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(100)}
                className="w-8 text-center text-white font-medium hover:text-purple-300 transition-colors"
                title="Click to reset to 100% A4 size"
              >
                {zoom}%
              </button>
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

            {/* Color accent indicator */}
            <div className="relative color-picker-container">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowColorPicker(!showColorPicker);
                  setShowTemplateDropdown(false);
                }}
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
                <div className="absolute right-0 top-full mt-2 z-50 bg-[#1E1B2E] border border-[#353154] rounded-xl p-2.5 shadow-2xl flex items-center gap-2 animate-fade-in">
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

            {/* Real PDF Download Button */}
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
                  <span className="hidden sm:inline">PDF...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="hidden sm:inline">Saved</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </>
              )}
            </button>

            {/* DOCX Download Button */}
            <button
              type="button"
              onClick={handleDownloadDocx}
              disabled={isDownloadingDocx}
              className="px-2.5 py-1 rounded-lg bg-[#25223C] hover:bg-[#322d4f] border border-[#3D385E] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
              title="Download Editable Word Document (.docx)"
              aria-label="Download Editable Word Document (.docx)"
              aria-busy={isDownloadingDocx}
            >
              {isDownloadingDocx ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-300" />
                  <span className="hidden sm:inline">DOCX...</span>
                </>
              ) : docxSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span className="hidden sm:inline">Saved</span>
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

        {/* Paper Container Canvas: Full vertical and horizontal unclipped scrolling */}
        <div 
          ref={containerRef}
          className="p-3 sm:p-6 overflow-y-auto overflow-x-auto max-h-[calc(100vh-175px)] min-h-[550px] flex flex-col items-center bg-[#151326]"
        >
          {/* A4 Standard Paper Format & ATS Status Header */}
          <div className="flex items-center justify-between w-full max-w-[620px] mb-3 px-1 text-[11px] text-[#A09EB0] font-mono select-none">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white font-medium">A4 Standard Format</span>
              <span className="text-[#7D7A9C]">(210 × 297 mm)</span>
              <span className="text-[#4E4A72]">•</span>
              <span className="text-purple-300 font-sans hidden sm:inline">
                {TEMPLATES[activeTemplate]?.name}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                100% ATS FREE
              </span>
              <span className="text-slate-300">
                {estimatedPages} {estimatedPages === 1 ? 'Page' : 'Pages'}
              </span>
            </div>
          </div>

          {/* Scaled Sheet Wrapper: dynamically provides exact scroll height to prevent ANY cutoff */}
          <div
            className="w-full flex justify-center pb-24 sm:pb-32"
            style={{
              height: `${Math.round(contentHeight * (zoom / 100)) + 60}px`,
              minHeight: `${Math.round(877 * (zoom / 100)) + 60}px`,
            }}
          >
            <div
              ref={paperRef}
              className="w-[620px] bg-white text-gray-900 rounded-sm shadow-[0_16px_50px_rgba(0,0,0,0.55)] border border-gray-200 select-text transition-transform duration-150 origin-top shrink-0 relative"
              style={{
                minHeight: '877px', // Standard A4 Aspect Ratio 210mm x 297mm (620 x 1.4142)
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
              }}
            >
              <ResumeDocument 
                data={resumeData} 
                template={activeTemplate} 
                accentColor={accentColor} 
              />

              {/* Visual Multi-page Boundary Marker if content exceeds 1 A4 Page */}
              {contentHeight > 890 && (
                <div 
                  className="absolute left-0 right-0 border-b border-dashed border-red-300 pointer-events-none flex items-center justify-center print:hidden"
                  style={{ top: '877px' }}
                >
                  <span className="bg-red-50 text-red-700 border border-red-200 text-[9px] font-mono font-medium px-2.5 py-0.5 rounded-full shadow-sm -mt-2.5">
                    --- A4 Page 1 End • Page 2 Begins ---
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 100% ATS Compliance Modal */}
      {showAtsModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-[#1E1B2E] border border-[#3B3660] rounded-2xl max-w-lg w-full p-6 shadow-2xl text-white">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">100% ATS-Compliant Guarantee</h3>
                  <p className="text-xs text-purple-300">Audited against Workday, Taleo, Greenhouse & Lever</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAtsModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-200">Single-Column Linear Parsing: 100% Pass</span>
                  <p className="text-emerald-300/80 mt-0.5">No complex multi-column grids or floating text frames that scramble recruiter ATS parsers.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-200">Standard ATS Section Headers: 100% Pass</span>
                  <p className="text-emerald-300/80 mt-0.5">Universal headings: PROFESSIONAL SUMMARY, WORK EXPERIENCE, EDUCATION, SKILLS, PROJECTS, CERTIFICATIONS.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-200">Standard ATS Typography: 100% Pass</span>
                  <p className="text-emerald-300/80 mt-0.5">Using system & web safe fonts ({TEMPLATE_FONT_META[activeTemplate]?.fontName || 'Inter'}) readable by any applicant parser.</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-emerald-200">Machine-Readable Contact & Links: 100% Pass</span>
                  <p className="text-emerald-300/80 mt-0.5">Email, phone, LinkedIn, GitHub and portfolio URLs structured for instant contact extraction.</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Current Score: <strong className="text-emerald-400 font-mono text-sm">{atsReport.totalScore}/100</strong></span>
              <button
                type="button"
                onClick={() => setShowAtsModal(false)}
                className="btn-primary py-2 px-4 text-xs"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

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
                  Template: {TEMPLATES[activeTemplate]?.name || 'Classic ATS'} • Font: {TEMPLATE_FONT_META[activeTemplate]?.fontName} • {estimatedPages} {estimatedPages === 1 ? 'Page' : 'Pages'}
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

          <div className="flex-1 overflow-y-auto overflow-x-auto flex flex-col items-center p-4 sm:p-8 pb-32">
            <div className="bg-white rounded shadow-2xl max-w-[850px] w-full text-gray-900 border border-gray-200 p-2 sm:p-6 select-text mb-20">
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