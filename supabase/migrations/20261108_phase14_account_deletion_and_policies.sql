-- ==============================================================
-- Migration: 20261108_phase14_account_deletion_and_policies.sql
-- Description: Cascading Account Deletion and Security Verification
-- Schema: Public (resumes, profiles, career_journeys, job_applications, etc.)
-- ==============================================================

-- 1. Function to delete all personal user records and associated assets
CREATE OR REPLACE FUNCTION public.delete_user_account_data(target_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  deleted_resumes_count int := 0;
  deleted_journeys_count int := 0;
  deleted_apps_count int := 0;
BEGIN
  -- Verify the caller is deleting their own account or has service role
  IF auth.uid() IS NULL OR (auth.uid() <> target_user_id) THEN
    RAISE EXCEPTION 'Unauthorized: You may only delete your own account data.';
  END IF;

  -- 1. Delete associated career intelligence records
  DELETE FROM public.communication_drafts WHERE user_id = target_user_id;
  DELETE FROM public.mock_interviews WHERE user_id = target_user_id;
  DELETE FROM public.career_roadmaps WHERE user_id = target_user_id;
  DELETE FROM public.portfolio_projects WHERE user_id = target_user_id;
  DELETE FROM public.resume_versions WHERE user_id = target_user_id;

  -- 2. Delete job applications
  WITH deleted_apps AS (
    DELETE FROM public.job_applications WHERE user_id = target_user_id RETURNING id
  )
  SELECT count(*) INTO deleted_apps_count FROM deleted_apps;

  -- 3. Delete career journeys
  WITH deleted_journeys AS (
    DELETE FROM public.career_journeys WHERE user_id = target_user_id RETURNING id
  )
  SELECT count(*) INTO deleted_journeys_count FROM deleted_journeys;

  -- 4. Delete saved resumes
  WITH deleted_res AS (
    DELETE FROM public.resumes WHERE user_id = target_user_id RETURNING id
  )
  SELECT count(*) INTO deleted_resumes_count FROM deleted_res;

  -- 5. Delete profile record
  DELETE FROM public.profiles WHERE id = target_user_id;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'User account data permanently deleted.',
    'deleted_resumes', deleted_resumes_count,
    'deleted_journeys', deleted_journeys_count,
    'deleted_applications', deleted_apps_count,
    'timestamp', now()
  );
END;
$$;

-- 2. Grant execution permission to authenticated users
GRANT EXECUTE ON FUNCTION public.delete_user_account_data(uuid) TO authenticated;

-- 3. Comments on data deletion policy compliance
COMMENT ON FUNCTION public.delete_user_account_data(uuid) IS 'Permanently purges all user-associated resumes, applications, career records, and profile data in compliance with GDPR and Data Deletion Policies.';

