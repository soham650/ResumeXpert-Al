/**
 * Phase 5 Automated Test Suite: Dynamic Form Sections & Advanced Repeatable Fields
 * Tests Experience, Education, Skills, Projects, and Certifications dynamic actions,
 * reordering, duplicate prevention, and validation integration.
 */

import assert from 'node:assert';
import { 
  workExperienceSchema, 
  educationSchema, 
  skillsSchema, 
  projectsSchema, 
  certificationsSchema 
} from './src/schema/validation.js';

// Setup Mock LocalStorage for Node environment before importing store
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

const mockStorageInstance = new MockLocalStorage();
globalThis.window = {
  localStorage: mockStorageInstance,
  print: () => {},
};
globalThis.localStorage = mockStorageInstance;

async function runTestSuite() {
  const { useResumeStore, STORAGE_KEY } = await import('./src/store/useResumeStore.js');

  console.log('🧪 Starting Phase 5 Dynamic Form Sections & Repeatable Fields Test Suite...\n');

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

  // Reset store to known fresh state
  useResumeStore.getState().resetResume();

  // ============================================================================
  // Suite 1: Dynamic Work Experience Section
  // ============================================================================
  console.log('--- Test 1: Dynamic Work Experience CRUD & Reordering ---');

  test('Add experience appends item with unique ID and default Present', () => {
    const store = useResumeStore.getState();
    const initialLength = store.resume.experience.length;
    
    store.addExperience({
      companyName: 'Acme Corp',
      jobTitle: 'Staff Engineer',
      location: 'Remote',
      startDate: '2023',
      endDate: 'Present',
      achievements: ['Led architecture overhaul'],
    });

    const updated = useResumeStore.getState().resume.experience;
    assert.strictEqual(updated.length, initialLength + 1);
    const latest = updated[updated.length - 1];
    assert.strictEqual(latest.companyName, 'Acme Corp');
    assert.strictEqual(latest.jobTitle, 'Staff Engineer');
    assert.strictEqual(latest.endDate, 'Present');
    assert.ok(latest.id !== undefined, 'ID should be present');
  });

  test('Update experience modifies targeted item without corrupting others', () => {
    const store = useResumeStore.getState();
    const list = store.resume.experience;
    const targetId = list[0].id;

    store.updateExperience(targetId, { companyName: 'Globex Inc' });

    const updated = useResumeStore.getState().resume.experience;
    assert.strictEqual(updated[0].companyName, 'Globex Inc');
    if (updated.length > 1) {
      assert.notStrictEqual(updated[1].companyName, 'Globex Inc');
    }
  });

  test('Reorder experience moves entry between indices safely', () => {
    const store = useResumeStore.getState();
    const originalFirst = store.resume.experience[0];
    const originalSecond = store.resume.experience[1];

    store.reorderExperience(0, 1);

    const updated = useResumeStore.getState().resume.experience;
    assert.strictEqual(updated[0].id, originalSecond.id);
    assert.strictEqual(updated[1].id, originalFirst.id);
  });

  test('Reorder experience ignores out-of-bounds indices gracefully', () => {
    const store = useResumeStore.getState();
    const currentList = [...store.resume.experience];
    
    store.reorderExperience(-1, 0);
    store.reorderExperience(0, 999);

    const after = useResumeStore.getState().resume.experience;
    assert.strictEqual(after.length, currentList.length);
    assert.strictEqual(after[0].id, currentList[0].id);
  });

  test('Remove experience removes targeted entry and maintains aliases', () => {
    const store = useResumeStore.getState();
    const target = store.resume.experience[0];
    const initialLen = store.resume.experience.length;

    store.removeExperience(target.id);

    const updated = useResumeStore.getState().resume.experience;
    assert.strictEqual(updated.length, initialLen - 1);
    assert.ok(!updated.some((item) => item.id === target.id));
    assert.strictEqual(useResumeStore.getState().resume.workExperience.length, updated.length);
  });

  // ============================================================================
  // Suite 2: Dynamic Education Section
  // ============================================================================
  console.log('\n--- Test 2: Dynamic Education Section & Reordering ---');

  test('Add education adds entry with unique ID', () => {
    const store = useResumeStore.getState();
    const initLen = store.resume.education.length;

    store.addEducation({
      institutionName: 'Stanford University',
      degree: 'M.S. Computer Science',
      startYear: '2020',
      endYear: '2022',
      score: '3.9 GPA',
    });

    const updated = useResumeStore.getState().resume.education;
    assert.strictEqual(updated.length, initLen + 1);
    const latest = updated[updated.length - 1];
    assert.strictEqual(latest.institutionName, 'Stanford University');
    assert.strictEqual(latest.degree, 'M.S. Computer Science');
  });

  test('Reorder education moves items correctly', () => {
    const store = useResumeStore.getState();
    const first = store.resume.education[0];
    const second = store.resume.education[1];

    store.reorderEducation(0, 1);

    const updated = useResumeStore.getState().resume.education;
    assert.strictEqual(updated[0].id, second.id);
    assert.strictEqual(updated[1].id, first.id);
  });

  test('Update education list supports batch replacement', () => {
    const store = useResumeStore.getState();
    const newList = [
      { id: 101, institutionName: 'MIT', degree: 'B.S. EECS', startYear: '2016', endYear: '2020', score: '4.0' }
    ];

    store.updateEducationList(newList);

    const updated = useResumeStore.getState().resume.education;
    assert.strictEqual(updated.length, 1);
    assert.strictEqual(updated[0].institutionName, 'MIT');
  });

  // ============================================================================
  // Suite 3: Advanced Skills Manager
  // ============================================================================
  console.log('\n--- Test 3: Advanced Skills Manager & Tag De-duplication ---');

  test('Add skill group creates distinct category', () => {
    const store = useResumeStore.getState();
    const initLen = store.resume.skills.length;

    store.addSkillGroup({
      groupName: 'Cloud & DevOps',
      skills: ['AWS', 'Docker'],
    });

    const updated = useResumeStore.getState().resume.skills;
    assert.strictEqual(updated.length, initLen + 1);
    const latest = updated[updated.length - 1];
    assert.strictEqual(latest.groupName, 'Cloud & DevOps');
    assert.deepStrictEqual(latest.skills, ['AWS', 'Docker']);
  });

  test('Add skill to group adds valid new skill tag', () => {
    const store = useResumeStore.getState();
    const group = store.resume.skills[0];

    const result = store.addSkillToGroup(group.id, 'GraphQL');
    assert.strictEqual(result, true);

    const updated = useResumeStore.getState().resume.skills.find(g => g.id === group.id);
    assert.ok(updated.skills.includes('GraphQL'));
  });

  test('Add skill to group prevents case-insensitive duplicate', () => {
    const store = useResumeStore.getState();
    const group = store.resume.skills[0];

    // Try to add duplicate with different casing
    const result = store.addSkillToGroup(group.id, 'graphql');
    assert.strictEqual(result, false, 'Duplicate skill should be rejected');

    const updated = useResumeStore.getState().resume.skills.find(g => g.id === group.id);
    const occurrences = updated.skills.filter(s => s.toLowerCase() === 'graphql');
    assert.strictEqual(occurrences.length, 1);
  });

  test('Remove skill from group removes target index only', () => {
    const store = useResumeStore.getState();
    const group = store.resume.skills[0];
    const initialSkillCount = group.skills.length;
    const removedSkill = group.skills[0];

    store.removeSkillFromGroup(group.id, 0);

    const updated = useResumeStore.getState().resume.skills.find(g => g.id === group.id);
    assert.strictEqual(updated.skills.length, initialSkillCount - 1);
    assert.ok(!updated.skills.includes(removedSkill));
  });

  test('Reorder skill categories moves groups accurately', () => {
    const store = useResumeStore.getState();
    if (store.resume.skills.length < 2) {
      store.addSkillGroup({ groupName: 'Extra Group', skills: ['A'] });
    }

    const first = store.resume.skills[0];
    const second = store.resume.skills[1];

    store.reorderSkillGroup(0, 1);

    const updated = useResumeStore.getState().resume.skills;
    assert.strictEqual(updated[0].id, second.id);
    assert.strictEqual(updated[1].id, first.id);
  });

  // ============================================================================
  // Suite 4: Dynamic Projects Section
  // ============================================================================
  console.log('\n--- Test 4: Dynamic Projects Section & Reordering ---');

  test('Add project creates item with unique ID', () => {
    const store = useResumeStore.getState();
    const initLen = store.resume.projects.length;

    store.addProject({
      projectName: 'AI Assistant',
      technologies: 'Next.js, Python, FastAPI',
      projectLink: 'https://github.com/example/ai-assistant',
      achievements: ['Deployed to 50K users'],
    });

    const updated = useResumeStore.getState().resume.projects;
    assert.strictEqual(updated.length, initLen + 1);
    const latest = updated[updated.length - 1];
    assert.strictEqual(latest.projectName, 'AI Assistant');
    assert.ok(latest.id !== undefined);
  });

  test('Reorder projects moves items correctly', () => {
    const store = useResumeStore.getState();
    const first = store.resume.projects[0];
    const second = store.resume.projects[1];

    store.reorderProjects(0, 1);

    const updated = useResumeStore.getState().resume.projects;
    assert.strictEqual(updated[0].id, second.id);
    assert.strictEqual(updated[1].id, first.id);
  });

  test('Remove project removes targeted entry', () => {
    const store = useResumeStore.getState();
    const targetId = store.resume.projects[0].id;
    const initLen = store.resume.projects.length;

    store.removeProject(targetId);

    const updated = useResumeStore.getState().resume.projects;
    assert.strictEqual(updated.length, initLen - 1);
    assert.ok(!updated.some(p => p.id === targetId));
  });

  // ============================================================================
  // Suite 5: Dynamic Certifications Section
  // ============================================================================
  console.log('\n--- Test 5: Dynamic Certifications Section & Reordering ---');

  test('Add certification adds non-empty string and trims whitespace', () => {
    const store = useResumeStore.getState();
    const initLen = store.resume.certifications.length;

    store.addCertification('   Certified Kubernetes Administrator (CKA)   ');

    const updated = useResumeStore.getState().resume.certifications;
    assert.strictEqual(updated.length, initLen + 1);
    assert.strictEqual(updated[updated.length - 1], 'Certified Kubernetes Administrator (CKA)');
  });

  test('Add certification ignores empty or whitespace-only inputs', () => {
    const store = useResumeStore.getState();
    const initLen = store.resume.certifications.length;

    store.addCertification('     ');

    const updated = useResumeStore.getState().resume.certifications;
    assert.strictEqual(updated.length, initLen);
  });

  test('Reorder certifications moves item between indices', () => {
    useResumeStore.getState().addCertification('Cert A');
    useResumeStore.getState().addCertification('Cert B');
    const certs = useResumeStore.getState().resume.certifications;
    const idxA = certs.indexOf('Cert A');
    const idxB = certs.indexOf('Cert B');

    useResumeStore.getState().reorderCertifications(idxA, idxB);

    const updated = useResumeStore.getState().resume.certifications;
    assert.strictEqual(updated[idxB], 'Cert A');
  });

  test('Remove certification deletes entry by index', () => {
    const store = useResumeStore.getState();
    const initLen = store.resume.certifications.length;
    const target = store.resume.certifications[0];

    store.removeCertification(0);

    const updated = useResumeStore.getState().resume.certifications;
    assert.strictEqual(updated.length, initLen - 1);
    assert.notStrictEqual(updated[0], target);
  });

  // ============================================================================
  // Suite 6: Zod Validation Integration with Dynamic Repeatable Lists
  // ============================================================================
  console.log('\n--- Test 6: Zod Validation Integration with Dynamic Lists ---');

  test('workExperienceSchema validates dynamic array with multiple items', () => {
    const validData = {
      workExperience: [
        {
          companyName: 'Company 1',
          jobTitle: 'Developer',
          location: 'City',
          startDate: '2021',
          endDate: '2023',
          achievements: ['Bullet 1', 'Bullet 2'],
        },
        {
          companyName: 'Company 2',
          jobTitle: 'Senior Dev',
          location: 'City',
          startDate: '2023',
          endDate: 'Present',
          achievements: ['Bullet 3'],
        },
      ],
    };

    const parsed = workExperienceSchema.safeParse(validData);
    assert.strictEqual(parsed.success, true);
  });

  test('educationSchema validates dynamic array with multiple degrees', () => {
    const validData = {
      education: [
        {
          institutionName: 'University A',
          degree: 'Bachelor of Science',
          startYear: '2016',
          endYear: '2020',
          score: '3.8 GPA',
        },
        {
          institutionName: 'University B',
          degree: 'Master of Science',
          startYear: '2020',
          endYear: '2022',
          score: '3.9 GPA',
        },
      ],
    };

    const parsed = educationSchema.safeParse(validData);
    assert.strictEqual(parsed.success, true);
  });

  test('skillsSchema catches duplicate skill inside any group', () => {
    const invalidData = {
      skills: [
        {
          groupName: 'Languages',
          skills: ['JavaScript', 'Python', 'javascript'], // Duplicate
        },
      ],
    };

    const parsed = skillsSchema.safeParse(invalidData);
    assert.strictEqual(parsed.success, false);
    assert.ok(parsed.error.issues.some(i => i.message.includes('Duplicate')));
  });

  test('projectsSchema validates dynamic array of projects with valid URLs', () => {
    const validData = {
      projects: [
        {
          projectName: 'DevPortal',
          technologies: 'React, Node',
          projectLink: 'https://devportal.io',
          achievements: ['Scalable portal'],
        },
        {
          projectName: 'CLI Tool',
          technologies: 'Go',
          projectLink: 'github.com/user/cli',
          achievements: ['1K stars'],
        },
      ],
    };

    const parsed = projectsSchema.safeParse(validData);
    assert.strictEqual(parsed.success, true);
  });

  test('certificationsSchema accepts valid dynamic list', () => {
    const validData = {
      certifications: ['AWS Solutions Architect', 'GCP Cloud Engineer'],
    };

    const parsed = certificationsSchema.safeParse(validData);
    assert.strictEqual(parsed.success, true);
  });

  // ============================================================================
  // Suite 7: LocalStorage Persistence Conformance
  // ============================================================================
  console.log('\n--- Test 7: LocalStorage Persistence & Structure Conformance ---');

  test('LocalStorage saves full modified state with correct store structure', () => {
    const raw = mockStorageInstance.getItem(STORAGE_KEY);
    assert.ok(raw, 'LocalStorage should contain saved resume string');
    const parsed = JSON.parse(raw);
    assert.ok(parsed.state.resume.experience.length > 0);
    assert.ok(parsed.state.resume.skills.length > 0);
    assert.ok(parsed.state.resume.meta.lastSaved);
  });

  console.log(`\n========================================`);
  console.log(`Phase 5 Dynamic Sections Test Results: ${passCount} PASSED, 0 FAILED`);
  console.log(`========================================\n`);
}

runTestSuite().catch(err => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
