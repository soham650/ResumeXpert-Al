# ResumeXpert AI — Privacy & Data Flow Architecture
**Phase 14 Compliance & Candidate Data Protection Specification**  
**Effective Date:** November 8, 2026  
**Audience:** Platform Architects, Compliance Officers, and End Users  

---

## 1. Core Privacy Principles

1. **Candidate Data Sovereignty:** Users maintain 100% ownership and copyright over their resume text, work experience, career documents, and uploaded profiles.
2. **Client-First Processing:** Unauthenticated users can draft, format, audit, and export resumes entirely in browser memory and LocalStorage without ever transmitting data to cloud databases.
3. **Zero Third-Party Advertising / Tracking:** The application employs zero behavioral advertising pixels, marketing trackers, or third-party behavioral profiling scripts.
4. **Transient AI Processing:** Prompts sent to Google Gemini are ephemeral. User data is not used to train public foundation models under Google GenAI Enterprise terms.
5. **Absolute Right to Erasure:** Users can instantly purge local device data via single-click self-service, or trigger cascading cloud deletion for cloud accounts.

---

## 2. End-to-End Data Flow Map

```
┌────────────────────────────────────────────────────────────────────────┐
│                        USER BROWSER / CLIENT                           │
│                                                                        │
│   [Candidate Inputs] ──► [Zod Validation] ──► [Zustand Store Memory]   │
│                                                     │                  │
│                                                     ▼                  │
│                                             [LocalStorage Cache]       │
│                                                     │                  │
└─────────────────────────────┬───────────────────────┼──────────────────┘
                              │                       │
           (If Authenticated) │                       │ (Export Action)
                              ▼                       ▼
            ┌────────────────────────────┐    ┌───────────────────────────┐
            │   SUPABASE POSTGRESQL DB   │    │ CLIENT-SIDE EXPORT ENGINE │
            │                            │    │                           │
            │  • profiles (RLS)          │    │ • @react-pdf/renderer     │
            │  • resumes (RLS)           │    │   (Vector PDF in browser) │
            │  • mock_interviews (RLS)   │    │ • docx                    │
            │  • career_journeys (RLS)   │    │   (PKZIP Word document)   │
            └──────────────┬─────────────┘    └───────────────────────────┘
                           │
      (Optional AI Tools)  ▼
            ┌────────────────────────────┐
            │   GOOGLE GEMINI API (v1)   │
            │                            │
            │  • ATS Keyword Audit       │
            │  • Tailored Bullet Rewrites│
            │  • Mock Interview QA       │
            │  • Structured JSON Output  │
            └────────────────────────────┘
```

---

## 3. Storage Layer Breakdown

### 3.1 LocalStorage (Device-Level)
- **Key:** `resumecraft_resume_data_v1`
- **Contents:** Active resume JSON (contact info, work history, education, skills, projects, certifications, chosen template, accent color).
- **Security:** Scoped strictly to the application origin via the browser's Same-Origin Policy.
- **Purge Method:** Available via `Data Deletion Policy` screen or browser cache clear.

### 3.2 Supabase Cloud Storage (Authenticated Users)
- **Encryption:** Encrypted in transit (TLS 1.3) and encrypted at rest (AES-256).
- **Access Control:** Restricted via PostgreSQL Row Level Security (RLS) matching `auth.uid() = user_id`.
- **Retention:** Stored only while the user account is active. Deleted immediately upon account deletion request.

### 3.3 Google Gemini AI Integration
- **Transport:** HTTPS requests directed to `https://generativelanguage.googleapis.com`.
- **Payload:** Extracted job requirements and resume text passed in user prompt context.
- **Return Data:** Validated against Zod response schemas before presentation in UI.
- **Persistence:** Gemini does not persist conversation state; prompts are stateless.

---

## 4. Right to Deletion & Data Purge Workflow

Users exercise their GDPR/CCPA rights through two explicit interfaces in `DataDeletionPolicy.jsx`:

1. **Local Device Data Purge (`purgeAllLocalData`):**
   - Deletes `resumecraft_resume_data_v1` from localStorage.
   - Resets Zustand in-memory state to an empty template.
   - Clears cached career journey milestones.

2. **Cloud Account & Data Cascade (`delete_user_account_data`):**
   - User types `"DELETE"` to confirm intent.
   - Calls PostgreSQL `public.delete_user_account_data(target_user_id)`:
     ```sql
     DELETE FROM communication_drafts WHERE user_id = target_user_id;
     DELETE FROM mock_interviews WHERE user_id = target_user_id;
     DELETE FROM career_roadmaps WHERE user_id = target_user_id;
     DELETE FROM portfolio_projects WHERE user_id = target_user_id;
     DELETE FROM resume_versions WHERE user_id = target_user_id;
     DELETE FROM job_applications WHERE user_id = target_user_id;
     DELETE FROM career_journeys WHERE user_id = target_user_id;
     DELETE FROM resumes WHERE user_id = target_user_id;
     DELETE FROM profiles WHERE id = target_user_id;
     ```
   - Invokes `supabase.auth.signOut()` and redirects to homepage.

