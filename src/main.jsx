import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Pre-mount storage sanitizer to guard against legacy unnormalized objects in LocalStorage
(function sanitizeStorageBeforeMount() {
  try {
    const keysToCheck = [
      'resumecraft-resume-storage',
      'resumecraft_resume_storage',
      'resumecraft_draft',
      'resumexpert_active_career_journey'
    ];

    const normalizeCert = (c) => {
      if (typeof c === 'string') return c.trim();
      if (c && typeof c === 'object') {
        return (c.certificateName || c.name || c.title || (c.issuer ? `${c.name || 'Certificate'} - ${c.issuer}` : 'Certified Professional')).trim();
      }
      return String(c || '').trim();
    };

    keysToCheck.forEach((key) => {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        let changed = false;

        // Zustand store structure: parsed.state.resume.certifications
        if (Array.isArray(parsed?.state?.resume?.certifications)) {
          const original = parsed.state.resume.certifications;
          const cleaned = original.map(normalizeCert).filter(Boolean);
          if (JSON.stringify(original) !== JSON.stringify(cleaned)) {
            parsed.state.resume.certifications = cleaned;
            changed = true;
          }
        }

        // Direct resume structure: parsed.resume.certifications
        if (Array.isArray(parsed?.resume?.certifications)) {
          const original = parsed.resume.certifications;
          const cleaned = original.map(normalizeCert).filter(Boolean);
          if (JSON.stringify(original) !== JSON.stringify(cleaned)) {
            parsed.resume.certifications = cleaned;
            changed = true;
          }
        }

        // Raw certifications: parsed.certifications
        if (Array.isArray(parsed?.certifications)) {
          const original = parsed.certifications;
          const cleaned = original.map(normalizeCert).filter(Boolean);
          if (JSON.stringify(original) !== JSON.stringify(cleaned)) {
            parsed.certifications = cleaned;
            changed = true;
          }
        }

        if (changed) {
          localStorage.setItem(key, JSON.stringify(parsed));
        }
      } catch {
        // Ignore unparseable entries
      }
    });
  } catch {
    // Ignore storage access errors
  }
})();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
