export function skillSlug(value = "") {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

// Wrap any ALL-CAPS word or sequence of ALL-CAPS words in <strong> tags.
// Matches words with 2+ uppercase letters/digits and sequences like "CHRONO ASSERT".
export function formatAllCapsToBold(str = "") {
  // Escape HTML special characters to avoid injecting invalid HTML via dangerouslySetInnerHTML
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  const re = /\b([A-Z][A-Z0-9]{1,}(?:\s+[A-Z][A-Z0-9]{1,})*)\b/g;
  const escaped = escapeHtml(str);
  return escaped.replace(re, (m) => `<strong>${m}</strong>`);
}
