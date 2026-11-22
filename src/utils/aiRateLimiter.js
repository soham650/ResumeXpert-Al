/**
 * Client-Side AI Rate Limiter & Credit Tracker.
 * Manages daily quota allocation (25 AI actions/day) and request cooldowns.
 */

const QUOTA_STORAGE_KEY = 'resumexpert_ai_daily_quota';
const DAILY_LIMIT = 25;

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

export function getAiQuota() {
  try {
    const raw = localStorage.getItem(QUOTA_STORAGE_KEY);
    const today = getTodayString();

    if (!raw) {
      const initial = { date: today, used: 0, limit: DAILY_LIMIT };
      localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(initial));
      return { used: 0, remaining: DAILY_LIMIT, limit: DAILY_LIMIT, allowed: true };
    }

    const parsed = JSON.parse(raw);
    if (parsed.date !== today) {
      // New day, reset quota
      const resetQuota = { date: today, used: 0, limit: DAILY_LIMIT };
      localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(resetQuota));
      return { used: 0, remaining: DAILY_LIMIT, limit: DAILY_LIMIT, allowed: true };
    }

    const used = Number(parsed.used) || 0;
    const remaining = Math.max(0, DAILY_LIMIT - used);
    return {
      used,
      remaining,
      limit: DAILY_LIMIT,
      allowed: remaining > 0
    };
  } catch {
    return { used: 0, remaining: DAILY_LIMIT, limit: DAILY_LIMIT, allowed: true };
  }
}

export function consumeAiCredit() {
  const quota = getAiQuota();
  if (!quota.allowed) {
    return { success: false, remaining: 0, message: 'Daily AI credit limit reached. Credits reset tomorrow.' };
  }

  const today = getTodayString();
  const nextUsed = quota.used + 1;
  const updated = { date: today, used: nextUsed, limit: DAILY_LIMIT };
  localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify(updated));

  return {
    success: true,
    remaining: Math.max(0, DAILY_LIMIT - nextUsed),
    used: nextUsed
  };
}

export function resetAiQuota() {
  const today = getTodayString();
  localStorage.setItem(QUOTA_STORAGE_KEY, JSON.stringify({ date: today, used: 0, limit: DAILY_LIMIT }));
}

