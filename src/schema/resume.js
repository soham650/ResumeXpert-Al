// Resume data schema / structure definition
// This file defines the shape of resume data used throughout the app.

export const resumeSchema = {
  personalInfo: {
    fullName: '',
    professionalTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    additionalLinks: [],
  },
  professionalSummary: '',
  workExperience: [
    {
      id: 1,
      companyName: '',
      jobTitle: '',
      location: '',
      startDate: '',
      endDate: '',
      achievements: [''],
    },
  ],
  education: [
    {
      id: 1,
      institutionName: '',
      degree: '',
      startYear: '',
      endYear: '',
      score: '',
    },
  ],
  skills: [
    {
      id: 1,
      groupName: '',
      skills: [],
    },
  ],
  projects: [
    {
      id: 1,
      projectName: '',
      technologies: '',
      projectLink: '',
      achievements: [''],
    },
  ],
  certifications: [],
};

export default resumeSchema;
