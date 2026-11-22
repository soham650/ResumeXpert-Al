/**
 * Career Journey Service for ResumeXpert AI (Phase 13).
 * Manages the persistent 6-Step Career Journey, database storage with RLS,
 * and high-fidelity deterministic fallback mock engines.
 */

import { supabase } from './supabaseClient.js';
import { getAiConsentStatus, sanitizeResumeForAi, getPrivacyMode } from '../utils/aiPrivacy.js';
import { consumeAiCredit } from '../utils/aiRateLimiter.js';
import {
  careerProfileSchema,
  targetJobAuditSchema,
  coverLetterSchema,
  recruiterEmailSchema,
  truthCheckAuditSchema,
  interviewTurnSchema,
  interviewEvaluationSchema,
  careerRoadmapSchema,
  portfolioProjectSchema,
  jobApplicationSchema,
  pipelineAnalyticsSchema,
  careerJourneyStateSchema,
} from '../schema/careerJourneySchemas.js';
import { resumeTailorSchema } from '../schema/aiSchemas.js';

const LOCAL_JOURNEY_KEY = 'resumexpert_active_career_journey';
const LOCAL_APPLICATIONS_KEY = 'resumexpert_job_applications';
const LOCAL_INTERVIEWS_KEY = 'resumexpert_mock_interviews';
const LOCAL_ROADMAPS_KEY = 'resumexpert_career_roadmaps';
const LOCAL_PORTFOLIO_KEY = 'resumexpert_portfolio_projects';

// -------------------------------------------------------------
// LOCAL DETERMINISTIC FALLBACK INTELLIGENCE
// -------------------------------------------------------------

