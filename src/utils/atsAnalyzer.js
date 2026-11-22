/**
 * ATS Resume Analyzer & Scoring Engine
 * 100% client-side, transparent, explainable, rule-based ATS evaluation.
 * Evaluates contact info, summary, experience, skills, education, projects, certifications,
 * formatting, bullet quality, and optional job description keyword matching.
 */

// Top strong action verbs favored by ATS parsers and executive recruiters
export const STRONG_ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'advised', 'analyzed', 'architected', 'audited',
  'automated', 'boosted', 'built', 'centralized', 'championed', 'coached', 'collaborated',
  'composed', 'conceptualized', 'consolidated', 'constructed', 'converted', 'coordinated',
  'crafted', 'created', 'customized', 'cut', 'debugged', 'decreased', 'delivered', 'deployed',
  'designed', 'developed', 'devised', 'directed', 'documented', 'drove', 'eliminated',
  'enabled', 'engineered', 'enhanced', 'established', 'evaluated', 'executed', 'expanded',
  'expedited', 'facilitated', 'formulated', 'founded', 'generated', 'governed', 'guided',
  'headed', 'identified', 'implemented', 'improved', 'increased', 'initiated', 'innovated',
  'inspected', 'installed', 'instituted', 'integrated', 'introduced', 'invented', 'investigated',
  'launched', 'led', 'leveraged', 'maintained', 'managed', 'maximized', 'mentored',
  'migrated', 'minimized', 'modernized', 'monitored', 'negotiated', 'optimized', 'orchestrated',
  'organized', 'overhauled', 'oversaw', 'partnered', 'performed', 'pioneered', 'planned',
  'prepared', 'presented', 'prioritized', 'produced', 'programmed', 'published', 're-engineered',
  'rebuilt', 'reduced', 'refined', 'reorganized', 'resolved', 'restructured', 'revamped',
  'revitalized', 'saved', 'scaled', 'scheduled', 'secured', 'simplified', 'slashed', 'solved',
  'spearheaded', 'standardized', 'streamlined', 'strengthened', 'supervised', 'surpassed',
  'synthesized', 'systematized', 'trained', 'transformed', 'transitioned', 'translated',
  'upgraded', 'validated'
];

// Weak / passive verbs and filler phrases that reduce bullet impact
export const WEAK_VERB_PATTERNS = [
  { pattern: /\b(worked on|worked with)\b/i, label: 'worked on', replacement: 'Developed / Engineered / Architected' },
  { pattern: /\b(responsible for|duties included)\b/i, label: 'responsible for', replacement: 'Spearheaded / Managed / Led' },
  { pattern: /\b(helped with|helped out|assisted in|assisted with)\b/i, label: 'helped with', replacement: 'Collaborated to / Facilitated' },
  { pattern: /\b(handled|did)\b/i, label: 'handled', replacement: 'Administered / Executed / Orchestrated' },
  { pattern: /\b(tried to|attempted to)\b/i, label: 'tried to', replacement: 'Implemented / Delivered' },
  { pattern: /\b(participated in)\b/i, label: 'participated in', replacement: 'Contributed to / Partnered on' },
];

// Common tech keywords dictionary for extraction & matching
export const COMMON_TECH_KEYWORDS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'golang', 'go', 'rust',
  'ruby', 'php', 'swift', 'kotlin', 'sql', 'nosql', 'html', 'css', 'sass', 'tailwind',
  'react', 'react.js', 'vue', 'vue.js', 'angular', 'next.js', 'nuxt', 'node', 'node.js',
  'express', 'express.js', 'django', 'flask', 'fastapi', 'spring', 'spring boot', 'laravel',
  'asp.net', 'graphql', 'rest', 'restful', 'grpc', 'postgresql', 'postgres', 'mysql',
  'mongodb', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'sqlite', 'aws', 'amazon web services',
  'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s', 'terraform', 'ansible',
  'ci/cd', 'jenkins', 'github actions', 'gitlab', 'git', 'linux', 'unix', 'bash', 'shell',
  'microservices', 'serverless', 'lambda', 'api gateway', 'kafka', 'rabbitmq', 'rabbitmq',
  'agile', 'scrum', 'kanban', 'jira', 'confluence', 'tdd', 'test driven development',
  'unit testing', 'jest', 'cypress', 'playwright', 'selenium', 'webpack', 'vite',
  'figma', 'ui/ux', 'seo', 'accessibility', 'a11y', 'web performance', 'system design',
  'distributed systems', 'cloud computing', 'data structures', 'algorithms', 'machine learning',
  'deep learning', 'nlp', 'data science', 'pandas', 'numpy', 'pytorch', 'tensorflow',
  'llm', 'generative ai', 'devops', 'security', 'oauth', 'jwt', 'sso'
];

/**
 * Evaluates Contact Information (Max: 10 pts)
 */
