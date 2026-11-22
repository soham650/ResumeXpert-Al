/**
 * ATS-Friendly DOCX Resume Generator
 * Built using the 'docx' library. Produces clean, editable, single-column Microsoft Word (.docx)
 * documents strictly optimized for ATS parsing (Workday, Greenhouse, Taleo) and human recruiters.
 */

import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ExternalHyperlink,
  Packer,
  BorderStyle,
} from 'docx';
import { sanitizeSafeUrl, formatUrlForDisplay } from './security.js';
import { getSafeResumeFilename } from './pdfDownload.js';

// Template typography & styling mappings
const TEMPLATE_STYLES = {
  classic: {
    font: 'Times New Roman',
    headingColor: '111827',
    primaryColor: '111827',
    subheadColor: '374151',
    lineSpacing: 276, // 1.15
  },
  modern: {
    font: 'Arial',
    headingColor: '6335F5',
    primaryColor: '111827',
    subheadColor: '4B5563',
    lineSpacing: 276,
  },
  professional: {
    font: 'Calibri',
    headingColor: '1E3A8A',
    primaryColor: '111827',
    subheadColor: '4B5563',
    lineSpacing: 276,
  },
  minimal: {
    font: 'Arial',
    headingColor: '111827',
    primaryColor: '27272A',
    subheadColor: '52525B',
    lineSpacing: 260,
  },
  technical: {
    font: 'Calibri',
    headingColor: '0F766E',
    primaryColor: '0F172A',
    subheadColor: '334155',
    lineSpacing: 276,
  },
  academic: {
    font: 'Georgia',
    headingColor: '701A75',
    primaryColor: '1C1917',
    subheadColor: '44403C',
    lineSpacing: 288,
  },
};

/**
 * Normalizes hex colors by stripping '#' for docx color strings
 */
function cleanHex(hex, fallback = '111827') {
  if (!hex || typeof hex !== 'string') return fallback;
  return hex.replace(/^#/, '');
}

/**
 * Creates an ATS Section Heading Paragraph
 */
function createSectionHeading(title, font, color) {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    border: {
      bottom: {
        color: 'E5E7EB',
        space: 2,
        style: BorderStyle.SINGLE,
        size: 6,
      },
    },
    children: [
      new TextRun({
        text: title.toUpperCase(),
        bold: true,
        font,
        size: 21, // 10.5pt
        color,
      }),
    ],
  });
}

/**
 * Generates a docx Document instance from resume data
 */
