// ProfessionalTemplate — Executive Corporate ATS Resume Template
// Clean executive styling, Calibri/system sans-serif typography, structured summary & impact bullets.

import React from 'react';
import { sanitizeSafeUrl, formatUrlForDisplay } from '../utils/security.js';

const formatUrl = (url) => sanitizeSafeUrl(url);

const ProfessionalTemplate = ({ data, accentColor = '#1e3a8a' }) => {
  if (!data) return null;

  const personalInfo = data.personalInfo || data.basics || {};
  const professionalSummary = data.professionalSummary || data.summary || '';
  const workExperience = data.workExperience || data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const projects = data.projects || [];
  const certifications = data.certifications || [];

  const primaryColor = accentColor || '#1e3a8a';

  const rawLinks = [
    personalInfo.linkedinUrl && { label: 'LinkedIn', url: personalInfo.linkedinUrl },
    personalInfo.githubUrl && { label: 'GitHub', url: personalInfo.githubUrl },
    personalInfo.portfolioUrl && { label: 'Portfolio', url: personalInfo.portfolioUrl },
    ...(personalInfo.additionalLinks || []).map((l) => ({
      label: l.label || 'Link',
      url: l.url,
    })),
  ].filter((item) => item && item.url);

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    personalInfo.location,
  ].filter(Boolean);

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Calibri, -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
        color: '#1f2937',
        lineHeight: 1.45,
        fontSize: '9.5pt',
        padding: '36px 42px',
        maxWidth: '8.5in',
        margin: '0 auto',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: `2px solid ${primaryColor}`, paddingBottom: '10px', marginBottom: '14px' }}>
        <h1
          style={{
            fontSize: '22pt',
            fontWeight: 700,
            color: '#111827',
            marginBottom: '2px',
            letterSpacing: '-0.3px',
          }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.professionalTitle && (
          <p style={{ fontSize: '11pt', color: primaryColor, fontWeight: 600, marginBottom: '6px' }}>
            {personalInfo.professionalTitle}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', fontSize: '8.5pt', color: '#4b5563' }}>
          {contactItems.map((item, idx) => (
            <span key={idx}>
              {idx > 0 && <span style={{ marginRight: '16px', color: '#d1d5db' }}>|</span>}
              {item}
            </span>
          ))}

          {rawLinks.length > 0 && (
            <>
              {contactItems.length > 0 && <span style={{ color: '#d1d5db' }}>|</span>}
              {rawLinks.map((item, idx) => (
                <span key={idx}>
                  {idx > 0 && <span style={{ marginRight: '16px', color: '#d1d5db' }}>|</span>}
                  <a
                    href={formatUrl(item.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: primaryColor, textDecoration: 'none', fontWeight: 500 }}
                  >
                    {item.label}: {formatUrlForDisplay(item.url)}
                  </a>
                </span>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Executive Summary */}
      {professionalSummary && (
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontSize: '10pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: primaryColor,
              marginBottom: '4px',
            }}
          >
            Executive Summary
          </h2>
          <p style={{ fontSize: '9pt', color: '#374151', lineHeight: 1.5 }}>
            {professionalSummary}
          </p>
        </div>
      )}

      {/* Professional Experience */}
      {workExperience?.length > 0 && workExperience.some(e => e.companyName || e.jobTitle) && (
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontSize: '10pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: primaryColor,
              marginBottom: '6px',
            }}
          >
            Professional Experience
          </h2>
          {workExperience
            .filter((exp) => exp.companyName || exp.jobTitle)
            .map((exp, idx) => (
              <div key={exp.id || idx} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '9.5pt', fontWeight: 700, color: '#111827' }}>
                    {exp.jobTitle || 'Role Title'}
                  </span>
                  <span style={{ fontSize: '8.5pt', color: '#6b7280', fontWeight: 500 }}>
                    {[exp.startDate, exp.endDate || 'Present'].filter(Boolean).join(' – ')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '3px' }}>
                  <span style={{ fontSize: '9pt', color: '#4b5563', fontWeight: 600 }}>
                    {exp.companyName}
                  </span>
                  {exp.location && (
                    <span style={{ fontSize: '8.5pt', color: '#6b7280', fontStyle: 'italic' }}>
                      {exp.location}
                    </span>
                  )}
                </div>
                {exp.achievements && exp.achievements.filter(Boolean).length > 0 && (
                  <ul style={{ paddingLeft: '18px', margin: '3px 0 0 0' }}>
                    {exp.achievements.filter(Boolean).map((ach, i) => (
                      <li key={i} style={{ fontSize: '9pt', color: '#374151', marginBottom: '2px', lineHeight: 1.45 }}>
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
      {education?.length > 0 && education.some(e => e.institutionName || e.degree) && (
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontSize: '10pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: primaryColor,
              marginBottom: '6px',
            }}
          >
            Education & Credentials
          </h2>
          {education
            .filter((edu) => edu.institutionName || edu.degree)
            .map((edu, idx) => (
              <div key={edu.id || idx} style={{ marginBottom: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '9.5pt', fontWeight: 700, color: '#111827' }}>
                    {edu.degree || 'Degree'}
                  </span>
                  <span style={{ fontSize: '8.5pt', color: '#6b7280', fontWeight: 500 }}>
                    {[edu.startYear, edu.endYear].filter(Boolean).join(' – ')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '9pt', color: '#4b5563' }}>
                    {edu.institutionName}
                  </span>
                  {edu.score && (
                    <span style={{ fontSize: '8.5pt', color: '#6b7280', fontWeight: 500 }}>
                      Score: {edu.score}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Core Competencies & Skills */}
      {skills?.length > 0 && skills.some(g => (g.skills || []).length > 0) && (
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontSize: '10pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: primaryColor,
              marginBottom: '4px',
            }}
          >
            Core Competencies & Technical Skills
          </h2>
          <div style={{ fontSize: '9pt', lineHeight: 1.5 }}>
            {skills
              .filter((group) => (group.skills || []).length > 0)
              .map((group, idx) => (
                <div key={group.id || idx} style={{ marginBottom: '2px' }}>
                  <strong style={{ color: '#111827' }}>{group.groupName}: </strong>
                  <span style={{ color: '#374151' }}>{(group.skills || []).join(', ')}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && projects.some(p => p.projectName) && (
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontSize: '10pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: primaryColor,
              marginBottom: '6px',
            }}
          >
            Key Initiatives & Projects
          </h2>
          {projects
            .filter((p) => p.projectName)
            .map((proj, idx) => (
              <div key={proj.id || idx} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '9.5pt', fontWeight: 700, color: '#111827' }}>
                    {proj.projectName}
                    {proj.technologies && (
                      <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '8.5pt' }}>
                        {' '}({proj.technologies})
                      </span>
                    )}
                  </span>
                  {proj.projectLink && (
                    <a
                      href={formatUrl(proj.projectLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '8.5pt', color: primaryColor, textDecoration: 'none' }}
                    >
                      {formatUrlForDisplay(proj.projectLink)}
                    </a>
                  )}
                </div>
                {proj.achievements && proj.achievements.filter(Boolean).length > 0 && (
                  <ul style={{ paddingLeft: '18px', margin: '2px 0 0 0' }}>
                    {proj.achievements.filter(Boolean).map((ach, i) => (
                      <li key={i} style={{ fontSize: '9pt', color: '#374151', marginBottom: '1.5px' }}>
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
      {certifications?.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: '10pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: primaryColor,
              marginBottom: '4px',
            }}
          >
            Certifications & Licenses
          </h2>
          <ul style={{ paddingLeft: '18px', margin: '2px 0 0 0', fontSize: '9pt', color: '#374151' }}>
            {certifications.filter(Boolean).map((cert, idx) => (
              <li key={idx} style={{ marginBottom: '2px' }}>
                {typeof cert === 'string' ? cert : (cert?.certificateName || cert?.name || cert?.title || String(cert))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfessionalTemplate;