export function analyzeContactInfo(basics = {}) {
  let score = 0;
  const deductions = [];
  const strengths = [];

  const fullName = (basics.fullName || '').trim();
  const email = (basics.email || '').trim();
  const phone = (basics.phone || '').trim();
  const location = (basics.location || '').trim();
  const links = [basics.linkedinUrl, basics.githubUrl, basics.portfolioUrl].filter(Boolean);

  // Full Name (3 pts)
  if (fullName.length > 0) {
    const parts = fullName.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      score += 3;
      strengths.push('Full name is complete with first and last name.');
    } else {
      score += 2;
      deductions.push({
        points: 1,
        reason: 'Include both first and last name for professional identification.',
      });
    }
  } else {
    deductions.push({
      points: 3,
      reason: 'Candidate full name is missing.',
    });
  }

  // Email (2.5 pts)
  if (email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    score += 2.5;
    strengths.push('Professional email address is provided and valid.');
  } else if (email.length > 0) {
    score += 1;
    deductions.push({
      points: 1.5,
      reason: 'Email address appears improperly formatted.',
    });
  } else {
    deductions.push({
      points: 2.5,
      reason: 'Email address is missing; critical for recruiter contact.',
    });
  }

  // Phone (2 pts)
  if (phone.length >= 7) {
    score += 2;
    strengths.push('Phone number is provided for direct recruiter outreach.');
  } else {
    deductions.push({
      points: 2,
      reason: 'Phone number is missing; recruiters often conduct initial phone screens.',
    });
  }

  // Location (1.5 pts)
  if (location.length >= 3) {
    score += 1.5;
    strengths.push('Location is specified (city/region/remote).');
  } else {
    deductions.push({
      points: 1.5,
      reason: 'Location is missing; ATS filters use location to assess local/remote suitability.',
    });
  }

  // Professional Links (1 pt)
  if (links.length > 0) {
    score += 1;
    strengths.push(`Included ${links.length} professional link(s) (e.g. LinkedIn, GitHub).`);
  } else {
    deductions.push({
      points: 1,
      reason: 'No professional links provided (LinkedIn, GitHub, or portfolio).',
    });
  }

  return {
    category: 'Contact Information',
    weight: 10,
    score: Math.min(10, Math.max(0, score)),
    strengths,
    deductions,
  };
}

/**
 * Evaluates Professional Summary (Max: 10 pts)
 */
export function analyzeProfessionalSummary(summary = '') {
  let score = 0;
  const deductions = [];
  const strengths = [];
  const text = (summary || '').trim();

  if (!text) {
    deductions.push({
      points: 10,
      reason: 'Professional summary is blank. A concise 2-3 sentence summary clarifies your target role and core strengths.',
    });
    return {
      category: 'Professional Summary',
      weight: 10,
      score: 0,
      strengths: [],
      deductions,
    };
  }

  // Base presence (4 pts)
  score += 4;
  strengths.push('Professional summary section is present.');

  // Length Evaluation (3 pts)
  const len = text.length;
  if (len >= 120 && len <= 450) {
    score += 3;
    strengths.push(`Summary length is optimal (${len} characters; ideal range is 120-450 characters).`);
  } else if (len < 120) {
    score += 1.5;
    deductions.push({
      points: 1.5,
      reason: `Summary is brief (${len} characters). Expand to 2-3 sentences outlining your expertise and key impact.`,
    });
  } else {
    score += 1.5;
    deductions.push({
      points: 1.5,
      reason: `Summary is long (${len} characters). ATS parsers favor succinct summaries under 450 characters.`,
    });
  }

  // Key content & impact words (3 pts)
  const impactWords = ['experience', 'developed', 'architected', 'led', 'specialized', 'proven', 'track record', 'expertise', 'scalable', 'solutions'];
  const matches = impactWords.filter(word => new RegExp(`\\b${word}\\b`, 'i').test(text));
  if (matches.length >= 2) {
    score += 3;
    strengths.push('Contains strong positioning keywords and career trajectory descriptors.');
  } else {
    score += 1.5;
    deductions.push({
      points: 1.5,
      reason: 'Summary lacks strong impact keywords (e.g., specialized, engineered, proven track record).',
    });
  }

  return {
    category: 'Professional Summary',
    weight: 10,
    score: Math.min(10, Math.max(0, score)),
    strengths,
    deductions,
  };
}

/**
 * Evaluates Work Experience (Max: 25 pts)
 */
