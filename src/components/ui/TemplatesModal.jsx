import React, { useEffect } from 'react';
import { X, Check, LayoutTemplate, Sparkles, ShieldCheck } from 'lucide-react';
import { useResume, TEMPLATES, ACCENT_COLORS } from '../../context/ResumeContext';

const TemplatesModal = ({ isOpen, onClose }) => {
  const { activeTemplate, setActiveTemplate, accentColor, setAccentColor } = useResume();

  // Handle Escape key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div 
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-modal-title"
        className="bg-white rounded-3xl border border-border-light shadow-2xl max-w-4xl w-full p-5 sm:p-8 max-h-[92vh] overflow-y-auto relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border-subtle sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 shadow-sm">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="template-modal-title" className="text-lg sm:text-xl font-bold text-heading">
                  Resume Template Collection
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  100% ATS Compliant
                </span>
              </div>
              <p className="text-xs text-body mt-0.5">
                Switch between professional formats without losing any resume data. Supports PDF & DOCX export.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close template modal"
            className="p-2 rounded-xl text-body hover:text-heading hover:bg-surface-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Templates Grid (6 ATS-Compliant Templates) */}
        <div className="py-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.values(TEMPLATES).map((tmpl) => {
              const isSelected = activeTemplate === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => setActiveTemplate(tmpl.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveTemplate(tmpl.id);
                    }
                  }}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/20 flex flex-col justify-between ${
                    isSelected
                      ? 'border-primary-600 bg-primary-50/40 shadow-glow'
                      : 'border-border-light hover:border-primary-300 hover:bg-surface-50 hover:shadow-subtle'
                  }`}
                >
                  <div>
                    {/* Header with Tag & Selected Indicator */}
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide uppercase"
                        style={{
                          backgroundColor: `${tmpl.badgeColor || '#6335F5'}15`,
                          color: tmpl.badgeColor || '#6335F5',
                        }}
                      >
                        {tmpl.tag || 'ATS Ready'}
                      </span>
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-primary-700 bg-primary-100 px-2 py-0.5 rounded-md">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Active
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-body/60">
                          Click to select
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-heading mb-1">{tmpl.name}</h4>
                    <p className="text-xs text-body leading-relaxed mb-3 min-h-[34px]">
                      {tmpl.description}
                    </p>
                  </div>

                  {/* Wireframe Miniature Preview Thumbnail */}
                  <div className="h-28 bg-white rounded-xl border border-border-light p-2.5 shadow-sm overflow-hidden flex flex-col justify-between group-hover:border-primary-200 transition-colors">
                    {/* Layout Header Simulation */}
                    <div className="space-y-1">
                      <div 
                        className="h-2 rounded w-2/3"
                        style={{ backgroundColor: isSelected ? accentColor : '#9CA3AF' }}
                      />
                      <div className="h-1 bg-surface-200 rounded w-1/3" />
                    </div>

                    {/* Content Section Bars */}
                    <div className="space-y-1 my-1">
                      <div className="h-1.5 bg-gray-200 rounded w-full" />
                      <div className="h-1 bg-gray-100 rounded w-5/6" />
                      <div className="h-1 bg-gray-100 rounded w-4/6" />
                    </div>

                    {/* Bottom Section */}
                    <div className="space-y-1">
                      <div className="h-1.5 bg-gray-200 rounded w-3/4" />
                      <div className="h-1 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Color Accent Picker */}
          <div className="pt-4 border-t border-border-subtle">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
              <label className="block text-xs font-bold text-heading uppercase tracking-wider">
                Template Accent Palette
              </label>
              <span className="text-xs text-body">
                Customizes headings and highlight colors in live preview, PDF, and DOCX
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              {ACCENT_COLORS.map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setAccentColor(color.hex)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                    accentColor === color.hex
                      ? 'border-primary-600 bg-primary-50 text-primary-700 ring-2 ring-primary-500/20'
                      : 'border-border-light text-body hover:border-primary-200'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span>{color.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-border-subtle flex items-center justify-between sticky bottom-0 bg-white">
          <p className="text-xs text-body hidden sm:block">
            Current: <strong className="text-heading">{TEMPLATES[activeTemplate]?.name || 'Classic ATS'}</strong>
          </p>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary ml-auto"
          >
            Apply Template & Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplatesModal;
