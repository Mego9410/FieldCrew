/**
 * Short links for worker invite and job SMS. Stores code → path and provides redirect lookup.
 */

const SHORT_CODE_LENGTH = 8;
const ALPHABET = "abcdefghijklmnopqrstuvwxyz0123456789";

function randomShortCode(): string {
  const bytes = new Uint8Array(SHORT_CODE_LENGTH);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  }
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

/**
 * Create a short link for the given path. Returns the short code (e.g. "a1b2c3d4").
 * Path should be relative, e.g. "/w/abc123.../jobs/jobId".
 * Accepts any Supabase client (server or service role).
 */
export async function createShortLink(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  targetPath: string
): Promise<string> {
  const path = targetPath.startsWith("/") ? targetPath : `/${targetPath}`;
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomShortCode();
    const { error } = await supabase.from("short_links").insert({
      code,
      target_path: path,
    });
    if (!error) return code;
    if (error.code !== "23505") throw error; // 23505 = unique violation, retry with new code
  }
  throw new Error("Failed to generate unique short code");
}

/**
 * Resolve a short code to the target path for redirect. Returns null if not found.
 */
export async function getShortLinkTarget(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  code: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("short_links")
    .select("target_path")
    .eq("code", code.toLowerCase())
    .single();
  if (error || !data?.target_path) return null;
  return data.target_path as string;
}