export function analyzeWorkExperience(experiences = []) {
  let score = 0;
  const deductions = [];
  const strengths = [];
  const validList = (experiences || []).filter(e => e && (e.companyName || e.jobTitle));

  if (validList.length === 0) {
    deductions.push({
      points: 25,
      reason: 'No work experience entries recorded. Experience is the highest-weighted ATS category.',
    });
    return {
      category: 'Work Experience',
      weight: 25,
      score: 0,
      strengths: [],
      deductions,
    };
  }

  // Number of positions (Max: 8 pts)
  if (validList.length >= 2) {
    score += 8;
    strengths.push(`Documented ${validList.length} professional roles with chronological continuity.`);
  } else {
    score += 6;
    strengths.push('Documented 1 professional role.');
  }

  // Company and Title completeness (Max: 5 pts)
  const allHaveTitles = validList.every(e => (e.jobTitle || '').trim().length > 0);
  const allHaveCompanies = validList.every(e => (e.companyName || '').trim().length > 0);

  if (allHaveTitles && allHaveCompanies) {
    score += 5;
    strengths.push('All roles have clearly defined job titles and organization names.');
  } else {
    score += 2;
    deductions.push({
      points: 3,
      reason: 'One or more experience entries is missing a specific Job Title or Company Name.',
    });
  }

  // Timeline / Date consistency (Max: 4 pts)
  const allHaveDates = validList.every(e => (e.startDate || '').trim() && (e.endDate || '').trim());
  if (allHaveDates) {
    score += 4;
    strengths.push('All positions include valid start and end dates.');
  } else {
    score += 2;
    deductions.push({
      points: 2,
      reason: 'Missing start or end dates in one or more experience entries.',
    });
  }

  // Bullets & Achievements count (Max: 4 pts)
  const totalBullets = validList.reduce((acc, exp) => acc + (exp.achievements || []).filter(b => (b || '').trim()).length, 0);
  const avgBullets = totalBullets / validList.length;

  if (avgBullets >= 2.5) {
    score += 4;
    strengths.push(`Strong achievement density (${totalBullets} total bullets, average ${avgBullets.toFixed(1)} per role).`);
  } else if (totalBullets > 0) {
    score += 2.5;
    deductions.push({
      points: 1.5,
      reason: 'Some roles have fewer than 2-3 achievement bullets. Aim for 3-5 bullets for primary roles.',
    });
  } else {
    deductions.push({
      points: 4,
      reason: 'No achievement bullets recorded. Bullet points are essential for ATS keyword indexing.',
    });
  }

  // Action Verbs at start of bullets (Max: 2 pts)
  let actionVerbCount = 0;
  const allBullets = validList.flatMap(e => (e.achievements || []).filter(b => (b || '').trim()));
  allBullets.forEach(b => {
    const firstWord = (b.trim().split(/\s+/)[0] || '').toLowerCase().replace(/[^a-z]/g, '');
    if (STRONG_ACTION_VERBS.includes(firstWord)) {
      actionVerbCount++;
    }
  });

  const actionVerbRatio = allBullets.length > 0 ? actionVerbCount / allBullets.length : 0;
  if (actionVerbRatio >= 0.5) {
    score += 2;
    strengths.push(`High action verb frequency (${actionVerbCount}/${allBullets.length} bullets open with strong verbs).`);
  } else if (actionVerbCount > 0) {
    score += 1;
    deductions.push({
      points: 1,
      reason: 'Several bullets do not begin with strong action verbs (e.g. Architected, Accelerated, Reduced).',
    });
  } else if (allBullets.length > 0) {
    deductions.push({
      points: 2,
      reason: 'Start each bullet with an active verb rather than passive phrasing.',
    });
  }

  // Measurable Metrics & Quantified Results (Max: 2 pts)
  // Check for numbers, percentages, currency, multipliers (e.g. 40%, $10M, 50K, 2x)
  const metricRegex = /(\b\d+([.,]\d+)?\b|\b\d+k\b|\b\d+m\b|%|\$|€|£|\b\d+x\b)/i;
  const bulletsWithMetrics = allBullets.filter(b => metricRegex.test(b)).length;

  if (bulletsWithMetrics >= 2) {
    score += 2;
    strengths.push(`Contains quantifiable outcomes (${bulletsWithMetrics} bullets cite metrics, percentages, or scale).`);
  } else if (bulletsWithMetrics === 1) {
    score += 1;
    deductions.push({
      points: 1,
      reason: 'Only 1 bullet includes quantifiable metrics. Quantified results boost recruiter callback rates.',
    });
  } else {
    deductions.push({
      points: 2,
      reason: 'No quantifiable achievements found (e.g. % improved, $ saved, hours automated, users served).',
    });
  }

  return {
    category: 'Work Experience',
    weight: 25,
    score: Math.min(25, Math.max(0, score)),
    strengths,
    deductions,
  };
}

/**
 * Evaluates Skills Relevance & Organization (Max: 15 pts)
 */
