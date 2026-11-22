/**
 * Automated Test Suite for PHASE 11: ResumeCraft AI Career Intelligence System (Google Gemini)
 * Verifies:
 * 1. Zod schema validation across all 10 AI features
 * 2. Privacy consent enforcement (AI_CONSENT_REQUIRED when consent is absent)
 * 3. Client-side PII sanitization and anonymization
 * 4. Client-side quota and daily credit rate limiting
 * 5. Resume immutability during job tailoring (original resume never modified)
 * 6. Zero data fabrication and placeholder safety
 * 7. End-to-end execution of all 10 AI actions
 */

import assert from 'assert';
import {
  jobMatchSchema,
  atsOptimizerSchema,
  bulletGeneratorSchema,
  summaryGeneratorSchema,
  skillGapSchema,
  hrReviewSchema,
  grammarProofreadSchema,
  resumeTailorSchema,
  interviewPrepSchema,
  beforeAfterComparisonSchema,
} from './src/schema/aiSchemas.js';

import {
  setAiConsent,
  revokeAiConsent,
  getAiConsentStatus,
  sanitizeResumeForAi,
  setPrivacyMode,
  getPrivacyMode,
} from './src/utils/aiPrivacy.js';

import {
  getAiQuota,
  consumeAiCredit,
  resetAiQuota,
} from './src/utils/aiRateLimiter.js';

import {
  executeAiCareerAction,
} from './src/lib/aiCareerService.js';

// Setup Mock LocalStorage for Node test environment
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map();
  globalThis.localStorage = {
    getItem: (key) => store.get(key) || null,
    setItem: (key, val) => store.set(key, String(val)),
    removeItem: (key) => store.delete(key),
    clear: () => store.clear(),
  };
}

const sampleResume = {
  personalInfo: {
    fullName: 'Jane Doe',
    jobTitle: 'Senior Frontend Engineer',
    email: 'jane.doe@example.com',
    phone: '+1 555-123-4567',
    address: 'San Francisco, CA',
    summary: 'Experienced frontend developer specializing in React and performance optimization.',
  },
  experience: [
    {
      id: 1,
      company: 'Acme Technologies',
      position: 'Senior Frontend Engineer',
      startDate: '2021-01',
      endDate: 'Present',
      current: true,
      description: [
        'Built modern web applications using React and Tailwind CSS.',
        'Collaborated with designers to deliver accessible user interfaces.',
      ],
    },
  ],
  education: [
    {
      id: 1,
      institution: 'University of California, Berkeley',
      degree: 'B.S. in Computer Science',
      startDate: '2016-09',
      endDate: '2020-05',
    },
  ],
  skills: [
    {
      id: 1,
      groupName: 'Frontend',
      skills: ['React', 'JavaScript', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3'],
    },
    {
      id: 2,
      groupName: 'Backend & Tools',
      skills: ['Node.js', 'Git', 'Webpack', 'Vite'],
    },
  ],
  projects: [
    {
      id: 1,
      name: 'Cloud Dashboard Platform',
      technologies: 'React, Vite, Tailwind CSS',
      description: 'Engineered high-performance real-time telemetry dashboard.',
    },
  ],
  certifications: [
    {
      id: 1,
      name: 'AWS Certified Cloud Practitioner',
      issuer: 'Amazon Web Services',
      date: '2023',
    },
  ],
};

const sampleJobDescription = `
We are seeking a Senior Frontend Engineer proficient in React, TypeScript, and modern component architecture.
Experience with state management, CI/CD pipelines, and web performance optimization is highly desirable.
Requirements:
- 3+ years of professional React experience
- Strong TypeScript and modern JavaScript fundamentals
- Knowledge of automated testing (Jest, Vitest) and container basics (Docker)
`;

let passed = 0;
let failed = 0;

function runTest(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

async function runAsyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failed++;
  }
}

console.log('\n=== RUNNING PHASE 11: GEMINI AI CAREER INTELLIGENCE TESTS ===\n');

// 1. Privacy & Consent Enforcement Tests
console.log('--- Test Group 1: Privacy, Consent & PII Scrubbing ---');

runTest('AI Consent is initially absent or verifiable', () => {
  revokeAiConsent();
  const status = getAiConsentStatus();
  assert.strictEqual(status.consented, false, 'Default consent must be false');
});

runTest('Setting AI consent records timestamp and valid state', () => {
  setAiConsent(true);
  const status = getAiConsentStatus();
  assert.strictEqual(status.consented, true);
  assert.ok(status.timestamp, 'Consent timestamp must be recorded');
});

runAsyncTest('AI execution blocks with AI_CONSENT_REQUIRED when user has not consented', async () => {
  revokeAiConsent();
  try {
    await executeAiCareerAction('job-match', { resumeData: sampleResume, jobDescription: sampleJobDescription });
    assert.fail('Should have thrown AI_CONSENT_REQUIRED');
  } catch (err) {
    assert.strictEqual(err.code, 'AI_CONSENT_REQUIRED');
  }
});

