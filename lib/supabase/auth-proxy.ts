/**
 * Branded auth host (e.g. auth.getfieldcrew.com) on Vercel must proxy to the real
 * Supabase project URL — otherwise /auth/v1/authorize returns the app 404 page.
 */
import { getSupabaseAnonKey } from "@/lib/supabase/env";

export type AuthProxyConfig = {
  authHost: string;
  supabaseOrigin: string;
};

function trimOrigin(url: string) {
  return url.replace(/\/$/, "");
}

/** Decode a Supabase legacy JWT key (anon/service) and return its project `ref` claim. */
function projectRefFromJwt(key: string): string | null {
  const parts = key.split(".");
  if (parts.length !== 3) return null;
  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof atob !== "undefined"
        ? atob(base64)
        : Buffer.from(base64, "base64").toString("utf8");
    const parsed = JSON.parse(json) as { ref?: unknown };
    return typeof parsed.ref === "string" && parsed.ref ? parsed.ref : null;
  } catch {
    return null;
  }
}

/** Real Supabase API origin (always *.supabase.co). */
export function getSupabaseProjectOrigin(): string | null {
  const candidates = [
    process.env.SUPABASE_PROJECT_URL,
    process.env.SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  ];
  for (const raw of candidates) {
    const value = raw?.trim();
    if (!value) continue;
    try {
      const { hostname, origin } = new URL(value);
      if (hostname.endsWith(".supabase.co")) return trimOrigin(origin);
    } catch {
      /* skip invalid */
    }
  }

  // Fallback: derive the project origin from the anon key JWT (its `ref` claim).
  // This keeps the branded-domain proxy working even when SUPABASE_PROJECT_URL
  // is not set, as long as a legacy JWT anon key is configured.
  const ref = projectRefFromJwt(getSupabaseAnonKey());
  if (ref) return `https://${ref}.supabase.co`;

  return null;
}

export function getAuthProxyConfig(): AuthProxyConfig | null {
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!publicUrl) return null;

  let publicHost: string;
  try {
    publicHost = new URL(publicUrl).hostname;
  } catch {
    return null;
  }

  if (publicHost.endsWith(".supabase.co")) return null;

  const supabaseOrigin = getSupabaseProjectOrigin();
  if (!supabaseOrigin) return null;

  return { authHost: publicHost, supabaseOrigin };
}
