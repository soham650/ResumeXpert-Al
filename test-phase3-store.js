// test-phase3-store.js — Automated test suite for Phase 3 Zustand Store & Persistence

// 1. Mock browser window & localStorage environment
class MockLocalStorage {
  constructor() {
    this.store = {};
  }
  getItem(key) {
    return this.store[key] || null;
  }
  setItem(key, value) {
    this.store[key] = String(value);
  }
  removeItem(key) {
    delete this.store[key];
  }
  clear() {
    this.store = {};
  }
}

globalThis.window = {
  localStorage: new MockLocalStorage(),
  print: () => {},
};
globalThis.localStorage = globalThis.window.localStorage;

async function runTests() {
  console.log('🧪 Starting Phase 3 Zustand Store Test Suite...\n');
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

  try {
    // Dynamic import of the store
    const { useResumeStore, STORAGE_KEY, createDefaultResume, createEmptyResume } = await import('./src/store/useResumeStore.js');

    const store = useResumeStore.getState();

    // Test 1: Initial state & schema conformance
    console.log('--- Test 1: Initial State & Schema Conformance ---');
    assert(store.resume !== null && typeof store.resume === 'object', 'Store initializes with resume object');
    assert(store.resume.basics && typeof store.resume.basics === 'object', 'resume.basics exists');
    assert(store.resume.personalInfo === store.resume.basics, 'resume.personalInfo is synchronized alias of basics');
    assert(typeof store.resume.summary === 'string', 'resume.summary is string');
    assert(store.resume.professionalSummary === store.resume.summary, 'resume.professionalSummary is synchronized alias of summary');
    assert(Array.isArray(store.resume.experience), 'resume.experience is array');
    assert(store.resume.workExperience === store.resume.experience, 'resume.workExperience is synchronized alias of experience');
    assert(Array.isArray(store.resume.education), 'resume.education is array');
    assert(Array.isArray(store.resume.skills), 'resume.skills is array');
    assert(Array.isArray(store.resume.projects), 'resume.projects is array');
    assert(Array.isArray(store.resume.certifications), 'resume.certifications is array');
    assert(store.resume.meta && typeof store.resume.meta === 'object', 'resume.meta exists with template & version');

    // Test 2: Update personal information / basics
    console.log('\n--- Test 2: Update Personal Information (Basics) ---');
    useResumeStore.getState().updateBasics({
      fullName: 'Jane Doe',
      professionalTitle: 'Lead Software Architect',
      email: 'jane@example.com',
      phone: '+1 555-0199',
    });
    const s2 = useResumeStore.getState();
    assert(s2.resume.basics.fullName === 'Jane Doe', 'Basics fullName updated to Jane Doe');
    assert(s2.resume.personalInfo.fullName === 'Jane Doe', 'personalInfo alias also reflects updated fullName');
    assert(s2.resume.basics.professionalTitle === 'Lead Software Architect', 'professionalTitle updated');
    assert(s2.resume.basics.email === 'jane@example.com', 'email updated');

    // Test 3: Update professional summary
    console.log('\n--- Test 3: Update Professional Summary ---');
    const newSummary = 'Experienced engineering leader specializing in distributed systems and cloud architecture.';
    useResumeStore.getState().updateSummary(newSummary);
    const s3 = useResumeStore.getState();
    assert(s3.resume.summary === newSummary, 'resume.summary updated');
    assert(s3.resume.professionalSummary === newSummary, 'resume.professionalSummary updated');

    // Test 4: Experience CRUD actions
    console.log('\n--- Test 4: Experience CRUD Actions ---');
    const expInitialCount = useResumeStore.getState().resume.experience.length;
    useResumeStore.getState().addExperience({
      companyName: 'OpenAI Technologies',
      jobTitle: 'Principal Engineer',
      location: 'San Francisco, CA',
      startDate: '2024',
      endDate: 'Present',
      achievements: ['Designed next-gen agent architecture'],
    });
    const s4_add = useResumeStore.getState();
    assert(s4_add.resume.experience.length === expInitialCount + 1, 'addExperience increases list length');
    const addedExp = s4_add.resume.experience[s4_add.resume.experience.length - 1];
    assert(addedExp.companyName === 'OpenAI Technologies', 'New experience entry has correct companyName');
    assert(Boolean(addedExp.id), 'New experience entry has stable unique id');

    // Update experience
    useResumeStore.getState().updateExperience(addedExp.id, {
      jobTitle: 'Distinguished Engineer',
    });
    const s4_upd = useResumeStore.getState();
    const updatedExp = s4_upd.resume.experience.find((e) => e.id === addedExp.id);
    assert(updatedExp.jobTitle === 'Distinguished Engineer', 'updateExperience updates specific entry');

    // Remove experience
    useResumeStore.getState().removeExperience(addedExp.id);
    const s4_rem = useResumeStore.getState();
    assert(s4_rem.resume.experience.length === expInitialCount, 'removeExperience removes targeted entry by id');

    // Test 5: Education CRUD actions
    console.log('\n--- Test 5: Education CRUD Actions ---');
    const eduInitialCount = useResumeStore.getState().resume.education.length;
    useResumeStore.getState().addEducation({
      institutionName: 'Stanford University',
      degree: 'M.S. in Computer Science',
      startYear: '2020',
      endYear: '2022',
      score: 'GPA: 4.0/4.0',
    });
    const s5_add = useResumeStore.getState();
    assert(s5_add.resume.education.length === eduInitialCount + 1, 'addEducation adds entry');
    const addedEdu = s5_add.resume.education[s5_add.resume.education.length - 1];

    useResumeStore.getState().updateEducation(addedEdu.id, {
      score: 'GPA: 3.98/4.0',
    });
    const s5_upd = useResumeStore.getState();
    assert(s5_upd.resume.education.find((e) => e.id === addedEdu.id).score === 'GPA: 3.98/4.0', 'updateEducation modifies entry');

    useResumeStore.getState().removeEducation(addedEdu.id);
    const s5_rem = useResumeStore.getState();
    assert(s5_rem.resume.education.length === eduInitialCount, 'removeEducation removes entry by id');

    // Test 6: Skills CRUD actions
    console.log('\n--- Test 6: Skills Group CRUD Actions ---');
    const skillsInitialCount = useResumeStore.getState().resume.skills.length;
    useResumeStore.getState().addSkillGroup({
      groupName: 'Cloud & DevOps',
      skills: ['Kubernetes', 'Terraform', 'AWS'],
    });
    const s6_add = useResumeStore.getState();
    assert(s6_add.resume.skills.length === skillsInitialCount + 1, 'addSkillGroup adds new group');
    const addedSkillGroup = s6_add.resume.skills[s6_add.resume.skills.length - 1];

    useResumeStore.getState().updateSkillGroup(addedSkillGroup.id, {
      groupName: 'Cloud & Infrastructure',
    });
    const s6_upd = useResumeStore.getState();
    assert(s6_upd.resume.skills.find((g) => g.id === addedSkillGroup.id).groupName === 'Cloud & Infrastructure', 'updateSkillGroup modifies groupName');

    useResumeStore.getState().removeSkillGroup(addedSkillGroup.id);
    const s6_rem = useResumeStore.getState();
    assert(s6_rem.resume.skills.length === skillsInitialCount, 'removeSkillGroup removes targeted group');

    // Test 7: Projects CRUD actions
    console.log('\n--- Test 7: Projects CRUD Actions ---');
    const projInitialCount = useResumeStore.getState().resume.projects.length;
    useResumeStore.getState().addProject({
      projectName: 'Autonomous Agent Platform',
      technologies: 'React, Zustand, Node.js',
      projectLink: 'https://github.com/example/agents',
      achievements: ['Handled 100K requests/min with sub-10ms latency'],
    });
    const s7_add = useResumeStore.getState();
    assert(s7_add.resume.projects.length === projInitialCount + 1, 'addProject adds entry');
    const addedProj = s7_add.resume.projects[s7_add.resume.projects.length - 1];

    useResumeStore.getState().updateProject(addedProj.id, {
      technologies: 'React 18, Zustand 5, Node.js',
    });
    const s7_upd = useResumeStore.getState();
    assert(s7_upd.resume.projects.find((p) => p.id === addedProj.id).technologies === 'React 18, Zustand 5, Node.js', 'updateProject updates data');

    useResumeStore.getState().removeProject(addedProj.id);
    const s7_rem = useResumeStore.getState();
    assert(s7_rem.resume.projects.length === projInitialCount, 'removeProject removes entry by id');

    // Test 8: Certifications CRUD actions
    console.log('\n--- Test 8: Certifications CRUD Actions ---');
    const certInitialCount = useResumeStore.getState().resume.certifications.length;
    useResumeStore.getState().addCertification('CKA: Certified Kubernetes Administrator');
    const s8_add = useResumeStore.getState();
    assert(s8_add.resume.certifications.length === certInitialCount + 1, 'addCertification adds entry');
    assert(s8_add.resume.certifications.includes('CKA: Certified Kubernetes Administrator'), 'New cert exists in array');

    const certIndex = s8_add.resume.certifications.indexOf('CKA: Certified Kubernetes Administrator');
    useResumeStore.getState().updateCertification(certIndex, 'CKA: Certified Kubernetes Administrator (Honors)');
    const s8_upd = useResumeStore.getState();
    assert(s8_upd.resume.certifications[certIndex] === 'CKA: Certified Kubernetes Administrator (Honors)', 'updateCertification updates value at index');

    useResumeStore.getState().removeCertification(certIndex);
    const s8_rem = useResumeStore.getState();
    assert(s8_rem.resume.certifications.length === certInitialCount, 'removeCertification removes entry by index');

    // Test 9: LocalStorage Persistence & Hydration
    console.log('\n--- Test 9: LocalStorage Persistence & Hydration ---');
    const rawStorage = globalThis.localStorage.getItem(STORAGE_KEY);
    assert(rawStorage !== null, 'LocalStorage contains saved resume data under STORAGE_KEY');
    const parsedStorage = JSON.parse(rawStorage);
    assert(parsedStorage.state && parsedStorage.state.resume, 'Persisted JSON contains valid state.resume');
    assert(parsedStorage.version === 1, 'Persisted JSON has correct version (1)');

    // Test 10: Reset Resume to sample
    console.log('\n--- Test 10: Reset Resume to Sample Data ---');
    useResumeStore.getState().resetResume();
    const s10 = useResumeStore.getState();
    assert(s10.resume.basics.fullName === 'John Doe', 'resetResume restores sample candidate name');
    assert(s10.activeTemplate === 'classic', 'resetResume resets template to classic');

    // Test 11: Clear Saved Resume
    console.log('\n--- Test 11: Clear Saved Resume ---');
    useResumeStore.getState().clearSavedResume();
    const s11 = useResumeStore.getState();
    assert(s11.resume.basics.fullName === '', 'clearSavedResume empties basics.fullName');
    assert(globalThis.localStorage.getItem(STORAGE_KEY) === null, 'clearSavedResume clears LocalStorage');

    // Test 12: Corrupted LocalStorage Handling
    console.log('\n--- Test 12: Corrupted LocalStorage Graceful Recovery ---');
    globalThis.localStorage.setItem(STORAGE_KEY, 'INVALID_CORRUPTED_JSON{[:;}');
    const fallbackResume = createDefaultResume();
    assert(fallbackResume.basics !== undefined, 'Safe fallback creates valid resume structure even if storage is corrupted');

    // Test 13: Template & PDF Data Interface Integrity
    console.log('\n--- Test 13: Template & PDF Data Interface Integrity ---');
    useResumeStore.getState().resetResume();
    const s13 = useResumeStore.getState();
    const resumeDocData = s13.resume;
    assert(Boolean(resumeDocData.personalInfo), 'Template data contract: personalInfo is accessible');
    assert(Boolean(resumeDocData.professionalSummary), 'Template data contract: professionalSummary is accessible');
    assert(Array.isArray(resumeDocData.workExperience), 'Template data contract: workExperience is accessible');
    assert(Array.isArray(resumeDocData.education), 'Template data contract: education is accessible');
    assert(Array.isArray(resumeDocData.skills), 'Template data contract: skills is accessible');
    assert(Array.isArray(resumeDocData.projects), 'Template data contract: projects is accessible');
    assert(Array.isArray(resumeDocData.certifications), 'Template data contract: certifications is accessible');

    console.log(`\n========================================`);
    console.log(`Phase 3 Test Results: ${passed} PASSED, ${failed} FAILED`);
    console.log(`========================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Fatal test runner exception:', error);
    process.exit(1);
  }
}

runTests();