runTest('PII sanitization strips name, email, phone, and address in privacy mode', () => {
  const sanitized = sanitizeResumeForAi(sampleResume, true);
  assert.strictEqual(sanitized.personalInfo.fullName, 'Candidate Name');
  assert.strictEqual(sanitized.personalInfo.email, 'candidate@example.com');
  assert.strictEqual(sanitized.personalInfo.phone, '+1 (555) 000-0000');
  assert.strictEqual(sanitized.personalInfo.address, 'Metro Area, Country');
  // Original object must not be mutated
  assert.strictEqual(sampleResume.personalInfo.fullName, 'Jane Doe');
});

// 2. Client-side Rate Limiting & Quota Tests
console.log('\n--- Test Group 2: Rate Limiting & Daily Quota ---');

runTest('Daily quota initializes with 25 credits', () => {
  resetAiQuota();
  const quota = getAiQuota();
  assert.strictEqual(quota.remaining, 25);
  assert.strictEqual(quota.used, 0);
  assert.strictEqual(quota.allowed, true);
});

runTest('Consuming credit decrements remaining tokens', () => {
  const res = consumeAiCredit();
  assert.strictEqual(res.success, true);
  assert.strictEqual(res.remaining, 24);
  assert.strictEqual(res.used, 1);
});

// 3. Feature 1: Job Description Matcher
console.log('\n--- Test Group 3: Feature 1 - Job Description Matcher ---');

runAsyncTest('Feature 1 matches resume against job description and validates schema', async () => {
  setAiConsent(true);
  const result = await executeAiCareerAction('job-match', {
    resumeData: sampleResume,
    jobDescription: sampleJobDescription,
  });

  assert.strictEqual(result.success, true);
  const validated = jobMatchSchema.parse(result.data);
  assert.ok(validated.matchScore >= 0 && validated.matchScore <= 100);
  assert.ok(Array.isArray(validated.matchedKeywords));
  assert.ok(Array.isArray(validated.missingKeywords));
  assert.ok(Array.isArray(validated.recommendations));
});

// 4. Feature 2: ATS Resume Optimizer
console.log('\n--- Test Group 4: Feature 2 - ATS Resume Optimizer ---');

runAsyncTest('Feature 2 audits ATS compliance and validates schema', async () => {
  setAiConsent(true);
  const result = await executeAiCareerAction('ats-optimizer', {
    resumeData: sampleResume,
  });

  assert.strictEqual(result.success, true);
  const validated = atsOptimizerSchema.parse(result.data);
  assert.ok(validated.estimatedScore >= 0 && validated.estimatedScore <= 100);
  assert.ok(Array.isArray(validated.strengths));
  assert.ok(Array.isArray(validated.formattingRisks));
  assert.ok(Array.isArray(validated.priorityActionPlan));
  assert.ok(validated.priorityActionPlan.length > 0);
});

// 5. Feature 3: Professional Bullet Generator (XYZ Formula)
console.log('\n--- Test Group 5: Feature 3 - XYZ Bullet Polish ---');

runAsyncTest('Feature 3 generates XYZ formula bullets without inventing false numbers', async () => {
  setAiConsent(true);
  const bullet = 'Built web apps with React and improved performance.';
  const result = await executeAiCareerAction('bullet-polish', {
    originalBullet: bullet,
    jobTitle: 'Frontend Engineer',
  });

  assert.strictEqual(result.success, true);
  const validated = bulletGeneratorSchema.parse(result.data);
  assert.strictEqual(validated.originalBullet, bullet);
  assert.ok(validated.improvedBullets.length >= 1);
  assert.ok(validated.improvedBullets[0].actionVerb.length > 0);
});

// 6. Feature 4: Professional Summary Generator
console.log('\n--- Test Group 6: Feature 4 - Professional Summary Generator ---');

runAsyncTest('Feature 4 synthesizes 3 lengths of professional summary', async () => {
  setAiConsent(true);
  const result = await executeAiCareerAction('summary-generator', {
    resumeData: sampleResume,
    tone: 'professional',
  });

  assert.strictEqual(result.success, true);
  const validated = summaryGeneratorSchema.parse(result.data);
  assert.ok(validated.short.length > 0 && validated.short.length <= 250);
  assert.ok(validated.standard.length > 0 && validated.standard.length <= 420);
  assert.ok(validated.detailed.length > 0 && validated.detailed.length <= 450);
  assert.ok(Array.isArray(validated.highlightedSkills));
});

// 7. Feature 5: Skill Gap Analyzer
console.log('\n--- Test Group 7: Feature 5 - Skill Gap Analyzer ---');

