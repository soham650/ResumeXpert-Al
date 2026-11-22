import React from 'react';
import { AlertTriangle, RotateCcw, Download, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ResumeCraft Uncaught Error Boundary caught:', error, errorInfo);
  }

  handleExportEmergencyData = () => {
    try {
      const raw = localStorage.getItem('resumecraft-resume-storage') || localStorage.getItem('resumecraft_resume_storage');
      if (!raw) {
        alert('No saved resume found in local storage.');
        return;
      }
      const blob = new Blob([raw], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ResumeCraft_Emergency_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      alert('Unable to export backup: ' + (e.message || 'Unknown error'));
    }
  };

  handleReload = () => {
    try {
      const keys = ['resumecraft-resume-storage', 'resumecraft_resume_storage', 'resumecraft_draft'];
      const normalizeCert = (c) => {
        if (typeof c === 'string') return c.trim();
        if (c && typeof c === 'object') {
          return (c.certificateName || c.name || c.title || (c.issuer ? `${c.name || 'Certificate'} - ${c.issuer}` : 'Certified Professional')).trim();
        }
        return String(c || '').trim();
      };

      keys.forEach((key) => {
        const raw = localStorage.getItem(key);
        if (!raw) return;
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed?.state?.resume?.certifications)) {
            parsed.state.resume.certifications = parsed.state.resume.certifications.map(normalizeCert).filter(Boolean);
          }
          if (Array.isArray(parsed?.resume?.certifications)) {
            parsed.resume.certifications = parsed.resume.certifications.map(normalizeCert).filter(Boolean);
          }
          if (Array.isArray(parsed?.certifications)) {
            parsed.certifications = parsed.certifications.map(normalizeCert).filter(Boolean);
          }
          localStorage.setItem(key, JSON.stringify(parsed));
        } catch {}
      });
    } catch {
      // ignore
    }
    window.location.reload();
  };

  handleResetState = () => {
    try {
      localStorage.removeItem('resumecraft-resume-storage');
      localStorage.removeItem('resumecraft_resume_storage');
      localStorage.removeItem('resumecraft_draft');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-card border border-border-light p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-heading">
                Something went wrong
              </h1>
              <p className="text-sm text-body mt-2 leading-relaxed">
                An unexpected interface error occurred. Don’t worry — your resume data in LocalStorage is preserved.
              </p>
              {this.state.error?.message && (
                <div className="mt-3 p-3 bg-surface-50 rounded-xl border border-border-subtle text-left">
                  <p className="text-xs font-mono text-body/80 break-words">
                    {this.state.error.message}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="btn-primary flex-1 justify-center py-2.5 text-xs sm:text-sm font-semibold"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reload App</span>
              </button>

              <button
                type="button"
                onClick={this.handleExportEmergencyData}
                className="btn-secondary flex-1 justify-center py-2.5 text-xs sm:text-sm font-semibold"
                title="Download raw resume JSON from browser storage"
              >
                <Download className="w-4 h-4" />
                <span>Download Backup</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

