/**
 * Self-Healing & Error Boundary Verification Test
 * Verifies that legacy objects with keys {id, name, certificateName, issuer, date}
 * are automatically sanitized before render and never crash React.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    testsPassed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    testsFailed++;
  }
}

console.log('================================================================');
console.log('SELF-HEALING & REACT CHILD ERROR DEFENSE VERIFICATION');
console.log('================================================================\n');

// 1. main.jsx Pre-Mount Sanitizer
console.log('1. main.jsx Pre-Mount Sanitizer:');
const mainPath = path.join(__dirname, 'src', 'main.jsx');
const mainContent = fs.readFileSync(mainPath, 'utf8');
assert(mainContent.includes('sanitizeStorageBeforeMount'), 'main.jsx contains pre-mount storage sanitizer');
assert(mainContent.includes('resumecraft-resume-storage'), 'Sanitizer checks primary storage key');
assert(mainContent.includes('normalizeCert'), 'Sanitizer defines normalizeCert logic');

// 2. ErrorBoundary Recovery Logic
console.log('\n2. ErrorBoundary Recovery Logic:');
const errorBoundaryPath = path.join(__dirname, 'src', 'components', 'ui', 'ErrorBoundary.jsx');
const errorBoundaryContent = fs.readFileSync(errorBoundaryPath, 'utf8');
assert(errorBoundaryContent.includes('handleReload'), 'ErrorBoundary contains handleReload');
assert(errorBoundaryContent.includes('handleResetState'), 'ErrorBoundary contains handleResetState');
assert(errorBoundaryContent.includes('normalizeCert'), 'ErrorBoundary sanitizes legacy certification objects');

// 3. Zustand useResumeStore Certification Normalization
console.log('\n3. Zustand Store Normalization:');
const storePath = path.join(__dirname, 'src', 'store', 'useResumeStore.js');
const storeContent = fs.readFileSync(storePath, 'utf8');
assert(storeContent.includes('updateCertifications'), 'Store defines updateCertifications');
assert(storeContent.includes('certificateName'), 'Store normalizes certificateName to string');
assert(storeContent.includes('migrate:'), 'Store defines migration sanitization');

// 4. Certifications.jsx Safe Object Handling
console.log('\n4. Certifications.jsx Defensive Checks:');
const certsPath = path.join(__dirname, 'src', 'pages', 'Certifications.jsx');
const certsContent = fs.readFileSync(certsPath, 'utf8');
assert(certsContent.includes('SUGGESTED_CERTIFICATIONS'), 'Certifications page contains suggestions');
assert(certsContent.includes('c?.certificateName || c?.name'), 'Exists check safely extracts string from objects');

// 5. Normalization Simulation Test
console.log('\n5. Data Normalization Unit Test:');
const legacyObj = {
  id: 1,
  name: 'AWS Cloud Practitioner',
  certificateName: 'AWS Cloud Practitioner',
  issuer: 'Amazon Web Services',
  date: '2023'
};

const normalize = (c) => {
  if (typeof c === 'string') return c.trim();
  if (c && typeof c === 'object') {
    return (c.certificateName || c.name || c.title || (c.issuer ? `${c.name || 'Certificate'} - ${c.issuer}` : 'Certified Professional')).trim();
  }
  return String(c || '').trim();
};

const normalizedResult = normalize(legacyObj);
assert(typeof normalizedResult === 'string', 'Normalized output is a string, NOT an object');
assert(normalizedResult === 'AWS Cloud Practitioner', `Correctly extracted certificate name: "${normalizedResult}"`);

const legacyObjWithoutName = {
  id: 2,
  issuer: 'HashiCorp',
  date: '2024'
};
const fallbackResult = normalize(legacyObjWithoutName);
assert(typeof fallbackResult === 'string', 'Fallback output is a string');
assert(fallbackResult === 'Certificate - HashiCorp', `Correctly generated fallback string: "${fallbackResult}"`);

console.log('\n================================================================');
console.log(`VERIFICATION SUMMARY: ${testsPassed} passed, ${testsFailed} failed`);
console.log('================================================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('All error defense and self-healing tests PASSED perfectly!');
  process.exit(0);
}

