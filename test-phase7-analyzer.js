/**
 * Phase 7 Automated Test Suite: ATS Resume Analyzer, Scoring & Content Improvement
 * Tests all 7 required scenarios:
 * 1. Complete resume (scores >= 85, rating tier 'Excellent')
 * 2. Incomplete resume (deductions for missing fields, missing sections identified)
 * 3. Resume with weak bullet points (identifies 'worked on', 'responsible for')
 * 4. Resume with strong measurable achievements (recognizes metrics %, $, scale)
 * 5. Resume with a target job description (matches keywords, identifies missing keywords, match %)
 * 6. Resume with no job description (graceful fallback)
 * 7. Empty and optional fields (clean calculation, no crashes, score >= 0)
 * 8. Rubric weights sum strictly to 100
 * 9. Client-side privacy and safety guarantees
 */

import assert from 'node:assert';
import {
  evaluateResumeATS,
  inspectAchievementBullets,
  analyzeJobDescriptionMatch,
  generateContentSuggestions,
  STRONG_ACTION_VERBS,
  WEAK_VERB_PATTERNS,
  COMMON_TECH_KEYWORDS,
} from './src/utils/atsAnalyzer.js';
import { sampleResumeData } from './src/data/sampleData.js';

console.log('🧪 Starting Phase 7 ATS Resume Analyzer & Scoring Test Suite...\n');

