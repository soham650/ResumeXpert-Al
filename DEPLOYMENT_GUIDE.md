# ResumeXpert AI — Production Deployment Guide
**Phase 14 Deployment & Hosting Architecture**  
**Version:** 1.0.0  
**Target Environments:** Vercel, Netlify, Cloudflare Pages, Supabase Cloud  

---

## 1. Prerequisites

Before deploying ResumeXpert AI to production, ensure you have:
1. Node.js `v18.0.0` or higher installed.
2. A Supabase project created with the Phase 9, 13, and 14 SQL migrations executed.
3. A Google AI Studio API key (`gemini-1.5-flash` or `gemini-2.0-flash` compatible).
4. A production support email address (e.g. `support@yourdomain.com`).

---

## 2. Environment Variables Configuration

Create a `.env.production` file or set the following environment variables in your deployment dashboard (e.g., Vercel Project Settings > Environment Variables):

```bash
# Google Gemini AI Integration (Required for AI Studio & Mock Interview)
VITE_GEMINI_API_KEY=your_production_gemini_api_key

# Supabase Authentication & Cloud Database (Required for Cloud Sync)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_production_supabase_anon_key

# Support & Contact (Required for Mailto links & User Inquiries)
VITE_SUPPORT_EMAIL=support@resumexpert.ai

# Canonical Site URL (Used for sitemap and OpenGraph tags)
VITE_SITE_URL=https://resumexpert.ai
```

> **Note on Fallback:** If `VITE_SUPPORT_EMAIL` is omitted, the application displays `[SUPPORT_EMAIL]` in gray font to prevent dummy email delivery, in accordance with Phase 14 specifications.

---

## 3. Database Migration Execution (Supabase)

In your Supabase SQL Editor, run the database migrations in chronological sequence:
1. `supabase/migrations/20261106_phase9_user_resumes.sql` (Initial resumes table and RLS).
2. `supabase/migrations/20261107_phase13_career_journey_schema.sql` (Career journey, mock interview, and application tracking tables).
3. `supabase/migrations/20261108_phase14_account_deletion_and_policies.sql` (Cascading account deletion function).

---

## 4. Local Build & Verification

Test the production build locally before triggering deployment:

```bash
# 1. Run all regression test suites
npm test

# 2. Compile production bundle
npm run build

# 3. Preview production bundle locally
npm run preview
```

---

## 5. Deployment Options

### Option A: Vercel (Recommended)
1. Import repository into Vercel.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Configure Environment Variables in Project Settings.
6. Add `vercel.json` rewrite rule for single-page application routing if using deep browser paths:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```

### Option B: Netlify
1. Connect Git repository to Netlify.
2. Build Command: `npm run build`
3. Publish Directory: `dist`
4. Set Environment Variables under Site Configuration > Environment variables.
5. Create `public/_redirects`:
   ```text
   /*    /index.html   200
   ```

### Option C: Cloudflare Pages
1. Create new project connected to Git repo.
2. Framework preset: **Vite**.
3. Build command: `npm run build`
4. Build output directory: `dist`
5. Set environment variables in Cloudflare Pages dashboard.

---

## 6. Post-Deployment Verification Checklist

- [ ] Visit home URL (`/`) and check browser console for zero runtime errors.
- [ ] Inspect footer links: Help Center, Contact, Privacy Policy, Terms, Data Deletion.
- [ ] Test resume creation and test PDF export in browser.
- [ ] Test ATS scoring on an uploaded resume sample.
- [ ] Test `Data Deletion Policy` local storage purge.
- [ ] Verify `https://your-domain.com/robots.txt` loads and restricts `/builder/`.
- [ ] Verify `https://your-domain.com/sitemap.xml` returns valid XML.

