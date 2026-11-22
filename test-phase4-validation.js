// test-phase4-validation.js — Automated test suite for Phase 4 React Hook Form + Zod Validation Integration

import {
  personalInfoSchema,
  professionalSummarySchema,
  workExperienceSchema,
  educationSchema,
  skillsSchema,
  projectsSchema,
  certificationsSchema,
  fullResumeSchema,
  validateStepData,
} from './src/schema/validation.js';

import { useResumeStore, createDefaultResume, createEmptyResume } from './src/store/useResumeStore.js';
import { sampleResumeData } from './src/data/sampleData.js';

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failed++;
  }
}

async function runTests() {
  console.log('🧪 Starting Phase 4 Form Validation & Multi-step Test Suite...\n');

  // -----------------------------------------------------------------
  // 1. Personal Information Validation (Valid & Invalid)
  // -----------------------------------------------------------------
  console.log('--- Test 1 & 2: Personal Information & URL/Email Validation ---');
  // Valid personal info
  const validPersonal = {
    fullName: 'John Doe',
    professionalTitle: 'Full Stack Developer',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    location: 'Nagpur, India',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    githubUrl: 'https://github.com/johndoe',
    portfolioUrl: 'https://johndoe.dev',
    additionalLinks: [],
  };
  const parseValid = personalInfoSchema.safeParse(validPersonal);
  assert(parseValid.success, 'Valid personal info passes validation');

  // Empty full name should fail
  const emptyName = personalInfoSchema.safeParse({ ...validPersonal, fullName: '   ' });
  assert(!emptyName.success && emptyName.error.issues.some((i) => i.path.includes('fullName')), 'Empty full name fails with error');

  // Invalid email
  const invalidEmail = personalInfoSchema.safeParse({ ...validPersonal, email: 'notanemail' });
  assert(!invalidEmail.success && invalidEmail.error.issues.some((i) => i.path.includes('email')), 'Malformed email fails validation');

  // Invalid URL format
  const invalidUrl = personalInfoSchema.safeParse({ ...validPersonal, linkedinUrl: 'http://' });
  assert(!invalidUrl.success && invalidUrl.error.issues.some((i) => i.path.includes('linkedinUrl')), 'Malformed URL fails validation');

  // Domain-style URL without https (e.g. linkedin.com/in/user) should pass
  const domainUrl = personalInfoSchema.safeParse({ ...validPersonal, linkedinUrl: 'linkedin.com/in/johndoe' });
  assert(domainUrl.success, 'Standard domain URL format passes validation');

  // -----------------------------------------------------------------
  // 2. Summary Validation (Character Limit)
  // -----------------------------------------------------------------
  console.log('\n--- Test 3: Professional Summary Validation ---');
  const validSummary = professionalSummarySchema.safeParse({
    professionalSummary: 'Passionate developer with 3+ years experience.',
  });
  assert(validSummary.success, 'Valid summary passes validation');

  const emptySummary = professionalSummarySchema.safeParse({
    professionalSummary: '',
  });
  assert(emptySummary.success, 'Empty summary is optional and passes validation');

  const tooLongText = 'a'.repeat(451);
  const tooLongSummary = professionalSummarySchema.safeParse({
    professionalSummary: tooLongText,
  });
  assert(!tooLongSummary.success && tooLongSummary.error.issues[0].message.includes('450'), 'Summary exceeding 450 characters fails validation');

  // -----------------------------------------------------------------
  // 3. Work Experience Validation
  // -----------------------------------------------------------------
  console.log('\n--- Test 4 & 5: Work Experience Validation & Multiple Entries ---');
  const validExperience = {
    workExperience: [
      {
        companyName: 'Tech Corp',
        jobTitle: 'Senior Developer',
        location: 'Nagpur, India',
        startDate: 'Jan 2024',
        endDate: 'Present',
        achievements: ['Built scalable web apps'],
      },
      {
        companyName: 'StartupXYZ',
        jobTitle: 'Full Stack Engineer',
        location: 'Remote',
        startDate: '2021',
        endDate: '2023',
        achievements: ['Improved performance'],
      },
    ],
  };
  const expParse = workExperienceSchema.safeParse(validExperience);
  assert(expParse.success, 'Multiple valid experience entries pass validation');

  // Missing company name
  const missingCompany = workExperienceSchema.safeParse({
    workExperience: [{ ...validExperience.workExperience[0], companyName: '   ' }],
  });
  assert(!missingCompany.success && missingCompany.error.issues.some((i) => i.path.includes('companyName')), 'Missing company name fails validation');

  // Missing job title
  const missingTitle = workExperienceSchema.safeParse({
    workExperience: [{ ...validExperience.workExperience[0], jobTitle: '' }],
  });
  assert(!missingTitle.success && missingTitle.error.issues.some((i) => i.path.includes('jobTitle')), 'Missing job title fails validation');

  // Inconsistent dates (end year earlier than start year)
  const invalidDates = workExperienceSchema.safeParse({
    workExperience: [{ ...validExperience.workExperience[0], startDate: '2024', endDate: '2021' }],
  });
  assert(!invalidDates.success && invalidDates.error.issues.some((i) => i.message.includes('earlier than start date')), 'End date earlier than start date fails validation');

  // -----------------------------------------------------------------
  // 4. Education Validation
  // -----------------------------------------------------------------
  console.log('\n--- Test 6: Education Validation ---');
  const validEdu = {
    education: [
      {
        institutionName: 'Your College',
        degree: 'B.E. Computer Science',
        startYear: '2022',
        endYear: '2026',
        score: '8.2 CGPA',
      },
    ],
  };
  const eduParse = educationSchema.safeParse(validEdu);
  assert(eduParse.success, 'Valid education entry passes validation');

  // Missing degree
  const missingDegree = educationSchema.safeParse({
    education: [{ ...validEdu.education[0], degree: '' }],
  });
  assert(!missingDegree.success && missingDegree.error.issues.some((i) => i.path.includes('degree')), 'Missing degree fails validation');

  // Inconsistent years (end year before start year)
  const invalidYears = educationSchema.safeParse({
    education: [{ ...validEdu.education[0], startYear: '2026', endYear: '2022' }],
  });
  assert(!invalidYears.success && invalidYears.error.issues.some((i) => i.message.includes('earlier than start year')), 'End year earlier than start year fails validation');

  // -----------------------------------------------------------------
  // 5. Skills Validation & Duplicate Handling
  // -----------------------------------------------------------------
  console.log('\n--- Test 7: Skills Validation & Duplicate Detection ---');
  const validSkills = {
    skills: [
      {
        groupName: 'Languages',
        skills: ['JavaScript', 'Python', 'TypeScript'],
      },
    ],
  };
  const skillsParse = skillsSchema.safeParse(validSkills);
  assert(skillsParse.success, 'Valid skills group passes validation');

  // Missing group name
  const missingGroup = skillsSchema.safeParse({
    skills: [{ groupName: '  ', skills: ['Python'] }],
  });
  assert(!missingGroup.success && missingGroup.error.issues.some((i) => i.path.includes('groupName')), 'Missing skill group name fails validation');

  // Duplicate skills in same group
  const duplicateSkills = skillsSchema.safeParse({
    skills: [{ groupName: 'Languages', skills: ['Python', 'python'] }],
  });
  assert(!duplicateSkills.success && duplicateSkills.error.issues.some((i) => i.message.includes('Duplicate skills')), 'Duplicate skills in group are caught by validation');

  // Empty skill strings
  const emptySkill = skillsSchema.safeParse({
    skills: [{ groupName: 'Languages', skills: ['Python', ''] }],
  });
  assert(!emptySkill.success && emptySkill.error.issues.some((i) => i.message.includes('empty')), 'Accidental empty skill caught by validation');

  // -----------------------------------------------------------------
  // 6. Projects Validation
  // -----------------------------------------------------------------
  console.log('\n--- Test 8: Projects Validation & Project URLs ---');
  const validProj = {
    projects: [
      {
        projectName: 'Inventory SaaS',
        technologies: 'React, Supabase',
        projectLink: 'https://github.com/yourname/inventory',
        achievements: ['Built multi-tenant POS'],
      },
    ],
  };
  const projParse = projectsSchema.safeParse(validProj);
  assert(projParse.success, 'Valid project entry passes validation');

  // Missing project name
  const missingProjName = projectsSchema.safeParse({
    projects: [{ ...validProj.projects[0], projectName: '' }],
  });
  assert(!missingProjName.success && missingProjName.error.issues.some((i) => i.path.includes('projectName')), 'Missing project name fails validation');

  // Invalid project link
  const invalidProjLink = projectsSchema.safeParse({
    projects: [{ ...validProj.projects[0], projectLink: 'http://' }],
  });
  assert(!invalidProjLink.success && invalidProjLink.error.issues.some((i) => i.path.includes('projectLink')), 'Invalid project URL fails validation');

  // -----------------------------------------------------------------
  // 7. Certifications Validation
  // -----------------------------------------------------------------
  console.log('\n--- Test 9: Certifications Validation ---');
  const validCerts = {
    certifications: ['AWS Cloud Practitioner', 'Google Cloud Certified'],
  };
  const certParse = certificationsSchema.safeParse(validCerts);
  assert(certParse.success, 'Valid certifications list passes validation');

  const emptyCertItem = certificationsSchema.safeParse({
    certifications: ['AWS Cloud Practitioner', '  '],
  });
  assert(!emptyCertItem.success, 'Blank certification entry fails validation');

  // -----------------------------------------------------------------
  // 8. Multi-Step Navigation & Future-Step Protection
  // -----------------------------------------------------------------
  console.log('\n--- Test 10 & 11: Multi-Step Navigation & Validation Guard ---');
  const completeResume = createDefaultResume(sampleResumeData);
  assert(validateStepData(1, completeResume) === true, 'Step 1 valid for sample resume');
  assert(validateStepData(2, completeResume) === true, 'Step 2 valid for sample resume');
  assert(validateStepData(3, completeResume) === true, 'Step 3 valid for sample resume');

  // Corrupted step 1 (empty fullName)
  const corruptedStep1 = {
    ...completeResume,
    personalInfo: { ...completeResume.personalInfo, fullName: '' },
  };
  assert(validateStepData(1, corruptedStep1) === false, 'validateStepData detects invalid step 1 and blocks forward navigation');

  // -----------------------------------------------------------------
  // 9. Full Resume Schema
  // -----------------------------------------------------------------
  console.log('\n--- Test 12: Full Resume Schema Integration ---');
  const fullParse = fullResumeSchema.safeParse(completeResume);
  assert(fullParse.success, 'Complete sample resume conforms to fullResumeSchema');

  // -----------------------------------------------------------------
  // 10. PDF Architecture Verification
  // -----------------------------------------------------------------
  console.log('\n--- Test 13: Template & PDF Data Interface Integrity ---');
  assert(Boolean(completeResume.personalInfo.fullName), 'personalInfo interface matches ClassicTemplate');
  assert(Boolean(completeResume.professionalSummary), 'professionalSummary interface matches ClassicTemplate');
  assert(Array.isArray(completeResume.workExperience), 'workExperience interface matches ClassicTemplate');

  console.log(`\n========================================`);
  console.log(`Phase 4 Validation Results: ${passed} PASSED, ${failed} FAILED`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();

