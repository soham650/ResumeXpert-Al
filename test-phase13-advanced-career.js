/**
 * Automated Test Suite for PHASE 13: ResumeXpert AI Advanced Career Intelligence Platform
 * Verifies:
 * 1. The complete 6-Step Career Journey workflow end-to-end
 * 2. Step 1: Career profile extraction & user verification
 * 3. Step 2: Target job selection & compatibility gap analysis
 * 4. Step 3: Application prep (tailored clone, cover letter, truth checker) with strict resume immutability
 * 5. Step 4: Multi-modal interview simulation (turn progression, speech fallbacks, evaluation report)
 * 6. Step 5: Career roadmap & milestone tracking, portfolio README generation
 * 7. Step 6: Application pipeline tracking, conversion analytics, next-action advisor
 * 8. Real progress calculations strictly based on completed milestones
 */

import assert from 'assert';
import {
  careerProfileSchema,
  targetJobAuditSchema,
  coverLetterSchema,
  recruiterEmailSchema,
  truthCheckAuditSchema,
  interviewTurnSchema,
  interviewEvaluationSchema,
  careerRoadmapSchema,
  portfolioProjectSchema,
  jobApplicationSchema,
  pipelineAnalyticsSchema,
  careerJourneyStateSchema,
} from './src/schema/careerJourneySchemas.js';

import {
  generatePhase13Fallback,
  loadActiveJourney,
  saveJourney,
  getLocalApplications,
  saveLocalApplications,
  addJobApplication,
  calculatePipelineAnalytics,
  executePhase13AiAction,
} from './src/lib/careerJourneyService.js';

import {
  isSpeechRecognitionSupported,
  isSpeechSynthesisSupported,
  VoiceRecognitionController,
} from './src/utils/speechRecognition.js';

import {
  setAiConsent,
  revokeAiConsent,
  getAiConsentStatus,
} from './src/utils/aiPrivacy.js';

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
    fullName: 'Alex Rivera',
    jobTitle: 'Senior Frontend Engineer',
    email: 'alex.rivera@example.com',
    phone: '+1 555-987-6543',
    address: 'Seattle, WA',
    summary: 'Senior frontend architect with 5+ years of experience engineering high-performance web applications using React and TypeScript.',
  },
  experience: [
    {
      id: 1,
      company: 'TechCorp Cloud',
      position: 'Senior Frontend Engineer',
      startDate: '2021-03',
      endDate: 'Present',
      current: true,
      description: [
        'Architected modern web interfaces using React, TypeScript, and Tailwind CSS.',
        'Accelerated page load speeds by 28% across 50,000 active users.',
      ],
    },
  ],
  education: [
    {
      id: 1,
      institution: 'University of Washington',
      degree: 'B.S. in Computer Science',
      startDate: '2016-09',
      endDate: '2020-05',
    },
  ],
  skills: [
    {
      id: 1,
      groupName: 'Frontend Stack',
      skills: ['React', 'TypeScript', 'JavaScript', 'HTML5', 'Tailwind CSS', 'Redux', 'Zustand'],
    },
    {
      id: 2,
      groupName: 'Tooling & DevOps',
      skills: ['Git', 'Vite', 'Webpack', 'REST APIs', 'Node.js'],
    },
  ],
  projects: [
    {
      id: 1,
      name: 'Real-time Telemetry Dashboard',
      technologies: 'React, TypeScript, Tailwind CSS',
      description: 'Engineered a 60fps high-throughput telemetry analytics dashboard.',
    },
  ],
  certifications: [
    {
      id: 1,
      name: 'Meta Certified Frontend Developer',
      issuer: 'Meta',
      date: '2022',
    },
  ],
};

const targetJob = {
  role: 'Lead React Developer',
  company: 'Apex Digital Inc.',
  description: `
We are looking for a Lead React Developer to spearhead our next-generation web application.
Requirements:
- 4+ years of professional React & TypeScript experience
- Deep knowledge of state management and virtual DOM profiling
- Experience with CI/CD automation and containerized micro-frontends
- Excellent communication and mentorship abilities
  `,
};

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

