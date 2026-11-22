import { supabase, isSupabaseConfigured } from './supabaseClient.js';
import { createDefaultResume } from '../store/useResumeStore.js';

/**
 * Standardized response envelope.
 */
const successResponse = (data) => ({ success: true, data, error: null });
const errorResponse = (errorMessage, originalError = null) => {
  if (originalError && process.env.NODE_ENV !== 'test') {
    console.warn(`[resumeCloudService] ${errorMessage}:`, originalError);
  }
  return { success: false, data: null, error: errorMessage };
};

/**
 * Fetch all resumes belonging to the authenticated user.
 */
export const fetchUserResumes = async (userId) => {
  if (!isSupabaseConfigured) {
    return errorResponse('Supabase is not configured.');
  }
  if (!userId) {
    return errorResponse('User ID is required to fetch resumes.');
  }

  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('id, user_id, title, template, created_at, updated_at, resume_data')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    const normalized = (data || []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title || 'Untitled Resume',
      template: row.template || 'classic',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      resumeData: createDefaultResume(row.resume_data || {}),
    }));

    return successResponse(normalized);
  } catch (err) {
    return errorResponse(err.message || 'Failed to fetch resumes from cloud.', err);
  }
};

/**
 * Fetch a single resume by its unique ID.
 */
export const fetchResumeById = async (resumeId) => {
  if (!isSupabaseConfigured) {
    return errorResponse('Supabase is not configured.');
  }
  if (!resumeId) {
    return errorResponse('Resume ID is required.');
  }

  try {
    const { data, error } = await supabase
      .from('resumes')
      .select('id, user_id, title, template, created_at, updated_at, resume_data')
      .eq('id', resumeId)
      .single();

    if (error) throw error;
    if (!data) return errorResponse('Resume not found.');

    const formatted = {
      id: data.id,
      userId: data.user_id,
      title: data.title || 'Untitled Resume',
      template: data.template || 'classic',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      resumeData: createDefaultResume(data.resume_data || {}),
    };

    return successResponse(formatted);
  } catch (err) {
    return errorResponse(err.message || 'Failed to fetch resume.', err);
  }
};

/**
 * Create a new resume in the cloud.
 */
export const createCloudResume = async ({ userId, title = 'Untitled Resume', resumeData = {}, template = 'classic' }) => {
  if (!isSupabaseConfigured) {
    return errorResponse('Supabase is not configured.');
  }
  if (!userId) {
    return errorResponse('User ID is required to create a resume.');
  }

  try {
    const normalizedData = createDefaultResume(resumeData);
    const safeTitle = (typeof title === 'string' && title.trim()) ? title.trim() : 'Untitled Resume';

    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: userId,
        title: safeTitle,
        resume_data: normalizedData,
        template: template || 'classic',
      })
      .select('id, user_id, title, template, created_at, updated_at, resume_data')
      .single();

    if (error) throw error;

    return successResponse({
      id: data.id,
      userId: data.user_id,
      title: data.title,
      template: data.template,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      resumeData: createDefaultResume(data.resume_data),
    });
  } catch (err) {
    return errorResponse(err.message || 'Failed to create resume in cloud.', err);
  }
};

/**
 * Update an existing cloud resume.
 */
export const updateCloudResume = async (resumeId, { title, resumeData, template }) => {
  if (!isSupabaseConfigured) {
    return errorResponse('Supabase is not configured.');
  }
  if (!resumeId) {
    return errorResponse('Resume ID is required to update.');
  }

  try {
    const updates = {
      updated_at: new Date().toISOString(),
    };

    if (title && typeof title === 'string') {
      updates.title = title.trim();
    }
    if (template && typeof template === 'string') {
      updates.template = template;
    }
    if (resumeData && typeof resumeData === 'object') {
      updates.resume_data = createDefaultResume(resumeData);
    }

    const { data, error } = await supabase
      .from('resumes')
      .update(updates)
      .eq('id', resumeId)
      .select('id, user_id, title, template, created_at, updated_at, resume_data')
      .single();

    if (error) throw error;

    return successResponse({
      id: data.id,
      userId: data.user_id,
      title: data.title,
      template: data.template,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      resumeData: createDefaultResume(data.resume_data),
    });
  } catch (err) {
    return errorResponse(err.message || 'Failed to update resume in cloud.', err);
  }
};

/**
 * Rename a cloud resume.
 */
export const renameCloudResume = async (resumeId, newTitle) => {
  const safeTitle = (typeof newTitle === 'string' && newTitle.trim()) ? newTitle.trim() : 'Untitled Resume';
  return await updateCloudResume(resumeId, { title: safeTitle });
};

/**
 * Duplicate an existing cloud resume.
 */
export const duplicateCloudResume = async (resumeId, userId) => {
  const existingResult = await fetchResumeById(resumeId);
  if (!existingResult.success || !existingResult.data) {
    return errorResponse(existingResult.error || 'Failed to find resume to duplicate.');
  }

  const existing = existingResult.data;
  const newTitle = `${existing.title} (Copy)`;

  return await createCloudResume({
    userId,
    title: newTitle,
    resumeData: existing.resumeData,
    template: existing.template,
  });
};

/**
 * Delete a cloud resume.
 */
export const deleteCloudResume = async (resumeId) => {
  if (!isSupabaseConfigured) {
    return errorResponse('Supabase is not configured.');
  }
  if (!resumeId) {
    return errorResponse('Resume ID is required for deletion.');
  }

  try {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', resumeId);

    if (error) throw error;
    return successResponse({ id: resumeId, deleted: true });
  } catch (err) {
    return errorResponse(err.message || 'Failed to delete resume.', err);
  }
};

