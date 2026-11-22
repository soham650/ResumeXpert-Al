/**
 * Google Gemini Prompt Templates for ResumeXpert AI Career Intelligence.
 * Strictly enforces:
 * - NO fabrication of metrics, jobs, companies, or credentials
 * - Accurate structured JSON response matching schema
 * - Action-oriented, ATS-optimized suggestions
 */

export const SYSTEM_CAREER_PROMPT = `You are the Lead ATS Career Architect and Senior Tech Recruiter for ResumeXpert AI.
Your job is to analyze resumes, provide job-matching intelligence, optimize ATS compliance, and assist with interview preparation.

CRITICAL INSTRUCTIONS & SAFETY RULES:
1. NEVER fabricate facts, past companies, degrees, dates, or quantitative metrics.
2. If metrics are missing from the user's bullet, invite the user to provide them (e.g. "[X% increase - insert your exact figure]"); NEVER invent percentages or dollars out of nowhere.
3. Maintain high ATS compliance (standard terminology, single-column logic, clear action verbs).
4. Strictly return valid, parseable JSON conforming exactly to the requested output structure.
5. Do not include markdown code block formatting (like \`\`\`json) in your final output unless explicitly instructed. Return pure JSON.`;

export function getJobMatchPrompt(resumeData: unknown, jobDescription: string): string {
  return `Compare the following Resume with the Target Job Description.
Evaluate keyword match, technical skills alignment, qualification gaps, and actionable recommendations.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

TARGET JOB DESCRIPTION:
${jobDescription}

Return a valid JSON object matching this schema:
{
  "matchScore": number (0-100),
  "summary": string,
  "matchedKeywords": string[],
  "missingKeywords": string[],
  "relevantTechnicalSkills": string[],
  "missingSkills": string[],
  "experienceAlignment": string,
  "projectRelevance": string,
  "qualificationGaps": string[],
  "recommendations": string[]
}`;
}

export function getAtsOptimizerPrompt(resumeData: unknown): string {
  return `Audit the following resume for ATS (Applicant Tracking System) parseability, readability, formatting risks, and keyword strength.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

Return a valid JSON object matching this schema:
{
  "estimatedScore": number (0-100),
  "strengths": string[],
  "weaknesses": string[],
  "formattingRisks": string[],
  "readability": string,
  "missingInformation": string[],
  "priorityActionPlan": [
    {
      "priority": "high" | "medium" | "low",
      "section": string,
      "action": string,
      "rationale": string
    }
  ]
}`;
}

export function getBulletPolishPrompt(originalBullet: string, jobTitle?: string): string {
  return `Transform this resume bullet point into strong, ATS-optimized achievement statements using the XYZ formula (Accomplished [X], as measured by [Y], by doing [Z]).
Do NOT invent numbers; if metrics are missing, use placeholders like "[X%]" or "[N users]".

ORIGINAL BULLET: "${originalBullet}"
TARGET ROLE/CONTEXT: "${jobTitle || 'General'}"

Return a valid JSON object matching this schema:
{
  "originalBullet": "${originalBullet}",
  "improvedBullets": [
    {
      "text": string,
      "style": "impact" | "concise" | "technical" | "metric-focused",
      "actionVerb": string,
      "explanation": string
    }
  ],
  "missingMetricsInquiry": string | null
}`;
}

export function getSummaryGeneratorPrompt(resumeData: unknown, tone: string = 'professional'): string {
  return `Generate 3 high-impact professional summaries (short ~200 chars, standard ~350 chars, detailed ~420 chars) based solely on this resume data.
Tone preference: ${tone}. Do NOT invent past experience or roles.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

Return a valid JSON object matching this schema:
{
  "short": string (max 250 characters),
  "standard": string (max 420 characters),
  "detailed": string (max 450 characters),
  "highlightedSkills": string[]
}`;
}

export function getSkillGapPrompt(resumeData: unknown, targetRoleOrJob: string): string {
  return `Analyze the skill gaps between this candidate's resume and the target role/job description.
Separate proven demonstrated skills from claimed but unsubstantiated skills, and missing required skills.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

TARGET ROLE / JOB:
${targetRoleOrJob}

Return a valid JSON object matching this schema:
{
  "demonstratedSkills": string[],
  "claimedUnprovenSkills": string[],
  "missingRequiredSkills": string[],
  "transferableSkills": string[],
  "learningRecommendations": [
    {
      "topic": string,
      "urgency": "high" | "medium" | "low",
      "rationale": string
    }
  ]
}`;
}

