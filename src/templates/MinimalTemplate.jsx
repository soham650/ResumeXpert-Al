// MinimalTemplate — Minimalist Executive ATS Resume Template
// Elegant, minimal, ultra-clean layout with understated dividers and perfect ATS parseability.

import React from 'react';

const MinimalTemplate = ({ data, accentColor = '#111827' }) => {
  if (!data) return null;

  const {
    personalInfo = {},
    professionalSummary = '',
    workExperience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
  } = data;

  const titleColor = accentColor || '#111827';

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#27272a',
        lineHeight: 1.45,
        fontSize: '9.5pt',
        padding: '36px 44px',
        maxWidth: '8.5in',
        margin: '0 auto',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '16px' }}>
        <h1
          style={{
            fontSize: '22pt',
            fontWeight: 700,
            color: titleColor,
            letterSpacing: '-0.3px',
            marginBottom: '2px',
          }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.professionalTitle && (
          <p style={{ fontSize: '10.5pt', color: '#52525b', fontWeight: 500, marginBottom: '6px' }}>
            {personalInfo.professionalTitle}
          </p>
        )}
        <div style={{ fontSize: '8.5pt', color: '#71717a', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location]
            .filter(Boolean)
            .map((item, idx) => (
              <span key={idx}>
                {idx > 0 && <span style={{ marginRight: '8px', color: '#d4d4d8' }}>/</span>}
                {item}
              </span>
            ))}
          {(personalInfo.linkedinUrl || personalInfo.githubUrl || personalInfo.portfolioUrl) && (
            <>
              <span style={{ color: '#d4d4d8' }}>/</span>
              {[personalInfo.linkedinUrl, personalInfo.githubUrl, personalInfo.portfolioUrl]
                .filter(Boolean)
                .map((link, idx) => (
                  <span key={idx}>
                    {idx > 0 && <span style={{ margin: '0 8px', color: '#d4d4d8' }}>/</span>}
                    {link}
                  </span>
                ))}
            </>
          )}
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
              color: titleColor,
              borderBottom: '1px solid #e4e4e7',
              paddingBottom: '3px',
              marginBottom: '6px',
            }}
          >
            Summary
          </h2>
          <p style={{ fontSize: '9pt', color: '#3f3f46', lineHeight: 1.5 }}>
            {professionalSummary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience?.length > 0 && workExperience[0]?.companyName && (
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontSize: '10pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: titleColor,
              borderBottom: '1px solid #e4e4e7',
              paddingBottom: '3px',
              marginBottom: '8px',
            }}
          >
            Experience
          </h2>
          {workExperience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '9px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '9.5pt', fontWeight: 600, color: '#18181b' }}>
                  {exp.jobTitle} <span style={{ fontWeight: 400, color: '#71717a' }}>— {exp.companyName}{exp.location && `, ${exp.location}`}</span>
                </span>
                <span style={{ fontSize: '8.5pt', color: '#71717a' }}>
                  {exp.startDate} – {exp.endDate || 'Present'}
                </span>
              </div>
              {exp.achievements && exp.achievements.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '16px', marginTop: '2px', margin: 0 }}>
                  {exp.achievements.filter(Boolean).map((ach, i) => (
                    <li key={i} style={{ fontSize: '8.5pt', color: '#3f3f46', marginBottom: '2px', lineHeight: 1.45 }}>
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
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontSize: '10pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: titleColor,
              borderBottom: '1px solid #e4e4e7',
              paddingBottom: '3px',
              marginBottom: '6px',
            }}
          >
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '9.5pt', fontWeight: 600, color: '#18181b' }}>
                  {edu.institutionName} <span style={{ fontWeight: 400, color: '#71717a' }}>— {edu.degree}{edu.score && ` (${edu.score})`}</span>
                </span>
                <span style={{ fontSize: '8.5pt', color: '#71717a' }}>
                  {edu.startYear} – {edu.endYear || 'Present'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills?.length > 0 && skills[0]?.groupName && (
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontSize: '10pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: titleColor,
              borderBottom: '1px solid #e4e4e7',
              paddingBottom: '3px',
              marginBottom: '6px',
            }}
          >
            Skills
          </h2>
          {skills.map((group) => (
            <p key={group.id} style={{ fontSize: '8.5pt', color: '#3f3f46', marginBottom: '2px' }}>
              <strong style={{ color: '#18181b', fontWeight: 600 }}>{group.groupName}: </strong>
              {Array.isArray(group.skills) ? group.skills.join(', ') : ''}
            </p>
          ))}
        </div>
      )}

      {/* Projects */}
      {projects?.length > 0 && projects[0]?.projectName && (
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontSize: '10pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: titleColor,
              borderBottom: '1px solid #e4e4e7',
              paddingBottom: '3px',
              marginBottom: '6px',
            }}
          >
            Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '7px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: '9.5pt', fontWeight: 600, color: '#18181b' }}>
                  {proj.projectName}
                  {proj.technologies && (
                    <span style={{ fontWeight: 400, color: '#71717a', fontSize: '8.5pt' }}>
                      {' '}— {proj.technologies}
                    </span>
                  )}
                </span>
                {proj.projectLink && (
                  <span style={{ fontSize: '8pt', color: '#71717a' }}>
                    {proj.projectLink}
                  </span>
                )}
              </div>
              {proj.achievements && proj.achievements.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '16px', marginTop: '2px', margin: 0 }}>
                  {proj.achievements.filter(Boolean).map((ach, i) => (
                    <li key={i} style={{ fontSize: '8.5pt', color: '#3f3f46', marginBottom: '1.5px', lineHeight: 1.45 }}>
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
        <div style={{ marginBottom: '6px' }}>
          <h2
            style={{
              fontSize: '10pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              color: titleColor,
              borderBottom: '1px solid #e4e4e7',
              paddingBottom: '3px',
              marginBottom: '5px',
            }}
          >
            Certifications
          </h2>
          <ul style={{ paddingLeft: '16px', margin: 0 }}>
            {certifications.filter(Boolean).map((cert, i) => (
              <li key={i} style={{ fontSize: '8.5pt', color: '#3f3f46', marginBottom: '1.5px' }}>
                {typeof cert === 'string' ? cert : (cert?.certificateName || cert?.name || cert?.title || String(cert))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MinimalTemplate;