export function generateResumeDocx(resumeData = {}, template = 'classic', accentColor = '') {
  const tmplKey = (template || 'classic').toLowerCase();
  const tmpl = TEMPLATE_STYLES[tmplKey] || TEMPLATE_STYLES.classic;
  const font = tmpl.font;
  const headingColor = accentColor ? cleanHex(accentColor) : tmpl.headingColor;

  const personalInfo = resumeData.personalInfo || resumeData.basics || {};
  const professionalSummary = resumeData.professionalSummary || resumeData.summary || '';
  const workExperience = resumeData.workExperience || resumeData.experience || [];
  const education = resumeData.education || [];
  const skills = resumeData.skills || [];
  const projects = resumeData.projects || [];
  const certifications = resumeData.certifications || [];

  const rawLinks = [
    personalInfo.linkedinUrl && { label: 'LinkedIn', url: personalInfo.linkedinUrl },
    personalInfo.githubUrl && { label: 'GitHub', url: personalInfo.githubUrl },
    personalInfo.portfolioUrl && { label: 'Portfolio', url: personalInfo.portfolioUrl },
    ...(personalInfo.additionalLinks || []).map((l) => ({
      label: l.label || 'Link',
      url: l.url,
    })),
  ].filter((item) => item && item.url && sanitizeSafeUrl(item.url));

  const contactParts = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
  ].filter(Boolean);

  const paragraphs = [];

  // ============================================================================
  // 1. Header (Name, Title, Contact Info, Links)
  // ============================================================================
  paragraphs.push(
    new Paragraph({
      alignment: tmplKey === 'classic' || tmplKey === 'academic' ? AlignmentType.CENTER : AlignmentType.LEFT,
      spacing: { after: 40 },
      children: [
        new TextRun({
          text: personalInfo.fullName || 'Your Name',
          bold: true,
          font,
          size: 44, // 22pt
          color: headingColor,
        }),
      ],
    })
  );

  if (personalInfo.professionalTitle) {
    paragraphs.push(
      new Paragraph({
        alignment: tmplKey === 'classic' || tmplKey === 'academic' ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 60 },
        children: [
          new TextRun({
            text: personalInfo.professionalTitle,
            bold: true,
            font,
            size: 22, // 11pt
            color: tmpl.subheadColor,
          }),
        ],
      })
    );
  }

  // Contact line
  if (contactParts.length > 0) {
    paragraphs.push(
      new Paragraph({
        alignment: tmplKey === 'classic' || tmplKey === 'academic' ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 40 },
        children: [
          new TextRun({
            text: contactParts.join('   •   '),
            font,
            size: 18, // 9pt
            color: '4B5563',
          }),
        ],
      })
    );
  }

  // Hyperlinks row
  if (rawLinks.length > 0) {
    const linkRuns = [];
    rawLinks.forEach((linkItem, idx) => {
      if (idx > 0) {
        linkRuns.push(
          new TextRun({
            text: '   •   ',
            font,
            size: 18,
            color: '9CA3AF',
          })
        );
      }
      const safeHref = sanitizeSafeUrl(linkItem.url);
      linkRuns.push(
        new ExternalHyperlink({
          link: safeHref,
          children: [
            new TextRun({
              text: `${linkItem.label}: ${formatUrlForDisplay(linkItem.url)}`,
              font,
              size: 18, // 9pt
              color: '1D4ED8',
              underline: {},
            }),
          ],
        })
      );
    });

    paragraphs.push(
      new Paragraph({
        alignment: tmplKey === 'classic' || tmplKey === 'academic' ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { after: 120 },
        children: linkRuns,
      })
    );
  }

  // ============================================================================
  // 2. Professional Summary
  // ============================================================================
  if (professionalSummary.trim()) {
    paragraphs.push(createSectionHeading(
      tmplKey === 'academic' ? 'Research Statement & Profile' : 'Professional Summary',
      font,
      headingColor
    ));
    paragraphs.push(
      new Paragraph({
        spacing: { after: 140 },
        children: [
          new TextRun({
            text: professionalSummary.trim(),
            font,
            size: 19, // 9.5pt
            color: '374151',
          }),
        ],
      })
    );
  }

  // Helper: Section Renderers
  const renderWorkExperience = () => {
    const validExp = workExperience.filter(e => e && (e.companyName || e.jobTitle));
    if (validExp.length === 0) return;

    paragraphs.push(createSectionHeading(
      tmplKey === 'technical' ? 'Engineering Experience' : 'Work Experience',
      font,
      headingColor
    ));

    validExp.forEach((exp) => {
      // Role & Dates
      const dateText = [exp.startDate, exp.endDate || 'Present'].filter(Boolean).join(' – ');
      paragraphs.push(
        new Paragraph({
          spacing: { before: 100, after: 20 },
          children: [
            new TextRun({
              text: exp.jobTitle || 'Role Title',
              bold: true,
              font,
              size: 20, // 10pt
              color: '111827',
            }),
            new TextRun({
              text: dateText ? `  (${dateText})` : '',
              font,
              size: 18,
              color: '6B7280',
            }),
          ],
        })
      );

      // Company & Location
      const companyLocation = [exp.companyName, exp.location].filter(Boolean).join(' — ');
      if (companyLocation) {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: companyLocation,
                italics: true,
                font,
                size: 18,
                color: '4B5563',
              }),
            ],
          })
        );
      }

      // Achievement Bullets
      const bullets = (exp.achievements || []).filter(b => b && b.trim());
      bullets.forEach((bullet) => {
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: bullet.trim(),
                font,
                size: 19, // 9.5pt
                color: '374151',
              }),
            ],
          })
        );
      });
    });
  };

  const renderEducation = () => {
    const validEdu = education.filter(e => e && (e.institutionName || e.degree));
    if (validEdu.length === 0) return;

    paragraphs.push(createSectionHeading('Education', font, headingColor));

    validEdu.forEach((edu) => {
      const dates = [edu.startYear, edu.endYear].filter(Boolean).join(' – ');
      paragraphs.push(
        new Paragraph({
          spacing: { before: 80, after: 20 },
          children: [
            new TextRun({
              text: edu.degree || 'Degree',
              bold: true,
              font,
              size: 20,
              color: '111827',
            }),
            new TextRun({
              text: dates ? `  (${dates})` : '',
              font,
              size: 18,
              color: '6B7280',
            }),
          ],
        })
      );

      const details = [
        edu.institutionName,
        edu.score ? `Score / Honors: ${edu.score}` : '',
      ].filter(Boolean).join('   |   ');

      if (details) {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: details,
                italics: true,
                font,
                size: 18,
                color: '4B5563',
              }),
            ],
          })
        );
      }
    });
  };

  const renderSkills = () => {
    const validSkills = skills.filter(g => g && (g.skills || []).length > 0);
    if (validSkills.length === 0) return;

    paragraphs.push(createSectionHeading(
      tmplKey === 'technical' ? 'Technical Proficiencies' : 'Skills & Proficiencies',
      font,
      headingColor
    ));

    validSkills.forEach((group) => {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({
              text: `${group.groupName || 'Skills'}: `,
              bold: true,
              font,
              size: 19,
              color: '111827',
            }),
            new TextRun({
              text: (group.skills || []).join(', '),
              font,
              size: 19,
              color: '374151',
            }),
          ],
        })
      );
    });
  };

  const renderProjects = () => {
    const validProjects = projects.filter(p => p && p.projectName);
    if (validProjects.length === 0) return;

    paragraphs.push(createSectionHeading(
      tmplKey === 'academic' ? 'Publications & Research Projects' : 'Key Projects',
      font,
      headingColor
    ));

    validProjects.forEach((proj) => {
      const headerRuns = [
        new TextRun({
          text: proj.projectName,
          bold: true,
          font,
          size: 20,
          color: '111827',
        }),
      ];

      if (proj.technologies) {
        headerRuns.push(
          new TextRun({
            text: `  [${proj.technologies}]`,
            font,
            size: 18,
            color: '6B7280',
          })
        );
      }

      paragraphs.push(
        new Paragraph({
          spacing: { before: 80, after: 20 },
          children: headerRuns,
        })
      );

      if (proj.projectLink && sanitizeSafeUrl(proj.projectLink)) {
        paragraphs.push(
          new Paragraph({
            spacing: { after: 40 },
            children: [
              new ExternalHyperlink({
                link: sanitizeSafeUrl(proj.projectLink),
                children: [
                  new TextRun({
                    text: `Project Link: ${formatUrlForDisplay(proj.projectLink)}`,
                    font,
                    size: 17, // 8.5pt
                    color: '1D4ED8',
                    underline: {},
                  }),
                ],
              }),
            ],
          })
        );
      }

      const bullets = (proj.achievements || []).filter(b => b && b.trim());
      bullets.forEach((bullet) => {
        paragraphs.push(
          new Paragraph({
            bullet: { level: 0 },
            spacing: { after: 30 },
            children: [
              new TextRun({
                text: bullet.trim(),
                font,
                size: 19,
                color: '374151',
              }),
            ],
          })
        );
      });
    });
  };

  const renderCertifications = () => {
    const validCerts = certifications.filter(c => typeof c === 'string' && c.trim().length > 0);
    if (validCerts.length === 0) return;

    paragraphs.push(createSectionHeading('Certifications & Credentials', font, headingColor));

    validCerts.forEach((cert) => {
      paragraphs.push(
        new Paragraph({
          bullet: { level: 0 },
          spacing: { after: 30 },
          children: [
            new TextRun({
              text: cert.trim(),
              font,
              size: 19,
              color: '374151',
            }),
          ],
        })
      );
    });
  };

  // Section Ordering based on template type
  if (tmplKey === 'academic') {
    // Academic CV puts Education first, then Research/Projects, Experience, Skills, Certifications
    renderEducation();
    renderProjects();
    renderWorkExperience();
    renderSkills();
    renderCertifications();
  } else if (tmplKey === 'technical') {
    // Technical resume prioritizes Skills near the top, then Projects, Experience, Education, Certifications
    renderSkills();
    renderWorkExperience();
    renderProjects();
    renderEducation();
    renderCertifications();
  } else {
    // Classic / Modern / Professional / Minimal: Standard ATS Order
    renderWorkExperience();
    renderEducation();
    renderSkills();
    renderProjects();
    renderCertifications();
  }

  // Create DOCX Document structure with standard single-column 0.5in margins (720 dxa)
  return new Document({
    styles: {
      default: {
        document: {
          run: {
            font,
            size: 20, // 10pt base
            color: '111827',
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720,
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });
}

/**
 * Node.js helper to compile DOCX document to Buffer for testing and headless processing
 */
export async function generateResumeDocxBuffer(resumeData, template = 'classic', accentColor = '') {
  const doc = generateResumeDocx(resumeData, template, accentColor);
  return await Packer.toBuffer(doc);
}

/**
 * Browser helper to trigger instant, client-side download of the editable DOCX file
 */
export async function downloadResumeDocx(resumeData, template = 'classic', accentColor = '') {
  const doc = generateResumeDocx(resumeData, template, accentColor);
  const blob = await Packer.toBlob(doc);

  if (!blob) {
    throw new Error('Failed to generate DOCX file blob');
  }

  const filename = getSafeResumeFilename(resumeData, 'docx');

  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return filename;
}