export function getHrReviewPrompt(resumeData: unknown): string {
  return `Act as a seasoned Senior Tech Recruiter doing a 6-second resume screen followed by a deep review.
Give honest, constructive feedback on first impression, role relevance, clarity, red flags, and priority improvements.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

Return a valid JSON object matching this schema:
{
  "firstImpression": string,
  "roleRelevance": string,
  "clarityScore": number (1-10),
  "strongPoints": string[],
  "redFlags": string[],
  "presentationQuality": string,
  "suggestedCorrections": [
    {
      "area": string,
      "feedback": string,
      "suggestion": string
    }
  ],
  "priorityImprovements": string[]
}`;
}

export function getGrammarProofreadPrompt(textOrResume: unknown): string {
  return `Proofread the provided resume content for grammar, punctuation, active voice, conciseness, and professional tone.

CONTENT:
${JSON.stringify(textOrResume, null, 2)}

Return a valid JSON object matching this schema:
{
  "overallTone": string,
  "correctionsCount": number,
  "corrections": [
    {
      "originalText": string,
      "suggestedText": string,
      "type": "grammar" | "spelling" | "tone" | "wordiness" | "repetition",
      "explanation": string
    }
  ],
  "polishedSummary": string | null
}`;
}

export function getResumeTailorPrompt(resumeData: unknown, jobDescription: string): string {
  return `You are asked to tailor a resume specifically for a target job description.
RULES:
1. Re-order, rephrase, and highlight genuine experiences to best fit the job requirements.
2. NEVER invent companies, degrees, dates, or nonexistent tools.
3. Suggest an updated summary, tailored bullet points for existing work history items, and skill group prioritization.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

TARGET JOB DESCRIPTION:
${jobDescription}

Return a valid JSON object matching this schema:
{
  "tailoredTitle": string,
  "targetRole": string,
  "tailoredSummary": string (max 450 characters),
  "tailoredExperience": [
    {
      "id": string | number,
      "companyName": string,
      "jobTitle": string,
      "suggestedAchievements": string[]
    }
  ],
  "suggestedSkillsOrder": [
    {
      "groupName": string,
      "skills": string[]
    }
  ],
  "highlightedProjects": string[],
  "explanationOfChanges": string
}`;
}

export function getInterviewPrepPrompt(resumeData: unknown, jobTitle: string, jobDescription?: string): string {
  return `Generate targeted interview preparation materials tailored to this candidate's resume and target role.
Include 5-7 realistic questions across HR, Technical, Behavioral (STAR), and Project Deep-Dive categories, with guidance on how to answer.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

TARGET ROLE: ${jobTitle}
JOB DESCRIPTION: ${jobDescription || 'Standard requirements for ' + jobTitle}

Return a valid JSON object matching this schema:
{
  "targetJobTitle": "${jobTitle}",
  "difficulty": "entry" | "mid" | "senior" | "executive",
  "questions": [
    {
      "id": string,
      "category": "hr" | "technical" | "project" | "behavioral" | "scenario",
      "question": string,
      "whyAsked": string,
      "suggestedAnswerStructure": string,
      "keyConceptsToCover": string[],
      "followUpQuestions": string[]
    }
  ],
  "coreConceptsToRevise": string[]
}`;
}

export function getCareerProfileExtractPrompt(resumeData: unknown): string {
  return `Extract a verified structured career profile from the supplied resume data.
Do NOT invent degrees, companies, or unmentioned skills.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

Return a valid JSON object matching this schema:
{
  "fullName": string,
  "currentTitle": string,
  "seniorityLevel": "entry" | "mid" | "senior" | "lead" | "executive",
  "summary": string,
  "topSkills": string[],
  "domainExpertise": string[],
  "totalYearsExperience": number,
  "keyAchievements": string[],
  "verifiedByUser": false
}`;
}

