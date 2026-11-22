/**
 * Centralized Application Configuration for ResumeXpert AI (Phase 14).
 * Single source of truth for support contact, branding, production URLs,
 * and feature catalogs. Never invent email addresses or legal identities.
 */

const getEnv = (key, fallback = '') => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return fallback;
};

// Official Support Email:
// When VITE_SUPPORT_EMAIL is provided in .env, it is used directly.
// Defaults to the owner-specified support address: sohamjamkar54@gmail.com
const rawSupportEmail = getEnv('VITE_SUPPORT_EMAIL', 'sohamjamkar54@gmail.com').trim();
export const isSupportEmailConfigured = Boolean(
  rawSupportEmail &&
  rawSupportEmail.length > 5 &&
  rawSupportEmail.includes('@') &&
  !rawSupportEmail.includes('placeholder')
);

export const SUPPORT_EMAIL = isSupportEmailConfigured
  ? rawSupportEmail
  : '[SUPPORT_EMAIL]';

export const APP_CONFIG = {
  name: 'ResumeXpert AI',
  legalName: 'ResumeXpert AI Platform',
  tagline: 'Build Smarter. Apply Better. Get Hired.',
  version: '1.0.0',
  releasePhase: 'Production Release (Phase 14)',
  
  // URLs & Endpoints
  websiteUrl: getEnv('VITE_WEBSITE_URL', 'https://resumexpert.ai'),
  supportEmail: SUPPORT_EMAIL,
  isSupportEmailConfigured,
  
  // Policies & Legal Effective Dates
  legalEffectiveDate: 'November 8, 2026',
  lastUpdatedDate: 'November 8, 2026',

  // Genuine Product Feature Roster (only features that actually exist and work)
  features: [
    {
      id: 'builder',
      title: 'ATS Resume Builder',
      description: 'Create standardized, single-column chronological resumes formatted for automated parser readability.',
      status: 'active',
    },
    {
      id: 'ats-checker',
      title: 'Free ATS Correctness Engine',
      description: 'Upload PDF, DOCX, or Image files for instant transparent heuristic scoring and structural audit.',
      status: 'active',
    },
    {
      id: 'export-engines',
      title: 'Multi-Format Export',
      description: 'Download print-ready vector PDFs and editable Microsoft Word (.docx) documents.',
      status: 'active',
    },
    {
      id: 'ai-studio',
      title: 'AI Career Intelligence Studio',
      description: 'Powered by advanced neural AI for resume tailoring, XYZ bullet points, and recruiter simulations.',
      status: 'active',
    },
    {
      id: 'voice-interview',
      title: 'Voice + Text Mock Interview Simulator',
      description: 'Turn-by-turn STAR question simulation utilizing browser Web Speech recognition & synthesis.',
      status: 'active',
    },
    {
      id: 'career-journey',
      title: 'Six-Step Career Journey',
      description: 'End-to-end career workflow from resume understanding to job targeting, application cloning, and pipeline tracking.',
      status: 'active',
    },
  ],

  // Real Supported Upload Document Formats
  supportedUploadFormats: ['PDF (.pdf)', 'Word (.docx)', 'Plain Text (.txt, .md)', 'JSON (.json)', 'Images (.jpg, .png)'],
  maxUploadSizeBytes: 15 * 1024 * 1024, // 15 MB
  maxUploadSizeMB: 15,
};

export default APP_CONFIG;

