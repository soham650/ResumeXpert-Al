// ClassicTemplate — ATS-friendly single-column resume template
// Ivy League standard format with serif typography, horizontal section dividers, and all-caps headings.

import React from 'react';
import { sanitizeSafeUrl, formatUrlForDisplay } from '../utils/security.js';

const formatUrl = (url) => sanitizeSafeUrl(url);

const ClassicTemplate = ({ data, accentColor = '#111827' }) => {
  if (!data) return null;

  const personalInfo = data.personalInfo || data.basics || {};
  const professionalSummary = data.professionalSummary || data.summary || '';
  const workExperience = data.workExperience || data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const projects = data.projects || [];
  const certifications = data.certifications || [];

  const headerBorderColor = accentColor || '#111827';

  const rawLinks = [
    personalInfo.linkedinUrl && { label: 'LinkedIn', url: personalInfo.linkedinUrl },
    personalInfo.githubUrl && { label: 'GitHub', url: personalInfo.githubUrl },
    personalInfo.portfolioUrl && { label: 'Portfolio', url: personalInfo.portfolioUrl },
    ...(personalInfo.additionalLinks || []).map((l) => ({
      label: l.label || 'Link',
      url: l.url,
    })),
  ].filter((item) => item && item.url);

  return (
    <div
      style={{
        fontFamily: "'Times New Roman', Times, Georgia, serif",
        color: '#111',
        lineHeight: 1.45,
        fontSize: '10pt',
        padding: '36px 40px',
        maxWidth: '8.5in',
        margin: '0 auto',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '10px' }}>
        <h1
          style={{
            fontSize: '22pt',
            fontWeight: 700,
            marginBottom: '2px',
            color: accentColor !== '#111827' ? accentColor : '#000',
            letterSpacing: '0.3px',
          }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.professionalTitle && (
          <p style={{ fontSize: '11pt', color: '#374151', fontWeight: 600, marginBottom: '2px' }}>
            {personalInfo.professionalTitle}
          </p>
        )}
        <p style={{ fontSize: '9pt', color: '#4b5563' }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location]
            .filter(Boolean)
            .join('  •  ')}
        </p>
        {rawLinks.length > 0 && (
          <p style={{ fontSize: '9pt', color: '#4b5563', marginTop: '2px' }}>
            {rawLinks.map((item, index) => (
              <span key={index}>
                {index > 0 && '  •  '}
                <a
                  href={formatUrl(item.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#1d4ed8', textDecoration: 'none' }}
                >
                  {item.label}: {formatUrlForDisplay(item.url)}
                </a>
              </span>
            ))}
          </p>
        )}
      </div>

      {/* Professional Summary */}
      {professionalSummary && (
        <div style={{ marginBottom: '10px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          <h2
            style={{
              fontSize: '11pt',
              fontWeight: 700,
              borderBottom: `1.5px solid ${headerBorderColor}`,
              paddingBottom: '2px',
              marginTop: '8px',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: accentColor !== '#111827' ? accentColor : '#000',
            }}
          >
            Professional Summary
          </h2>
          <p style={{ textAlign: 'justify', fontSize: '9.5pt', color: '#1f2937' }}>
            {professionalSummary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience?.length > 0 && workExperience[0]?.companyName && (
        <div style={{ marginBottom: '10px' }}>
          <h2
            style={{
              fontSize: '11pt',
              fontWeight: 700,
              borderBottom: `1.5px solid ${headerBorderColor}`,
              paddingBottom: '2px',
              marginTop: '8px',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: accentColor !== '#111827' ? accentColor : '#000',
            }}
          >
            Work Experience
          </h2>
          {workExperience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '8px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <h3 style={{ fontSize: '10pt', fontWeight: 700, color: '#111' }}>
                  {exp.jobTitle}
                </h3>
                <span style={{ fontSize: '9pt', color: '#4b5563', fontWeight: 600 }}>
                  {exp.startDate} – {exp.endDate || 'Present'}
                </span>
              </div>
              <p style={{ fontSize: '9pt', color: '#374151', fontStyle: 'italic', marginBottom: '2px' }}>
                {exp.companyName}
                {exp.location && `, ${exp.location}`}
              </p>
              {exp.achievements && exp.achievements.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '18px', marginTop: '2px', marginBottom: '2px' }}>
                  {exp.achievements.filter(Boolean).map((ach, i) => (
                    <li key={i} style={{ fontSize: '9.5pt', color: '#1f2937', marginBottom: '1.5px' }}>
                      {ach}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Education */}
      {education?.length > 0 && education[0]?.institutionName && (
        <div style={{ marginBottom: '10px' }}>
          <h2
            style={{
              fontSize: '11pt',
              fontWeight: 700,
              borderBottom: `1.5px solid ${headerBorderColor}`,
              paddingBottom: '2px',
              marginTop: '8px',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: accentColor !== '#111827' ? accentColor : '#000',
            }}
          >
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '6px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <h3 style={{ fontSize: '10pt', fontWeight: 700, color: '#111' }}>
                  {edu.institutionName}
                </h3>
                <span style={{ fontSize: '9pt', color: '#4b5563', fontWeight: 600 }}>
                  {edu.startYear} – {edu.endYear || 'Present'}
                </span>
              </div>
              <p style={{ fontSize: '9pt', color: '#374151' }}>
                {edu.degree}
                {edu.score && `  |  ${edu.score}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills?.length > 0 && skills[0]?.groupName && (
        <div style={{ marginBottom: '10px' }}>
          <h2
            style={{
              fontSize: '11pt',
              fontWeight: 700,
              borderBottom: `1.5px solid ${headerBorderColor}`,
              paddingBottom: '2px',
              marginTop: '8px',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: accentColor !== '#111827' ? accentColor : '#000',
            }}
          >
            Skills
          </h2>
          {skills.map((group) => (
            <p key={group.id} style={{ fontSize: '9.5pt', color: '#1f2937', marginBottom: '2px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <strong style={{ color: '#111' }}>{group.groupName}: </strong>
              {Array.isArray(group.skills) ? group.skills.join(', ') : ''}
            </p>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && projects[0]?.projectName && (
        <div style={{ marginBottom: '10px' }}>
          <h2
            style={{
              fontSize: '11pt',
              fontWeight: 700,
              borderBottom: `1.5px solid ${headerBorderColor}`,
              paddingBottom: '2px',
              marginTop: '8px',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: accentColor !== '#111827' ? accentColor : '#000',
            }}
          >
            Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '8px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontSize: '10pt', fontWeight: 700, color: '#111' }}>
                  {proj.projectName}
                  {proj.technologies && (
                    <span style={{ fontWeight: 400, fontSize: '9pt', color: '#4b5563' }}>
                      {' '}— {proj.technologies}
                    </span>
                  )}
                </h3>
                {proj.projectLink && (
                  <a
                    href={formatUrl(proj.projectLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ fontSize: '8.5pt', color: '#1d4ed8', textDecoration: 'none' }}
                  >
                    {formatUrlForDisplay(proj.projectLink)}
                  </a>
                )}
              </div>
              {proj.achievements && proj.achievements.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '18px', marginTop: '2px', marginBottom: '2px' }}>
                  {proj.achievements.filter(Boolean).map((ach, i) => (
                    <li key={i} style={{ fontSize: '9.5pt', color: '#1f2937', marginBottom: '1.5px' }}>
                      {ach}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications?.length > 0 && certifications.filter(Boolean).length > 0 && (
        <div style={{ marginBottom: '8px', breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          <h2
            style={{
              fontSize: '11pt',
              fontWeight: 700,
              borderBottom: `1.5px solid ${headerBorderColor}`,
              paddingBottom: '2px',
              marginTop: '8px',
              marginBottom: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: accentColor !== '#111827' ? accentColor : '#000',
            }}
          >
            Certifications
          </h2>
          <ul style={{ paddingLeft: '18px', marginTop: '2px' }}>
            {certifications.filter(Boolean).map((cert, i) => (
              <li key={i} style={{ fontSize: '9.5pt', color: '#1f2937', marginBottom: '1.5px' }}>
                {typeof cert === 'string' ? cert : (cert?.certificateName || cert?.name || cert?.title || String(cert))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ClassicTemplate;
