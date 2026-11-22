/**
 * AI Privacy & Consent Manager for ResumeXpert AI.
 * Enforces explicit user consent before any resume data is transmitted to AI.
 * Provides client-side PII sanitization.
 */

const CONSENT_STORAGE_KEY = 'resumexpert_ai_user_consent';
const PRIVACY_MODE_KEY = 'resumexpert_ai_privacy_mode';

export function getAiConsentStatus() {
  try {
    const raw = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return { consented: false, timestamp: null };
    const parsed = JSON.parse(raw);
    return {
      consented: Boolean(parsed?.consented),
      timestamp: parsed?.timestamp || null,
      version: parsed?.version || '1.0'
    };
  } catch {
    return { consented: false, timestamp: null };
  }
}

export function setAiConsent(consented = true) {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
      consented: Boolean(consented),
      timestamp: new Date().toISOString(),
      version: '1.0'
    }));
    return true;
  } catch {
    return false;
  }
}

export function revokeAiConsent() {
  try {
    localStorage.removeItem(CONSENT_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}

export function getPrivacyMode() {
  try {
    return localStorage.getItem(PRIVACY_MODE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setPrivacyMode(enabled = true) {
  try {
    localStorage.setItem(PRIVACY_MODE_KEY, String(enabled));
  } catch {
    // ignore
  }
}

/**
 * Anonymizes Personally Identifiable Information (PII) before transmission to AI.
 * Replaces names, emails, phones, and exact addresses with generalized placeholders.
 */
export function sanitizeResumeForAi(resumeData, anonymize = false) {
  if (!resumeData || typeof resumeData !== 'object') return resumeData;

  const sanitized = JSON.parse(JSON.stringify(resumeData));

  if (anonymize && sanitized.personalInfo) {
    sanitized.personalInfo.fullName = 'Candidate Name';
    sanitized.personalInfo.email = 'candidate@example.com';
    sanitized.personalInfo.phone = '+1 (555) 000-0000';
    if (sanitized.personalInfo.address) {
      sanitized.personalInfo.address = 'Metro Area, Country';
    }
  }

  return sanitized;
}