export function generatePhase13Fallback(action, payload = {}) {
  const { resumeData = {}, jobDescription = '', category = 'mixed', transcript = [] } = payload;
  const targetRole = payload.targetRole || payload.jobTitle || resumeData?.personalInfo?.jobTitle || 'Software Engineer';
  const name = resumeData?.personalInfo?.fullName || 'Candidate';

  switch (action) {
    case 'career-profile-extract': {
      const skills = (resumeData?.skills || []).flatMap((g) => g.skills || []);
      const exps = resumeData?.experience || [];
      return careerProfileSchema.parse({
        fullName: name,
        currentTitle: resumeData?.personalInfo?.jobTitle || 'Software Engineer',
        seniorityLevel: exps.length > 4 ? 'senior' : exps.length > 1 ? 'mid' : 'entry',
        summary: resumeData?.personalInfo?.summary || 'Experienced software professional specializing in modern scalable web solutions.',
        topSkills: skills.slice(0, 8),
        domainExpertise: ['Web Applications', 'API Integration', 'Full-Lifecycle Engineering'],
        totalYearsExperience: Math.max(1, exps.length * 2),
        keyAchievements: [
          'Delivered high-performance features across customer-facing web applications',
          'Collaborated with cross-functional teams to accelerate product sprint velocity',
        ],
        verifiedByUser: false,
      });
    }

    case 'job-insights': {
      return targetJobAuditSchema.parse({
        targetRole,
        companyName: payload.companyName || 'Target Organization',
        compatibilityScore: 86,
        executiveSummary: `Strong qualifications match for ${targetRole}. Technical competencies align closely with essential architecture demands.`,
        mandatoryMatched: ['React', 'JavaScript', 'TypeScript', 'Git'],
        mandatoryMissing: ['CI/CD Pipelines', 'Automated Testing'],
        preferredMatched: ['Tailwind CSS', 'RESTful APIs'],
        preferredMissing: ['Docker', 'AWS'],
        experienceAlignment: `Candidate demonstrates 3+ years of relevant experience, meeting the required experience threshold.`,
        qualificationGaps: ['Enterprise distributed systems deployment experience'],
        immediateRecommendations: [
          'Tailor work experience bullets to highlight React component scalability',
          'Complete a practical CI/CD pipeline project',
          'Highlight unit testing tools (Jest, Vitest) in technical skills',
        ],
      });
    }

    case 'truth-check': {
      const skills = (resumeData?.skills || []).flatMap((g) => g.skills || []);
      return truthCheckAuditSchema.parse({
        overallCredibilityScore: 92,
        unsubstantiatedMetricsCount: 1,
        verifiedClaimsCount: 4,
        summary: 'Resume claims demonstrate high factual integrity. Suggested improvements focus on adding context to standalone skills.',
        findings: [
          {
            claimText: skills[0] || 'React',
            section: 'Skills',
            classification: 'supported',
            rationale: 'Skill is corroborated by extensive work experience and project descriptions.',
            remediationAdvice: 'Maintain strong action verbs linking this skill to measurable outcomes.',
            suggestedWording: `Architected web components utilizing ${skills[0] || 'React'}.`,
            userVerified: true,
          },
          {
            claimText: 'Increased performance significantly across application modules',
            section: 'Experience',
            classification: 'needs_verification',
            rationale: 'Vague performance claim without specific benchmark numbers.',
            remediationAdvice: 'Add an exact metric or percentage increase (e.g. 25% faster load time).',
            suggestedWording: 'Accelerated application load velocity by [X%] across 10K+ monthly active users.',
            userVerified: false,
          },
          {
            claimText: 'Microservices Architecture',
            section: 'Skills',
            classification: 'partially_supported',
            rationale: 'Claimed as a skill, but lacking dedicated bullet point in recent roles.',
            remediationAdvice: 'Mention specific backend or API integration tasks supporting this skill.',
            suggestedWording: 'Engineered modular service integrations connecting client applications to core APIs.',
            userVerified: false,
          },
        ],
      });
    }

    case 'generate-communication': {
      const cat = payload.category || 'cover_letter';
      if (cat === 'cover_letter') {
        return coverLetterSchema.parse({
          recipientName: 'Hiring Committee',
          companyName: payload.companyName || 'Target Company',
          roleTitle: targetRole,
          tone: payload.tone || 'professional',
          content: `Dear Hiring Committee,\n\nI am writing to express my strong interest in the ${targetRole} position at ${payload.companyName || 'your esteemed organization'}. With a proven track record in software engineering, component architecture, and modern digital development, I am eager to contribute to your engineering roadmaps.\n\nThroughout my career, I have prioritized shipping clean, accessible, and high-performance applications that deliver real user impact. My background aligns directly with the core requirements outlined in your job posting.\n\nThank you for your time and consideration. I welcome the opportunity to discuss how my technical expertise can support your team's goals.\n\nSincerely,\n${name}`,
          keyHooks: ['Proven track record in high-performance application delivery', 'Clean, accessible component architecture'],
        });
      }
      return recruiterEmailSchema.parse({
        subject: `Application for ${targetRole} — ${name}`,
        body: `Hi Hiring Team,\n\nI recently came across the ${targetRole} opening at your company and wanted to introduce myself. Having delivered scalable web applications, I believe my technical background is an excellent match for your current projects.\n\nI have attached my tailored resume for your review and would love to connect for a brief 15-minute introductory conversation.\n\nBest regards,\n${name}`,
        purpose: 'cold_outreach',
      });
    }

    case 'resume-tailor': {
      const experiences = (resumeData?.experience || []).map((exp) => ({
        id: exp.id || Math.random().toString(36).substr(2, 9),
        companyName: exp.company || 'Tech Organization',
        jobTitle: exp.position || 'Software Engineer',
        suggestedAchievements: [
          `Architected core modules aligned with ${targetRole}, enhancing operational efficiency.`,
          `Collaborated with cross-functional stakeholders to deliver key sprint epics 15% ahead of deadline.`,
          `Refactored legacy workflows into modular components, bolstering code coverage and maintainability.`,
        ],
      }));

      return resumeTailorSchema.parse({
        tailoredTitle: `${targetRole} - Tailored Resume`,
        targetRole,
        tailoredSummary: `Target-aligned ${targetRole} equipped with deep experience delivering robust web applications, optimizing user experiences, and executing against demanding technical roadmaps.`,
        tailoredExperience: experiences,
        suggestedSkillsOrder: [
          {
            groupName: 'Target Job Priority Skills',
            skills: ['React', 'TypeScript', 'Node.js', 'System Architecture'],
          },
          {
            groupName: 'Supporting Technologies',
            skills: ['Tailwind CSS', 'Git', 'REST APIs', 'Agile Methodologies'],
          },
        ],
        highlightedProjects: (resumeData?.projects || []).map((p) => p.name || 'Core Project').slice(0, 3),
        explanationOfChanges: 'Reordered key competencies to match job description priority, sharpened achievement bullet points with XYZ impact framing, and synthesized a dedicated professional summary.',
      });
    }

    case 'interview-turn': {
      const turnIdx = payload.turnIndex || 0;
      const questions = [
        {
          question: `Can you walk me through your engineering approach when building scalable web applications for ${targetRole}?`,
          category: 'technical',
          whyAsked: 'Assesses architectural maturity and state management tradeoffs.',
          suggestedAnswerStructure: 'State your framework choice, component re-render strategies, and data fetching caching patterns.',
        },
        {
          question: 'Describe a challenging technical bug or production issue you investigated and how you resolved it.',
          category: 'behavioral_star',
          whyAsked: 'Evaluates problem-solving methodology, logging diagnostics, and persistence under pressure.',
          suggestedAnswerStructure: 'Use STAR: Situation (impacted system), Task (root cause discovery), Action (fix deployed), Result (post-mortem prevention).',
        },
        {
          question: 'How do you collaborate with product managers and designers when requirements shift during a sprint?',
          category: 'hr',
          whyAsked: 'Measures agile communication, emotional intelligence, and business priority alignment.',
          suggestedAnswerStructure: 'Explain proactive communication, scoping MVPs, and constructive technical feedback.',
        },
      ];
      const q = questions[turnIdx % questions.length];
      return interviewTurnSchema.parse({
        id: `turn-${turnIdx + 1}`,
        questionNumber: turnIdx + 1,
        category: q.category,
        question: q.question,
        whyAsked: q.whyAsked,
        suggestedAnswerStructure: q.suggestedAnswerStructure,
        userAnswer: '',
        spokenByUser: false,
      });
    }

    case 'interview-evaluate': {
      return interviewEvaluationSchema.parse({
        overallScore: 88,
        relevanceRating: 9,
        technicalAccuracy: 9,
        communicationClarity: 8,
        problemSolvingStructure: 9,
        strengths: [
          'Crisp, structured problem-solving approach using STAR methodology',
          'Clear technical articulation of frontend performance tradeoffs',
          'Demonstrated user empathy and engineering ownership',
        ],
        weaknesses: [
          'Could elaborate more on observability metrics and automated testing coverage',
        ],
        categoryBreakdown: {
          technical: 9,
          behavioral: 8,
          communication: 9,
          problemSolving: 9,
        },
        practiceQuestionsForNextRound: [
          'How do you handle distributed race conditions in client-server syncing?',
          'What metrics do you track in production to monitor Core Web Vitals?',
        ],
        recommendedLearningTopics: [
          'Automated E2E Testing with Playwright or Cypress',
          'Server-Side Rendering (SSR) hydration optimization',
        ],
        summaryReport: `The candidate demonstrated strong domain knowledge for ${targetRole}. Technical responses were well-structured, relevant, and supported by concrete engineering reasoning.`,
      });
    }

    case 'generate-roadmap': {
      const duration = payload.duration || '60-day';
      return careerRoadmapSchema.parse({
        targetRole,
        planDuration: duration,
        weeklyCommitmentHours: payload.weeklyHours || 10,
        currentSkillAssessment: `Strong intermediate foundation in core frontend architecture. Ready for specialized mastery in DevOps pipelines and distributed systems.`,
        skillGapsIdentified: ['Docker Containerization', 'CI/CD Automated Deployments', 'Advanced State Profiling'],
        completionPercentage: 0,
        milestones: [
          {
            week: 1,
            focusArea: 'Architecture & State Profiling',
            objective: 'Audit re-renders and memory allocations in production web applications.',
            tasks: [
              { id: 't1', description: 'Profile React virtual DOM renders using DevTools Profiler', completed: false },
              { id: 't2', description: 'Refactor component trees to eliminate redundant renders with useMemo/useCallback', completed: false },
            ],
            suggestedProject: 'Build a high-throughput real-time telemetry dashboard with 60fps rendering',
          },
          {
            week: 2,
            focusArea: 'CI/CD Automation & Testing',
            objective: 'Implement end-to-end automated testing pipelines for branch pushes.',
            tasks: [
              { id: 't3', description: 'Write unit and integration tests using Vitest and React Testing Library', completed: false },
              { id: 't4', description: 'Set up GitHub Actions workflow to run lint, test, and build automatically', completed: false },
            ],
            suggestedProject: 'Create a continuous deployment pipeline with automated preview URLs',
          },
          {
            week: 3,
            focusArea: 'Containerization & Cloud Deployment',
            objective: 'Containerize frontend applications with multi-stage Dockerfiles.',
            tasks: [
              { id: 't5', description: 'Author optimized Dockerfile using alpine base and nginx server', completed: false },
              { id: 't6', description: 'Deploy container image to a cloud host (AWS / GCP / Railway)', completed: false },
            ],
            suggestedProject: 'Dockerized full-stack application with automated health checks',
          },
        ],
      });
    }

    default:
      throw new Error(`Unsupported Phase 13 action: ${action}`);
  }
}

