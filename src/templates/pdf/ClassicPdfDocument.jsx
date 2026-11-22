import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Link 
} from '@react-pdf/renderer';
import { sanitizeSafeUrl, formatUrlForDisplay } from '../../utils/security.js';

// Standard ATS Ivy League single-column typography & spacing
const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 40,
    paddingLeft: 40,
    paddingRight: 40,
    fontFamily: 'Times-Roman',
    fontSize: 9.5,
    lineHeight: 1.35,
    color: '#111827',
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
  },
  fullName: {
    fontSize: 20,
    fontFamily: 'Times-Bold',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  professionalTitle: {
    fontSize: 11,
    fontFamily: 'Times-Bold',
    color: '#374151',
    marginBottom: 2,
  },
  contactRow: {
    fontSize: 9,
    color: '#4B5563',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  linksRow: {
    fontSize: 8.5,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  link: {
    color: '#1D4ED8',
    textDecoration: 'none',
  },
  section: {
    marginTop: 8,
    marginBottom: 4,
  },
  sectionHeader: {
    borderBottomWidth: 1.2,
    paddingBottom: 2,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: 'Times-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  summaryText: {
    fontSize: 9.5,
    color: '#1F2937',
    textAlign: 'justify',
    lineHeight: 1.4,
  },
  entryBlock: {
    marginBottom: 7,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  entryTitle: {
    fontSize: 10,
    fontFamily: 'Times-Bold',
    color: '#111827',
    flex: 1,
  },
  dateText: {
    fontSize: 8.5,
    fontFamily: 'Times-Bold',
    color: '#4B5563',
    textAlign: 'right',
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 1,
    marginBottom: 2,
  },
  companyOrSchool: {
    fontSize: 9,
    fontFamily: 'Times-Italic',
    color: '#374151',
    flex: 1,
  },
  locationOrScore: {
    fontSize: 8.5,
    color: '#4B5563',
    textAlign: 'right',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 1.5,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 10,
    fontSize: 9,
    lineHeight: 1.2,
    color: '#374151',
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: '#1F2937',
    lineHeight: 1.35,
  },
  skillGroupRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  skillGroupName: {
    fontFamily: 'Times-Bold',
    fontSize: 9.5,
    color: '#111827',
  },
  skillItemsText: {
    fontSize: 9.5,
    color: '#374151',
    flex: 1,
  },
  certItemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 2,
    paddingLeft: 4,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 8,
    color: '#9CA3AF',
  },
});

const formatUrl = (url) => sanitizeSafeUrl(url);

const ClassicPdfDocument = ({ data, accentColor = '#111827' }) => {
  if (!data) return null;

  const {
    basics = {},
    personalInfo = basics,
    summary = '',
    professionalSummary = summary,
    experience = [],
    workExperience = experience,
    education = [],
    skills = [],
    projects = [],
    certifications = [],
  } = data;

  const validName = personalInfo?.fullName?.trim() || 'Your Name';
  const validTitle = personalInfo?.professionalTitle?.trim() || '';
  const brandColor = accentColor && accentColor !== '#111827' ? accentColor : '#000000';
  const dividerColor = accentColor && accentColor !== '#111827' ? accentColor : '#111827';

  // Contact items filter
  const contactParts = [
    personalInfo?.email,
    personalInfo?.phone,
    personalInfo?.location,
  ].filter(Boolean);

  // Link items
  const rawLinks = [
    personalInfo?.linkedinUrl && { label: 'LinkedIn', url: personalInfo.linkedinUrl },
    personalInfo?.githubUrl && { label: 'GitHub', url: personalInfo.githubUrl },
    personalInfo?.portfolioUrl && { label: 'Portfolio', url: personalInfo.portfolioUrl },
    ...(personalInfo?.additionalLinks || []).map((l) => ({
      label: l.label || 'Link',
      url: l.url,
    })),
  ].filter((item) => item && item.url);

  // Filter valid experiences, education, etc.
  const validExperiences = (workExperience || []).filter(
    (exp) => exp && (exp.companyName?.trim() || exp.jobTitle?.trim())
  );
  const validEducations = (education || []).filter(
    (edu) => edu && (edu.institutionName?.trim() || edu.degree?.trim())
  );
  const validSkills = (skills || []).filter(
    (grp) => grp && grp.groupName?.trim() && grp.skills?.length > 0
  );
  const validProjects = (projects || []).filter(
    (prj) => prj && prj.projectName?.trim()
  );
  const validCertifications = (certifications || []).filter(
    (cert) => typeof cert === 'string' && cert.trim().length > 0
  );

  return (
    <Document
      title={`${validName} - Resume`}
      author={validName}
      subject="Professional ATS Resume"
      keywords="Resume, ATS, Curriculum Vitae, Professional"
    >
      <Page size="A4" style={styles.page} wrap>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={[styles.fullName, { color: brandColor }]}>
            {validName}
          </Text>

          {validTitle ? (
            <Text style={styles.professionalTitle}>{validTitle}</Text>
          ) : null}

          {contactParts.length > 0 ? (
            <Text style={styles.contactRow}>
              {contactParts.join('   •   ')}
            </Text>
          ) : null}

          {rawLinks.length > 0 ? (
            <View style={styles.linksRow}>
              {rawLinks.map((item, index) => (
                <Text key={index}>
                  {index > 0 ? '   •   ' : ''}
                  <Link src={formatUrl(item.url)} style={styles.link}>
                    {item.label}: {formatUrlForDisplay(item.url)}
                  </Link>
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        {/* Professional Summary */}
        {professionalSummary?.trim() ? (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { borderBottomColor: dividerColor }]}>
              <Text style={[styles.sectionTitle, { color: brandColor }]}>
                Professional Summary
              </Text>
            </View>
            <Text style={styles.summaryText}>{professionalSummary.trim()}</Text>
          </View>
        ) : null}

        {/* Work Experience */}
        {validExperiences.length > 0 ? (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { borderBottomColor: dividerColor }]}>
              <Text style={[styles.sectionTitle, { color: brandColor }]}>
                Work Experience
              </Text>
            </View>

            {validExperiences.map((exp, idx) => (
              <View key={exp.id || idx} wrap={false} style={styles.entryBlock}>
                <View style={styles.rowBetween}>
                  <Text style={styles.entryTitle}>
                    {exp.jobTitle || 'Role'}
                  </Text>
                  <Text style={styles.dateText}>
                    {exp.startDate || 'Start'} – {exp.endDate || 'Present'}
                  </Text>
                </View>

                <View style={styles.subRow}>
                  <Text style={styles.companyOrSchool}>
                    {exp.companyName || 'Company'}
                  </Text>
                  {exp.location ? (
                    <Text style={styles.locationOrScore}>{exp.location}</Text>
                  ) : null}
                </View>

                {(exp.achievements || [])
                  .filter((ach) => ach && ach.trim())
                  .map((ach, achIdx) => (
                    <View key={achIdx} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{ach.trim()}</Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* Education */}
        {validEducations.length > 0 ? (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { borderBottomColor: dividerColor }]}>
              <Text style={[styles.sectionTitle, { color: brandColor }]}>
                Education
              </Text>
            </View>

            {validEducations.map((edu, idx) => (
              <View key={edu.id || idx} wrap={false} style={styles.entryBlock}>
                <View style={styles.rowBetween}>
                  <Text style={styles.entryTitle}>
                    {edu.degree || 'Degree'}
                  </Text>
                  {(edu.startYear || edu.endYear) ? (
                    <Text style={styles.dateText}>
                      {edu.startYear || ''}{edu.startYear && edu.endYear ? ' – ' : ''}{edu.endYear || ''}
                    </Text>
                  ) : null}
                </View>

                <View style={styles.subRow}>
                  <Text style={styles.companyOrSchool}>
                    {edu.institutionName || 'Institution'}
                  </Text>
                  {edu.score ? (
                    <Text style={styles.locationOrScore}>{edu.score}</Text>
                  ) : null}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {/* Skills */}
        {validSkills.length > 0 ? (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { borderBottomColor: dividerColor }]}>
              <Text style={[styles.sectionTitle, { color: brandColor }]}>
                Technical & Professional Skills
              </Text>
            </View>

            {validSkills.map((grp, idx) => (
              <View key={grp.id || idx} wrap={false} style={styles.skillGroupRow}>
                <Text style={styles.skillGroupName}>{grp.groupName}: </Text>
                <Text style={styles.skillItemsText}>
                  {(grp.skills || []).join(', ')}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Projects */}
        {validProjects.length > 0 ? (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { borderBottomColor: dividerColor }]}>
              <Text style={[styles.sectionTitle, { color: brandColor }]}>
                Key Projects
              </Text>
            </View>

            {validProjects.map((prj, idx) => (
              <View key={prj.id || idx} wrap={false} style={styles.entryBlock}>
                <View style={styles.rowBetween}>
                  <Text style={styles.entryTitle}>
                    {prj.projectName}
                    {prj.technologies ? ` (${prj.technologies})` : ''}
                  </Text>
                  {prj.projectLink ? (
                    <Link src={formatUrl(prj.projectLink)} style={[styles.link, { fontSize: 8.5 }]}>
                      {formatUrlForDisplay(prj.projectLink)}
                    </Link>
                  ) : null}
                </View>

                {(prj.achievements || [])
                  .filter((ach) => ach && ach.trim())
                  .map((ach, achIdx) => (
                    <View key={achIdx} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{ach.trim()}</Text>
                    </View>
                  ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* Certifications */}
        {validCertifications.length > 0 ? (
          <View style={styles.section}>
            <View style={[styles.sectionHeader, { borderBottomColor: dividerColor }]}>
              <Text style={[styles.sectionTitle, { color: brandColor }]}>
                Certifications & Credentials
              </Text>
            </View>

            {validCertifications.map((cert, idx) => (
              <View key={idx} wrap={false} style={styles.certItemRow}>
                <Text style={styles.bulletDot}>•</Text>
                <Text style={styles.bulletText}>{cert}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* Multi-Page Footer with Page Numbers (Fixed on all pages) */}
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) =>
            totalPages > 1 ? `Page ${pageNumber} of ${totalPages}` : ''
          }
          fixed
        />
      </Page>
    </Document>
  );
};

export default ClassicPdfDocument;

