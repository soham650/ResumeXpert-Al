-- ==============================================================
-- ResumeXpert AI Phase 13: Advanced Career Intelligence & 6-Step Journey
-- Production-Ready Schema Migration with Row Level Security (RLS)
-- ==============================================================

-- 1. Career Journeys (State machine tracking the 6-Step AI Career Journey)
create table if not exists public.career_journeys (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  target_role text not null default 'Target Position',
  company_name text,
  job_description text,
  current_step integer not null default 1,
  completed_steps integer[] not null default '{}',
  overall_progress integer not null default 0,
  career_profile jsonb not null default '{}'::jsonb,
  compatibility_audit jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_career_journeys_user_id on public.career_journeys(user_id);
create index if not exists idx_career_journeys_updated_at on public.career_journeys(updated_at desc);

alter table public.career_journeys enable row level security;

drop policy if exists "Users can read own career journeys" on public.career_journeys;
create policy "Users can read own career journeys"
  on public.career_journeys for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own career journeys" on public.career_journeys;
create policy "Users can insert own career journeys"
  on public.career_journeys for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own career journeys" on public.career_journeys;
create policy "Users can update own career journeys"
  on public.career_journeys for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own career journeys" on public.career_journeys;
create policy "Users can delete own career journeys"
  on public.career_journeys for delete using (auth.uid() = user_id);

-- 2. Job Applications Pipeline (Feature 1 Copilot)
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  journey_id uuid references public.career_journeys(id) on delete set null,
  company text not null,
  role text not null,
  location text,
  application_url text,
  status text not null default 'interested',
  applied_date date,
  follow_up_date date,
  compatibility_score integer default 0,
  notes text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_job_applications_user_id on public.job_applications(user_id);
create index if not exists idx_job_applications_status on public.job_applications(status);

alter table public.job_applications enable row level security;

drop policy if exists "Users can read own applications" on public.job_applications;
create policy "Users can read own applications"
  on public.job_applications for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own applications" on public.job_applications;
create policy "Users can insert own applications"
  on public.job_applications for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own applications" on public.job_applications;
create policy "Users can update own applications"
  on public.job_applications for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own applications" on public.job_applications;
create policy "Users can delete own applications"
  on public.job_applications for delete using (auth.uid() = user_id);

-- 3. Mock Interview Sessions & Evaluations (Feature 2)
create table if not exists public.mock_interviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  journey_id uuid references public.career_journeys(id) on delete set null,
  target_role text not null,
  interview_type text not null default 'mixed',
  mode text not null default 'text',
  difficulty text not null default 'mid',
  transcript jsonb not null default '[]'::jsonb,
  evaluation jsonb,
  performance_score integer default 0,
  completed boolean not null default false,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_mock_interviews_user_id on public.mock_interviews(user_id);

alter table public.mock_interviews enable row level security;

drop policy if exists "Users can read own interviews" on public.mock_interviews;
create policy "Users can read own interviews"
  on public.mock_interviews for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own interviews" on public.mock_interviews;
create policy "Users can insert own interviews"
  on public.mock_interviews for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own interviews" on public.mock_interviews;
create policy "Users can update own interviews"
  on public.mock_interviews for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own interviews" on public.mock_interviews;
create policy "Users can delete own interviews"
  on public.mock_interviews for delete using (auth.uid() = user_id);

-- 4. Career Roadmaps & Learning Milestones (Feature 3)
create table if not exists public.career_roadmaps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  journey_id uuid references public.career_journeys(id) on delete set null,
  target_role text not null,
  plan_duration text not null default '60-day',
  milestones jsonb not null default '[]'::jsonb,
  progress integer not null default 0,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_career_roadmaps_user_id on public.career_roadmaps(user_id);

alter table public.career_roadmaps enable row level security;

drop policy if exists "Users can read own roadmaps" on public.career_roadmaps;
create policy "Users can read own roadmaps"
  on public.career_roadmaps for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own roadmaps" on public.career_roadmaps;
create policy "Users can insert own roadmaps"
  on public.career_roadmaps for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own roadmaps" on public.career_roadmaps;
create policy "Users can update own roadmaps"
  on public.career_roadmaps for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own roadmaps" on public.career_roadmaps;
create policy "Users can delete own roadmaps"
  on public.career_roadmaps for delete using (auth.uid() = user_id);

-- 5. Saved Communication Drafts (Feature 4 Cover Letter & Email Studio)
create table if not exists public.communication_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  journey_id uuid references public.career_journeys(id) on delete set null,
  category text not null,
  title text not null,
  content text not null,
  tone text not null default 'professional',
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_communication_drafts_user_id on public.communication_drafts(user_id);

alter table public.communication_drafts enable row level security;

drop policy if exists "Users can read own drafts" on public.communication_drafts;
create policy "Users can read own drafts"
  on public.communication_drafts for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own drafts" on public.communication_drafts;
create policy "Users can insert own drafts"
  on public.communication_drafts for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete own drafts" on public.communication_drafts;
create policy "Users can delete own drafts"
  on public.communication_drafts for delete using (auth.uid() = user_id);

-- 6. Portfolio Projects (Feature 6 Portfolio Builder)
create table if not exists public.portfolio_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  problem_statement text,
  technologies text[] not null default '{}',
  responsibilities text,
  results text,
  github_url text,
  demo_url text,
  readme_content text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_portfolio_projects_user_id on public.portfolio_projects(user_id);

alter table public.portfolio_projects enable row level security;

drop policy if exists "Users can read own portfolio projects" on public.portfolio_projects;
create policy "Users can read own portfolio projects"
  on public.portfolio_projects for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own portfolio projects" on public.portfolio_projects;
create policy "Users can insert own portfolio projects"
  on public.portfolio_projects for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own portfolio projects" on public.portfolio_projects;
create policy "Users can update own portfolio projects"
  on public.portfolio_projects for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own portfolio projects" on public.portfolio_projects;
create policy "Users can delete own portfolio projects"
  on public.portfolio_projects for delete using (auth.uid() = user_id);

-- 7. Resume Versions & History (Feature 8 Version Intelligence)
create table if not exists public.resume_versions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  resume_id uuid references public.resumes(id) on delete cascade,
  journey_id uuid references public.career_journeys(id) on delete set null,
  version_name text not null,
  target_role text,
  resume_data jsonb not null,
  changes_summary text,
  created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_resume_versions_user_id on public.resume_versions(user_id);

alter table public.resume_versions enable row level security;

drop policy if exists "Users can read own resume versions" on public.resume_versions;
create policy "Users can read own resume versions"
  on public.resume_versions for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own resume versions" on public.resume_versions;
create policy "Users can insert own resume versions"
  on public.resume_versions for insert with check (auth.uid() = user_id);

drop policy if exists "Users can delete own resume versions" on public.resume_versions;
create policy "Users can delete own resume versions"
  on public.resume_versions for delete using (auth.uid() = user_id);