export function analyzeSkills(skills = []) {
  let score = 0;
  const deductions = [];
  const strengths = [];
  const validGroups = (skills || []).filter(g => g && g.groupName && (g.skills || []).length > 0);

  if (validGroups.length === 0) {
    deductions.push({
      points: 15,
      reason: 'No skills recorded. Skills sections are scanned first by ATS keyword indexing algorithms.',
    });
    return {
      category: 'Skills',
      weight: 15,
      score: 0,
      strengths: [],
      deductions,
    };
  }

  // Skill categorization (Max: 6 pts)
  if (validGroups.length >= 3) {
    score += 6;
    strengths.push(`Skills organized into ${validGroups.length} clean categories (e.g. Languages, Frameworks, Cloud).`);
  } else if (validGroups.length >= 2) {
    score += 5;
    strengths.push(`Skills organized into ${validGroups.length} categories.`);
  } else {
    score += 4;
    deductions.push({
      points: 2,
      reason: 'Consider grouping skills into distinct categories (e.g. Programming Languages, Tools, Databases).',
    });
  }

  // Total unique skill count (Max: 5 pts)
  const allSkillItems = validGroups.flatMap(g => g.skills || []).map(s => (s || '').trim()).filter(Boolean);
  const uniqueSkills = new Set(allSkillItems.map(s => s.toLowerCase()));

  if (uniqueSkills.size >= 10) {
    score += 5;
    strengths.push(`Broad keyword coverage (${uniqueSkills.size} unique skills indexed).`);
  } else if (uniqueSkills.size >= 6) {
    score += 3.5;
    strengths.push(`Good foundational skills (${uniqueSkills.size} skills recorded).`);
  } else {
    score += 2;
    deductions.push({
      points: 3,
      reason: `Fewer than 6 skills listed (${uniqueSkills.size} skills). Add relevant frameworks, tools, and platforms.`,
    });
  }

  // Check for duplicate skills across or inside groups (Max: 2 pts)
  if (allSkillItems.length === uniqueSkills.size) {
    score += 2;
    strengths.push('Zero duplicate skills found across categories.');
  } else {
    deductions.push({
      points: 2,
      reason: 'Duplicate skills detected across different groups. Keep each skill in its single most relevant group.',
    });
  }

  // Check for skill naming quality (Max: 2 pts)
  const hasVagueSkill = allSkillItems.some(s => s.length <= 1 || /^(etc|various|skills|other)$/i.test(s));
  if (!hasVagueSkill) {
    score += 2;
    strengths.push('All skill entries use standard industry naming conventions.');
  } else {
    deductions.push({
      points: 2,
      reason: 'Avoid generic terms like "etc." or single-letter placeholders in your skills list.',
    });
  }

  return {
    category: 'Skills',
    weight: 15,
    score: Math.min(15, Math.max(0, score)),
    strengths,
    deductions,
  };
}

/**
 * Evaluates Education Section (Max: 10 pts)
 */
export function analyzeEducation(education = []) {
  let score = 0;
  const deductions = [];
  const strengths = [];
  const validEducations = (education || []).filter(e => e && (e.institutionName || e.degree));

  if (validEducations.length === 0) {
    deductions.push({
      points: 10,
      reason: 'No education entries provided. Most ATS systems filter for minimum academic credentials.',
    });
    return {
      category: 'Education',
      weight: 10,
      score: 0,
      strengths: [],
      deductions,
    };
  }

  // Base presence (4 pts)
  score += 4;
  strengths.push(`Documented ${validEducations.length} academic credential(s).`);

  // Degree & Institution completeness (3 pts)
  const allComplete = validEducations.every(e => (e.institutionName || '').trim() && (e.degree || '').trim());
  if (allComplete) {
    score += 3;
    strengths.push('Institution name and degree are clearly stated.');
  } else {
    score += 1.5;
    deductions.push({
      points: 1.5,
      reason: 'One or more education entries is missing either the Institution or Degree name.',
    });
  }

  // Graduation timeline (2 pts)
  const hasYears = validEducations.every(e => (e.endYear || e.startYear));
  if (hasYears) {
    score += 2;
    strengths.push('Graduation timeline/year is specified.');
  } else {
    deductions.push({
      points: 2,
      reason: 'Graduation year is missing; recruiters use this to verify timeline continuity.',
    });
  }

  // Score or Honors (1 pt)
  const hasScore = validEducations.some(e => (e.score || '').trim().length > 0);
  if (hasScore) {
    score += 1;
    strengths.push('Academic performance/CGPA included.');
  } else {
    // Optional point
    score += 1;
  }

  return {
    category: 'Education',
    weight: 10,
    score: Math.min(10, Math.max(0, score)),
    strengths,
    deductions,
  };
}

/**
 * Evaluates Key Projects Section (Max: 10 pts)
 */
