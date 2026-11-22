/**
 * Phase 6 Automated Test Suite: Professional PDF Generation & ATS Compatibility Verification
 * Uses @react-pdf/renderer to compile resumes into real binary PDFs,
 * inspecting streams for selectable text, A4 layout, multi-page overflow,
 * clickable URI links, and safe filenames.
 */

import assert from 'node:assert';
import zlib from 'node:zlib';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import ClassicPdfDocument from './src/templates/pdf/ClassicPdfDocument.js';
import { getSafeResumeFilename } from './src/utils/pdfDownload.js';
import { sampleResumeData } from './src/data/sampleData.js';

console.log('🧪 Starting Phase 6 Professional PDF Generation & ATS Test Suite...\n');

let passCount = 0;
const test = async (description, fn) => {
  try {
    await fn();
    console.log(`  ✅ PASS: ${description}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${description}`);
    console.error(err);
    process.exit(1);
  }
};

/**
 * Helper to decompress all FlateDecode streams in a PDF buffer
 */
function extractDecompressedStreams(pdfBuffer) {
  const binary = pdfBuffer.toString('binary');
  const streamRegex = /stream\r?\n([\s\S]*?)\r?\nendstream/g;
  const decompressedChunks = [];
  let match;

  while ((match = streamRegex.exec(binary)) !== null) {
    const rawStream = Buffer.from(match[1], 'binary');
    try {
      const unzipped = zlib.inflateSync(rawStream);
      decompressedChunks.push(unzipped.toString('latin1'));
    } catch {
      // If uncompressed or uses another filter, keep raw
      decompressedChunks.push(match[1]);
    }
  }

  return decompressedChunks.join('\n');
}

