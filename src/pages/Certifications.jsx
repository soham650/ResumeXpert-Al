import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Award, Plus, X, CheckCircle2, AlertCircle, 
  Printer, Download, Copy, Check, ArrowUp, ArrowDown, Edit2, Sparkles, Loader2,
  ShieldCheck
} from 'lucide-react';
import FormCard from '../components/ui/FormCard';
import TipCard from '../components/ui/TipCard';
import NavigationButtons from '../components/ui/NavigationButtons';
import { useResume } from '../context/ResumeContext';
import { certificationsSchema } from '../schema/validation';

const SUGGESTED_CERTIFICATIONS = [
  'AWS Certified Cloud Practitioner',
  'Google Cloud Associate Engineer',
  'Meta Front-End Developer',
  'Certified Kubernetes Administrator (CKA)',
  'HashiCorp Terraform Associate',
  'Project Management Professional (PMP)',
];

const atsRules = [
  { text: 'Single-column layout (Standard ATS format)', pass: true },
  { text: 'Standard headings recognizable by parsers', pass: true },
  { text: 'Clean bullet points without breaking symbols', pass: true },
  { text: 'Structured contact details & verified links', pass: true },
  { text: 'Zero nested tables or graphical barriers', pass: true },
];

const STEP_MAP = {
  personal: 1,
  summary: 2,
  experience: 3,
  education: 4,
  skills: 5,
  projects: 6,
  certifications: 7,
};

