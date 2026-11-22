// Sample resume data matching ResumeCraft design specification
export const sampleResumeData = {
  personalInfo: {
    fullName: 'John Doe',
    professionalTitle: 'Full Stack Developer',
    email: 'john@example.com',
    phone: '+91 98765 43210',
    location: 'Nagpur, India',
    linkedinUrl: 'https://linkedin.com/in/johndoe',
    githubUrl: 'https://github.com/johndoe',
    portfolioUrl: 'https://johndoe.dev',
    additionalLinks: [],
  },
  professionalSummary:
    'Passionate Full Stack Developer with expertise in React, Node.js and modern web technologies.',
  workExperience: [
    {
      id: 1,
      companyName: 'Tech Corp',
      jobTitle: 'Senior Developer',
      location: 'Nagpur, India',
      startDate: 'Jan 2024',
      endDate: 'Present',
      achievements: [
        'Built scalable web applications',
        'Improved performance by 40%',
      ],
    },
  ],
  education: [
    {
      id: 1,
      institutionName: 'Your College',
      degree: 'B.E. Computer Science',
      startYear: '2022',
      endYear: '2026',
      score: '8.2 CGPA',
    },
  ],
  skills: [
    {
      id: 1,
      groupName: 'Languages',
      skills: ['JavaScript', 'Python', 'TypeScript'],
    },
    {
      id: 2,
      groupName: 'Frameworks & Libraries',
      skills: ['React', 'Node.js', 'Express', 'Tailwind CSS'],
    },
    {
      id: 3,
      groupName: 'Tools & Databases',
      skills: ['Git', 'Docker', 'PostgreSQL', 'Supabase'],
    },
  ],
  projects: [
    {
      id: 1,
      projectName: 'Inventory SaaS',
      technologies: 'React, Supabase',
      projectLink: 'https://github.com/yourname',
      achievements: [
        'Built multi-tenant POS',
        'Served 10K+ users',
      ],
    },
  ],
  certifications: [
    'AWS Cloud Practitioner',
  ],
};

export const recentResumes = [
  {
    id: 1,
    name: 'Full Stack Developer Resume',
    lastEdited: 'Just now',
    completion: 85,
    template: 'Classic',
  },
  {
    id: 2,
    name: 'Product Manager Resume',
    lastEdited: 'Yesterday',
    completion: 100,
    template: 'Modern',
  },
  {
    id: 3,
    name: 'Data Analyst Resume',
    lastEdited: '3 days ago',
    completion: 60,
    template: 'Minimal',
  },
];

export const stepsList = [
  { number: 1, title: 'Personal Info', description: 'Contact details & links' },
  { number: 2, title: 'Summary', description: 'Professional summary' },
  { number: 3, title: 'Experience', description: 'Work history' },
  { number: 4, title: 'Education', description: 'Academic background' },
  { number: 5, title: 'Skills', description: 'Technical & soft skills' },
  { number: 6, title: 'Projects', description: 'Key projects' },
  { number: 7, title: 'Certifications', description: 'Certifications & review' },
];
