/**
 * Safe HTML Sanitizer for Rich Text & Article Content
 * Removes dangerous tags, event handlers (onclick, onerror, etc), and javascript: URIs.
 */

const DANGEROUS_TAGS_REGEX =
  /<\s*\/?\s*(script|iframe|object|embed|form|input|button|style|link|meta|base|applet|svg|math)[^>]*>/gi;
const ON_EVENT_ATTRIBUTES_REGEX =
  /\s+on[a-z]+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi;
const JAVASCRIPT_PROTOCOL_REGEX =
  /\s+(href|src)\s*=\s*['"]\s*javascript:[^'"]*['"]/gi;
const DATA_HTML_PROTOCOL_REGEX =
  /\s+(href|src)\s*=\s*['"]\s*data:text\/html[^'"]*['"]/gi;

export function sanitizeHtml(html?: string | null): string {
  if (!html) return "";

  let clean = String(html);

  // 1. Strip dangerous tags
  clean = clean.replace(DANGEROUS_TAGS_REGEX, "");

  // 2. Strip event handlers (onload, onclick, onerror, onmouseover, etc.)
  clean = clean.replace(ON_EVENT_ATTRIBUTES_REGEX, "");

  // 3. Strip javascript: and dangerous data: URIs in href/src
  clean = clean.replace(JAVASCRIPT_PROTOCOL_REGEX, "");
  clean = clean.replace(DATA_HTML_PROTOCOL_REGEX, "");

  return clean;
}