export function analyzeProjects(projects = []) {
  let score = 0;
  const deductions = [];
  const strengths = [];
  const validProjects = (projects || []).filter(p => p && (p.projectName || '').trim());

  if (validProjects.length === 0) {
    deductions.push({
      points: 10,
      reason: 'No projects documented. Projects demonstrate applied expertise and hands-on portfolio deliverables.',
    });
    return {
      category: 'Projects',
      weight: 10,
      score: 0,
      strengths: [],
      deductions,
    };
  }

  // Number of projects (Max: 5 pts)
  if (validProjects.length >= 2) {
    score += 5;
    strengths.push(`Highlighted ${validProjects.length} key technical projects.`);
  } else {
    score += 4;
    strengths.push('Documented 1 key technical project.');
  }

  // Tech stack specified (Max: 2.5 pts)
  const hasTech = validProjects.every(p => (p.technologies || '').trim().length > 0);
  if (hasTech) {
    score += 2.5;
    strengths.push('Technologies used are specified for all projects.');
  } else {
    score += 1;
    deductions.push({
      points: 1.5,
      reason: 'One or more projects is missing the specific technology stack used.',
    });
  }

  // Project links / repos (Max: 1.5 pts)
  const hasLinks = validProjects.some(p => (p.projectLink || '').trim().length > 0);
  if (hasLinks) {
    score += 1.5;
    strengths.push('Live project or repository link provided for verification.');
  } else {
    deductions.push({
      points: 1.5,
      reason: 'Add repository or live demo links to provide proof of your project work.',
    });
  }

  // Achievements in projects (Max: 1 pt)
  const hasBullets = validProjects.some(p => (p.achievements || []).some(b => (b || '').trim().length > 0));
  if (hasBullets) {
    score += 1;
    strengths.push('Project scope and deliverables explained with bullet points.');
  } else {
    deductions.push({
      points: 1,
      reason: 'Add achievement bullets to describe the problem solved and the project outcome.',
    });
  }

  return {
    category: 'Projects',
    weight: 10,
    score: Math.min(10, Math.max(0, score)),
    strengths,
    deductions,
  };
}

/**
 * Evaluates Certifications (Max: 5 pts)
 */
export function analyzeCertifications(certifications = []) {
  let score = 0;
  const deductions = [];
  const strengths = [];
  const validCerts = (certifications || []).filter(c => typeof c === 'string' && c.trim().length > 0);

  if (validCerts.length >= 2) {
    score = 5;
    strengths.push(`Earned ${validCerts.length} professional certifications (e.g. AWS, Google Cloud, PMP).`);
  } else if (validCerts.length === 1) {
    score = 3.5;
    strengths.push('Included 1 professional certification.');
  } else {
    score = 0;
    deductions.push({
      points: 5,
      reason: 'No certifications listed. Industry credentials (e.g., AWS, ScrumMaster, PMP) boost candidate authority.',
    });
  }

  return {
    category: 'Certifications',
    weight: 5,
    score: Math.min(5, Math.max(0, score)),
    strengths,
    deductions,
  };
}

/**
 * Evaluates ATS Formatting & Parsing Readiness (Max: 15 pts)
 */
export function analyzeAtsFormatting(resumeData = {}) {
  let score = 15;
  const deductions = [];
  const strengths = [];

  // Single-column structure verification (4 pts)
  strengths.push('Conforms to standard single-column ATS layout (zero columns or sidebars).');

  // Standard recognized heading names (3 pts)
  strengths.push('Standard parser-compliant headings (EXPERIENCE, EDUCATION, SKILLS, PROJECTS).');

  // Zero graphical barriers / tables (3 pts)
  strengths.push('Zero embedded tables, photo icons, or SVG charts that cause parser read errors.');

  // Check for overly long bullets (> 250 characters)
  const allBullets = [
    ...(resumeData.workExperience || resumeData.experience || []).flatMap(e => e.achievements || []),
    ...(resumeData.projects || []).flatMap(p => p.achievements || []),
  ].filter(b => typeof b === 'string' && b.trim().length > 0);

  const longBullets = allBullets.filter(b => b.length > 250);
  if (longBullets.length > 0) {
    score -= 2;
    deductions.push({
      points: 2,
      reason: `${longBullets.length} bullet point(s) exceed 250 characters. Keep bullets concise for fast parsing.`,
    });
  } else {
    strengths.push('All bullet points are within concise, scanner-friendly length bounds.');
  }

  // Check for clean bullet character standards
  strengths.push('Uses standard unicode bullet points without breaking custom glyphs.');

  return {
    category: 'ATS Formatting',
    weight: 15,
    score: Math.min(15, Math.max(0, score)),
    strengths,
    deductions,
  };
}

/**
 * Detailed Bullet-by-Bullet Achievement Quality Inspector
 */
