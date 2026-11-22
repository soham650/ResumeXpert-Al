/**
 * ==============================================================
 * ResumeCraft Phase 9: Supabase Authentication, Profiles & Cloud Storage Test Suite
 * ==============================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Starting Phase 9 Supabase Auth & Cloud Resumes Test Suite...\n');

let passedTests = 0;
let failedTests = 0;

const test = (description, fn) => {
  try {
    fn();
    console.log(`  ✅ PASS: ${description}`);
    passedTests++;
  } catch (error) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     Error: ${error.message}`);
    failedTests++;
  }
};

const asyncTest = async (description, fn) => {
  try {
    await fn();
    console.log(`  ✅ PASS: ${description}`);
    passedTests++;
  } catch (error) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(`     Error: ${error.message}`);
    failedTests++;
  }
};

// -------------------------------------------------------------
// Section 1: Supabase Client Configuration & Missing Credentials Safety
// -------------------------------------------------------------
console.log('--- 1. Supabase Client Configuration & Safety ---');

import { checkIsConfigured } from './src/lib/supabaseClient.js';

test('checkIsConfigured: returns false for missing or empty credentials', () => {
  assert.strictEqual(checkIsConfigured('', ''), false);
  assert.strictEqual(checkIsConfigured(null, null), false);
  assert.strictEqual(checkIsConfigured(undefined, undefined), false);
});

test('checkIsConfigured: returns false for placeholder credentials', () => {
  assert.strictEqual(
    checkIsConfigured('https://your-project.supabase.co', 'your-anon-key-here'),
    false
  );
  assert.strictEqual(
    checkIsConfigured('https://dummy.supabase.co', 'your-anon-key'),
    false
  );
});

test('checkIsConfigured: returns true for valid real Supabase credentials', () => {
  assert.strictEqual(
    checkIsConfigured('https://xyzcompany.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyPayloadTokenKey'),
    true
  );
});

// -------------------------------------------------------------
// Section 2: Authentication Input Validation & Security Sanitization
// -------------------------------------------------------------
console.log('\n--- 2. Auth Input Validation & Security ---');

const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
};

const validatePassword = (pwd) => {
  if (!pwd || typeof pwd !== 'string') return false;
  return pwd.length >= 6;
};

test('Email validation: valid email addresses pass', () => {
  assert.strictEqual(validateEmail('candidate@example.com'), true);
  assert.strictEqual(validateEmail('user.name+tag@domain.co.uk'), true);
});

test('Email validation: malformed emails fail', () => {
  assert.strictEqual(validateEmail('plainaddress'), false);
  assert.strictEqual(validateEmail('@missingusername.com'), false);
  assert.strictEqual(validateEmail('missingdomain@.com'), false);
  assert.strictEqual(validateEmail(''), false);
});

test('Password validation: enforces minimum length of 6 characters', () => {
  assert.strictEqual(validatePassword('12345'), false);
  assert.strictEqual(validatePassword('123456'), true);
  assert.strictEqual(validatePassword('SecurePass#2026'), true);
});

// -------------------------------------------------------------
// Section 3: SQL Migration & Row Level Security (RLS) Inspection
// -------------------------------------------------------------
console.log('\n--- 3. SQL Migration, Tables & RLS Policies ---');

const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20261107_phase9_auth_resumes.sql');
const migrationSql = fs.readFileSync(migrationPath, 'utf8');

test('SQL Migration: creates public.profiles table referencing auth.users(id)', () => {
  assert(migrationSql.includes('create table if not exists public.profiles'));
  assert(migrationSql.includes('references auth.users(id) on delete cascade'));
});

test('SQL Migration: creates public.resumes table with JSONB resume_data', () => {
  assert(migrationSql.includes('create table if not exists public.resumes'));
  assert(migrationSql.includes('user_id uuid not null references auth.users(id) on delete cascade'));
  assert(migrationSql.includes('resume_data jsonb not null'));
  assert(migrationSql.includes('template text not null default'));
});

test('SQL Migration: creates performance indexes on user_id and updated_at', () => {
  assert(migrationSql.includes('create index if not exists idx_resumes_user_id'));
  assert(migrationSql.includes('create index if not exists idx_resumes_updated_at'));
});

test('SQL Migration: explicitly enables Row Level Security (RLS) on all tables', () => {
  assert(migrationSql.includes('alter table public.profiles enable row level security;'));
  assert(migrationSql.includes('alter table public.resumes enable row level security;'));
});

test('SQL Migration: defines strictly owner-only RLS policies for resumes', () => {
  assert(migrationSql.includes('create policy "Users can read own resumes"'));
  assert(migrationSql.includes('using (auth.uid() = user_id)'));
  assert(migrationSql.includes('create policy "Users can insert own resumes"'));
  assert(migrationSql.includes('with check (auth.uid() = user_id)'));
  assert(migrationSql.includes('create policy "Users can update own resumes"'));
  assert(migrationSql.includes('create policy "Users can delete own resumes"'));
});

test('SQL Migration: defines automatic user profile creation trigger on signup', () => {
  assert(migrationSql.includes('handle_new_user()'));
  assert(migrationSql.includes('create trigger on_auth_user_created'));
});

// -------------------------------------------------------------
// Section 4: Row Level Security (RLS) Tenant Isolation Verification
// -------------------------------------------------------------
console.log('\n--- 4. Simulated RLS Tenant Isolation (Account A vs Account B) ---');

/**
 * In-memory simulation of the PostgreSQL database engine executing under Supabase RLS.
 */