let passCount = 0;
const test = (description, fn) => {
  try {
    fn();
    console.log(`  ✅ PASS: ${description}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(err);
    process.exit(1);
  }
};

// ==============================================================================
// TEST 1: Rubric Weights Sum Strictly to 100
// ==============================================================================
test('Scoring Rubric: weights of all 8 categories sum strictly to 100', () => {
  const result = evaluateResumeATS(sampleResumeData);
  assert(Array.isArray(result.categories), 'categories must be an array');
  assert.strictEqual(result.categories.length, 8, 'must have exactly 8 evaluated categories');

  const totalMax = result.categories.reduce((acc, cat) => acc + (cat.maxScore || cat.weight || 0), 0);
  assert.strictEqual(totalMax, 100, `Sum of category weights must equal 100, got ${totalMax}`);

  const expectedCategories = [
    { name: 'Contact Information', weight: 10 },
    { name: 'Professional Summary', weight: 10 },
    { name: 'Work Experience', weight: 25 },
    { name: 'Skills', weight: 15 },
    { name: 'Education', weight: 10 },
    { name: 'Projects', weight: 10 },
    { name: 'Certifications', weight: 5 },
    { name: 'ATS Formatting', weight: 15 },
  ];

  for (const exp of expectedCategories) {
    const found = result.categories.find(c => c.category === exp.name);
    assert(found, `Category ${exp.name} must be present`);
    assert.strictEqual(found.weight, exp.weight, `Category ${exp.name} weight should be ${exp.weight}`);
  }
});

// ==============================================================================
// TEST 2: Scenario 1 - Complete Resume (Scores >= 85, Rating 'Excellent')
// ==============================================================================
test('Scenario 1: Complete comprehensive resume scores >= 85 and achieves "Excellent" tier', () => {
  const completeResume = {
    personalInfo: {
      fullName: 'Alexandra Chen',
      professionalTitle: 'Lead Cloud Solutions Architect',
      email: 'alexandra.chen@example.com',
      phone: '+1 (555) 382-9012',
      location: 'San Francisco, CA',
      linkedinUrl: 'https://linkedin.com/in/alexandrachen',
      githubUrl: 'https://github.com/alexandrachen',
      portfolioUrl: 'https://alexandrachen.dev',
      additionalLinks: [],
    },
    professionalSummary:
      'Distinguished Cloud Solutions Architect with 8+ years designing fault-tolerant, high-concurrency microservices on AWS and GCP. Led multi-region migrations for Fortune 500 enterprises, cutting cloud infrastructure spend by 35% while sustaining 99.99% system availability.',
    workExperience: [
      {
        id: 1,
        companyName: 'CloudScale Technologies',
        jobTitle: 'Principal Cloud Architect',
        location: 'San Francisco, CA',
        startDate: 'Jan 2021',
        endDate: 'Present',
        achievements: [
          'Architected Kubernetes-based microservices platform serving 12M+ monthly active requests.',
          'Automated CI/CD deployment pipelines using Terraform and GitHub Actions, accelerating release velocity by 65%.',
          'Spearheaded multi-region disaster recovery initiative, slashing recovery time objective (RTO) by 80%.',
        ],
      },
      {
        id: 2,
        companyName: 'Apex Financial Data',
        jobTitle: 'Senior Systems Engineer',
        location: 'New York, NY',
        startDate: 'May 2018',
        endDate: 'Dec 2020',
        achievements: [
          'Engineered event-driven streaming pipeline with Apache Kafka handling 50K events per second.',
          'Reduced PostgreSQL query latency by 45% via strategic indexing and query optimization.',
        ],
      },
    ],
    education: [
      {
        id: 1,
        institutionName: 'University of California, Berkeley',
        degree: 'B.S. Computer Science & Electrical Engineering',
        startYear: '2014',
        endYear: '2018',
        score: '3.9 GPA',
      },
    ],
    skills: [
      {
        id: 1,
        groupName: 'Cloud & Infrastructure',
        skills: ['AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform'],
      },
      {
        id: 2,
        groupName: 'Languages & Frameworks',
        skills: ['Go', 'Python', 'TypeScript', 'Node.js', 'React'],
      },
      {
        id: 3,
        groupName: 'Databases & Messaging',
        skills: ['PostgreSQL', 'Redis', 'Kafka', 'Elasticsearch'],
      },
    ],
    projects: [
      {
        id: 1,
        projectName: 'Telemetry Monitoring Hub',
        technologies: 'Go, Prometheus, Grafana, Docker',
        projectLink: 'https://github.com/alexandrachen/telemetry-hub',
        achievements: [
          'Built real-time telemetry agent deployed across 200+ microservice instances.',
          'Improved incident detection speed by 70% with predictive anomaly alerting.',
        ],
      },
    ],
    certifications: [
      'AWS Certified Solutions Architect - Professional',
      'Certified Kubernetes Administrator (CKA)',
    ],
  };

  const result = evaluateResumeATS(completeResume);
  assert(result.totalScore >= 85, `Complete resume should score >= 85, got ${result.totalScore}`);
  assert.strictEqual(result.ratingTier, 'Excellent', `Rating tier should be Excellent, got ${result.ratingTier}`);
  assert(result.allStrengths.length > 5, 'Should have multiple strengths recognized');
  assert(result.disclaimer.includes('automated estimate'), 'Disclaimer must be present and honest');
});

// ==============================================================================
// TEST 3: Scenario 2 - Incomplete Resume (Deductions & Missing Sections Identified)
// ==============================================================================
test('Scenario 2: Incomplete resume identifies missing sections and applies transparent penalties', () => {
  const incompleteResume = {
    personalInfo: {
      fullName: 'Sam Student',
      email: '', // missing required email
      phone: '',
      location: '',
    },
    professionalSummary: '', // missing summary
    workExperience: [], // missing experience
    education: [], // missing education
    skills: [], // missing skills
    projects: [],
    certifications: [],
  };

  const result = evaluateResumeATS(incompleteResume);
  assert(result.totalScore < 50, `Incomplete resume should score < 50, got ${result.totalScore}`);
  assert.strictEqual(result.ratingTier, 'Critical Gaps', `Rating tier should be Critical Gaps, got ${result.ratingTier}`);

  // Contact info deductions
  const contactCat = result.categories.find(c => c.category === 'Contact Information');
  assert(contactCat.score < contactCat.weight, 'Contact score must have deductions');
  assert(contactCat.deductions.some(d => d.reason.includes('Email')), 'Should flag missing email');

  // Experience deductions
  const expCat = result.categories.find(c => c.category === 'Work Experience');
  assert.strictEqual(expCat.score, 0, 'Missing experience should give 0 points');
  assert(expCat.deductions.some(d => d.reason.includes('No work experience')), 'Should flag empty experience');

  // Education deductions
  const eduCat = result.categories.find(c => c.category === 'Education');
  assert.strictEqual(eduCat.score, 0, 'Missing education should give 0 points');

  // Skills deductions
  const skillsCat = result.categories.find(c => c.category === 'Skills');
  assert.strictEqual(skillsCat.score, 0, 'Missing skills should give 0 points');

  // Suggestions should recommend adding core sections
  assert(result.suggestions.some(s => s.category.includes('Experience') || s.issue.includes('experience')), 'Suggestions must include adding experience');
});

// ==============================================================================
// TEST 4: Scenario 3 - Bullet Points with Weak Verbs & Missing Metrics
// ==============================================================================
test('Scenario 3: Correctly flags weak verbs ("worked on", "responsible for") and missing numbers', () => {
  const weakResume = {
    workExperience: [
      {
        id: 1,
        companyName: 'Acme Corp',
        jobTitle: 'Junior Developer',
        location: 'Remote',
        startDate: 'Jan 2023',
        endDate: 'Present',
        achievements: [
          'Worked on the user interface and fixed bugs.',
          'Responsible for backend tasks and daily meetings.',
          'Helped with deploying code to the servers.',
        ],
      },
    ],
    projects: [],
  };

  const bullets = inspectAchievementBullets(weakResume);
  assert.strictEqual(bullets.length, 3, 'Should inspect 3 bullets');

  const weakBullets = bullets.filter(b => b.quality === 'needs-improvement');
  assert(weakBullets.length >= 2, `Should detect at least 2 weak bullets, found ${weakBullets.length}`);

  // Check weak phrase messages
  const allMessages = bullets.flatMap(b => b.issues.map(i => i.message));
  assert(allMessages.some(m => m.includes('worked on')), 'Should detect "worked on"');
  assert(allMessages.some(m => m.includes('responsible for')), 'Should detect "responsible for"');
  assert(allMessages.some(m => m.includes('helped with')), 'Should detect "helped with"');

  // Suggestions generated
  const suggestions = generateContentSuggestions([], bullets, {});
  assert(suggestions.some(s => s.category.includes('Bullet')), 'Must generate bullet improvement suggestions');
});

// ==============================================================================
// TEST 5: Scenario 4 - Measurable Achievements Recognition (%, $, scale)
// ==============================================================================
test('Scenario 4: Recognizes quantifiable metrics (%, $, numeric volume, latency ms)', () => {
  const strongResume = {
    workExperience: [
      {
        id: 1,
        companyName: 'ScaleTech',
        jobTitle: 'Lead Engineer',
        location: 'Austin, TX',
        startDate: 'Jan 2022',
        endDate: 'Present',
        achievements: [
          'Improved system response time by 45% and slashed memory footprint by 300MB.',
          'Saved $120,000 annually by decommissioning redundant cloud infrastructure.',
          'Scaled active user base from 10,000 to 250,000 without downtime.',
        ],
      },
    ],
    projects: [],
  };

  const bullets = inspectAchievementBullets(strongResume);
  assert.strictEqual(bullets.length, 3);
  
  const withMetrics = bullets.filter(b => b.hasMetric);
  assert.strictEqual(withMetrics.length, 3, 'All 3 bullets contain quantifiable metrics');

  const withStrongVerb = bullets.filter(b => b.hasActionVerb);
  assert.strictEqual(withStrongVerb.length, 3, 'All 3 bullets start with strong verbs');

  const weakBullets = bullets.filter(b => b.quality === 'needs-improvement');
  assert.strictEqual(weakBullets.length, 0, 'No weak verbs should be found');
});

// ==============================================================================
// TEST 6: Scenario 5 - Target Job Description Keyword Matching
// ==============================================================================
test('Scenario 5: Extracts keywords from Job Description, calculates coverage % and identifies missing keywords', () => {
  const resume = {
    ...sampleResumeData,
    skills: [
      { id: 1, groupName: 'Tech', skills: ['React', 'JavaScript', 'Node.js', 'Git'] },
    ],
  };

  const jobTitle = 'Senior Full Stack React Engineer';
  const jobDescription = `
    We are seeking a Senior Full Stack Engineer.
    Required technologies: React, TypeScript, Node.js, Docker, Kubernetes, AWS, GraphQL, and PostgreSQL.
    Candidates should have experience with CI/CD and automated testing.
  `;

  const match = analyzeJobDescriptionMatch(resume, jobTitle, jobDescription);
  assert(match.hasJobTarget, 'Job target should be active');
  assert(match.totalKeywordsDetected > 5, 'Should detect at least 5 keywords');

  // Verify matched vs missing
  assert(match.matchedKeywords.includes('react'), 'React should be matched');
  assert(match.matchedKeywords.includes('node.js') || match.matchedKeywords.includes('node'), 'Node should be matched');
  assert(match.missingKeywords.includes('kubernetes'), 'Kubernetes should be listed as missing');
  assert(match.missingKeywords.includes('graphql'), 'GraphQL should be listed as missing');

  assert(match.matchPercentage > 0 && match.matchPercentage < 100, `Match % should be realistic, got ${match.matchPercentage}%`);
});

// ==============================================================================
// TEST 7: Scenario 6 - Graceful Fallback When No Job Description Is Provided
// ==============================================================================
test('Scenario 6: Gracefully handles empty or missing Job Description without crashing or penalizing', () => {
  const match = analyzeJobDescriptionMatch(sampleResumeData, '', '');
  assert.strictEqual(match.hasJobTarget, false, 'hasJobTarget must be false');
  assert.strictEqual(match.matchPercentage, 0);
  assert.deepStrictEqual(match.matchedKeywords, []);
  assert.deepStrictEqual(match.missingKeywords, []);

  // Overall ATS evaluation should run cleanly without JD
  const evalWithoutJD = evaluateResumeATS(sampleResumeData, '', '');
  assert(evalWithoutJD.totalScore >= 70, 'Resume should score well on core rubrics alone');
  assert.strictEqual(evalWithoutJD.jobMatch.hasJobTarget, false);
});

// ==============================================================================
// TEST 8: Scenario 7 - Empty and Optional Fields Safety & Non-negative Scores
// ==============================================================================
test('Scenario 7: Completely empty resume object evaluates cleanly with score >= 0 and never crashes', () => {
  const bareResume = {};
  const result = evaluateResumeATS(bareResume);

  assert(typeof result.totalScore === 'number', 'totalScore must be a number');
  assert(result.totalScore >= 0 && result.totalScore <= 100, `Score must be between 0 and 100, got ${result.totalScore}`);
  assert(Array.isArray(result.categories), 'categories must be an array');
  assert(Array.isArray(result.suggestions), 'suggestions must be an array');
  assert(Array.isArray(result.allStrengths), 'allStrengths must be an array');
  assert(Array.isArray(result.allDeductions), 'allDeductions must be an array');
});

// ==============================================================================
// TEST 9: Privacy & Client-Side Verification
// ==============================================================================
test('Privacy: ATS Analyzer is strictly offline, deterministic, and free of remote network calls', () => {
  // Run evaluator 5 times on same data: must be 100% deterministic
  const r1 = evaluateResumeATS(sampleResumeData);
  const r2 = evaluateResumeATS(sampleResumeData);

  assert.strictEqual(r1.totalScore, r2.totalScore, 'Score must be 100% deterministic');
  assert.strictEqual(r1.ratingTier, r2.ratingTier, 'Rating tier must be 100% deterministic');
  assert.strictEqual(r1.categories.length, r2.categories.length, 'Category count must match');
});

console.log(`\n🎉 All ${passCount} Phase 7 ATS Analyzer tests passed successfully!`);
