import { z } from 'zod';

/**
 * Zod Schemas for Phase 13: ResumeXpert AI Advanced Career Intelligence Platform
 * Covering the Complete 6-Step Career Journey and all 8 AI Capabilities.
 */

// --- Step 1: Resume Understanding & Verified Career Profile ---
export const careerProfileSchema = z.object({
  fullName: z.string().min(1),
  currentTitle: z.string().default('Software Professional'),
  seniorityLevel: z.enum(['entry', 'mid', 'senior', 'lead', 'executive']).default('mid'),
  summary: z.string().default(''),
  topSkills: z.array(z.string()).default([]),
  domainExpertise: z.array(z.string()).default([]),
  totalYearsExperience: z.number().min(0).default(0),
  keyAchievements: z.array(z.string()).default([]),
  verifiedByUser: z.boolean().default(false),
});

// --- Step 2: Target Job Selection & Compatibility Audit ---
export const targetJobAuditSchema = z.object({
  targetRole: z.string().min(1),
  companyName: z.string().optional().default(''),
  compatibilityScore: z.number().min(0).max(100),
  executiveSummary: z.string(),
  mandatoryMatched: z.array(z.string()).default([]),
  mandatoryMissing: z.array(z.string()).default([]),
  preferredMatched: z.array(z.string()).default([]),
  preferredMissing: z.array(z.string()).default([]),
  experienceAlignment: z.string(),
  qualificationGaps: z.array(z.string()).default([]),
  immediateRecommendations: z.array(z.string()).default([]),
});

// --- Step 3: Application Preparation & Tailored Clones ---
export const coverLetterSchema = z.object({
  recipientName: z.string().default('Hiring Team'),
  companyName: z.string().default('Target Company'),
  roleTitle: z.string(),
  content: z.string().min(50),
  tone: z.enum(['formal', 'professional', 'friendly']).default('professional'),
  keyHooks: z.array(z.string()).default([]),
});

export const recruiterEmailSchema = z.object({
  subject: z.string(),
  body: z.string(),
  purpose: z.enum(['cold_outreach', 'referral_request', 'follow_up', 'thank_you', 'negotiation']),
});

// Feature 5: Truth & Evidence Checker
export const truthClaimSchema = z.object({
  claimText: z.string(),
  section: z.string(),
  classification: z.enum(['supported', 'partially_supported', 'no_evidence_found', 'needs_verification']),
  rationale: z.string(),
  remediationAdvice: z.string(),
  suggestedWording: z.string().optional(),
  userVerified: z.boolean().default(false),
});

export const truthCheckAuditSchema = z.object({
  overallCredibilityScore: z.number().min(0).max(100),
  findings: z.array(truthClaimSchema),
  unsubstantiatedMetricsCount: z.number().min(0),
  verifiedClaimsCount: z.number().min(0),
  summary: z.string(),
});

// --- Step 4: Multi-Modal Mock Interview Simulator ---
export const interviewTurnSchema = z.object({
  id: z.string(),
  questionNumber: z.number(),
  category: z.enum(['hr', 'technical', 'project', 'behavioral_star', 'scenario', 'mixed']),
  question: z.string(),
  whyAsked: z.string(),
  suggestedAnswerStructure: z.string(),
  userAnswer: z.string().default(''),
  spokenByUser: z.boolean().default(false),
  instantFeedback: z.object({
    relevanceScore: z.number().min(0).max(10).optional(),
    strengths: z.array(z.string()).optional(),
    improvementTips: z.array(z.string()).optional(),
  }).optional(),
});

export const interviewEvaluationSchema = z.object({
  overallScore: z.number().min(0).max(100),
  relevanceRating: z.number().min(1).max(10),
  technicalAccuracy: z.number().min(1).max(10),
  communicationClarity: z.number().min(1).max(10),
  problemSolvingStructure: z.number().min(1).max(10),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  categoryBreakdown: z.record(z.string(), z.number()),
  practiceQuestionsForNextRound: z.array(z.string()),
  recommendedLearningTopics: z.array(z.string()),
  summaryReport: z.string(),
});

// --- Step 5: Skill Improvement & Learning Roadmap ---
export const roadmapMilestoneSchema = z.object({
  week: z.number().min(1),
  focusArea: z.string(),
  objective: z.string(),
  tasks: z.array(
    z.object({
      id: z.string(),
      description: z.string(),
      completed: z.boolean().default(false),
      resourceLink: z.string().optional(),
    })
  ),
  suggestedProject: z.string().optional(),
});

export const careerRoadmapSchema = z.object({
  targetRole: z.string(),
  planDuration: z.enum(['30-day', '60-day', '90-day']).default('60-day'),
  weeklyCommitmentHours: z.number().default(10),
  currentSkillAssessment: z.string(),
  skillGapsIdentified: z.array(z.string()),
  milestones: z.array(roadmapMilestoneSchema),
  completionPercentage: z.number().min(0).max(100).default(0),
});

// Feature 6: Portfolio & Project Builder
export const portfolioProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  problemStatement: z.string().default(''),
  technologies: z.array(z.string()).default([]),
  responsibilities: z.string().default(''),
  challengesAndSolutions: z.string().default(''),
  quantifiableResults: z.string().default(''),
  githubUrl: z.string().url().or(z.literal('')).default(''),
  demoUrl: z.string().url().or(z.literal('')).default(''),
  readmeMarkdown: z.string().default(''),
  interviewTalkingPoints: z.array(z.string()).default([]),
});

// --- Step 6: Application Pipeline & Progress Tracking ---
export const jobApplicationSchema = z.object({
  id: z.string(),
  company: z.string().min(1),
  role: z.string().min(1),
  location: z.string().default('Remote'),
  applicationUrl: z.string().default(''),
  status: z.enum([
    'interested',
    'applied',
    'assessment',
    'shortlisted',
    'interview',
    'offer',
    'rejected',
    'withdrawn',
  ]).default('interested'),
  appliedDate: z.string().default(''),
  followUpDate: z.string().default(''),
  compatibilityScore: z.number().min(0).max(100).default(0),
  notes: z.string().default(''),
});

export const pipelineAnalyticsSchema = z.object({
  totalApplications: z.number().min(0),
  inProgress: z.number().min(0),
  interviewsScheduled: z.number().min(0),
  offersReceived: z.number().min(0),
  rejectionCount: z.number().min(0),
  conversionRate: z.number().min(0).max(100),
  nextRecommendedAction: z.string(),
});

// --- Master Career Journey State Machine ---
export const careerJourneyStateSchema = z.object({
  id: z.string(),
  targetRole: z.string().default(''),
  companyName: z.string().default(''),
  jobDescription: z.string().default(''),
  currentStep: z.number().min(1).max(6).default(1),
  completedSteps: z.array(z.number()).default([]),
  overallProgress: z.number().min(0).max(100).default(0),
  careerProfile: careerProfileSchema.nullable().optional(),
  compatibilityAudit: targetJobAuditSchema.nullable().optional(),
  activeCoverLetter: coverLetterSchema.nullable().optional(),
  activeRoadmap: careerRoadmapSchema.nullable().optional(),
  lastUpdated: z.string().optional(),
});

