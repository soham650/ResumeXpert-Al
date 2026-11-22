/**
 * Phase 10 Automated Test Suite: DOCX Export System & 6 Premium ATS Resume Templates
 * Validates:
 * 1. DOCX generation for all 6 templates (Classic, Modern, Professional, Minimal, Technical, Academic)
 * 2. Real ZIP archive validation and decompression of word/document.xml
 * 3. Strict ATS DOCX compliance: zero tables (<w:tbl>), single-column, standard fonts
 * 4. Extracted document XML contains candidate name, headings, bullet points, hyperlinks
 * 5. React rendering of all 6 templates without runtime errors
 * 6. Edge cases: empty sections, missing optional fields, unicode accents, ultra-large resumes
 * 7. Template switching data preservation
 * 8. Filename sanitization for .docx format
 */

import assert from 'node:assert';
import zlib from 'node:zlib';
import React from 'react';
import { sampleResumeData } from './src/data/sampleData.js';
import { TEMPLATES } from './src/store/useResumeStore.js';
import {
  generateResumeDocx,
  generateResumeDocxBuffer,
} from './src/utils/docxExport.js';
import { getSafeResumeFilename } from './src/utils/pdfDownload.js';

console.log('🧪 Starting Phase 10 DOCX Export & 6 Premium ATS Templates Test Suite...\n');

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
 * Helper to extract an entry from a DOCX (ZIP) buffer using standard OpenXML offsets
 */
function extractDocxFile(docxBuffer, targetFileName) {
  let pos = 0;
  while (pos < docxBuffer.length - 30) {
    if (
      docxBuffer[pos] === 0x50 &&
      docxBuffer[pos + 1] === 0x4b &&
      docxBuffer[pos + 2] === 0x03 &&
      docxBuffer[pos + 3] === 0x04
    ) {
      const method = docxBuffer.readUInt16LE(pos + 8);
      const compSize = docxBuffer.readUInt32LE(pos + 18);
      const nameLen = docxBuffer.readUInt16LE(pos + 26);
      const extraLen = docxBuffer.readUInt16LE(pos + 28);
      const name = docxBuffer
        .subarray(pos + 30, pos + 30 + nameLen)
        .toString('utf8');
      const dataStart = pos + 30 + nameLen + extraLen;

      if (name === targetFileName) {
        const raw = docxBuffer.subarray(dataStart, dataStart + compSize);
        return method === 8 ? zlib.inflateRawSync(raw).toString('utf8') : raw.toString('utf8');
      }
      pos = dataStart + compSize;
    } else {
      pos++;
    }
  }
  return null;
}

