/** Canonical production site URL for SEO, sitemaps, RSS, and JSON-LD. */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.VERCEL_URL ||
  "https://getfieldcrew.com";

export function getSiteUrl(): string {
  return SITE_URL.startsWith("http") ? SITE_URL : `https://${SITE_URL}`;
}