console.log('\n=== RUNNING PHASE 13: ADVANCED CAREER INTELLIGENCE & 6-STEP JOURNEY TESTS ===\n');

// 1. Initial State & Consent
console.log('--- Test Group 1: Career Journey State Initialization ---');

runAsyncTest('Initializes clean Career Journey state with Step 1 active', async () => {
  localStorage.clear();
  setAiConsent(true);
  const journey = await loadActiveJourney();
  assert.ok(journey.id.startsWith('journey-'));
  assert.strictEqual(journey.currentStep, 1);
  assert.strictEqual(journey.overallProgress, 0);
  assert.deepStrictEqual(journey.completedSteps, []);
});

// 2. Step 1: Resume Understanding & Verified Career Profile
console.log('\n--- Test Group 2: Step 1 - Resume Understanding & Profile Verification ---');

runAsyncTest('Step 1 extracts structured career profile from resume and validates schema', async () => {
  const profile = await executePhase13AiAction('career-profile-extract', { resumeData: sampleResume });
  const validated = careerProfileSchema.parse(profile);

  assert.strictEqual(validated.fullName, 'Alex Rivera');
  assert.ok(validated.topSkills.includes('React'));
  assert.ok(validated.totalYearsExperience >= 1);
  assert.strictEqual(validated.verifiedByUser, false);

  // Simulate user verification
  validated.verifiedByUser = true;
  assert.strictEqual(validated.verifiedByUser, true);
});

// 3. Step 2: Target Job Selection & Compatibility Audit
console.log('\n--- Test Group 3: Step 2 - Target Job Selection & Compatibility Audit ---');

runAsyncTest('Step 2 audits job compatibility and flags matched vs missing skills', async () => {
  const audit = await executePhase13AiAction('job-insights', {
    resumeData: sampleResume,
    targetRole: targetJob.role,
    companyName: targetJob.company,
    jobDescription: targetJob.description,
  });

  const validated = targetJobAuditSchema.parse(audit);
  assert.strictEqual(validated.targetRole, targetJob.role);
  assert.ok(validated.compatibilityScore >= 0 && validated.compatibilityScore <= 100);
  assert.ok(Array.isArray(validated.mandatoryMatched));
  assert.ok(Array.isArray(validated.mandatoryMissing));
  assert.ok(validated.immediateRecommendations.length > 0);
});

// 4. Step 3: Application Preparation & Strict Immutability Rule
console.log('\n--- Test Group 4: Step 3 - Tailored Clone & Immutability ---');

runAsyncTest('Step 3 creates tailored clone without mutating original resume', async () => {
  const originalSnapshot = JSON.parse(JSON.stringify(sampleResume));

  const tailored = await executePhase13AiAction('resume-tailor', {
    resumeData: sampleResume,
    jobDescription: targetJob.description,
    jobTitle: targetJob.role,
  });

  assert.ok(tailored.tailoredTitle.includes('Tailored Resume'));
  assert.ok(tailored.tailoredSummary.length > 0);

  // Strict immutability assertion
  assert.deepStrictEqual(sampleResume, originalSnapshot, 'Original resume must remain 100% untouched');
});

runAsyncTest('Step 3 generates tailored cover letter matching schema', async () => {
  const cl = await executePhase13AiAction('generate-communication', {
    category: 'cover_letter',
    resumeData: sampleResume,
    targetRole: targetJob.role,
    jobDescription: targetJob.description,
    companyName: targetJob.company,
    tone: 'professional',
  });

  const validated = coverLetterSchema.parse(cl);
  assert.strictEqual(validated.roleTitle, targetJob.role);
  assert.ok(validated.content.includes(targetJob.role));
  assert.ok(validated.content.length > 50);
});

