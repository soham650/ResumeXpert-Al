// Supabase Edge Function: ai-career-intelligence
// Serves all 10 AI Career Intelligence features powered by Google Gemini

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { callGemini } from '../_shared/geminiClient.ts';
import {
  SYSTEM_CAREER_PROMPT,
  getJobMatchPrompt,
  getAtsOptimizerPrompt,
  getBulletPolishPrompt,
  getSummaryGeneratorPrompt,
  getSkillGapPrompt,
  getHrReviewPrompt,
  getGrammarProofreadPrompt,
  getResumeTailorPrompt,
  getInterviewPrepPrompt,
  getCareerProfileExtractPrompt,
  getInterviewTurnPrompt,
  getInterviewEvaluationPrompt,
  getRoadmapPrompt,
  getCommunicationPrompt,
  getTruthCheckPrompt,
  getJobInsightsPrompt,
} from '../_shared/promptTemplates.ts';
import { checkRateLimit } from '../_shared/rateLimiter.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const ip = req.headers.get('x-forwarded-for') || 'anonymous';
    const rateCheck = checkRateLimit(ip, 30, 60 * 1000);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please wait a moment before trying again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { action, payload } = await req.json();
    if (!action) {
      return new Response(
        JSON.stringify({ error: 'Missing "action" parameter in request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    let prompt = '';

    switch (action) {
      case 'job-match':
        prompt = getJobMatchPrompt(payload.resumeData, payload.jobDescription);
        break;
      case 'ats-optimizer':
        prompt = getAtsOptimizerPrompt(payload.resumeData);
        break;
      case 'bullet-polish':
        prompt = getBulletPolishPrompt(payload.originalBullet, payload.jobTitle);
        break;
      case 'summary-generator':
        prompt = getSummaryGeneratorPrompt(payload.resumeData, payload.tone);
        break;
      case 'skill-gap':
        prompt = getSkillGapPrompt(payload.resumeData, payload.targetRoleOrJob);
        break;
      case 'hr-review':
        prompt = getHrReviewPrompt(payload.resumeData);
        break;
      case 'grammar-proofread':
        prompt = getGrammarProofreadPrompt(payload.content || payload.resumeData);
        break;
      case 'resume-tailor':
        prompt = getResumeTailorPrompt(payload.resumeData, payload.jobDescription);
        break;
      case 'interview-prep':
        prompt = getInterviewPrepPrompt(payload.resumeData, payload.jobTitle, payload.jobDescription);
        break;
      case 'diff-comparison':
        prompt = `Compare this original resume section with the suggested section. Provide clear reasoning and expected ATS improvement.\nOriginal: "${payload.originalContent}"\nSuggested: "${payload.suggestedContent}"\nReturn JSON: { "section": "${payload.section || 'General'}", "originalContent": "${payload.originalContent}", "suggestedContent": "${payload.suggestedContent}", "explanationOfChange": string, "expectedImprovement": string }`;
        break;
      case 'career-profile-extract':
        prompt = getCareerProfileExtractPrompt(payload.resumeData);
        break;
      case 'interview-turn':
        prompt = getInterviewTurnPrompt(payload.targetRole || 'Software Engineer', payload.category || 'mixed', payload.turnIndex || 0, payload.transcript || []);
        break;
      case 'interview-evaluate':
        prompt = getInterviewEvaluationPrompt(payload.targetRole || 'Software Engineer', payload.transcript || []);
        break;
      case 'generate-roadmap':
        prompt = getRoadmapPrompt(payload.targetRole || 'Target Role', payload.currentSkills || [], payload.duration || '60-day', payload.weeklyHours || 10);
        break;
      case 'generate-communication':
        prompt = getCommunicationPrompt(payload.category || 'cover_letter', payload.resumeData, payload.jobDescription || '', payload.tone || 'professional');
        break;
      case 'truth-check':
        prompt = getTruthCheckPrompt(payload.resumeData);
        break;
      case 'job-insights':
        prompt = getJobInsightsPrompt(payload.jobDescription || '');
        break;
      default:
        return new Response(
          JSON.stringify({ error: `Unsupported action: ${action}` }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }

    // Invoke Gemini AI
    const rawResult = await callGemini(prompt, {
      systemInstruction: SYSTEM_CAREER_PROMPT,
      temperature: 0.2,
      responseMimeType: 'application/json',
    });

    // Parse & sanitize JSON
    let parsedResult;
    try {
      // Strip potential ```json wrappers if returned
      const cleanJson = rawResult.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      parsedResult = JSON.parse(cleanJson);
    } catch {
      parsedResult = { rawText: rawResult };
    }

    return new Response(
      JSON.stringify({ success: true, data: parsedResult }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    return new Response(
      JSON.stringify({ success: false, error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

