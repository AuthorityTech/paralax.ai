// No canonical essay yet for Christian
export const CANONICAL_ESSAY_SLUG: string | null = null;

export const MAX_SEARCH_TITLE_LENGTH = 70;

function cleanTitle(value: string | null | undefined): string {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function buildSearchTitle(value: string | null | undefined): string {
  const title = cleanTitle(value);
  if (title.length <= MAX_SEARCH_TITLE_LENGTH) return title;

  const clipped = title.slice(0, MAX_SEARCH_TITLE_LENGTH + 1);
  const lastSpace = clipped.lastIndexOf(" ");
  return clipped.slice(0, lastSpace > 48 ? lastSpace : MAX_SEARCH_TITLE_LENGTH).trim();
}
