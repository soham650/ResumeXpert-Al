/**
 * Phase 14 Test Suite — Production Readiness, Authentic Content, Help & Legal Policies
 * Verifies centralized config, authentic branding, legal documents, data deletion, SEO files, and absence of fake data.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { APP_CONFIG, SUPPORT_EMAIL, isSupportEmailConfigured } from './src/config/appConfig.js';
import { purgeAllLocalData, requestFullAccountDeletion } from './src/lib/accountDeletionService.js';

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
console.log('PHASE 14: PRODUCTION READINESS & LEGAL POLICY VERIFICATION');
console.log('================================================================\n');

// 1. Centralized App Configuration & Support Email
console.log('1. Centralized Application Configuration & Support Email:');
assert(APP_CONFIG && APP_CONFIG.name === 'ResumeXpert AI', 'APP_CONFIG has name "ResumeXpert AI"');
assert(APP_CONFIG.version === '1.0.0', 'APP_CONFIG version is 1.0.0');
assert(typeof APP_CONFIG.tagline === 'string' && APP_CONFIG.tagline.length > 0, 'APP_CONFIG defines genuine tagline');
assert(APP_CONFIG.legalEffectiveDate === 'November 8, 2026', 'Legal effective date is calibrated');
assert(
  SUPPORT_EMAIL === '[SUPPORT_EMAIL]' || SUPPORT_EMAIL.includes('@'),
  `Support email is safe and authentic: ${SUPPORT_EMAIL}`
);
assert(
  typeof isSupportEmailConfigured === 'boolean',
  `isSupportEmailConfigured returns boolean flag (${isSupportEmailConfigured})`
);
assert(
  !SUPPORT_EMAIL.includes('example.com') && !SUPPORT_EMAIL.includes('fake') && !SUPPORT_EMAIL.includes('test@test'),
  'No dummy/fake email domain in configuration'
);

// 2. SEO & Crawler Indexing Boundary
console.log('\n2. SEO, Robots.txt & Sitemap Protection:');
const robotsPath = path.join(__dirname, 'public', 'robots.txt');
assert(fs.existsSync(robotsPath), 'public/robots.txt exists');
const robotsContent = fs.readFileSync(robotsPath, 'utf8');
assert(robotsContent.includes('Disallow: /builder/'), 'robots.txt disallows candidate builder paths');
assert(robotsContent.includes('Disallow: /app/'), 'robots.txt disallows private app state');
assert(robotsContent.includes('Disallow: /api/'), 'robots.txt disallows API indexing');
assert(robotsContent.includes('Sitemap: https://resumexpert.ai/sitemap.xml'), 'robots.txt references sitemap');

const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
assert(fs.existsSync(sitemapPath), 'public/sitemap.xml exists');
const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
assert(sitemapContent.includes('https://resumexpert.ai/privacy-policy'), 'sitemap includes privacy-policy');
assert(sitemapContent.includes('https://resumexpert.ai/terms'), 'sitemap includes terms');
assert(sitemapContent.includes('https://resumexpert.ai/cookie-policy'), 'sitemap includes cookie-policy');
assert(sitemapContent.includes('https://resumexpert.ai/ai-disclaimer'), 'sitemap includes ai-disclaimer');
assert(sitemapContent.includes('https://resumexpert.ai/data-deletion'), 'sitemap includes data-deletion');
assert(!sitemapContent.includes('/builder/'), 'sitemap strictly omits candidate builder paths');

const indexPath = path.join(__dirname, 'index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
assert(indexHtml.includes('ResumeXpert AI'), 'index.html title has ResumeXpert AI');
assert(indexHtml.includes('property="og:title"'), 'index.html contains OpenGraph title');
assert(indexHtml.includes('name="twitter:card"'), 'index.html contains Twitter Card tags');

// 3. Legal and Policy Documents
console.log('\n3. Legal and Policy Component Integrity:');
const legalDir = path.join(__dirname, 'src', 'pages', 'legal');
const legalFiles = [
  'PrivacyPolicy.jsx',
  'TermsConditions.jsx',
  'CookiePolicy.jsx',
  'AiDisclaimer.jsx',
  'DataDeletionPolicy.jsx'
];
legalFiles.forEach((file) => {
  const filePath = path.join(legalDir, file);
  assert(fs.existsSync(filePath), `Legal document ${file} exists`);
  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.length > 2000, `${file} contains comprehensive policy content (${content.length} bytes)`);
  assert(
    content.includes('ResumeXpert AI') || content.includes('APP_CONFIG.name'),
    `${file} is branded for ResumeXpert AI via central config`
  );
});

const privacyContent = fs.readFileSync(path.join(legalDir, 'PrivacyPolicy.jsx'), 'utf8');
assert(privacyContent.includes('Google Gemini'), 'Privacy policy clearly discloses Google Gemini processing');
assert(privacyContent.includes('Supabase'), 'Privacy policy clearly discloses Supabase authentication & storage');
assert(privacyContent.includes('LocalStorage'), 'Privacy policy clearly discloses local browser storage');

const termsContent = fs.readFileSync(path.join(legalDir, 'TermsConditions.jsx'), 'utf8');
assert(termsContent.includes('100%'), 'Terms declare 100% user ownership of created resumes');

const aiDisclaimerContent = fs.readFileSync(path.join(legalDir, 'AiDisclaimer.jsx'), 'utf8');
assert(
  aiDisclaimerContent.includes('Heuristic Estimates') || aiDisclaimerContent.includes('Estimates'),
  'AI disclaimer states ATS scores are estimates'
);
assert(
  aiDisclaimerContent.toLowerCase().includes('guarantee'),
  'AI disclaimer explicitly disclaims employment guarantees'
);

// 4. Public and Support Pages
console.log('\n4. Public and Support Page Verification:');
const publicDir = path.join(__dirname, 'src', 'pages', 'public');
const publicFiles = [
  'ContactUs.jsx',
  'HelpCenter.jsx',
  'AboutUs.jsx',
  'FeaturesPage.jsx',
  'PricingPage.jsx'
];
publicFiles.forEach((file) => {
  const filePath = path.join(publicDir, file);
  assert(fs.existsSync(filePath), `Public page ${file} exists`);
  const content = fs.readFileSync(filePath, 'utf8');
  assert(content.length > 2000, `${file} contains authentic user-facing content (${content.length} bytes)`);
});

const contactContent = fs.readFileSync(path.join(publicDir, 'ContactUs.jsx'), 'utf8');
assert(contactContent.includes('SUPPORT_EMAIL'), 'Contact page uses centralized SUPPORT_EMAIL');

const pricingContent = fs.readFileSync(path.join(publicDir, 'PricingPage.jsx'), 'utf8');
assert(pricingContent.includes('$0'), 'Pricing page honestly discloses $0 free community plan');
assert(!pricingContent.includes('Limited time only!') && !pricingContent.includes('Seats left'), 'Pricing page avoids fake urgency');

// 5. Account Deletion Architecture & SQL
console.log('\n5. Data Deletion Service & Cascading Migration:');
assert(typeof purgeAllLocalData === 'function', 'purgeAllLocalData function exported');
assert(typeof requestFullAccountDeletion === 'function', 'requestFullAccountDeletion function exported');

const migrationPath = path.join(__dirname, 'supabase', 'migrations', '20261108_phase14_account_deletion_and_policies.sql');
assert(fs.existsSync(migrationPath), 'Phase 14 migration SQL exists');
const sqlContent = fs.readFileSync(migrationPath, 'utf8');
assert(sqlContent.includes('delete_user_account_data'), 'Migration contains delete_user_account_data function');
assert(sqlContent.includes('resumes'), 'Migration cascades to resumes table');
assert(sqlContent.includes('mock_interviews'), 'Migration cascades to mock_interviews table');

// 6. Fake Data Audit in Dashboard
console.log('\n6. Authentic Content Audit (Absence of Fake/Demo Data):');
const dashboardPath = path.join(__dirname, 'src', 'pages', 'Dashboard.jsx');
const dashboardContent = fs.readFileSync(dashboardPath, 'utf8');

assert(dashboardContent.includes('50K+'), 'User-requested 50K+ Happy Users badge is present');
assert(dashboardContent.includes('4.8/5'), 'User-requested 4.8/5 User Rating badge is present');
assert(!dashboardContent.includes('Senior Product Manager Resume'), 'Removed fabricated dummy second resume');
assert(dashboardContent.includes('Single-Column'), 'Replaced with real capability badge: Single-Column ATS');
assert(dashboardContent.includes('Google Gemini'), 'Replaced with real capability badge: Google Gemini');
assert(dashboardContent.includes('AppFooter'), 'Dashboard integrates production AppFooter');

// 7. Navigation Integration in App.jsx
console.log('\n7. App.jsx Route & View Integration:');
const appJsxPath = path.join(__dirname, 'src', 'App.jsx');
const appJsxContent = fs.readFileSync(appJsxPath, 'utf8');
assert(appJsxContent.includes('PrivacyPolicy'), 'App.jsx imports PrivacyPolicy');
assert(appJsxContent.includes('TermsConditions'), 'App.jsx imports TermsConditions');
assert(appJsxContent.includes('DataDeletionPolicy'), 'App.jsx imports DataDeletionPolicy');
assert(appJsxContent.includes('HelpCenter'), 'App.jsx imports HelpCenter');
assert(appJsxContent.includes('ContactUs'), 'App.jsx imports ContactUs');
assert(appJsxContent.includes('AppFooter'), 'App.jsx imports AppFooter');

console.log('\n================================================================');
console.log(`PHASE 14 VERIFICATION SUMMARY: ${testsPassed} passed, ${testsFailed} failed`);
console.log('================================================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  console.log('All Phase 14 Production Readiness and Legal verifications PASSED perfectly!');
  process.exit(0);
}