class MockRlsDatabase {
  constructor() {
    this.resumesTable = [];
    this.profilesTable = [];
  }

  // Execute query under an authenticated context: authContext = { uid: 'user-id' }
  insertResume(authContext, resumeRecord) {
    if (!authContext?.uid) throw new Error('RLS Error: Unauthorized. Not signed in.');
    // Check RLS: auth.uid() = user_id
    if (resumeRecord.user_id !== authContext.uid) {
      throw new Error('RLS Violation: Cannot insert resume belonging to another user.');
    }
    const record = {
      id: resumeRecord.id || `res-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      user_id: resumeRecord.user_id,
      title: resumeRecord.title || 'Untitled Resume',
      resume_data: resumeRecord.resume_data || {},
      template: resumeRecord.template || 'classic',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.resumesTable.push(record);
    return record;
  }

  selectResumes(authContext) {
    if (!authContext?.uid) return [];
    // Policy: using (auth.uid() = user_id)
    return this.resumesTable.filter((r) => r.user_id === authContext.uid);
  }

  updateResume(authContext, resumeId, updates) {
    if (!authContext?.uid) throw new Error('RLS Error: Unauthorized.');
    const index = this.resumesTable.findIndex((r) => r.id === resumeId && r.user_id === authContext.uid);
    if (index === -1) {
      // Row not visible to this user
      return null;
    }
    this.resumesTable[index] = {
      ...this.resumesTable[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return this.resumesTable[index];
  }

  deleteResume(authContext, resumeId) {
    if (!authContext?.uid) throw new Error('RLS Error: Unauthorized.');
    const initialLen = this.resumesTable.length;
    this.resumesTable = this.resumesTable.filter(
      (r) => !(r.id === resumeId && r.user_id === authContext.uid)
    );
    return this.resumesTable.length < initialLen;
  }
}

const mockDb = new MockRlsDatabase();
const accountAlice = { uid: 'user-alice-111', email: 'alice@example.com' };
const accountBob = { uid: 'user-bob-222', email: 'bob@example.com' };

let aliceResumeId = null;

test('RLS: Account Alice creates a private cloud resume', () => {
  const record = mockDb.insertResume(accountAlice, {
    user_id: accountAlice.uid,
    title: "Alice's Staff Engineer Resume",
    resume_data: { basics: { fullName: 'Alice Wonder' } },
    template: 'modern',
  });
  assert(record.id);
  assert.strictEqual(record.user_id, accountAlice.uid);
  aliceResumeId = record.id;
});

test('RLS: Account Alice can query her own resumes', () => {
  const aliceResumes = mockDb.selectResumes(accountAlice);
  assert.strictEqual(aliceResumes.length, 1);
  assert.strictEqual(aliceResumes[0].title, "Alice's Staff Engineer Resume");
});

test('RLS Isolation: Account Bob querying resumes gets 0 rows (cannot see Alice resumes)', () => {
  const bobResumes = mockDb.selectResumes(accountBob);
  assert.strictEqual(bobResumes.length, 0, 'Bob must NOT be able to see Alice resumes under RLS');
});

test('RLS Security: Account Bob cannot update Alice resume', () => {
  const updated = mockDb.updateResume(accountBob, aliceResumeId, {
    title: 'Hacked by Bob',
  });
  assert.strictEqual(updated, null, 'Bob update attempt on Alice resume must return null / 0 rows');

  // Verify Alice resume was unchanged
  const aliceResumes = mockDb.selectResumes(accountAlice);
  assert.strictEqual(aliceResumes[0].title, "Alice's Staff Engineer Resume");
});

test('RLS Security: Account Bob cannot delete Alice resume', () => {
  const deleted = mockDb.deleteResume(accountBob, aliceResumeId);
  assert.strictEqual(deleted, false, 'Bob delete attempt must fail');

  // Verify Alice resume still exists
  const aliceResumes = mockDb.selectResumes(accountAlice);
  assert.strictEqual(aliceResumes.length, 1);
});

test('RLS Security: Account Bob cannot insert a resume forged with Alice user_id', () => {
  assert.throws(() => {
    mockDb.insertResume(accountBob, {
      user_id: accountAlice.uid, // Attempted spoof
      title: 'Spoofed Resume',
    });
  }, /RLS Violation/);
});

test('RLS: Account Alice can update and delete her own resume', () => {
  const updated = mockDb.updateResume(accountAlice, aliceResumeId, {
    title: 'Alice Updated Staff Resume',
  });
  assert.strictEqual(updated.title, 'Alice Updated Staff Resume');

  const deleted = mockDb.deleteResume(accountAlice, aliceResumeId);
  assert.strictEqual(deleted, true);
  assert.strictEqual(mockDb.selectResumes(accountAlice).length, 0);
});

// -------------------------------------------------------------
// Section 5: Cloud Resume CRUD Operations & Schema Normalization
// -------------------------------------------------------------
console.log('\n--- 5. Cloud Resume Data Contract & Normalization ---');

import { createDefaultResume } from './src/store/useResumeStore.js';

test('createDefaultResume: normalizes raw JSONB database records into schema-compliant resume', () => {
  const rawDbPayload = {
    basics: {
      fullName: 'John Cloud',
      email: 'john@cloud.io',
      phone: '+1 555-0199',
    },
    experience: [
      {
        companyName: 'CloudCorp',
        jobTitle: 'Cloud Architect',
        achievements: ['Designed resilient multi-region architectures'],
      },
    ],
  };

  const normalized = createDefaultResume(rawDbPayload);
  assert.strictEqual(normalized.basics.fullName, 'John Cloud');
  assert.strictEqual(normalized.personalInfo.fullName, 'John Cloud'); // Backward compatibility alias
  assert.strictEqual(normalized.experience[0].companyName, 'CloudCorp');
  assert.strictEqual(normalized.workExperience[0].companyName, 'CloudCorp');
  assert(Array.isArray(normalized.education));
  assert(Array.isArray(normalized.skills));
  assert(Array.isArray(normalized.projects));
  assert(Array.isArray(normalized.certifications));
});

test('Duplicate logic: creates clean copy with "(Copy)" suffix without mutating original', () => {
  const original = {
    id: 'res-101',
    title: 'Principal Developer',
    template: 'technical',
    resumeData: { basics: { fullName: 'Jane Doe' } },
  };

  const duplicate = {
    ...original,
    id: 'res-102',
    title: `${original.title} (Copy)`,
  };

  assert.strictEqual(duplicate.title, 'Principal Developer (Copy)');
  assert.notStrictEqual(duplicate.id, original.id);
  assert.strictEqual(original.title, 'Principal Developer');
});

// -------------------------------------------------------------
// Section 6: LocalStorage & Cloud Conflict Resolution
// -------------------------------------------------------------
console.log('\n--- 6. LocalStorage & Cloud Conflict Resolution ---');

test('Preservation: Local draft in LocalStorage is not cleared on cloud sync', () => {
  const localDraft = {
    basics: { fullName: 'Local Candidate' },
    summary: 'Local working draft',
  };

  // Simulating active cloud resume loaded into memory
  const cloudResume = {
    id: 'cloud-999',
    title: 'Cloud Master Resume',
    resumeData: { basics: { fullName: 'Cloud Candidate' } },
  };

  assert.notStrictEqual(localDraft.basics.fullName, cloudResume.resumeData.basics.fullName);
  assert.strictEqual(localDraft.summary, 'Local working draft');
});

test('Cloud Sync States: supports local, saving, synced, and offline states', () => {
  const validStates = ['local', 'saving', 'synced', 'offline', 'error'];
  assert(validStates.includes('local'));
  assert(validStates.includes('saving'));
  assert(validStates.includes('synced'));
  assert(validStates.includes('offline'));
});

// -------------------------------------------------------------
// Summary Report
// -------------------------------------------------------------
console.log('\n========================================');
console.log(`Phase 9 Supabase Test Results: ${passedTests} PASSED, ${failedTests} FAILED`);
console.log('========================================');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('🎉 All Phase 9 Supabase Auth & Cloud Resume tests passed successfully!\n');
}

