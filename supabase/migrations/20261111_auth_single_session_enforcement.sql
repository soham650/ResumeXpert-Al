-- ==============================================================
-- ResumeCraft Phase 15: Enterprise Single Active Session Enforcement
-- Migration: 20261111_auth_single_session_enforcement.sql
-- Description: Enforces strict single-device / single-session policy per user account
-- ==============================================================

-- 1. Create User Sessions Table
create table if not exists public.user_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  session_identifier_hash text not null,
  created_at timestamptz not null default timezone('utc'::text, now()),
  last_active_at timestamptz not null default timezone('utc'::text, now()),
  expires_at timestamptz not null default timezone('utc'::text, now() + interval '30 days'),
  revoked_at timestamptz,
  revocation_reason text,
  user_agent text,
  ip_address text
);

-- Performance & Lookup Indexes
create index if not exists idx_user_sessions_user_id on public.user_sessions(user_id);
create index if not exists idx_user_sessions_hash on public.user_sessions(session_identifier_hash);
create index if not exists idx_user_sessions_active on public.user_sessions(user_id) where revoked_at is null;

-- Enable Row Level Security (RLS)
alter table public.user_sessions enable row level security;

-- RLS Policy: Users can only read their own session records
drop policy if exists "Users can read own session metadata" on public.user_sessions;
create policy "Users can read own session metadata"
  on public.user_sessions
  for select
  using (auth.uid() = user_id);

-- Note: No direct INSERT/UPDATE/DELETE policy is granted to normal users.
-- All mutations must go through the SECURITY DEFINER stored procedures below to prevent client tampering.

-- 2. Stored Procedure: Register New Session & Revoke Previous Active Sessions Atomically
create or replace function public.register_user_session(
  p_session_identifier_hash text,
  p_user_agent text default null,
  p_ip_address text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
  v_revoked_count int := 0;
  v_new_session_id uuid;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    raise exception 'Unauthorized: Must be logged in to register a session.';
  end if;

  if p_session_identifier_hash is null or length(trim(p_session_identifier_hash)) < 16 then
    raise exception 'Invalid session identifier hash.';
  end if;

  -- 1. Atomically revoke all existing active sessions for this user account
  with revoked as (
    update public.user_sessions
    set revoked_at = timezone('utc'::text, now()),
        revocation_reason = 'new_login_on_another_device'
    where user_id = v_user_id
      and revoked_at is null
    returning id
  )
  select count(*) into v_revoked_count from revoked;

  -- 2. Insert the single new active session
  insert into public.user_sessions (
    user_id,
    session_identifier_hash,
    user_agent,
    ip_address,
    created_at,
    last_active_at,
    expires_at
  ) values (
    v_user_id,
    p_session_identifier_hash,
    p_user_agent,
    p_ip_address,
    timezone('utc'::text, now()),
    timezone('utc'::text, now()),
    timezone('utc'::text, now() + interval '30 days')
  )
  returning id into v_new_session_id;

  return jsonb_build_object(
    'success', true,
    'session_id', v_new_session_id,
    'previous_sessions_revoked', v_revoked_count,
    'registered_at', timezone('utc'::text, now())
  );
end;
$$;

-- 3. Stored Procedure: Validate Active Session
create or replace function public.validate_user_session(
  p_session_identifier_hash text
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
  v_session record;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return jsonb_build_object('valid', false, 'reason', 'unauthenticated');
  end if;

  select id, user_id, revoked_at, revocation_reason, expires_at
  into v_session
  from public.user_sessions
  where user_id = v_user_id
    and session_identifier_hash = p_session_identifier_hash
  order by created_at desc
  limit 1;

  if not found then
    return jsonb_build_object('valid', false, 'reason', 'session_not_found');
  end if;

  if v_session.revoked_at is not null then
    return jsonb_build_object(
      'valid', false,
      'reason', coalesce(v_session.revocation_reason, 'revoked'),
      'revoked_at', v_session.revoked_at
    );
  end if;

  if v_session.expires_at < timezone('utc'::text, now()) then
    return jsonb_build_object('valid', false, 'reason', 'session_expired');
  end if;

  -- Update heartbeat last active timestamp
  update public.user_sessions
  set last_active_at = timezone('utc'::text, now())
  where id = v_session.id;

  return jsonb_build_object('valid', true);
end;
$$;

-- 4. Stored Procedure: Revoke Specific Session on Logout
create or replace function public.revoke_user_session(
  p_session_identifier_hash text,
  p_reason text default 'user_logged_out'
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
  v_count int := 0;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return jsonb_build_object('success', false, 'error', 'unauthenticated');
  end if;

  with updated as (
    update public.user_sessions
    set revoked_at = timezone('utc'::text, now()),
        revocation_reason = p_reason
    where user_id = v_user_id
      and session_identifier_hash = p_session_identifier_hash
      and revoked_at is null
    returning id
  )
  select count(*) into v_count from updated;

  return jsonb_build_object('success', true, 'revoked_count', v_count);
end;
$$;

-- 5. Stored Procedure: Revoke All Sessions on Password Reset / Security Incident
create or replace function public.revoke_all_user_sessions(
  p_reason text default 'security_reset'
)
returns jsonb
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  v_user_id uuid;
  v_count int := 0;
begin
  v_user_id := auth.uid();
  if v_user_id is null then
    return jsonb_build_object('success', false, 'error', 'unauthenticated');
  end if;

  with updated as (
    update public.user_sessions
    set revoked_at = timezone('utc'::text, now()),
        revocation_reason = p_reason
    where user_id = v_user_id
      and revoked_at is null
    returning id
  )
  select count(*) into v_count from updated;

  return jsonb_build_object('success', true, 'revoked_count', v_count);
end;
$$;

-- Grant execution permissions to authenticated users
grant execute on function public.register_user_session(text, text, text) to authenticated;
grant execute on function public.validate_user_session(text) to authenticated;
grant execute on function public.revoke_user_session(text, text) to authenticated;
grant execute on function public.revoke_all_user_sessions(text) to authenticated;

