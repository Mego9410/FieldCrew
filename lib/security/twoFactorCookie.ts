/**
 * Device-level 2FA cookie ("fc_2fa") binding.
 *
 * The cookie proves "this browser already passed the 2FA challenge for THIS
 * user". It is an HMAC over the user id so it cannot be forged and cannot be
 * reused by a different account on the same browser. Uses Web Crypto so it works
 * in both the Edge middleware runtime and Node route handlers.
 */

export const TWO_FACTOR_COOKIE = "fc_2fa";
export const TWO_FACTOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function getSecret(): string {
  return (
    process.env.TWO_FACTOR_COOKIE_SECRET ||
    process.env.TOTP_ENCRYPTION_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "fc-2fa-dev-fallback-secret"
  );
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Deterministic, unforgeable cookie value for a given user id. */
export async function twoFactorCookieValue(userId: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(`2fa:${userId}`));
  return toBase64Url(new Uint8Array(sig));
}

/** Timing-safe-ish comparison of the presented cookie against the expected value. */
export async function isValidTwoFactorCookie(
  userId: string,
  cookieValue: string | undefined | null
): Promise<boolean> {
  if (!cookieValue) return false;
  const expected = await twoFactorCookieValue(userId);
  if (expected.length !== cookieValue.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i += 1) {
    mismatch |= expected.charCodeAt(i) ^ cookieValue.charCodeAt(i);
  }
  return mismatch === 0;
}