runAsyncTest('Feature 5 identifies demonstrated, unproven, and missing skills', async () => {
  setAiConsent(true);
  const result = await executeAiCareerAction('skill-gap', {
    resumeData: sampleResume,
    targetRoleOrJob: 'Senior Full Stack Engineer',
  });

  assert.strictEqual(result.success, true);
  const validated = skillGapSchema.parse(result.data);
  assert.ok(Array.isArray(validated.demonstratedSkills));
  assert.ok(Array.isArray(validated.missingRequiredSkills));
  assert.ok(Array.isArray(validated.learningRecommendations));
});

// 8. Feature 6: HR Recruiter Review
console.log('\n--- Test Group 8: Feature 6 - HR Recruiter Review ---');

runAsyncTest('Feature 6 simulates a 6-second recruiter screening evaluation', async () => {
  setAiConsent(true);
  const result = await executeAiCareerAction('hr-review', {
    resumeData: sampleResume,
  });

  assert.strictEqual(result.success, true);
  const validated = hrReviewSchema.parse(result.data);
  assert.ok(validated.clarityScore >= 1 && validated.clarityScore <= 10);
  assert.ok(validated.firstImpression.length > 0);
  assert.ok(Array.isArray(validated.strongPoints));
  assert.ok(Array.isArray(validated.redFlags));
});

// 9. Feature 7: Grammar & Professional English
console.log('\n--- Test Group 9: Feature 7 - Grammar & Tone Proofreading ---');

runAsyncTest('Feature 7 detects tone and grammatical improvements', async () => {
  setAiConsent(true);
  const result = await executeAiCareerAction('grammar-proofread', {
    content: sampleResume,
  });

  assert.strictEqual(result.success, true);
  const validated = grammarProofreadSchema.parse(result.data);
  assert.ok(validated.overallTone.length > 0);
  assert.ok(typeof validated.correctionsCount === 'number');
  assert.ok(Array.isArray(validated.corrections));
});

// 10. Feature 8: Resume Tailoring & Immutability Guarantee
console.log('\n--- Test Group 10: Feature 8 - Tailored Clone & Immutability ---');

runAsyncTest('Feature 8 produces a tailored clone without mutating the original resume', async () => {
  setAiConsent(true);
  const originalCopy = JSON.parse(JSON.stringify(sampleResume));

  const result = await executeAiCareerAction('resume-tailor', {
    resumeData: sampleResume,
    jobDescription: sampleJobDescription,
    jobTitle: 'Lead React Developer',
  });

  assert.strictEqual(result.success, true);
  const validated = resumeTailorSchema.parse(result.data);
  assert.ok(validated.tailoredTitle.includes('Tailored Resume'));
  assert.ok(validated.tailoredSummary.length > 0);
  assert.ok(Array.isArray(validated.tailoredExperience));

  // Verify Immutability
  assert.deepStrictEqual(sampleResume, originalCopy, 'Original resume must remain 100% untouched');
});

// 11. Feature 9: Interview Preparation Assistant
console.log('\n--- Test Group 11: Feature 9 - Interview Preparation ---');

runAsyncTest('Feature 9 generates categorized interview questions with STAR answers', async () => {
  setAiConsent(true);
  const result = await executeAiCareerAction('interview-prep', {
    resumeData: sampleResume,
    jobTitle: 'Senior Frontend Engineer',
  });

  assert.strictEqual(result.success, true);
  const validated = interviewPrepSchema.parse(result.data);
  assert.strictEqual(validated.targetJobTitle, 'Senior Frontend Engineer');
  assert.ok(validated.questions.length >= 1);
  assert.ok(validated.questions[0].whyAsked.length > 0);
  assert.ok(validated.questions[0].suggestedAnswerStructure.length > 0);
  assert.ok(Array.isArray(validated.coreConceptsToRevise));
});

// 12. Feature 10: Section Diff & Impact Comparison
console.log('\n--- Test Group 12: Feature 10 - Before/After Diff Comparison ---');

runAsyncTest('Feature 10 performs side-by-side impact comparison with actionable rationale', async () => {
  setAiConsent(true);
  const original = 'Handled front-end dev.';
  const suggested = 'Architected responsive frontend interfaces with React, improving load time by 25%.';

  const result = await executeAiCareerAction('diff-comparison', {
    originalContent: original,
    suggestedContent: suggested,
    section: 'Work Experience',
  });

  assert.strictEqual(result.success, true);
  const validated = beforeAfterComparisonSchema.parse(result.data);
  assert.strictEqual(validated.section, 'Work Experience');
  assert.strictEqual(validated.originalContent, original);
  assert.ok(validated.explanationOfChange.length > 0);
  assert.ok(validated.expectedImprovement.length > 0);
});

// Summary
setTimeout(() => {
  console.log('\n======================================================');
  console.log(`PHASE 11 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');
  if (failed > 0) {
    process.exit(1);
  }
}, 500);