export function inspectAchievementBullets(resumeData = {}) {
  const experiences = resumeData.workExperience || resumeData.experience || [];
  const projects = resumeData.projects || [];
  const results = [];

  experiences.forEach((exp, expIdx) => {
    (exp.achievements || []).forEach((bullet, bIdx) => {
      const text = (bullet || '').trim();
      if (!text) return;

      const words = text.split(/\s+/);
      const firstWord = (words[0] || '').toLowerCase().replace(/[^a-z]/g, '');
      const hasActionVerb = STRONG_ACTION_VERBS.includes(firstWord);
      const metricRegex = /(\b\d+([.,]\d+)?\b|\b\d+k\b|\b\d+m\b|%|\$|€|£|\b\d+x\b)/i;
      const hasMetric = metricRegex.test(text);
      const weakMatch = WEAK_VERB_PATTERNS.find(w => w.pattern.test(text));

      const issues = [];
      let quality = 'strong';

      if (weakMatch) {
        quality = 'needs-improvement';
        issues.push({
          type: 'weak-verb',
          message: `Weak phrase "${weakMatch.label}" detected.`,
          suggestion: `Consider replacing with strong action verbs like ${weakMatch.replacement}.`,
        });
      } else if (!hasActionVerb) {
        quality = quality === 'strong' ? 'acceptable' : quality;
        issues.push({
          type: 'missing-action-verb',
          message: `Does not open with an active verb (starts with "${words[0]}").`,
          suggestion: 'Begin bullet with a high-impact verb (e.g. Developed, Architected, Automated).',
        });
      }

      if (!hasMetric) {
        if (quality === 'strong') quality = 'acceptable';
        issues.push({
          type: 'missing-metric',
          message: 'Lacks measurable results or quantified business impact.',
          suggestion: 'Add numbers, percentages, time saved, or scale (e.g. "by 35%", "serving 15K users").',
        });
      }

      if (text.length > 220) {
        issues.push({
          type: 'too-long',
          message: `Bullet is lengthy (${text.length} chars).`,
          suggestion: 'Split into two focused statements to improve readability.',
        });
      }

      results.push({
        id: `exp-${expIdx}-${bIdx}`,
        source: `${exp.jobTitle || 'Role'} at ${exp.companyName || 'Company'}`,
        text,
        quality: issues.length === 0 ? 'strong' : quality,
        hasActionVerb,
        hasMetric,
        issues,
      });
    });
  });

  projects.forEach((proj, pIdx) => {
    (proj.achievements || []).forEach((bullet, bIdx) => {
      const text = (bullet || '').trim();
      if (!text) return;

      const words = text.split(/\s+/);
      const firstWord = (words[0] || '').toLowerCase().replace(/[^a-z]/g, '');
      const hasActionVerb = STRONG_ACTION_VERBS.includes(firstWord);
      const metricRegex = /(\b\d+([.,]\d+)?\b|\b\d+k\b|\b\d+m\b|%|\$|€|£|\b\d+x\b)/i;
      const hasMetric = metricRegex.test(text);
      const weakMatch = WEAK_VERB_PATTERNS.find(w => w.pattern.test(text));

      const issues = [];
      let quality = 'strong';

      if (weakMatch) {
        quality = 'needs-improvement';
        issues.push({
          type: 'weak-verb',
          message: `Weak phrase "${weakMatch.label}" detected.`,
          suggestion: `Consider replacing with strong action verbs like ${weakMatch.replacement}.`,
        });
      } else if (!hasActionVerb) {
        quality = quality === 'strong' ? 'acceptable' : quality;
        issues.push({
          type: 'missing-action-verb',
          message: `Does not open with an active verb (starts with "${words[0]}").`,
          suggestion: 'Begin bullet with a high-impact verb (e.g. Developed, Architected, Automated).',
        });
      }

      if (!hasMetric) {
        if (quality === 'strong') quality = 'acceptable';
        issues.push({
          type: 'missing-metric',
          message: 'Lacks measurable results or quantified business impact.',
          suggestion: 'Add numbers, percentages, time saved, or scale (e.g. "by 35%", "serving 15K users").',
        });
      }

      if (text.length > 220) {
        issues.push({
          type: 'too-long',
          message: `Bullet is lengthy (${text.length} chars).`,
          suggestion: 'Split into two focused statements to improve readability.',
        });
      }

      results.push({
        id: `proj-${pIdx}-${bIdx}`,
        source: `Project: ${proj.projectName || 'Project'}`,
        text,
        quality: issues.length === 0 ? 'strong' : quality,
        hasActionVerb,
        hasMetric,
        issues,
      });
    });
  });

  return results;
}

/**
 * Keyword Matching & Job Description Target Analyzer
 */
