import { z } from 'zod';

// URL validator supporting protocol prefix (http/https) or direct domain format (e.g. linkedin.com/in/...)
const optionalUrlSchema = z.string().trim().refine((val) => {
  if (!val || val.length === 0) return true;
  // Regex allowing https?:// or standard host with valid TLD and path
  const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
  return urlRegex.test(val);
}, {
  message: 'Please enter a valid website or profile URL (e.g. linkedin.com/in/username)',
});

// Phone validator allowing clean international/local numbers
const optionalPhoneSchema = z.string().trim().refine((val) => {
  if (!val || val.length === 0) return true;
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{6,15}$/;
  return phoneRegex.test(val);
}, {
  message: 'Please enter a valid phone number (e.g. +91 98765 43210)',
});

// -------------------------------------------------------------
// Step 1: Personal Information Schema
// -------------------------------------------------------------
export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(100, 'Full name is too long'),
  professionalTitle: z.string().trim().max(100, 'Title is too long').optional().default(''),
  email: z.string().trim().min(1, 'Email is required').email('Please enter a valid email address'),
  phone: optionalPhoneSchema.optional().default(''),
  location: z.string().trim().max(100, 'Location is too long').optional().default(''),
  linkedinUrl: optionalUrlSchema.optional().default(''),
  githubUrl: optionalUrlSchema.optional().default(''),
  portfolioUrl: optionalUrlSchema.optional().default(''),
  additionalLinks: z.array(
    z.object({
      label: z.string().trim().default(''),
      url: optionalUrlSchema.default(''),
    })
  ).optional().default([]),
});

// -------------------------------------------------------------
// Step 2: Professional Summary Schema
// -------------------------------------------------------------
export const professionalSummarySchema = z.object({
  professionalSummary: z
    .string()
    .max(450, 'Professional summary cannot exceed 450 characters')
    .optional()
    .default(''),
});

// -------------------------------------------------------------
// Step 3: Work Experience Schema
// -------------------------------------------------------------
export const workExperienceItemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  companyName: z.string().trim().min(1, 'Company name is required'),
  jobTitle: z.string().trim().min(1, 'Job title is required'),
  location: z.string().trim().optional().default(''),
  startDate: z.string().trim().min(1, 'Start date is required'),
  endDate: z.string().trim().min(1, 'End date or Present is required'),
  achievements: z.array(z.string()).optional().default(['']),
}).refine((data) => {
  // If both start and end dates are 4-digit years, ensure end >= start
  const startYear = parseInt(data.startDate, 10);
  const endYear = parseInt(data.endDate, 10);
  if (!isNaN(startYear) && !isNaN(endYear) && data.endDate.toLowerCase() !== 'present') {
    return endYear >= startYear;
  }
  return true;
}, {
  message: 'End date cannot be earlier than start date',
  path: ['endDate'],
});

export const workExperienceSchema = z.object({
  workExperience: z.array(workExperienceItemSchema).min(1, 'At least one work experience entry is required'),
});

// -------------------------------------------------------------
// Step 4: Education Schema
// -------------------------------------------------------------
export const educationItemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  institutionName: z.string().trim().min(1, 'Institution / University name is required'),
  degree: z.string().trim().min(1, 'Degree is required'),
  startYear: z.string().trim().optional().default(''),
  endYear: z.string().trim().optional().default(''),
  score: z.string().trim().optional().default(''),
}).refine((data) => {
  const start = parseInt(data.startYear, 10);
  const end = parseInt(data.endYear, 10);
  if (!isNaN(start) && !isNaN(end) && start > 0 && end > 0) {
    return end >= start;
  }
  return true;
}, {
  message: 'End year cannot be earlier than start year',
  path: ['endYear'],
});

export const educationSchema = z.object({
  education: z.array(educationItemSchema).min(1, 'At least one education entry is required'),
});

// -------------------------------------------------------------
// Step 5: Skills Schema
// -------------------------------------------------------------
export const skillGroupItemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  groupName: z.string().trim().min(1, 'Skill group name is required'),
  skills: z
    .array(z.string().trim())
    .refine((items) => items.every((s) => s.length > 0), {
      message: 'Skill entries cannot be empty',
    })
    .refine((items) => new Set(items.map((s) => s.toLowerCase())).size === items.length, {
      message: 'Duplicate skills found in this group',
    }),
});

export const skillsSchema = z.object({
  skills: z.array(skillGroupItemSchema).min(1, 'At least one skill group is required'),
});

// -------------------------------------------------------------
// Step 6: Projects Schema
// -------------------------------------------------------------
export const projectItemSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  projectName: z.string().trim().min(1, 'Project name is required'),
  technologies: z.string().trim().optional().default(''),
  projectLink: optionalUrlSchema.optional().default(''),
  achievements: z.array(z.string()).optional().default(['']),
});

export const projectsSchema = z.object({
  projects: z.array(projectItemSchema).min(1, 'At least one project is required'),
});

// -------------------------------------------------------------
// Step 7: Certifications Schema
// -------------------------------------------------------------
export const certificationsSchema = z.object({
  certifications: z.array(
    z.string().trim().min(1, 'Certification name cannot be empty')
  ).optional().default([]),
});

// -------------------------------------------------------------
// Full Resume Complete Schema
// -------------------------------------------------------------
export const fullResumeSchema = z.object({
  personalInfo: personalInfoSchema,
  professionalSummary: z.string().max(450).optional().default(''),
  workExperience: z.array(workExperienceItemSchema).optional().default([]),
  education: z.array(educationItemSchema).optional().default([]),
  skills: z.array(skillGroupItemSchema).optional().default([]),
  projects: z.array(projectItemSchema).optional().default([]),
  certifications: z.array(z.string()).optional().default([]),
  meta: z.object({
    template: z.string().optional().default('classic'),
    accentColor: z.string().optional().default('#111827'),
    lastSaved: z.string().optional(),
    version: z.number().optional().default(1),
  }).optional(),
});

// Helper to validate a specific step's data synchronously
export const validateStepData = (stepNumber, resumeData) => {
  try {
    switch (stepNumber) {
      case 1:
        personalInfoSchema.parse(resumeData?.personalInfo || resumeData?.basics || {});
        return true;
      case 2:
        professionalSummarySchema.parse({
          professionalSummary: resumeData?.professionalSummary || resumeData?.summary || '',
        });
        return true;
      case 3:
        workExperienceSchema.parse({
          workExperience: resumeData?.workExperience || resumeData?.experience || [],
        });
        return true;
      case 4:
        educationSchema.parse({
          education: resumeData?.education || [],
        });
        return true;
      case 5:
        skillsSchema.parse({
          skills: resumeData?.skills || [],
        });
        return true;
      case 6:
        projectsSchema.parse({
          projects: resumeData?.projects || [],
        });
        return true;
      case 7:
        certificationsSchema.parse({
          certifications: resumeData?.certifications || [],
        });
        return true;
      default:
        return true;
    }
  } catch (err) {
    return false;
  }
};
