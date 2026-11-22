-- ==============================================================
-- ResumeCraft Phase 9: Supabase Authentication & Cloud Resumes
-- Production-Ready Schema Migration with Row Level Security (RLS)
-- ==============================================================

-- 1. Create User Profiles Table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles RLS Policies (strictly owner-only)
drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

drop policy if exists "Users can insert own profile" on public.profiles;
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

-- 2. Create Cloud Resumes Table
create table if not exists public.resumes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled Resume',
  resume_data jsonb not null default '{}'::jsonb,
  template text not null default 'classic',
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now())
);

-- Indexes for performance
create index if not exists idx_resumes_user_id on public.resumes(user_id);
create index if not exists idx_resumes_updated_at on public.resumes(updated_at desc);

-- Enable RLS on resumes
alter table public.resumes enable row level security;

-- Resumes RLS Policies (strictly owner-only)
drop policy if exists "Users can read own resumes" on public.resumes;
create policy "Users can read own resumes"
  on public.resumes
  for select
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own resumes" on public.resumes;
create policy "Users can insert own resumes"
  on public.resumes
  for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own resumes" on public.resumes;
create policy "Users can update own resumes"
  on public.resumes
  for update
  using (auth.uid() = user_id);

drop policy if exists "Users can delete own resumes" on public.resumes;
create policy "Users can delete own resumes"
  on public.resumes
  for delete
  using (auth.uid() = user_id);

-- 3. Automatic User Profile Trigger
-- Automatically creates a profile record when a new user signs up in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, email, created_at, updated_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email,
    now(),
    now()
  )
  on conflict (id) do update
  set email = excluded.email,
      full_name = coalesce(excluded.full_name, public.profiles.full_name),
      updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 4. Automatic Timestamp Updater
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_resumes_updated_at on public.resumes;
create trigger set_resumes_updated_at
  before update on public.resumes
  for each row execute procedure public.handle_updated_at();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