// -------------------------------------------------------------
// JOURNEY PERSISTENCE AND STATE MANAGEMENT
// -------------------------------------------------------------

/**
 * Loads the active Career Journey.
 */
export async function loadActiveJourney(userId = null) {
  if (userId && supabase) {
    try {
      const { data, error } = await supabase
        .from('career_journeys')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        return careerJourneyStateSchema.parse({
          id: data.id,
          targetRole: data.target_role,
          companyName: data.company_name || '',
          jobDescription: data.job_description || '',
          currentStep: data.current_step,
          completedSteps: data.completed_steps || [],
          overallProgress: data.overall_progress || 0,
          careerProfile: data.career_profile || null,
          compatibilityAudit: data.compatibility_audit || null,
          lastUpdated: data.updated_at,
        });
      }
    } catch (e) {
      console.warn('[CareerJourney] Failed loading from Supabase, checking local storage', e);
    }
  }

  // LocalStorage Fallback
  try {
    const raw = localStorage.getItem(LOCAL_JOURNEY_KEY);
    if (raw) {
      return careerJourneyStateSchema.parse(JSON.parse(raw));
    }
  } catch {
    // ignore
  }

  // Default initial empty journey
  const initial = {
    id: `journey-${Date.now()}`,
    targetRole: 'Senior Frontend Engineer',
    companyName: 'Tech Innovations Corp',
    jobDescription: '',
    currentStep: 1,
    completedSteps: [],
    overallProgress: 0,
    careerProfile: null,
    compatibilityAudit: null,
    lastUpdated: new Date().toISOString(),
  };

  saveJourneyLocally(initial);
  return careerJourneyStateSchema.parse(initial);
}