export function analyzeJobDescriptionMatch(resumeData = {}, targetJobTitle = '', jobDescription = '') {
  if (!jobDescription || !jobDescription.trim()) {
    return {
      hasJobTarget: false,
      matchPercentage: 0,
      matchedKeywords: [],
      missingKeywords: [],
      totalKeywordsDetected: 0,
      recommendations: [],
    };
  }

  const cleanJD = jobDescription.toLowerCase();
  const cleanTitle = (targetJobTitle || '').toLowerCase();

  // Aggregate all textual content from resume
  const allResumeText = [
    resumeData.basics?.fullName,
    resumeData.personalInfo?.fullName,
    resumeData.basics?.professionalTitle,
    resumeData.personalInfo?.professionalTitle,
    resumeData.summary,
    resumeData.professionalSummary,
    ...(resumeData.workExperience || resumeData.experience || []).flatMap(e => [
      e.jobTitle,
      e.companyName,
      ...(e.achievements || []),
    ]),
    ...(resumeData.education || []).flatMap(e => [e.degree, e.institutionName]),
    ...(resumeData.skills || []).flatMap(g => [g.groupName, ...(g.skills || [])]),
    ...(resumeData.projects || []).flatMap(p => [
      p.projectName,
      p.technologies,
      ...(p.achievements || []),
    ]),
    ...(resumeData.certifications || []),
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  // Helper to safely match keywords with special chars (e.g. c++, c#, node.js)
  const matchKeyword = (kw, text) => {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const prefix = /^\w/.test(kw) ? '\\b' : '';
    const suffix = /\w$/.test(kw) ? '\\b' : '(?![a-zA-Z0-9])';
    const regex = new RegExp(`${prefix}${escaped}${suffix}`, 'i');
    return regex.test(text);
  };

  // Extract relevant keywords from JD
  const foundInJd = new Set();
  COMMON_TECH_KEYWORDS.forEach(kw => {
    if (matchKeyword(kw, cleanJD) || (cleanTitle && matchKeyword(kw, cleanTitle))) {
      foundInJd.add(kw);
    }
  });

  const jdKeywordsArray = Array.from(foundInJd);
  if (jdKeywordsArray.length === 0) {
    return {
      hasJobTarget: true,
      matchPercentage: 100,
      matchedKeywords: [],
      missingKeywords: [],
      totalKeywordsDetected: 0,
      recommendations: ['Provide a more detailed job description containing specific technical skills, tools, and methodologies.'],
    };
  }

  const matchedKeywords = [];
  const missingKeywords = [];

  jdKeywordsArray.forEach(kw => {
    if (matchKeyword(kw, allResumeText)) {
      matchedKeywords.push(kw);
    } else {
      missingKeywords.push(kw);
    }
  });

  const matchPercentage = Math.round((matchedKeywords.length / jdKeywordsArray.length) * 100);

  const recommendations = [];
  if (missingKeywords.length > 0) {
    recommendations.push(
      `Job description mentions keywords missing from your resume: ${missingKeywords.slice(0, 5).join(', ')}.`
    );
    recommendations.push(
      'Only add skills you genuinely possess. Substantiate them with bullet point evidence in your experience or projects.'
    );
  } else {
    recommendations.push('Excellent keyword alignment! Your resume covers the primary technical requirements found in the posting.');
  }

  return {
    hasJobTarget: true,
    targetJobTitle: targetJobTitle.trim(),
    matchPercentage,
    matchedKeywords,
    missingKeywords,
    totalKeywordsDetected: jdKeywordsArray.length,
    recommendations,
  };
}

/**
 * Generates Actionable, Contextual Content Suggestions
 */
export function generateContentSuggestions(categories = [], bulletAudit = [], jobMatch = {}) {
  const suggestions = [];

  // Summary suggestions
  const summaryCat = categories.find(c => c.category === 'Professional Summary');
  if (summaryCat && summaryCat.score < 8) {
    suggestions.push({
      id: 'sugg-summary',
      category: 'Professional Summary',
      issue: 'Professional summary is either too short, missing, or lacks impact keywords.',
      whyItMatters: 'Recruiters scan the summary in the first 6 seconds to determine career level and specialization.',
      recommendation: 'Write a 2-3 sentence overview starting with your title, years of experience, core tech stack, and proudest achievement.',
      example: 'Full Stack Engineer with 4+ years of experience architecting scalable React and Node.js microservices. Proven track record optimizing performance by 40% and deploying distributed cloud applications.',
    });
  }

  // Work Experience suggestions
  const expCat = categories.find(c => c.category === 'Work Experience');
  if (expCat && expCat.score < 20) {
    suggestions.push({
      id: 'sugg-metrics',
      category: 'Work Experience',
      issue: 'Work experience lacks quantifiable metrics (%, $, scale, hours saved).',
      whyItMatters: 'ATS score ranking prioritizes resumes that demonstrate tangible business impact over plain task lists.',
      recommendation: 'Use the XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".',
      example: 'Decreased API response latency by 35% by implementing Redis caching across 12 high-traffic microservices.',
    });
  }

  // Weak bullets suggestions
  const weakBullets = bulletAudit.filter(b => b.quality === 'needs-improvement');
  if (weakBullets.length > 0) {
    suggestions.push({
      id: 'sugg-weak-verbs',
      category: 'Bullet Points',
      issue: `${weakBullets.length} bullet point(s) use passive phrases like "worked on" or "responsible for".`,
      whyItMatters: 'Passive phrases make candidates appear as order-takers rather than proactive engineers.',
      recommendation: 'Replace passive phrases with ownership verbs such as Spearheaded, Architected, Automated, or Overhauled.',
      example: 'Original: "Responsible for managing AWS servers." -> Suggestion: "Orchestrated AWS multi-region infrastructure using Terraform and automated zero-downtime CI/CD pipelines."',
    });
  }

  // Skills suggestions
  const skillsCat = categories.find(c => c.category === 'Skills');
  if (skillsCat && skillsCat.score < 12) {
    suggestions.push({
      id: 'sugg-skills',
      category: 'Skills Organization',
      issue: 'Skills are either under-populated or listed in a single unorganized bucket.',
      whyItMatters: 'Recruiters and ATS filters look for structured buckets like Programming Languages, Frameworks, and Cloud & DevOps.',
      recommendation: 'Organize your skills into 3-4 clear categories with at least 8-12 relevant technologies.',
      example: 'Categories: "Languages: Python, TypeScript" • "Frameworks: React, FastAPI" • "Cloud & DevOps: Docker, AWS, GitHub Actions"',
    });
  }

  // Missing Keywords from JD
  if (jobMatch.hasJobTarget && jobMatch.missingKeywords?.length > 0) {
    suggestions.push({
      id: 'sugg-jd-keywords',
      category: 'Job Match',
      issue: `Target job posting calls for: ${jobMatch.missingKeywords.slice(0, 4).join(', ')}.`,
      whyItMatters: 'Missing prerequisite keywords can cause your resume to be filtered out during initial ATS screening.',
      recommendation: 'If you have experience with these tools, add them to your skills and reference them in relevant project or role bullets.',
      example: `If experienced with ${jobMatch.missingKeywords[0]}, mention how you applied it in your most recent role.`,
    });
  }

  return suggestions;
}

/**
 * Main ATS Resume Evaluation Orchestrator
 * Calculates the transparent score out of 100 with the exact specified category weights.
 */
export function evaluateResumeATS(resumeData = {}, targetJobTitle = '', jobDescription = '') {
  const basics = resumeData.basics || resumeData.personalInfo || {};
  const summary = resumeData.summary || resumeData.professionalSummary || '';
  const experience = resumeData.workExperience || resumeData.experience || [];
  const education = resumeData.education || [];
  const skills = resumeData.skills || [];
  const projects = resumeData.projects || [];
  const certifications = resumeData.certifications || [];

  // 1. Evaluate all 8 categories
  const contactResult = analyzeContactInfo(basics);
  const summaryResult = analyzeProfessionalSummary(summary);
  const experienceResult = analyzeWorkExperience(experience);
  const skillsResult = analyzeSkills(skills);
  const educationResult = analyzeEducation(education);
  const projectsResult = analyzeProjects(projects);
  const certsResult = analyzeCertifications(certifications);
  const formattingResult = analyzeAtsFormatting(resumeData);

  const categories = [
    contactResult,
    summaryResult,
    experienceResult,
    skillsResult,
    educationResult,
    projectsResult,
    certsResult,
    formattingResult,
  ].map(c => ({ ...c, maxScore: c.weight }));

  // 2. Sum up total score (strictly out of 100)
  const totalScore = Math.round(
    categories.reduce((acc, cat) => acc + cat.score, 0)
  );

  // 3. Determine Rating Tier & Headline
  let ratingTier = 'Critical Gaps';
  let badgeColor = '#EF4444'; // red
  let summaryHeadline = 'Your resume needs significant structural updates to reliably pass ATS screening.';

  if (totalScore >= 85) {
    ratingTier = 'Excellent';
    badgeColor = '#10B981'; // emerald
    summaryHeadline = 'Your resume meets high ATS standards with strong content density and clear formatting.';
  } else if (totalScore >= 70) {
    ratingTier = 'Good';
    badgeColor = '#6335F5'; // primary purple
    summaryHeadline = 'Strong overall profile. Addressing a few missing details will further improve your ATS score.';
  } else if (totalScore >= 50) {
    ratingTier = 'Needs Improvement';
    badgeColor = '#F59E0B'; // amber
    summaryHeadline = 'Several key sections or metrics are missing or could be strengthened.';
  }

  // 4. Inspect bullet points
  const bulletAudit = inspectAchievementBullets(resumeData);

  // 5. Job description keyword match analysis
  const jobMatch = analyzeJobDescriptionMatch(resumeData, targetJobTitle, jobDescription);

  // 6. Actionable recommendations
  const suggestions = generateContentSuggestions(categories, bulletAudit, jobMatch);

  // 7. Aggregate key strengths and priority fixes
  const allStrengths = categories.flatMap(c => c.strengths);
  const allDeductions = categories.flatMap(c => c.deductions.map(d => ({ ...d, category: c.category })));

  return {
    totalScore,
    ratingTier,
    badgeColor,
    summaryHeadline,
    categories,
    allStrengths,
    allDeductions,
    bulletAudit,
    jobMatch,
    suggestions,
    analyzedAt: new Date().toISOString(),
    disclaimer: 'This score is an automated estimate based on standard ATS parser heuristics (single-column format, standard headings, keyword density, quantifiable metrics). It does not guarantee interview callbacks from third-party employers.',
  };
}