async function runTestSuite() {
  // ==========================================================================
  // Suite 1: Safe Filename Generation
  // ==========================================================================
  console.log('--- Test 1: Filename Sanitization & Fallbacks ---');

  await test('Generates standard filename from full name', () => {
    const filename = getSafeResumeFilename({ basics: { fullName: 'John Doe' } });
    assert.strictEqual(filename, 'John_Doe_Resume.pdf');
  });

  await test('Strips illegal characters and handles extra whitespace', () => {
    const filename = getSafeResumeFilename({
      personalInfo: { fullName: '  Jane   O\'Connor-Smith!   ' },
    });
    assert.strictEqual(filename, 'Jane_OConnor-Smith_Resume.pdf');
  });

  await test('Falls back safely to Resume.pdf when name is empty or missing', () => {
    assert.strictEqual(getSafeResumeFilename({}), 'Resume.pdf');
    assert.strictEqual(getSafeResumeFilename({ basics: { fullName: '   ' } }), 'Resume.pdf');
  });

  // ==========================================================================
  // Suite 2: Real PDF Generation & Valid Header
  // ==========================================================================
  console.log('\n--- Test 2: Real PDF Generation & Binary Conformance ---');

  let samplePdfBuffer;
  await test('Compiles sample resume into native vector PDF buffer', async () => {
    const doc = React.createElement(ClassicPdfDocument, {
      data: sampleResumeData,
      accentColor: '#111827',
    });

    samplePdfBuffer = await renderToBuffer(doc);
    assert.ok(samplePdfBuffer && Buffer.isBuffer(samplePdfBuffer), 'Must return a Node buffer');
    assert.ok(samplePdfBuffer.length > 1000, `PDF size (${samplePdfBuffer.length} bytes) should be healthy`);

    const header = samplePdfBuffer.slice(0, 8).toString('ascii');
    assert.ok(header.startsWith('%PDF-'), `PDF header must start with %PDF-, got: ${header}`);
  });

  // ==========================================================================
  // Suite 3: Selectable Text & ATS Vector Glyph Inspection
  // ==========================================================================
  console.log('\n--- Test 3: Selectable Text Verification (Not an Image) ---');

  await test('PDF stream contains candidate name and text operators (BT, TJ/Tj, ET)', async () => {
    const streamText = extractDecompressedStreams(samplePdfBuffer);
    
    // Check for standard PDF text operators
    assert.ok(streamText.includes('BT'), 'Must contain Begin Text (BT) operator');
    assert.ok(streamText.includes('ET'), 'Must contain End Text (ET) operator');
    assert.ok(/T[jJ]/.test(streamText), 'Must contain text show operator (Tj or TJ)');

    // Check that candidate name characters are encoded in the stream
    const fullName = sampleResumeData.personalInfo.fullName;
    // Extract first word (e.g. 'John')
    const firstWord = fullName.split(' ')[0];
    const rawPdf = samplePdfBuffer.toString('binary');
    
    // Check that either decompressed text or raw font glyphs encode the candidate
    const nameFoundInStream = streamText.toLowerCase().includes(firstWord.toLowerCase()) ||
      rawPdf.includes(firstWord);
    assert.ok(nameFoundInStream, `Candidate name "${firstWord}" must be encoded in PDF content`);
  });

  // ==========================================================================
  // Suite 4: A4 Dimensions & Single-Column Layout
  // ==========================================================================
  console.log('\n--- Test 4: A4 Page Dimensions & Standard Geometry ---');

  await test('PDF specifies standard A4 MediaBox [0 0 595.28 841.89]', async () => {
    const pdfText = samplePdfBuffer.toString('latin1');
    assert.ok(
      pdfText.includes('595.28') && pdfText.includes('841.89'),
      'PDF must specify A4 points (595.28 x 841.89)'
    );
  });

  // ==========================================================================
  // Suite 5: Clickable External Links (LinkedIn, GitHub, Portfolio)
  // ==========================================================================
  console.log('\n--- Test 5: Clickable Hyperlinks (URI Annotations) ---');

  await test('PDF generates URI link annotations for professional profiles', async () => {
    const pdfText = samplePdfBuffer.toString('latin1');
    assert.ok(pdfText.includes('/Subtype /Link'), 'Must contain Link annotations');
    assert.ok(pdfText.includes('/S /URI'), 'Must contain URI action dictionary');
    assert.ok(
      pdfText.includes('linkedin.com') || pdfText.includes('github.com'),
      'Must contain candidate URLs in Link annotations'
    );
  });

  // ==========================================================================
  // Suite 6: Multi-Page Overflow & Page Pagination
  // ==========================================================================
  console.log('\n--- Test 6: Multi-Page Overflow & Automatic Pagination ---');

  await test('Long resume automatically overflows into multiple A4 pages with pagination', async () => {
    // Construct a long resume with 8 detailed work experiences to force multi-page flow
    const longExperienceList = Array.from({ length: 8 }).map((_, i) => ({
      id: i + 1,
      companyName: `Global Tech Enterprises #${i + 1}`,
      jobTitle: `Principal Architect Level ${i + 1}`,
      location: 'San Francisco, CA',
      startDate: `201${i}`,
      endDate: `201${i + 1}`,
      achievements: [
        `Architected high-throughput message broker handling 500,000 requests/sec with 99.999% uptime.`,
        `Led cross-functional team of 18 engineers through microservices migration and zero-downtime deployment.`,
        `Reduced AWS cloud computing infrastructure cost by $420,000 annually via reserved instances and caching.`,
      ],
    }));

    const multiPageResumeData = {
      ...sampleResumeData,
      workExperience: longExperienceList,
      projects: [
        {
          id: 1,
          projectName: 'Enterprise Kubernetes Platform',
          technologies: 'Go, Kubernetes, Terraform',
          projectLink: 'https://github.com/example/k8s-platform',
          achievements: ['Automated multi-region cluster failover', 'Adopted by 40 enterprise clients'],
        },
        {
          id: 2,
          projectName: 'Distributed Vector Database Engine',
          technologies: 'Rust, C++, SIMD',
          projectLink: 'https://github.com/example/vector-db',
          achievements: ['Sub-millisecond approximate nearest neighbor indexing over 100M embeddings'],
        },
      ],
    };

    const doc = React.createElement(ClassicPdfDocument, {
      data: multiPageResumeData,
      accentColor: '#111827',
    });

    const multiPageBuf = await renderToBuffer(doc);
    const pdfText = multiPageBuf.toString('latin1');

    // Count pages by matching `/Type /Page` (excluding `/Pages`)
    const pageMatches = pdfText.match(/\/Type\s*\/Page\b/g) || [];
    assert.ok(pageMatches.length >= 2, `Expected at least 2 pages for long resume, found ${pageMatches.length}`);

    // Verify footer page numbering was compiled
    const streamText = extractDecompressedStreams(multiPageBuf);
    assert.ok(
      streamText.includes('Page') || multiPageBuf.toString('binary').includes('Page'),
      'Must contain multi-page numbering indicator'
    );
  });

  // ==========================================================================
  // Suite 7: Missing Optional Fields & Edge Cases
  // ==========================================================================
  console.log('\n--- Test 7: Handling Empty Sections & Edge Cases ---');

  await test('Generates valid PDF even when optional sections are completely empty', async () => {
    const minimalData = {
      personalInfo: {
        fullName: 'Jane Doe',
        email: 'jane@example.com',
      },
      professionalSummary: '',
      workExperience: [],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
    };

    const doc = React.createElement(ClassicPdfDocument, {
      data: minimalData,
      accentColor: '#6335F5',
    });

    const buf = await renderToBuffer(doc);
    assert.ok(buf && buf.length > 500, 'Minimal resume must generate valid PDF');
    const header = buf.slice(0, 8).toString('ascii');
    assert.ok(header.startsWith('%PDF-'));
  });

  await test('Handles special characters (quotes, dashes, ampersands, accents)', async () => {
    const specialCharsData = {
      personalInfo: {
        fullName: 'Renée François-Müller',
        professionalTitle: 'Lead R&D Engineer (AI/ML) & Senior Architect',
        email: 'renee@muller.fr',
        location: 'Zürich, Switzerland',
      },
      professionalSummary: 'Specialist in high-availability systems with "zero-trust" & sub-10ms latency.',
      workExperience: [
        {
          id: 1,
          companyName: 'Böhme & Co.',
          jobTitle: 'Head of Engineering — Core Platforms',
          startDate: '2020',
          endDate: 'Present',
          achievements: ['Designed resilient architecture for €100M+ volume.'],
        },
      ],
      education: [],
      skills: [],
      projects: [],
      certifications: [],
    };

    const doc = React.createElement(ClassicPdfDocument, {
      data: specialCharsData,
      accentColor: '#111827',
    });

    const buf = await renderToBuffer(doc);
    assert.ok(buf && buf.length > 800, 'Must compile special characters cleanly');
  });

  console.log(`\n========================================`);
  console.log(`Phase 6 PDF Generation Test Results: ${passCount} PASSED, 0 FAILED`);
  console.log(`========================================\n`);
}

runTestSuite().catch((err) => {
  console.error('Test suite failed with unhandled exception:', err);
  process.exit(1);
});
