/**
 * Client-Side Google Gemini AI Client.
 * Connects directly using VITE_GEMINI_API_KEY / GEMINI_API_KEY
 * with structured JSON mode and configurable models (gemini-2.5-flash / gemini-2.0-flash / gemini-1.5-flash).
 */

const getEnvVariable = (key) => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return '';
};

export const GEMINI_API_KEY = getEnvVariable('VITE_GEMINI_API_KEY') || getEnvVariable('GEMINI_API_KEY');
export const GEMINI_MODEL = getEnvVariable('VITE_GEMINI_MODEL') || getEnvVariable('GEMINI_MODEL') || 'gemini-2.5-flash';

export const isGeminiConfigured = Boolean(
  GEMINI_API_KEY && 
  GEMINI_API_KEY.length > 10 && 
  !GEMINI_API_KEY.includes('your-gemini')
);

export async function callClientGemini(prompt, options = {}) {
  if (!isGeminiConfigured) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = options.model || GEMINI_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: options.temperature ?? 0.2,
      maxOutputTokens: options.maxOutputTokens ?? 2048,
      responseMimeType: options.responseMimeType || 'application/json',
    },
  };

  if (options.systemInstruction) {
    payload.systemInstruction = {
      parts: [{ text: options.systemInstruction }],
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini API returned an empty response');
  }

  // Strip code fences if returned by model
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```\s*$/i, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/i, '').replace(/```\s*$/i, '');
  }

  return cleaned.trim();
}