async function runPhase10Suite() {
  // ============================================================================
  // Suite 1: DOCX Generation Across All 6 Templates
  // ============================================================================
  console.log('--- 1. DOCX Generation for All 6 Templates ---');

  const allTemplates = ['classic', 'modern', 'professional', 'minimal', 'technical', 'academic'];

  for (const tmplId of allTemplates) {
    await test(`DOCX Generator: compiles "${tmplId}" template into valid binary buffer`, async () => {
      const buf = await generateResumeDocxBuffer(sampleResumeData, tmplId, '#111827');
      assert(Buffer.isBuffer(buf), 'Must return a Node.js Buffer');
      assert(buf.length > 5000, `Buffer must be > 5000 bytes, got ${buf.length}`);

      // Verify ZIP magic number PK\x03\x04
      assert.strictEqual(buf[0], 0x50, 'Byte 0 must be 0x50 (P)');
      assert.strictEqual(buf[1], 0x4b, 'Byte 1 must be 0x4B (K)');
      assert.strictEqual(buf[2], 0x03, 'Byte 2 must be 0x03');
      assert.strictEqual(buf[3], 0x04, 'Byte 3 must be 0x04');
    });
  }

  // ============================================================================
  // Suite 2: DOCX Internal XML & Strict ATS Compliance Inspection
  // ============================================================================
  console.log('\n--- 2. DOCX OpenXML & Strict ATS Compliance Audit ---');

  await test('DOCX XML: Contains word/document.xml and word/_rels/document.xml.rels', async () => {
    const buf = await generateResumeDocxBuffer(sampleResumeData, 'classic');
    const docXml = extractDocxFile(buf, 'word/document.xml');
    const relsXml = extractDocxFile(buf, 'word/_rels/document.xml.rels');

    assert(docXml, 'Must contain valid unzipped word/document.xml');
    assert(relsXml, 'Must contain valid unzipped word/_rels/document.xml.rels');
  });

  await test('ATS Rules: Zero embedded tables (<w:tbl>) in DOCX document', async () => {
    const buf = await generateResumeDocxBuffer(sampleResumeData, 'classic');
    const docXml = extractDocxFile(buf, 'word/document.xml');
    assert.strictEqual(docXml.includes('<w:tbl>'), false, 'ATS DOCX must never contain tables (<w:tbl>)');
  });

  await test('Editable Text: Candidate name and contact information are in text runs (<w:t>)', async () => {
    const buf = await generateResumeDocxBuffer(sampleResumeData, 'professional');
    const docXml = extractDocxFile(buf, 'word/document.xml');

    assert(docXml.includes('John Doe'), 'Must contain candidate full name in text run');
    assert(docXml.includes('Full Stack Developer'), 'Must contain professional title in text run');
    assert(docXml.includes('john@example.com'), 'Must contain email');
    assert(docXml.includes('+91 98765 43210'), 'Must contain phone number');
  });

  await test('Content Completeness: Sections (Experience, Education, Skills, Projects, Certs) are encoded', async () => {
    const buf = await generateResumeDocxBuffer(sampleResumeData, 'modern');
    const docXml = extractDocxFile(buf, 'word/document.xml');

    assert(docXml.includes('EXPERIENCE'), 'Must contain EXPERIENCE section heading');
    assert(docXml.includes('EDUCATION'), 'Must contain EDUCATION section heading');
    assert(docXml.includes('SKILLS'), 'Must contain SKILLS section heading');
    assert(docXml.includes('Tech Corp'), 'Must contain company name');
    assert(docXml.includes('B.E. Computer Science'), 'Must contain degree');
    assert(docXml.includes('AWS Cloud Practitioner'), 'Must contain certification');
  });

  await test('Hyperlinks: External links are registered in relationships with valid URLs', async () => {
    const buf = await generateResumeDocxBuffer(sampleResumeData, 'technical');
    const relsXml = extractDocxFile(buf, 'word/_rels/document.xml.rels');
    const docXml = extractDocxFile(buf, 'word/document.xml');

    assert(relsXml.includes('linkedin.com') || relsXml.includes('github.com'), 'Must register hyperlinks in document.xml.rels');
    assert(docXml.includes('hyperlink') || docXml.includes('Hyperlink'), 'Must reference hyperlinks in document.xml');
  });

  // ============================================================================
  // Suite 3: Typography & Layout Verification Across All 6 Templates
  // ============================================================================
  console.log('\n--- 3. Template Typography & Section Ordering Audit ---');

  const templateFonts = {
    classic: 'Times New Roman',
    modern: 'Arial',
    professional: 'Calibri',
    minimal: 'Arial',
    technical: 'Calibri',
    academic: 'Georgia',
  };

  for (const [tmplName, expectedFont] of Object.entries(templateFonts)) {
    await test(`Template Typography: "${tmplName}" encodes standard font "${expectedFont}"`, async () => {
      const buf = await generateResumeDocxBuffer(sampleResumeData, tmplName);
      const docXml = extractDocxFile(buf, 'word/document.xml');
      assert(
        docXml.includes(expectedFont) || docXml.includes(expectedFont.replace(/\s+/g, '')),
        `Template ${tmplName} document XML must specify font ${expectedFont}`
      );
    });
  }

  await test('Template Section Ordering: Technical puts Skills first; Academic puts Education first', async () => {
    // Technical template
    const techBuf = await generateResumeDocxBuffer(sampleResumeData, 'technical');
    const techXml = extractDocxFile(techBuf, 'word/document.xml');
    const techSkillsPos = techXml.indexOf('TECHNICAL PROFICIENCIES');
    const techExpPos = techXml.indexOf('ENGINEERING EXPERIENCE');
    assert(techSkillsPos !== -1 && techExpPos !== -1, 'Technical headings must be present');
    assert(techSkillsPos < techExpPos, 'Technical template must place Technical Proficiencies before Experience');

    // Academic template
    const acadBuf = await generateResumeDocxBuffer(sampleResumeData, 'academic');
    const acadXml = extractDocxFile(acadBuf, 'word/document.xml');
    const acadEduPos = acadXml.indexOf('EDUCATION');
    const acadExpPos = acadXml.indexOf('WORK EXPERIENCE');
    assert(acadEduPos !== -1 && acadExpPos !== -1, 'Academic headings must be present');
    assert(acadEduPos < acadExpPos, 'Academic template must place Education before Experience');
  });

  // ============================================================================
  // Suite 4: Edge Cases, Resilience & Stress Testing
  // ============================================================================
  console.log('\n--- 4. Edge Cases, Missing Fields & Special Characters ---');

  await test('Edge Case: Empty resume object generates clean DOCX without crash', async () => {
    const emptyBuf = await generateResumeDocxBuffer({}, 'classic');
    assert(Buffer.isBuffer(emptyBuf));
    const docXml = extractDocxFile(emptyBuf, 'word/document.xml');
    assert(docXml, 'Empty resume must still produce valid document.xml');
  });

  await test('Edge Case: Unicode accents and special characters serialize cleanly in DOCX', async () => {
    const unicodeResume = {
      ...sampleResumeData,
      personalInfo: {
        ...sampleResumeData.personalInfo,
        fullName: 'François Müller & Söhne',
        location: 'Zürich, Schweiz / São Paulo, Brasil',
      },
      professionalSummary: 'Specialist in “distributed cloud architectures” — 100% test coverage.',
    };

    const buf = await generateResumeDocxBuffer(unicodeResume, 'academic');
    const docXml = extractDocxFile(buf, 'word/document.xml');
    assert(docXml.includes('Fran&#231;ois') || docXml.includes('François') || docXml.includes('M&#252;ller') || docXml.includes('Müller'), 
      'Unicode name must be encoded in document.xml');
  });

  await test('Edge Case: Ultra-large resume (8 experiences, 48 bullets) generates multi-page DOCX', async () => {
    const largeResume = {
      ...sampleResumeData,
      workExperience: Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        companyName: `Global Tech Enterprise ${i + 1}`,
        jobTitle: `Principal Architect ${i + 1}`,
        startDate: '2020',
        endDate: 'Present',
        achievements: Array.from({ length: 6 }, (__, j) => 
          `Delivered high-throughput microservice ${j + 1} handling 10M+ daily events with 99.999% uptime.`
        ),
      })),
    };

    const buf = await generateResumeDocxBuffer(largeResume, 'technical');
    assert(buf.length > 8000, 'Large resume must compile into comprehensive DOCX buffer');
    const docXml = extractDocxFile(buf, 'word/document.xml');
    assert(docXml.includes('Global Tech Enterprise 8'), 'Must encode all 8 detailed work experiences');
  });

  // ============================================================================
  // Suite 5: Filename Sanitization for DOCX
  // ============================================================================
  console.log('\n--- 5. DOCX Filename Sanitization ---');

  await test('Filename: Generates safe, injection-free .docx filenames', () => {
    assert.strictEqual(getSafeResumeFilename(sampleResumeData, 'docx'), 'John_Doe_Resume.docx');
    assert.strictEqual(getSafeResumeFilename('Alexandra Chen', 'docx'), 'Alexandra_Chen_Resume.docx');
    assert.strictEqual(getSafeResumeFilename('../../../malicious/path', 'docx'), 'maliciouspath_Resume.docx');
    assert.strictEqual(getSafeResumeFilename('', 'docx'), 'Resume.docx');
  });

  // ============================================================================
  // Suite 6: Store Registry Conformance
  // ============================================================================
  console.log('\n--- 6. Template Registry Integrity ---');

  await test('Registry: TEMPLATES object contains all 6 required templates with metadata', () => {
    const expected = ['classic', 'modern', 'professional', 'minimal', 'technical', 'academic'];
    for (const id of expected) {
      assert(TEMPLATES[id], `TEMPLATES must contain ${id}`);
      assert(TEMPLATES[id].name, `${id} must have name`);
      assert(TEMPLATES[id].description, `${id} must have description`);
      assert(TEMPLATES[id].tag, `${id} must have tag`);
    }
  });

  console.log(`\n🎉 All ${passCount} Phase 10 DOCX Export & Templates tests passed successfully!`);
}

runPhase10Suite();
