export const DEFAULT_MESSAGE =
  "Another year of you — and the world is lighter for it. I hope today hands you every small joy you didn't even know to wish for, and that this next year surprises you in all the best ways. Happy birthday! 🎂✨";

export function unescapeHtml(str) {
  return String(str || "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

export function sanitize(str, max = 600) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .slice(0, max);
}

export function slugify(name) {
  return (
    (name || "friend")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 20) || "friend"
  );
}

export function generateId(len = 8) {
  const chars = "abcdefghjkmnpqrstuvwxyz23456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

// A slug in a link looks like "priyanka-a1b2c3d4" — the id is always the
// last hyphen-delimited segment, so parsing back out is unambiguous.
export function idFromSlugParam(slugParam) {
  const parts = String(slugParam).split("-");
  return parts[parts.length - 1];
}
