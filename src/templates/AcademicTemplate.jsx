// AcademicTemplate — Education, Research & Curriculum Vitae (CV) ATS Template
// Emphasizes academic credentials, publications/projects, and research/teaching experience.

import React from 'react';
import { sanitizeSafeUrl, formatUrlForDisplay } from '../utils/security.js';

const formatUrl = (url) => sanitizeSafeUrl(url);

const AcademicTemplate = ({ data, accentColor = '#701a75' }) => {
  if (!data) return null;

  const personalInfo = data.personalInfo || data.basics || {};
  const professionalSummary = data.professionalSummary || data.summary || '';
  const workExperience = data.workExperience || data.experience || [];
  const education = data.education || [];
  const skills = data.skills || [];
  const projects = data.projects || [];
  const certifications = data.certifications || [];

  const primaryColor = accentColor || '#701a75';

  const rawLinks = [
    personalInfo.portfolioUrl && { label: 'Scholar / Website', url: personalInfo.portfolioUrl },
    personalInfo.linkedinUrl && { label: 'LinkedIn', url: personalInfo.linkedinUrl },
    personalInfo.githubUrl && { label: 'GitHub / Code', url: personalInfo.githubUrl },
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
        fontFamily: "Georgia, Cambria, 'Times New Roman', serif",
        color: '#1c1917',
        lineHeight: 1.5,
        fontSize: '10pt',
        padding: '38px 44px',
        maxWidth: '8.5in',
        margin: '0 auto',
        backgroundColor: '#ffffff',
      }}
    >
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '14px', borderBottom: '1px solid #d6d3d1', paddingBottom: '12px' }}>
        <h1
          style={{
            fontSize: '23pt',
            fontWeight: 700,
            color: '#1c1917',
            marginBottom: '3px',
            letterSpacing: '0.2px',
          }}
        >
          {personalInfo.fullName || 'Your Name'}
        </h1>
        {personalInfo.professionalTitle && (
          <p style={{ fontSize: '11pt', color: primaryColor, fontStyle: 'italic', marginBottom: '6px' }}>
            {personalInfo.professionalTitle}
          </p>
        )}

        <div style={{ fontSize: '8.5pt', color: '#57534e' }}>
          <div>{contactItems.join('   •   ')}</div>
          {rawLinks.length > 0 && (
            <div style={{ marginTop: '3px' }}>
              {rawLinks.map((item, idx) => (
                <span key={idx}>
                  {idx > 0 && '   •   '}
                  <a
                    href={formatUrl(item.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: primaryColor, textDecoration: 'none' }}
                  >
                    {item.label}: {formatUrlForDisplay(item.url)}
                  </a>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Research Statement / Profile */}
      {professionalSummary && (
        <div style={{ marginBottom: '16px' }}>
          <h2
            style={{
              fontSize: '10.5pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#1c1917',
              borderBottom: '1px solid #e7e5e4',
              paddingBottom: '2px',
              marginBottom: '6px',
            }}
          >
            Research Statement & Academic Profile
          </h2>
          <p style={{ fontSize: '9.5pt', color: '#44403c', textAlign: 'justify' }}>
            {professionalSummary}
          </p>
        </div>
      )}

      {/* Education & Academic Qualifications — Prominent at the Top */}
      {education?.length > 0 && education.some(e => e.institutionName || e.degree) && (
        <div style={{ marginBottom: '16px' }}>
          <h2
            style={{
              fontSize: '10.5pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#1c1917',
              borderBottom: '1px solid #e7e5e4',
              paddingBottom: '2px',
              marginBottom: '6px',
            }}
          >
            Education
          </h2>
          {education
            .filter((edu) => edu.institutionName || edu.degree)
            .map((edu, idx) => (
              <div key={edu.id || idx} style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '10pt', fontWeight: 700, color: '#1c1917' }}>
                    {edu.degree || 'Degree Title'}
                  </span>
                  <span style={{ fontSize: '9pt', color: '#78716c', fontStyle: 'italic' }}>
                    {[edu.startYear, edu.endYear].filter(Boolean).join(' – ')}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '9.5pt', color: '#44403c', fontStyle: 'italic' }}>
                    {edu.institutionName}
                  </span>
                  {edu.score && (
                    <span style={{ fontSize: '8.5pt', color: '#78716c' }}>
                      Honors / GPA: {edu.score}
                    </span>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Research & Publications / Projects */}
      {projects?.length > 0 && projects.some(p => p.projectName) && (
        <div style={{ marginBottom: '16px' }}>
          <h2
            style={{
              fontSize: '10.5pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#1c1917',
              borderBottom: '1px solid #e7e5e4',
              paddingBottom: '2px',
              marginBottom: '6px',
            }}
          >
            Publications & Research Projects
          </h2>
          {projects
            .filter((p) => p.projectName)
            .map((proj, idx) => (
              <div key={proj.id || idx} style={{ marginBottom: '9px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '10pt', fontWeight: 700, color: '#1c1917' }}>
                    “{proj.projectName}”
                    {proj.technologies && (
                      <span style={{ fontWeight: 400, color: '#78716c', fontSize: '9pt', fontStyle: 'italic' }}>
                        {' '}— {proj.technologies}
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
                      DOI / Link
                    </a>
                  )}
                </div>
                {proj.achievements && proj.achievements.filter(Boolean).length > 0 && (
                  <ul style={{ paddingLeft: '18px', margin: '3px 0 0 0' }}>
                    {proj.achievements.filter(Boolean).map((ach, i) => (
                      <li key={i} style={{ fontSize: '9.5pt', color: '#44403c', marginBottom: '2px' }}>
                        {ach}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Academic & Professional Appointments */}
      {workExperience?.length > 0 && workExperience.some(e => e.companyName || e.jobTitle) && (
        <div style={{ marginBottom: '16px' }}>
          <h2
            style={{
              fontSize: '10.5pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#1c1917',
              borderBottom: '1px solid #e7e5e4',
              paddingBottom: '2px',
              marginBottom: '6px',
            }}
          >
            Appointments & Experience
          </h2>
          {workExperience
            .filter((exp) => exp.companyName || exp.jobTitle)
            .map((exp, idx) => (
              <div key={exp.id || idx} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '10pt', fontWeight: 700, color: '#1c1917' }}>
                    {exp.jobTitle || 'Appointment Title'}
                  </span>
                  <span style={{ fontSize: '9pt', color: '#78716c', fontStyle: 'italic' }}>
                    {[exp.startDate, exp.endDate || 'Present'].filter(Boolean).join(' – ')}
                  </span>
                </div>
                <div style={{ fontSize: '9.5pt', color: '#44403c', fontStyle: 'italic', marginBottom: '3px' }}>
                  {exp.companyName}{exp.location ? `, ${exp.location}` : ''}
                </div>
                {exp.achievements && exp.achievements.filter(Boolean).length > 0 && (
                  <ul style={{ paddingLeft: '18px', margin: '3px 0 0 0' }}>
                    {exp.achievements.filter(Boolean).map((ach, i) => (
                      <li key={i} style={{ fontSize: '9.5pt', color: '#44403c', marginBottom: '2px' }}>
                        {ach}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
        </div>
      )}

      {/* Teaching, Methodologies & Skills */}
      {skills?.length > 0 && skills.some(g => (g.skills || []).length > 0) && (
        <div style={{ marginBottom: '16px' }}>
          <h2
            style={{
              fontSize: '10.5pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#1c1917',
              borderBottom: '1px solid #e7e5e4',
              paddingBottom: '2px',
              marginBottom: '6px',
            }}
          >
            Methodologies, Languages & Skills
          </h2>
          <div style={{ fontSize: '9.5pt', lineHeight: 1.5 }}>
            {skills
              .filter((group) => (group.skills || []).length > 0)
              .map((group, idx) => (
                <div key={group.id || idx} style={{ marginBottom: '2px' }}>
                  <strong style={{ color: '#1c1917' }}>{group.groupName}: </strong>
                  <span style={{ color: '#44403c' }}>{(group.skills || []).join(', ')}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Certifications & Memberships */}
      {certifications?.length > 0 && (
        <div>
          <h2
            style={{
              fontSize: '10.5pt',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              color: '#1c1917',
              borderBottom: '1px solid #e7e5e4',
              paddingBottom: '2px',
              marginBottom: '6px',
            }}
          >
            Affiliations & Certifications
          </h2>
          <ul style={{ paddingLeft: '18px', margin: '3px 0 0 0', fontSize: '9.5pt', color: '#44403c' }}>
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

export default AcademicTemplate;

