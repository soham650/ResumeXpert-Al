// TechnicalTemplate — Software Engineering & Tech-Focused ATS Resume Template
// Highlights technical proficiencies up front, followed by key projects and high-scale work experience.

import React from 'react';
import { sanitizeSafeUrl, formatUrlForDisplay } from '../utils/security.js';

const formatUrl = (url) => sanitizeSafeUrl(url);

const TechnicalTemplate = ({ data, accentColor = '#0f766e' }) => {
  if (!data) return null;

  const personalInfo = data.personalInfo || data.basics || {};
  const professionalSummary = data.professionalSummary || data.summary || '';
  const workExperience = data.workExperience || data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const projects = data.projects || [];
  const certifications = data.certifications || [];

  const primaryColor = accentColor || '#0f766e';

  const rawLinks = [
    personalInfo.githubUrl && { label: 'GitHub', url: personalInfo.githubUrl },
    personalInfo.linkedinUrl && { label: 'LinkedIn', url: personalInfo.linkedinUrl },
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
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#1e293b',
        lineHeight: 1.45,
        fontSize: '9.5pt',
        padding: '36px 42px',
        maxWidth: '8.5in',
        margin: '0 auto',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '14px', borderBottom: `2px solid ${primaryColor}`, paddingBottom: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <h1
              style={{
                fontSize: '22pt',
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.5px',
                marginBottom: '2px',
              }}
            >
              {personalInfo.fullName || 'Your Name'}
            </h1>
            {personalInfo.professionalTitle && (
              <p style={{ fontSize: '11pt', color: primaryColor, fontWeight: 600, letterSpacing: '-0.2px' }}>
                {personalInfo.professionalTitle}
              </p>
            )}
          </div>

          <div style={{ textAlign: 'right', fontSize: '8.5pt', color: '#64748b' }}>
            <div>{contactItems.join(' • ')}</div>
            {rawLinks.length > 0 && (
              <div style={{ marginTop: '3px' }}>
                {rawLinks.map((item, idx) => (
                  <span key={idx}>
                    {idx > 0 && ' • '}
                    <a
                      href={formatUrl(item.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: primaryColor, textDecoration: 'none', fontWeight: 600 }}
                    >
                      {item.label}: {formatUrlForDisplay(item.url)}
                    </a>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      {professionalSummary && (
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontSize: '10pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: primaryColor,
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '2px',
              marginBottom: '5px',
            }}
          >
            Technical Profile
          </h2>
          <p style={{ fontSize: '9pt', color: '#334155', lineHeight: 1.5 }}>
            {professionalSummary}
          </p>
        </div>
      )}

      {/* Technical Skills — Positioned Prominently at the Top for Recruiters */}
      {skills?.length > 0 && skills.some(g => (g.skills || []).length > 0) && (
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontSize: '10pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: primaryColor,
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '2px',
              marginBottom: '6px',
            }}
          >
            Technical Proficiencies
          </h2>
          <div style={{ fontSize: '9pt', lineHeight: 1.55 }}>
            {skills
              .filter((group) => (group.skills || []).length > 0)
              .map((group, idx) => (
                <div key={group.id || idx} style={{ marginBottom: '2.5px' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{group.groupName}: </span>
                  <span style={{ color: '#334155' }}>{(group.skills || []).join(', ')}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Work Experience */}
      {workExperience?.length > 0 && workExperience.some(e => e.companyName || e.jobTitle) && (
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontSize: '10pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: primaryColor,
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '2px',
              marginBottom: '6px',
            }}
          >
            Engineering Experience
          </h2>
          {workExperience
            .filter((exp) => exp.companyName || exp.jobTitle)
            .map((exp, idx) => (
              <div key={exp.id || idx} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '9.5pt', fontWeight: 700, color: '#0f172a' }}>
                    {exp.jobTitle || 'Role'} <span style={{ fontWeight: 400, color: '#64748b' }}>at</span> {exp.companyName}
                  </span>
                  <span style={{ fontSize: '8.5pt', color: '#64748b', fontWeight: 500 }}>
                    {[exp.startDate, exp.endDate || 'Present'].filter(Boolean).join(' – ')}
                  </span>
                </div>
                {exp.location && (
                  <div style={{ fontSize: '8.5pt', color: '#64748b', marginBottom: '2px' }}>
                    {exp.location}
                  </div>
                )}
                {exp.achievements && exp.achievements.filter(Boolean).length > 0 && (
                  <ul style={{ paddingLeft: '18px', margin: '3px 0 0 0' }}>
                    {exp.achievements.filter(Boolean).map((ach, i) => (
                      <li key={i} style={{ fontSize: '9pt', color: '#334155', marginBottom: '2px', lineHeight: 1.45 }}>
                        {ach}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
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
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '2px',
              marginBottom: '6px',
            }}
          >
            Key Software Projects & Open Source
          </h2>
          {projects
            .filter((p) => p.projectName)
            .map((proj, idx) => (
              <div key={proj.id || idx} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '9.5pt', fontWeight: 700, color: '#0f172a' }}>
                    {proj.projectName}
                    {proj.technologies && (
                      <span style={{ fontWeight: 500, color: '#64748b', fontSize: '8.5pt' }}>
                        {' '}[{proj.technologies}]
                      </span>
                    )}
                  </span>
                  {proj.projectLink && (
                    <a
                      href={formatUrl(proj.projectLink)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '8.5pt', color: primaryColor, textDecoration: 'none', fontWeight: 600 }}
                    >
                      {formatUrlForDisplay(proj.projectLink)}
                    </a>
                  )}
                </div>
                {proj.achievements && proj.achievements.filter(Boolean).length > 0 && (
                  <ul style={{ paddingLeft: '18px', margin: '2px 0 0 0' }}>
                    {proj.achievements.filter(Boolean).map((ach, i) => (
                      <li key={i} style={{ fontSize: '9pt', color: '#334155', marginBottom: '1.5px' }}>
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
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '2px',
              marginBottom: '6px',
            }}
          >
            Education
          </h2>
          {education
            .filter((edu) => edu.institutionName || edu.degree)
            .map((edu, idx) => (
              <div key={edu.id || idx} style={{ marginBottom: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '9.5pt', fontWeight: 700, color: '#0f172a' }}>
                    {edu.degree || 'Degree'}
                  </span>
                  <span style={{ fontSize: '8.5pt', color: '#64748b', fontWeight: 500 }}>
                    {[edu.startYear, edu.endYear].filter(Boolean).join(' – ')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '9pt', color: '#475569' }}>
                    {edu.institutionName}
                  </span>
                  {edu.score && (
                    <span style={{ fontSize: '8.5pt', color: '#64748b' }}>
                      GPA / Score: {edu.score}
                    </span>
                  )}
                </div>
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
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '2px',
              marginBottom: '4px',
            }}
          >
            Certifications & Cloud Badges
          </h2>
          <div style={{ fontSize: '9pt', color: '#334155' }}>
            {certifications.map((c) => typeof c === 'string' ? c : (c?.certificateName || c?.name || c?.title || String(c))).filter(Boolean).join(' • ')}
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnicalTemplate;

