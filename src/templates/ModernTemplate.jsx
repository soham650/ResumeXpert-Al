// ModernTemplate — Contemporary Clean ATS Resume Template
// Modern sans-serif layout with colored section headings, clean alignment, and high-readability hierarchy.

import React from 'react';

const ModernTemplate = ({ data, accentColor = '#1e3a8a' }) => {
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

  const primaryColor = accentColor || '#1e3a8a';

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        color: '#1f2937',
        lineHeight: 1.5,
        fontSize: '10pt',
        padding: '36px 44px',
        maxWidth: '8.5in',
        margin: '0 auto',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Header */}
      <div style={{ borderBottom: `2.5px solid ${primaryColor}`, paddingBottom: '12px', marginBottom: '14px' }}>
        <h1
          style={{
            fontSize: '24pt',
            fontWeight: 800,
            color: primaryColor,
            lineHeight: 1.1,
            letterSpacing: '-0.5px',
            marginBottom: '4px',
          }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.professionalTitle && (
          <p style={{ fontSize: '11.5pt', fontWeight: 600, color: '#4b5563', marginBottom: '6px' }}>
            {personalInfo.professionalTitle}
          </p>
        )}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '8.5pt', color: '#4b5563' }}>
          {[personalInfo.email, personalInfo.phone, personalInfo.location]
            .filter(Boolean)
            .map((item, idx) => (
              <span key={idx} style={{ display: 'inline-flex', alignItems: 'center' }}>
                {idx > 0 && <span style={{ marginRight: '12px', color: '#9ca3af' }}>•</span>}
                {item}
              </span>
            ))}
        </div>
        {(personalInfo.linkedinUrl || personalInfo.githubUrl || personalInfo.portfolioUrl) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '8.5pt', color: primaryColor, marginTop: '4px' }}>
            {[personalInfo.linkedinUrl, personalInfo.githubUrl, personalInfo.portfolioUrl]
              .filter(Boolean)
              .map((item, idx) => (
                <span key={idx} style={{ display: 'inline-flex', alignItems: 'center' }}>
                  {idx > 0 && <span style={{ marginRight: '12px', color: '#9ca3af' }}>•</span>}
                  {item}
                </span>
              ))}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {professionalSummary && (
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontSize: '11pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: primaryColor,
              marginBottom: '6px',
            }}
          >
            Professional Summary
          </h2>
          <p style={{ fontSize: '9.5pt', color: '#374151', lineHeight: 1.55 }}>
            {professionalSummary}
          </p>
        </div>
      )}

      {/* Work Experience */}
      {workExperience?.length > 0 && workExperience[0]?.companyName && (
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontSize: '11pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: primaryColor,
              marginBottom: '8px',
            }}
          >
            Work Experience
          </h2>
          {workExperience.map((exp) => (
            <div key={exp.id} style={{ marginBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontSize: '10.5pt', fontWeight: 700, color: '#111827' }}>
                  {exp.jobTitle}
                </h3>
                <span style={{ fontSize: '8.5pt', fontWeight: 600, color: '#6b7280' }}>
                  {exp.startDate} – {exp.endDate || 'Present'}
                </span>
              </div>
              <div style={{ fontSize: '9pt', fontWeight: 500, color: primaryColor, marginBottom: '4px' }}>
                {exp.companyName}{exp.location && ` — ${exp.location}`}
              </div>
              {exp.achievements && exp.achievements.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '18px', margin: 0 }}>
                  {exp.achievements.filter(Boolean).map((ach, i) => (
                    <li key={i} style={{ fontSize: '9pt', color: '#374151', marginBottom: '2.5px', lineHeight: 1.45 }}>
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
              fontSize: '11pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: primaryColor,
              marginBottom: '8px',
            }}
          >
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id} style={{ marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontSize: '10pt', fontWeight: 700, color: '#111827' }}>
                  {edu.institutionName}
                </h3>
                <span style={{ fontSize: '8.5pt', fontWeight: 600, color: '#6b7280' }}>
                  {edu.startYear} – {edu.endYear || 'Present'}
                </span>
              </div>
              <p style={{ fontSize: '9pt', color: '#4b5563' }}>
                {edu.degree}{edu.score && ` | ${edu.score}`}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Skills */}
      {skills?.length > 0 && skills[0]?.groupName && (
        <div style={{ marginBottom: '14px' }}>
          <h2
            style={{
              fontSize: '11pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: primaryColor,
              marginBottom: '6px',
            }}
          >
            Skills
          </h2>
          {skills.map((group) => (
            <p key={group.id} style={{ fontSize: '9pt', color: '#374151', marginBottom: '3px' }}>
              <strong style={{ color: '#111827', fontWeight: 600 }}>{group.groupName}: </strong>
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
              fontSize: '11pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: primaryColor,
              marginBottom: '8px',
            }}
          >
            Key Projects
          </h2>
          {projects.map((proj) => (
            <div key={proj.id} style={{ marginBottom: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ fontSize: '10pt', fontWeight: 700, color: '#111827' }}>
                  {proj.projectName}
                  {proj.technologies && (
                    <span style={{ fontWeight: 400, fontSize: '8.5pt', color: '#6b7280' }}>
                      {' '}[{proj.technologies}]
                    </span>
                  )}
                </h3>
                {proj.projectLink && (
                  <span style={{ fontSize: '8pt', color: primaryColor }}>
                    {proj.projectLink}
                  </span>
                )}
              </div>
              {proj.achievements && proj.achievements.filter(Boolean).length > 0 && (
                <ul style={{ paddingLeft: '18px', marginTop: '2px', marginBottom: 0 }}>
                  {proj.achievements.filter(Boolean).map((ach, i) => (
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

      {/* Certifications */}
      {certifications?.length > 0 && certifications.filter(Boolean).length > 0 && (
        <div style={{ marginBottom: '8px' }}>
          <h2
            style={{
              fontSize: '11pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: primaryColor,
              marginBottom: '6px',
            }}
          >
            Certifications & Honors
          </h2>
          <ul style={{ paddingLeft: '18px', margin: 0 }}>
            {certifications.filter(Boolean).map((cert, i) => (
              <li key={i} style={{ fontSize: '9pt', color: '#374151', marginBottom: '2px' }}>
                {typeof cert === 'string' ? cert : (cert?.certificateName || cert?.name || cert?.title || String(cert))}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ModernTemplate;
