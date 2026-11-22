/**
 * Security and Sanitization Utilities for ResumeCraft
 * Prevents XSS, unsafe URL schemes (javascript:, data:, vbscript:),
 * and validates external resource protocols.
 */

// Permitted URL schemes for user-provided hyperlinks
const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:']);

/**
 * Validates and formats a user-provided URL safely.
 * Returns a safe string starting with http(s):// or mailto: / tel:,
 * or returns '' if the URL is dangerous or invalid.
 *
 * @param {string} url - User-provided URL or email/phone link
 * @returns {string} Sanitized safe URL string
 */
export function sanitizeSafeUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Block obvious dangerous protocols before parsing
  if (/^\s*(javascript|vbscript|data|file):/i.test(trimmed)) {
    return '';
  }

  try {
    // If it already has a protocol, check it
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) {
      const parsed = new URL(trimmed);
      if (SAFE_PROTOCOLS.has(parsed.protocol.toLowerCase())) {
        return parsed.href;
      }
      return '';
    }

    // Bare domain or path (e.g. "linkedin.com/in/user" or "github.com/user")
    // Safe fallback prepend https://
    const withScheme = `https://${trimmed}`;
    const parsed = new URL(withScheme);
    if (SAFE_PROTOCOLS.has(parsed.protocol.toLowerCase())) {
      return parsed.href;
    }
    return '';
  } catch {
    return '';
  }
}

/**
 * Checks whether a URL is safe to render as a clickable href.
 *
 * @param {string} url - Target URL
 * @returns {boolean} True if URL is strictly safe
 */
export function isSafeUrl(url) {
  return sanitizeSafeUrl(url).length > 0;
}

/**
 * Sanitizes plain text inputs by stripping non-printable control characters,
 * except standard whitespace (newlines, tabs).
 *
 * @param {string} text - Raw input text
 * @returns {string} Cleaned safe text
 */
export function sanitizePlainText(text) {
  if (!text || typeof text !== 'string') return '';
  // Remove control characters from \u0000 to \u001F (except \t, \n, \r) and \u007F
  return text.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '');
}

/**
 * Returns a human-friendly display label for a URL by stripping the protocol and trailing slashes.
 *
 * @param {string} url - Full URL
 * @returns {string} Clean display domain and path
 */
export function formatUrlForDisplay(url) {
  if (!url || typeof url !== 'string') return '';
  return url
    .replace(/^https?:\/\//i, '')
    .replace(/^mailto:/i, '')
    .replace(/^tel:/i, '')
    .replace(/\/$/, '');
}

