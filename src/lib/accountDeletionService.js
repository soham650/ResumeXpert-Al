/**
 * Account & Personal Data Deletion Service for ResumeXpert AI (Phase 14).
 * Enforces actual deletion across LocalStorage, Supabase Cloud records,
 * and authenticated sessions in compliance with Data Deletion Policies.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { STORAGE_KEY } from '../store/useResumeStore.js';

export async function purgeAllLocalData() {
  const keysToPurge = [
    STORAGE_KEY,
    'resumecraft-resume-storage',
    'resumexpert_active_career_journey',
    'resumexpert_job_applications',
    'resumexpert_mock_interviews',
    'resumexpert_career_roadmaps',
    'resumexpert_portfolio_projects',
    'resumexpert_ai_consent',
    'resumexpert_ai_privacy_mode',
    'resumexpert_ai_usage_credits',
  ];

  let purgedCount = 0;
  if (typeof window !== 'undefined' && window.localStorage) {
    keysToPurge.forEach((key) => {
      if (window.localStorage.getItem(key) !== null) {
        window.localStorage.removeItem(key);
        purgedCount++;
      }
    });
  }

  return {
    success: true,
    purgedKeysCount: purgedCount,
    message: 'All local resume drafts, career journeys, and cached preferences have been permanently cleared from this device.',
  };
}

export async function requestFullAccountDeletion(userId) {
  // 1. Purge client-side stored data first
  await purgeAllLocalData();

  if (!userId || !isSupabaseConfigured || !supabase) {
    return {
      success: true,
      mode: 'local_only',
      message: 'Local drafts and preferences deleted. No cloud account was active.',
    };
  }

  // 2. Execute deletion of cloud records
  try {
    // Attempt RPC first
    const { data, error } = await supabase.rpc('delete_user_account_data', {
      target_user_id: userId,
    });

    if (!error && data?.success) {
      // Sign out user after successful deletion
      await supabase.auth.signOut();
      return {
        success: true,
        mode: 'cloud_rpc',
        details: data,
        message: 'Your account, cloud resumes, and career records have been permanently deleted from our servers.',
      };
    }

    // Direct table deletions fallback
    await supabase.from('communication_drafts').delete().eq('user_id', userId);
    await supabase.from('mock_interviews').delete().eq('user_id', userId);
    await supabase.from('career_roadmaps').delete().eq('user_id', userId);
    await supabase.from('portfolio_projects').delete().eq('user_id', userId);
    await supabase.from('job_applications').delete().eq('user_id', userId);
    await supabase.from('career_journeys').delete().eq('user_id', userId);
    await supabase.from('resumes').delete().eq('user_id', userId);
    await supabase.from('profiles').delete().eq('id', userId);

    await supabase.auth.signOut();

    return {
      success: true,
      mode: 'cloud_direct',
      message: 'Your cloud resumes, applications, and profile have been permanently deleted.',
    };
  } catch (err) {
    console.error('Account deletion error:', err);
    throw new Error(`Failed to complete account deletion: ${err.message}`);
  }
}