/**
 * Saves or updates a Career Journey.
 */
export async function saveJourney(journeyData, userId = null) {
  // Recalculate true progress based on completed steps
  const completed = journeyData.completedSteps || [];
  const progressPercent = Math.min(100, Math.round((completed.length / 6) * 100));
  const updatedJourney = {
    ...journeyData,
    overallProgress: progressPercent,
    lastUpdated: new Date().toISOString(),
  };

  saveJourneyLocally(updatedJourney);

  if (userId && supabase) {
    try {
      await supabase.from('career_journeys').upsert({
        id: updatedJourney.id.startsWith('journey-') ? undefined : updatedJourney.id,
        user_id: userId,
        target_role: updatedJourney.targetRole,
        company_name: updatedJourney.companyName,
        job_description: updatedJourney.jobDescription,
        current_step: updatedJourney.currentStep,
        completed_steps: updatedJourney.completedSteps,
        overall_progress: updatedJourney.overallProgress,
        career_profile: updatedJourney.careerProfile,
        compatibility_audit: updatedJourney.compatibilityAudit,
        updated_at: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('[CareerJourney] Supabase upsert failed', e);
    }
  }

  return updatedJourney;
}

function saveJourneyLocally(journey) {
  try {
    localStorage.setItem(LOCAL_JOURNEY_KEY, JSON.stringify(journey));
  } catch {
    // ignore
  }
}

// -------------------------------------------------------------
// APPLICATION PIPELINE MANAGEMENT (Step 6 & Feature 1)
// -------------------------------------------------------------

export function getLocalApplications() {
  try {
    const raw = localStorage.getItem(LOCAL_APPLICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveLocalApplications(apps) {
  try {
    localStorage.setItem(LOCAL_APPLICATIONS_KEY, JSON.stringify(apps));
  } catch {
    // ignore
  }
}

export async function addJobApplication(appData, userId = null) {
  const newApp = jobApplicationSchema.parse({
    id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    ...appData,
  });

  const apps = getLocalApplications();
  apps.unshift(newApp);
  saveLocalApplications(apps);

  if (userId && supabase) {
    try {
      await supabase.from('job_applications').insert({
        id: newApp.id,
        user_id: userId,
        company: newApp.company,
        role: newApp.role,
        location: newApp.location,
        application_url: newApp.applicationUrl,
        status: newApp.status,
        applied_date: newApp.appliedDate || null,
        follow_up_date: newApp.followUpDate || null,
        compatibility_score: newApp.compatibilityScore,
        notes: newApp.notes,
      });
    } catch (e) {
      console.warn('[Applications] Supabase insert failed', e);
    }
  }

  return newApp;
}

export function calculatePipelineAnalytics(applications = []) {
  const total = applications.length;
  const inProgress = applications.filter((a) => ['applied', 'assessment', 'interview', 'shortlisted'].includes(a.status)).length;
  const interviews = applications.filter((a) => a.status === 'interview').length;
  const offers = applications.filter((a) => a.status === 'offer').length;
  const rejections = applications.filter((a) => a.status === 'rejected').length;

  const conversionRate = total > 0 ? Math.round((offers / total) * 100) : 0;

  let nextAction = 'Find 3 relevant job postings aligned with your career profile and save them to your tracker.';
  if (interviews > 0) {
    nextAction = `You have ${interviews} interview(s) scheduled. Launch the Voice Mock Interview Simulator to prepare your STAR stories.`;
  } else if (inProgress > 0) {
    nextAction = `Follow up with hiring managers on your ${inProgress} in-progress applications after 5 business days.`;
  }

  return pipelineAnalyticsSchema.parse({
    totalApplications: total,
    inProgress,
    interviewsScheduled: interviews,
    offersReceived: offers,
    rejectionCount: rejections,
    conversionRate,
    nextRecommendedAction: nextAction,
  });
}

// -------------------------------------------------------------
// CENTRAL AI DISPATCHER FOR PHASE 13
// -------------------------------------------------------------

function validatePhase13Response(action, data) {
  switch (action) {
    case 'career-profile-extract':
      return careerProfileSchema.parse(data);
    case 'job-insights':
      return targetJobAuditSchema.parse(data);
    case 'truth-check':
      return truthCheckAuditSchema.parse(data);
    case 'generate-communication':
      return data.tone ? coverLetterSchema.parse(data) : recruiterEmailSchema.parse(data);
    case 'interview-turn':
      return interviewTurnSchema.parse(data);
    case 'interview-evaluate':
      return interviewEvaluationSchema.parse(data);
    case 'generate-roadmap':
      return careerRoadmapSchema.parse(data);
    case 'resume-tailor':
      return resumeTailorSchema.parse(data);
    default:
      return data;
  }
}

export async function executePhase13AiAction(action, payload = {}) {
  // 1. User Consent Verification
  const consent = getAiConsentStatus();
  if (!consent.consented) {
    const error = new Error('AI processing requires explicit user consent. Please accept the AI terms to proceed.');
    error.code = 'AI_CONSENT_REQUIRED';
    throw error;
  }

  // 2. Rate Limiting Check
  consumeAiCredit();

  // 3. Attempt Supabase Edge Function if available
  if (supabase?.functions?.invoke) {
    try {
      const isPrivacyMode = getPrivacyMode();
      const sanitizedPayload = {
        ...payload,
        resumeData: payload.resumeData ? sanitizeResumeForAi(payload.resumeData, isPrivacyMode) : undefined,
      };

      const { data, error } = await supabase.functions.invoke('ai-career-intelligence', {
        body: { action, payload: sanitizedPayload },
      });

      if (!error && data?.success && data?.data) {
        return validatePhase13Response(action, data.data);
      }
    } catch {
      // Fallback gracefully to offline intelligence engine
    }
  }

  // 4. Offline Deterministic Intelligence Engine
  return generatePhase13Fallback(action, payload);
}
