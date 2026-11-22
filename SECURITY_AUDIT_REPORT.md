# ResumeXpert AI — Security Audit Report
**Phase 14 Security & Vulnerability Assessment**  
**Audit Date:** November 8, 2026  
**Auditor:** Application Security & QA Engineering Team  
**Security Status:** **PASSED / PRODUCTION HARDENED**  

---

## 1. Scope of Audit

The security assessment evaluated:
1. Client-Side Input Sanitization and XSS Prevention.
2. Authentication, Session Tokens, and Supabase JWT Handling.
3. Row Level Security (RLS) policies on cloud database tables.
4. AI API Key Handling and Gemini Rate Limiting.
5. Local Storage data leakage and cryptographic considerations.
6. Cascading Account Deletion (`delete_user_account_data`) security boundary.
7. Search Engine Crawler privacy barriers (`robots.txt`).

---

## 2. Findings & Mitigations

### 2.1 Cross-Site Scripting (XSS) & Template Injection
- **Risk:** Malicious scripts inserted into resume markdown fields (e.g., job descriptions, project bullet points) could execute in victim browsers during shared preview or web viewing.
- **Remediation:**
  - All user inputs are validated against strict Zod schemas (`src/schema/validation.js`).
  - React's JSX engine automatically escapes dynamic string bindings across all 6 resume templates (`Modern`, `Classic`, `Minimal`, `Professional`, `Technical`, `Academic`).
  - Custom markdown formatters escape HTML tags before rendering bullet lists.

### 2.2 Row Level Security (RLS) Verification
- **Risk:** In multi-tenant environments, users could query or mutate other candidates' resumes, mock interview transcripts, or career roadmaps.
- **Remediation:**
  - Every table in Supabase (`resumes`, `profiles`, `career_journeys`, `mock_interviews`, `resume_versions`, `job_applications`, `communication_drafts`, `career_roadmaps`) has Row Level Security explicitly enabled (`ALTER TABLE ... ENABLE ROW LEVEL SECURITY`).
  - Policies enforce strict user matching:
    ```sql
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id)
    ```
  - Unauthorized reads return empty sets; unauthorized updates/deletes fail with 0 rows affected.

### 2.3 Account Deletion Security Boundary
- **Risk:** Malicious callers executing stored procedures to delete other users' data.
- **Remediation:**
  - Stored procedure `public.delete_user_account_data(target_user_id uuid)` is defined as `SECURITY DEFINER`.
  - It includes an explicit authentication guard:
    ```sql
    IF auth.uid() IS NULL OR (auth.uid() <> target_user_id) THEN
      RAISE EXCEPTION 'Unauthorized: You may only delete your own account data.';
    END IF;
    ```
  - Foreign key cascades cleanly delete associated child records in `resumes`, `mock_interviews`, `career_roadmaps`, and `job_applications`.

### 2.4 Google Gemini API Key Security & Rate Limiting
- **Risk:** API key exhaustion, token quota abuse, or denial-of-service from automated requests.
- **Remediation:**
  - AI requests check for valid API keys (`VITE_GEMINI_API_KEY`) and allow users to provide their own personal API key in localStorage.
  - Client-side token bucket rate limiting prevents rapid-fire prompts.
  - Prompts enforce structured JSON schemas to prevent prompt injection and unintended output leakage.

### 2.5 Candidate Data Privacy & Indexing Protection
- **Risk:** Googlebot or other web scrapers indexing candidate names, phone numbers, and job histories from builder URLs.
- **Remediation:**
  - `public/robots.txt` strictly disallows indexing of `/builder/`, `/app/`, `/api/`, `/storage/`, and query strings containing user tokens.
  - Candidate resumes are kept in private memory/client-side storage unless explicitly shared by the user.

---

## 3. Vulnerability Matrix

| Vulnerability ID | Category | Severity | Pre-Audit Risk | Mitigation Implemented | Post-Audit Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| SEC-01 | XSS / Content Injection | High | Potential script in bullet fields | React JSX auto-escaping + Zod string validation | **RESOLVED** |
| SEC-02 | Broken Access Control | Critical | Potential cross-tenant data access | Enforced Supabase RLS on 8 public tables | **RESOLVED** |
| SEC-03 | Privacy / Scraping | High | Web crawlers indexing candidate data | Custom `robots.txt` disallow rules on builder paths | **RESOLVED** |
| SEC-04 | Account Takeover / Deletion | High | Unauthorized account wipe | Procedure verifies `auth.uid() = target_user_id` | **RESOLVED** |
| SEC-05 | Fake Contact Spoofing | Medium | Dummy email address in footer | Centralized `appConfig.js` with fallback guard | **RESOLVED** |

---

## 4. Security Sign-Off

The application demonstrates defense-in-depth across the client, API integration layer, and cloud database. No unauthenticated data exposure vectors were identified.