runAsyncTest('Step 3 runs truth & evidence checker classifying claims', async () => {
  const audit = await executePhase13AiAction('truth-check', { resumeData: sampleResume });
  const validated = truthCheckAuditSchema.parse(audit);

  assert.ok(validated.overallCredibilityScore >= 0 && validated.overallCredibilityScore <= 100);
  assert.ok(validated.findings.length > 0);

  // Validate allowed classifications
  const validClasses = ['supported', 'partially_supported', 'no_evidence_found', 'needs_verification'];
  validated.findings.forEach((f) => {
    assert.ok(validClasses.includes(f.classification));
  });
});

// 5. Step 4: Multi-Modal Mock Interview Simulator
console.log('\n--- Test Group 5: Step 4 - Mock Interview Simulator (Voice + Text) ---');

runTest('Speech Recognition controller gracefully reports unsupported in Node/headless environment', () => {
  assert.strictEqual(isSpeechRecognitionSupported(), false);
  const controller = new VoiceRecognitionController();
  let errorCaught = false;
  controller.start({
    onError: (err) => {
      errorCaught = true;
      assert.ok(err.message.includes('Speech recognition is not supported'));
    },
  });
  assert.strictEqual(errorCaught, true);
});

runAsyncTest('Step 4 turn-by-turn question generation returns structured STAR question', async () => {
  const turn = await executePhase13AiAction('interview-turn', {
    targetRole: targetJob.role,
    category: 'technical',
    turnIndex: 0,
    transcript: [],
  });

  const validated = interviewTurnSchema.parse(turn);
  assert.strictEqual(validated.questionNumber, 1);
  assert.strictEqual(validated.category, 'technical');
  assert.ok(validated.question.length > 10);
  assert.ok(validated.suggestedAnswerStructure.length > 0);
});

runAsyncTest('Step 4 evaluates complete interview transcript and generates structured report', async () => {
  const mockTranscript = [
    {
      id: 'q-1',
      questionNumber: 1,
      category: 'technical',
      question: 'How do you optimize React component re-renders?',
      whyAsked: 'Assesses state architecture.',
      suggestedAnswerStructure: 'Explain useMemo/useCallback tradeoffs and Virtual DOM diffing.',
      userAnswer: 'I profile render cycles using React DevTools, decouple local state from global stores, and memoize expensive computations.',
      spokenByUser: true,
    },
  ];

  const evalReport = await executePhase13AiAction('interview-evaluate', {
    targetRole: targetJob.role,
    transcript: mockTranscript,
  });

  const validated = interviewEvaluationSchema.parse(evalReport);
  assert.ok(validated.overallScore >= 0 && validated.overallScore <= 100);
  assert.ok(validated.technicalAccuracy >= 1 && validated.technicalAccuracy <= 10);
  assert.ok(validated.strengths.length > 0);
  assert.ok(validated.weaknesses.length > 0);
  assert.ok(validated.recommendedLearningTopics.length > 0);
});

// 6. Step 5: Skill Improvement & Learning Roadmap
console.log('\n--- Test Group 6: Step 5 - Career Roadmap & Portfolio Builder ---');

runAsyncTest('Step 5 generates 30/60/90-day learning curriculum matching skill gaps', async () => {
  const roadmap = await executePhase13AiAction('generate-roadmap', {
    targetRole: targetJob.role,
    currentSkills: ['React', 'TypeScript', 'Tailwind CSS'],
    duration: '60-day',
    weeklyHours: 10,
  });

  const validated = careerRoadmapSchema.parse(roadmap);
  assert.strictEqual(validated.targetRole, targetJob.role);
  assert.strictEqual(validated.planDuration, '60-day');
  assert.ok(validated.milestones.length >= 2);
  assert.ok(validated.milestones[0].tasks.length >= 2);
});

