# ResumeXpert AI — Environment Variables Reference
**Phase 14 Configuration & Secrets Management**  
**Version:** 1.0.0  

---

## 1. Overview

ResumeXpert AI relies on client-side environment variables prefixed with `VITE_` per the Vite standard. All environment variables are non-sensitive public runtime values except the Gemini API Key and Supabase Anon Key, which are constrained by Row Level Security and Google Cloud origin restrictions.

---

## 2. Environment Variables Catalog

| Variable Name | Required | Default / Fallback | Sensitivity | Description |
| :--- | :--- | :--- | :--- | :--- |
| `VITE_GEMINI_API_KEY` | Optional* | None | High | Google GenAI API Key used for ATS analysis, AI tailoring, and mock interview questions. If omitted, users can provide their own key in the UI. |
| `VITE_SUPABASE_URL` | Optional** | None | Medium | The HTTPS REST/GraphQL endpoint of your Supabase project (e.g. `https://xyz.supabase.co`). |
| `VITE_SUPABASE_ANON_KEY` | Optional** | None | Medium | The public `anon` JWT key used by the Supabase client. Secured via database Row Level Security (RLS). |
| `VITE_SUPPORT_EMAIL` | Optional | `[SUPPORT_EMAIL]` | Low | The official user-facing support email address. If omitted or unset, UI renders `[SUPPORT_EMAIL]` in neutral gray to prevent dummy email delivery. |
| `VITE_SITE_URL` | Optional | `https://resumexpert.ai` | Low | Canonical domain name used in OpenGraph tags, Twitter Cards, and XML sitemaps. |

*\* If not set in `.env`, the application prompts the user to enter their personal Gemini API key in the UI settings or modal.*  
*\*\* If not set, cloud sync features are disabled and the application functions gracefully in Local-Only offline mode.*

---

## 3. Sample `.env.example`

```bash
# ================================================================
# ResumeXpert AI — Environment Configuration Example
# Copy this file to .env.local for development or configure
# in your cloud hosting provider (Vercel, Netlify, Cloudflare)
# ================================================================

# Google Gemini AI Studio API Key
VITE_GEMINI_API_KEY=AIzaSyYourGeminiApiKeyHere

# Supabase Cloud Project URL
VITE_SUPABASE_URL=https://your-project.supabase.co

# Supabase Public Anonymous API Key
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_anon_token_here

# User-Facing Support Email Address (Set to your actual domain)
VITE_SUPPORT_EMAIL=support@yourdomain.com

# Canonical Site URL
VITE_SITE_URL=https://resumexpert.ai
```

---

## 4. Security Rules for Secrets Handling

1. **Never Commit Secrets to Source Control:** `.env`, `.env.local`, and `.env.production` are strictly included in `.gitignore`.
2. **Restrict Google API Key:** In the Google Cloud Console, restrict your `VITE_GEMINI_API_KEY` to:
   - API restriction: **Generative Language API**.
   - Application restriction: **HTTP referrers** (e.g. `https://resumexpert.ai/*`).
3. **Never Hardcode Secrets:** All application components source values via `import.meta.env` or centralized helpers in `src/config/appConfig.js`.

