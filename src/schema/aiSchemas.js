import { z } from 'zod';

/**
 * Zod Schemas for Google Gemini AI Career Intelligence Platform
 */

// 1. Job Description Matcher Schema
export const jobMatchSchema = z.object({
  matchScore: z.number().min(0).max(100),
  summary: z.string(),
  matchedKeywords: z.array(z.string()),
  missingKeywords: z.array(z.string()),
  relevantTechnicalSkills: z.array(z.string()),
  missingSkills: z.array(z.string()),
  experienceAlignment: z.string(),
  projectRelevance: z.string(),
  qualificationGaps: z.array(z.string()),
  recommendations: z.array(z.string()),
});

// 2. ATS Resume Optimizer Schema
export const atsOptimizerSchema = z.object({
  estimatedScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  formattingRisks: z.array(z.string()),
  readability: z.string(),
  missingInformation: z.array(z.string()),
  priorityActionPlan: z.array(
    z.object({
      priority: z.enum(['high', 'medium', 'low']),
      section: z.string(),
      action: z.string(),
      rationale: z.string(),
    })
  ),
});

// 3. Professional Bullet Generator Schema
export const bulletGeneratorSchema = z.object({
  originalBullet: z.string(),
  improvedBullets: z.array(
    z.object({
      text: z.string(),
      style: z.enum(['impact', 'concise', 'technical', 'metric-focused']),
      actionVerb: z.string(),
      explanation: z.string(),
    })
  ).min(1),
  missingMetricsInquiry: z.string().nullable().optional(),
});

// 4. Professional Summary Generator Schema
export const summaryGeneratorSchema = z.object({
  short: z.string().max(250),
  standard: z.string().max(420),
  detailed: z.string().max(450),
  highlightedSkills: z.array(z.string()),
});

// 5. Skill Gap Analyzer Schema
export const skillGapSchema = z.object({
  demonstratedSkills: z.array(z.string()),
  claimedUnprovenSkills: z.array(z.string()),
  missingRequiredSkills: z.array(z.string()),
  transferableSkills: z.array(z.string()),
  learningRecommendations: z.array(
    z.object({
      topic: z.string(),
      urgency: z.enum(['high', 'medium', 'low']),
      rationale: z.string(),
    })
  ),
});

// 6. HR Recruiter Review Schema
export const hrReviewSchema = z.object({
  firstImpression: z.string(),
  roleRelevance: z.string(),
  clarityScore: z.number().min(1).max(10),
  strongPoints: z.array(z.string()),
  redFlags: z.array(z.string()),
  presentationQuality: z.string(),
  suggestedCorrections: z.array(
    z.object({
      area: z.string(),
      feedback: z.string(),
      suggestion: z.string(),
    })
  ),
  priorityImprovements: z.array(z.string()),
});

// 7. Grammar & Professional English Schema
export const grammarProofreadSchema = z.object({
  overallTone: z.string(),
  correctionsCount: z.number().min(0),
  corrections: z.array(
    z.object({
      originalText: z.string(),
      suggestedText: z.string(),
      type: z.enum(['grammar', 'spelling', 'tone', 'wordiness', 'repetition']),
      explanation: z.string(),
    })
  ),
  polishedSummary: z.string().nullable().optional(),
});

// 8. Job-Specific Resume Tailoring Schema
export const resumeTailorSchema = z.object({
  tailoredTitle: z.string(),
  targetRole: z.string(),
  tailoredSummary: z.string().max(450),
  tailoredExperience: z.array(
    z.object({
      id: z.union([z.number(), z.string()]),
      companyName: z.string(),
      jobTitle: z.string(),
      suggestedAchievements: z.array(z.string()),
    })
  ),
  suggestedSkillsOrder: z.array(
    z.object({
      groupName: z.string(),
      skills: z.array(z.string()),
    })
  ),
  highlightedProjects: z.array(z.string()),
  explanationOfChanges: z.string(),
});

// 9. Interview Preparation Schema
export const interviewPrepSchema = z.object({
  targetJobTitle: z.string(),
  difficulty: z.enum(['entry', 'mid', 'senior', 'executive']),
  questions: z.array(
    z.object({
      id: z.string(),
      category: z.enum(['hr', 'technical', 'project', 'behavioral', 'scenario']),
      question: z.string(),
      whyAsked: z.string(),
      suggestedAnswerStructure: z.string(),
      keyConceptsToCover: z.array(z.string()),
      followUpQuestions: z.array(z.string()),
    })
  ).min(1),
  coreConceptsToRevise: z.array(z.string()),
});

// 10. Before / After Section Comparison Schema
export const beforeAfterComparisonSchema = z.object({
  section: z.string(),
  originalContent: z.string(),
  suggestedContent: z.string(),
  explanationOfChange: z.string(),
  expectedImprovement: z.string(),
});

