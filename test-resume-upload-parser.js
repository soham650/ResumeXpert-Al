import assert from 'assert';
import zlib from 'zlib';
import {
  parseResumeText,
  auditResumeCorrectness,
  extractTextFromDocx,
  extractTextFromPdf,
} from './src/utils/fileResumeParser.js';

console.log('--- TEST 1: Plain Text Resume Parsing ---');
const sampleText = `
Alex Morgan
Senior Cloud Engineer
alex.morgan@techmail.com | (555) 345-6789 | Austin, TX | linkedin.com/in/alexmorgan

Summary
Innovative Cloud Engineer with 7 years of experience in distributed systems, Kubernetes orchestration, and multi-cloud architectures.

Work Experience
Apex Cloud Systems - Lead DevOps Architect
2021 - Present
• Spearheaded migration of 120 microservices to AWS EKS, improving system availability to 99.99%.
• Reduced cloud infrastructure costs by 28% using automated spot instance scheduling.

CloudScale Data - Systems Developer
2018 - 2021
• Built real-time monitoring pipelines with Prometheus and Grafana.

Education
University of Texas at Austin - B.S. in Computer Engineering
2014 - 2018

Skills
Kubernetes, Docker, AWS, Python, Go, Terraform, Linux, Git, CI/CD, SQL
`;

const parsed = parseResumeText(sampleText);
assert.strictEqual(parsed.personalInfo.fullName, 'Alex Morgan');
assert.strictEqual(parsed.personalInfo.email, 'alex.morgan@techmail.com');
assert.strictEqual(parsed.personalInfo.phone, '(555) 345-6789');
assert(parsed.personalInfo.summary.includes('Cloud Engineer'));
assert(parsed.skills.some((g) => g.skills.includes('Kubernetes')));
assert(parsed.skills.some((g) => g.skills.includes('Docker')));
assert(parsed.experience.length >= 1);
assert.strictEqual(parsed.education[0].institution, 'University of Texas at Austin');
console.log('✓ Plain text parsing passed');

console.log('--- TEST 2: Free Correctness & ATS Audit ---');
const audit = auditResumeCorrectness(parsed, sampleText);
console.log('Audit Total Score:', audit.totalScore, 'Categories:', audit.categories.map(c => `${c.category}: ${c.score}/${c.maxScore}`));
assert(audit.isFree === true);
assert(typeof audit.totalScore === 'number' && audit.totalScore >= 50);
assert(audit.checklist.length >= 5);
assert(audit.skillsDetected.includes('AWS'));
console.log(`✓ ATS Audit completed. Total Score: ${audit.totalScore}%, Rating: ${audit.ratingTier}`);

console.log('--- TEST 3: DOCX Binary Zip Parsing ---');
// Construct a minimal valid PKZIP with word/document.xml
const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p><w:r><w:t>Devin Vance</w:t></w:r></w:p>
    <w:p><w:r><w:t>devin.vance@example.com | +1 555-987-6543</w:t></w:r></w:p>
    <w:p><w:r><w:t>Frontend Engineer specialized in React and TypeScript.</w:t></w:r></w:p>
  </w:body>
</w:document>`;

const compressedXml = zlib.deflateRawSync(Buffer.from(xmlContent, 'utf-8'));
const filename = 'word/document.xml';
const fnBytes = Buffer.from(filename, 'utf-8');

// Construct PKZIP Local File Header (30 bytes + filename + data)
const lfh = Buffer.alloc(30 + fnBytes.length + compressedXml.length);
lfh.writeUInt32LE(0x04034b50, 0); // signature
lfh.writeUInt16LE(20, 4); // version needed
lfh.writeUInt16LE(0, 6); // flags
lfh.writeUInt16LE(8, 8); // compression method (deflate)
lfh.writeUInt16LE(0, 10); // last mod time
lfh.writeUInt16LE(0, 12); // last mod date
lfh.writeUInt32LE(0, 14); // crc32
lfh.writeUInt32LE(compressedXml.length, 18); // compressed size
lfh.writeUInt32LE(xmlContent.length, 22); // uncompressed size
lfh.writeUInt16LE(fnBytes.length, 26); // filename length
lfh.writeUInt16LE(0, 28); // extra field length
fnBytes.copy(lfh, 30);
compressedXml.copy(lfh, 30 + fnBytes.length);

const docxText = await extractTextFromDocx(lfh.buffer);
assert(docxText.includes('Devin Vance'), 'Extracted text should contain Devin Vance');
assert(docxText.includes('devin.vance@example.com'), 'Extracted text should contain email');
console.log('✓ DOCX PKZIP binary parsing passed');

console.log('--- TEST 4: PDF Stream Extraction ---');
const pdfMock = `%PDF-1.4
1 0 obj
<< /Length 60 >>
stream
BT
/F1 12 Tf
(Samantha Reed - Full Stack Specialist) Tj
(samantha.reed@domain.com) Tj
ET
endstream
endobj
trailer
<< /Root 1 0 R >>
%%EOF`;

const pdfBuffer = Buffer.from(pdfMock, 'utf-8');
const pdfText = await extractTextFromPdf(pdfBuffer.buffer);
assert(pdfText.includes('Samantha Reed'), 'Extracted PDF text should contain candidate name');
console.log('✓ PDF stream text extraction passed');

console.log('\n=============================================');
console.log('ALL RESUME UPLOAD & PARSING TESTS PASSED!');
console.log('=============================================');