export function getInterviewTurnPrompt(targetRole: string, category: string, turnIndex: number, transcript: unknown[]): string {
  return `You are an expert interviewer simulating an authentic job interview for the role of ${targetRole}.
Category of this question: ${category}.
This is question #${turnIndex + 1}.

TRANSCRIPT SO FAR:
${JSON.stringify(transcript, null, 2)}

Generate the next question.
Return a valid JSON object matching this schema:
{
  "id": "q-${turnIndex + 1}",
  "questionNumber": ${turnIndex + 1},
  "category": "${category}",
  "question": string,
  "whyAsked": string,
  "suggestedAnswerStructure": string,
  "userAnswer": "",
  "spokenByUser": false
}`;
}

export function getInterviewEvaluationPrompt(targetRole: string, transcript: unknown[]): string {
  return `Evaluate this complete mock interview session for the role of ${targetRole}.
Score relevance, technical accuracy, communication clarity, problem-solving structure, strengths, and areas to improve.

INTERVIEW TRANSCRIPT:
${JSON.stringify(transcript, null, 2)}

Return a valid JSON object matching this schema:
{
  "overallScore": number (0-100),
  "relevanceRating": number (1-10),
  "technicalAccuracy": number (1-10),
  "communicationClarity": number (1-10),
  "problemSolvingStructure": number (1-10),
  "strengths": string[],
  "weaknesses": string[],
  "categoryBreakdown": { [category: string]: number },
  "practiceQuestionsForNextRound": string[],
  "recommendedLearningTopics": string[],
  "summaryReport": string
}`;
}

export function getRoadmapPrompt(targetRole: string, currentSkills: string[], duration: string, weeklyHours: number): string {
  return `Generate an actionable, step-by-step career development roadmap for an aspiring ${targetRole}.
Plan duration: ${duration}. Weekly hours: ${weeklyHours}.
Current verified skills: ${currentSkills.join(', ')}.

Return a valid JSON object matching this schema:
{
  "targetRole": "${targetRole}",
  "planDuration": "${duration}",
  "weeklyCommitmentHours": ${weeklyHours},
  "currentSkillAssessment": string,
  "skillGapsIdentified": string[],
  "milestones": [
    {
      "week": number,
      "focusArea": string,
      "objective": string,
      "tasks": [
        {
          "id": string,
          "description": string,
          "completed": false,
          "resourceLink": string
        }
      ],
      "suggestedProject": string
    }
  ],
  "completionPercentage": 0
}`;
}

export function getCommunicationPrompt(category: string, resumeData: unknown, jobDescription: string, tone: string): string {
  return `Generate professional job communication based solely on this candidate's genuine background.
Category: ${category}. Tone: ${tone}.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

JOB DESCRIPTION / CONTEXT:
${jobDescription}

Return a valid JSON object matching this schema:
{
  "recipientName": string,
  "companyName": string,
  "roleTitle": string,
  "content": string,
  "tone": "${tone}",
  "keyHooks": string[]
}`;
}

export function getTruthCheckPrompt(resumeData: unknown): string {
  return `Audit this candidate's resume for claims that lack concrete evidence.
Do NOT label candidate dishonest. Classify claims and suggest helpful evidence improvements.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

Return a valid JSON object matching this schema:
{
  "overallCredibilityScore": number (0-100),
  "findings": [
    {
      "claimText": string,
      "section": string,
      "classification": "supported" | "partially_supported" | "no_evidence_found" | "needs_verification",
      "rationale": string,
      "remediationAdvice": string,
      "suggestedWording": string,
      "userVerified": false
    }
  ],
  "unsubstantiatedMetricsCount": number,
  "verifiedClaimsCount": number,
  "summary": string
}`;
}

export function getJobInsightsPrompt(jobDescription: string): string {
  return `Deconstruct this job description into key requirements, must-have vs preferred skills, and realistic industry salary benchmarks.

JOB DESCRIPTION:
${jobDescription}

Return a valid JSON object matching this schema:
{
  "targetRole": string,
  "companyName": string,
  "compatibilityScore": 85,
  "executiveSummary": string,
  "mandatoryMatched": string[],
  "mandatoryMissing": string[],
  "preferredMatched": string[],
  "preferredMissing": string[],
  "experienceAlignment": string,
  "qualificationGaps": string[],
  "immediateRecommendations": string[]
}`;
}