const Certifications = ({ onNext, onPrevious, onStepSelect, onOpenAnalyzer }) => {
  const { 
    resumeData, 
    updateCertifications, 
    calculateCompletion,
    printResume,
    downloadJson,
    downloadPdf,
    downloadDocx,
    getPlainTextForATS
  } = useResume();

  const certificationList = resumeData.certifications || [];
  const [newCertInput, setNewCertInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingValue, setEditingValue] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);
  const [downloadError, setDownloadError] = useState(null);

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(certificationsSchema),
    defaultValues: {
      certifications: certificationList,
    },
    mode: 'onTouched',
  });

  const currentCerts = watch('certifications') || [];

  // Real-time synchronization to Zustand store for instant live preview updates
  useEffect(() => {
    const subscription = watch((values) => {
      if (values.certifications) {
        updateCertifications(values.certifications);
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updateCertifications]);

  const { percentage, checklist } = calculateCompletion();

  const handleAddCertification = (customName = '') => {
    const target = (customName || newCertInput || '').trim();
    if (!target) {
      setInputError('Certification name cannot be empty');
      return;
    }
    if (currentCerts.some((c) => (typeof c === 'string' ? c : c?.name || '').toLowerCase() === target.toLowerCase())) {
      setInputError(`"${target}" is already in your certifications`);
      return;
    }

    setInputError('');
    const updated = [...currentCerts, target];
    setValue('certifications', updated, { shouldValidate: true });
    updateCertifications(updated);
    if (!customName) {
      setNewCertInput('');
    }
  };

  const handleRemoveCertification = (index) => {
    const updated = currentCerts.filter((_, i) => i !== index);
    setValue('certifications', updated, { shouldValidate: true });
    updateCertifications(updated);
    if (editingIndex === index) {
      setEditingIndex(null);
    }
  };

  const handleMoveCertification = (fromIdx, toIdx) => {
    if (toIdx < 0 || toIdx >= currentCerts.length) return;
    const list = [...currentCerts];
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);
    setValue('certifications', list, { shouldValidate: true });
    updateCertifications(list);
  };

  const handleStartEdit = (index, currentVal) => {
    setEditingIndex(index);
    setEditingValue(typeof currentVal === 'string' ? currentVal : (currentVal?.certificateName || currentVal?.name || ''));
  };

  const handleSaveEdit = (index) => {
    const trimmed = editingValue.trim();
    if (!trimmed) {
      handleRemoveCertification(index);
      return;
    }
    const list = [...currentCerts];
    list[index] = trimmed;
    setValue('certifications', list, { shouldValidate: true });
    updateCertifications(list);
    setEditingIndex(null);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCertification();
    }
  };

  const onValidSubmit = (data) => {
    updateCertifications(data.certifications || []);
    onNext();
  };

  const handlePreviousClick = () => {
    updateCertifications(currentCerts);
    onPrevious();
  };

  const handleDownloadPdf = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    setDownloadError(null);
    try {
      if (downloadPdf) {
        await downloadPdf();
      } else {
        printResume();
      }
    } catch (err) {
      console.error('Download failed:', err);
      setDownloadError(err.message || 'Failed to download PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (isDownloadingDocx) return;
    setIsDownloadingDocx(true);
    setDownloadError(null);
    try {
      if (downloadDocx) {
        await downloadDocx();
      }
    } catch (err) {
      console.error('DOCX Download failed:', err);
      setDownloadError(err.message || 'Failed to download DOCX. Please try again.');
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  const handleCopyText = () => {
    const text = getPlainTextForATS();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <form onSubmit={handleSubmit(onValidSubmit)} noValidate className="space-y-6">
      {/* Certifications Card */}
      <FormCard
        icon={Award}
        title="Certifications & Credentials"
        subtitle="Add professional certificates, licenses, and verified credentials"
      >
        {/* Quick Suggestions for Certifications */}
        <div className="mb-4 p-3.5 bg-surface-50 border border-border-light rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-bold text-heading mb-2">
            <Sparkles className="w-3.5 h-3.5 text-primary-600" />
            <span>Popular Certifications</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {SUGGESTED_CERTIFICATIONS.map((cert) => {
              const exists = currentCerts.some(
                (c) => (typeof c === 'string' ? c : (c?.certificateName || c?.name || '')).toLowerCase() === cert.toLowerCase()
              );
              return (
                <button
                  key={cert}
                  type="button"
                  disabled={exists}
                  onClick={() => handleAddCertification(cert)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all ${
                    exists
                      ? 'bg-surface-200 text-body/60 border border-transparent cursor-not-allowed'
                      : 'bg-white hover:bg-primary-50 text-heading hover:text-primary-700 border border-border-subtle shadow-xs hover:border-primary-300 font-medium'
                  }`}
                >
                  {exists ? `✓ ${cert}` : `+ ${cert}`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Existing Certifications List */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-sm font-semibold text-heading">
              Your Certifications
            </label>
            <span className="text-xs text-body">
              {currentCerts.length} credential(s)
            </span>
          </div>

          {currentCerts.map((cert, index) => {
            const isEditing = editingIndex === index;

            return (
              <div
                key={index}
                className="flex items-center justify-between gap-3 p-3 sm:p-3.5 bg-surface-50 rounded-xl border border-border-light group hover:border-primary-300 transition-all"
              >
                {isEditing ? (
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="text"
                      value={editingValue}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleSaveEdit(index);
                        }
                      }}
                      autoFocus
                      className="flex-1 rounded-lg border border-primary-500 bg-white px-3 py-1.5 text-xs text-heading focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleSaveEdit(index)}
                      className="px-2.5 py-1 rounded-md text-xs font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="w-6 h-6 rounded-md bg-primary-100/70 text-primary-700 flex items-center justify-center text-[11px] font-bold shrink-0">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-heading font-medium truncate">
                      {typeof cert === 'string' ? cert : (cert?.certificateName || cert?.name || cert?.title || String(cert))}
                    </span>
                  </div>
                )}

                {/* Reorder and Action Controls */}
                <div className="flex items-center gap-0.5 shrink-0">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => handleMoveCertification(index, index - 1)}
                    aria-label="Move certification up"
                    title="Move certification up"
                    className="p-1 text-body hover:text-heading hover:bg-surface-100 rounded disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === currentCerts.length - 1}
                    onClick={() => handleMoveCertification(index, index + 1)}
                    aria-label="Move certification down"
                    title="Move certification down"
                    className="p-1 text-body hover:text-heading hover:bg-surface-100 rounded disabled:opacity-20 disabled:cursor-not-allowed transition-all"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(index, cert)}
                      aria-label="Edit certification"
                      title="Edit certification"
                      className="p-1 text-body hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveCertification(index)}
                    aria-label={`Remove ${typeof cert === 'string' ? cert : (cert?.certificateName || cert?.name || 'credential')}`}
                    title={`Remove ${typeof cert === 'string' ? cert : (cert?.certificateName || cert?.name || 'credential')}`}
                    className="p-1 text-body hover:text-rose-500 hover:bg-rose-50 rounded transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {currentCerts.length === 0 && (
            <p className="text-xs text-body italic py-2">
              No certifications added yet. (Optional)
            </p>
          )}
        </div>

        {/* Input & Add Button */}
        <div>
          <div className="flex gap-2.5">
            <input
              type="text"
              value={newCertInput}
              onChange={(e) => {
                setNewCertInput(e.target.value);
                if (inputError) setInputError('');
              }}
              onKeyDown={handleKeyDown}
              placeholder="e.g. AWS Certified Solutions Architect"
              className={`flex-1 rounded-xl border bg-white px-4 py-2.5 text-sm text-heading placeholder:text-[#A09EB0] focus:outline-none focus:ring-2 transition-all ${
                inputError
                  ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-500/20'
                  : 'border-border-light focus:ring-primary-500/20 focus:border-primary-600'
              }`}
            />
            <button
              type="button"
              onClick={() => handleAddCertification()}
              className="btn-primary py-2.5 px-4 text-xs font-bold shrink-0 inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Certification</span>
            </button>
          </div>
          {inputError && (
            <p className="text-xs font-semibold text-rose-500 mt-1.5" role="alert">
              {inputError}
            </p>
          )}
          {errors.certifications?.message && (
            <p className="text-xs font-semibold text-rose-500 mt-1.5" role="alert">
              {errors.certifications.message}
            </p>
          )}
        </div>
      </FormCard>

      {/* Resume Completeness & Section Review Card */}
      <FormCard
        icon={CheckCircle2}
        title="Resume Health & Section Review"
        subtitle="Click any section below to jump directly to it"
      >
        <div className="mb-5 p-4 rounded-xl bg-surface-50 border border-border-light">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold text-heading">Overall Resume Strength</span>
            <span className="text-sm font-bold text-primary-600">{percentage}%</span>
          </div>
          <div className="w-full h-2.5 bg-surface-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-primary-600 transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle flex-wrap gap-2">
            <p className="text-xs text-body">
              {percentage >= 80
                ? '✨ Excellent! Your resume has all core components for maximum ATS score.'
                : 'Complete the remaining sections to maximize recruiter callbacks.'}
            </p>
            {onOpenAnalyzer && (
              <button
                type="button"
                onClick={onOpenAnalyzer}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary-700 hover:bg-primary-100 text-xs font-bold border border-primary-200 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-primary-600" />
                <span>Run Full ATS Analyzer</span>
              </button>
            )}
          </div>
        </div>

        {/* Section Checklist with Direct Navigation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {checklist.map((item) => {
            const stepNum = STEP_MAP[item.id] || 1;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onStepSelect && onStepSelect(stepNum)}
                className={`flex items-center justify-between p-3 rounded-xl border text-xs font-semibold transition-all text-left hover:scale-[1.01] active:scale-[0.99] ${
                  item.completed
                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800 hover:bg-emerald-100/70'
                    : 'bg-surface-50 border-border-light text-body hover:border-primary-300 hover:bg-primary-50/40'
                }`}
                title={`Jump to ${item.title}`}
              >
                <div className="flex items-center gap-2 truncate">
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  )}
                  <span className="truncate">{item.title}</span>
                </div>
                <span className="text-[10px] text-body/60 ml-2 whitespace-nowrap">
                  {item.completed ? 'Edit' : 'Fill'} →
                </span>
              </button>
            );
          })}
        </div>

        {/* ATS Parsing Rules */}
        <div className="pt-4 border-t border-border-subtle space-y-2">
          {atsRules.map((rule, idx) => (
            <div key={idx} className="flex items-center gap-2 text-xs text-heading">
              <Check className="w-3.5 h-3.5 text-primary-600 stroke-[3]" />
              <span>{rule.text}</span>
            </div>
          ))}
        </div>
      </FormCard>

      {/* Action Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-xl shadow-primary-600/10">
        <h3 className="text-lg font-bold mb-1">Download Your ATS-Ready Resume</h3>
        <p className="text-xs text-white/90 mb-4 leading-relaxed">
          Export your formatted vector PDF ready to apply across all major job portals.
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            aria-busy={isDownloading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-primary-700 font-bold text-sm shadow-md hover:bg-surface-50 transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
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
            onClick={handleDownloadDocx}
            disabled={isDownloadingDocx}
            aria-busy={isDownloadingDocx}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-800/90 hover:bg-primary-900 text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] disabled:opacity-60 cursor-pointer border border-white/20"
          >
            {isDownloadingDocx ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Generating DOCX...</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4 text-purple-200" />
                <span>Download DOCX</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-800/80 hover:bg-primary-800 text-white font-medium text-xs border border-white/20 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-300" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy ATS Text</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={downloadJson}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-800/80 hover:bg-primary-800 text-white font-medium text-xs border border-white/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      <TipCard
        title="Tip"
        tips={[
          'Always submit your resume in PDF format unless a recruiter specifies another format.',
          'Review all contact information, dates, and spelling before submitting applications.',
        ]}
      />

      <NavigationButtons
        onNext={handleSubmit(onValidSubmit)}
        onPrevious={handlePreviousClick}
        showPrevious={true}
        isLastStep={true}
        nextLabel="Complete Resume"
      />
    </form>
  );
};

export default Certifications;