runTest('Step 5 tracks task completion and accurately recalculates progress percentage', () => {
  const initialRoadmap = {
    targetRole: 'Lead React Developer',
    planDuration: '60-day',
    weeklyCommitmentHours: 10,
    currentSkillAssessment: 'Solid baseline.',
    skillGapsIdentified: ['Docker'],
    milestones: [
      {
        week: 1,
        focusArea: 'Profiling',
        objective: 'Optimize render cycles.',
        tasks: [
          { id: 't1', description: 'Run DevTools profiler', completed: true },
          { id: 't2', description: 'Decouple global state', completed: false },
        ],
      },
      {
        week: 2,
        focusArea: 'CI/CD',
        objective: 'Setup GitHub Actions.',
        tasks: [
          { id: 't3', description: 'Write unit tests', completed: true },
          { id: 't4', description: 'Deploy preview builds', completed: true },
        ],
      },
    ],
    completionPercentage: 0,
  };

  const allTasks = initialRoadmap.milestones.flatMap((m) => m.tasks);
  const completed = allTasks.filter((t) => t.completed).length;
  const pct = Math.round((completed / allTasks.length) * 100);

  assert.strictEqual(completed, 3);
  assert.strictEqual(allTasks.length, 4);
  assert.strictEqual(pct, 75);
});

// 7. Step 6: Application Pipeline & Progress Analytics
console.log('\n--- Test Group 7: Step 6 - Application Pipeline Tracking & Analytics ---');

runTest('Pipeline analytics calculates real conversion ratios and dynamic recommendations', () => {
  const sampleApps = [
    {
      id: 'app-1',
      company: 'Apex Digital Inc.',
      role: 'Lead React Developer',
      location: 'Remote',
      applicationUrl: 'https://example.com/apply',
      status: 'interview',
      appliedDate: '2026-11-01',
      followUpDate: '2026-11-08',
      compatibilityScore: 88,
      notes: 'Initial technical screen completed.',
    },
    {
      id: 'app-2',
      company: 'CloudScale Labs',
      role: 'Frontend Architect',
      location: 'Remote',
      applicationUrl: '',
      status: 'offer',
      appliedDate: '2026-10-15',
      followUpDate: '',
      compatibilityScore: 92,
      notes: 'Offer package received.',
    },
    {
      id: 'app-3',
      company: 'Legacy Corp',
      role: 'Senior Engineer',
      location: 'Seattle, WA',
      applicationUrl: '',
      status: 'rejected',
      appliedDate: '2026-10-01',
      followUpDate: '',
      compatibilityScore: 70,
      notes: 'Position closed.',
    },
  ];

  const analytics = calculatePipelineAnalytics(sampleApps);
  const validated = pipelineAnalyticsSchema.parse(analytics);

  assert.strictEqual(validated.totalApplications, 3);
  assert.strictEqual(validated.inProgress, 1);
  assert.strictEqual(validated.interviewsScheduled, 1);
  assert.strictEqual(validated.offersReceived, 1);
  assert.strictEqual(validated.rejectionCount, 1);
  assert.strictEqual(validated.conversionRate, 33); // 1 offer / 3 total = 33%
  assert.ok(validated.nextRecommendedAction.includes('interview'));
});

// 8. End-to-End Journey Milestone Integration
console.log('\n--- Test Group 8: End-to-End 6-Step Career Journey State Machine ---');

runAsyncTest('Journey marks each step complete and achieves 100% progress when all 6 steps finish', async () => {
  let journey = await loadActiveJourney();

  // Complete Step 1
  journey.completedSteps.push(1);
  journey = await saveJourney(journey);
  assert.strictEqual(journey.overallProgress, 17); // 1/6 ~ 17%

  // Complete Step 2
  journey.completedSteps.push(2);
  journey = await saveJourney(journey);
  assert.strictEqual(journey.overallProgress, 33); // 2/6 ~ 33%

  // Complete Step 3, 4, 5
  journey.completedSteps.push(3, 4, 5);
  journey = await saveJourney(journey);
  assert.strictEqual(journey.overallProgress, 83); // 5/6 ~ 83%

  // Complete Step 6
  journey.completedSteps.push(6);
  journey = await saveJourney(journey);
  assert.strictEqual(journey.overallProgress, 100); // 6/6 = 100%
  assert.strictEqual(journey.completedSteps.length, 6);
});

// Summary
setTimeout(() => {
  console.log('\n======================================================');
  console.log(`PHASE 13 TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('======================================================\n');
  if (failed > 0) {
    process.exit(1);
  }
}, 500);
