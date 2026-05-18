const PLACEHOLDER_URL = "https://your-project.supabase.co";
const PLACEHOLDER_KEY = "your-anon-key";

export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

/** Build-time / bundled env (may be empty on production if vars were missing at build). */
export function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    ""
  );
}

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL ?? "";
}

export function resolveSupabaseConfig(
  runtime?: SupabasePublicConfig | null
): SupabasePublicConfig {
  return {
    url: runtime?.url?.trim() || getSupabaseUrl(),
    anonKey: runtime?.anonKey?.trim() || getSupabaseAnonKey(),
  };
}

function isValidSupabaseApiOrigin(url: string) {
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== "https:" || !hostname.includes(".")) return false;
    if (hostname === "your-project.supabase.co") return false;
    // Hosted project URL or Supabase Auth custom domain (e.g. auth.getfieldcrew.com).
    return hostname.endsWith(".supabase.co") || hostname.split(".").length >= 2;
  } catch {
    return false;
  }
}

export function isSupabaseConfigValid(config: SupabasePublicConfig) {
  const { url, anonKey } = config;
  if (!url || !anonKey) return false;
  if (url === PLACEHOLDER_URL || anonKey === PLACEHOLDER_KEY) return false;
  return isValidSupabaseApiOrigin(url);
}

export function isSupabaseConfigured(runtime?: SupabasePublicConfig | null) {
  return isSupabaseConfigValid(resolveSupabaseConfig(runtime));
}

export const SUPABASE_CONFIG_ERROR =
  "Sign-in is unavailable: Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your host (Vercel → Project → Settings → Environment Variables → Production), then redeploy.";

export function formatAuthError(
  message: string,
  runtime?: SupabasePublicConfig | null
) {
  if (message === "Failed to fetch") {
    return isSupabaseConfigured(runtime)
      ? "Could not reach Supabase. Check your connection, or ask an admin to verify production env vars and redeploy."
      : SUPABASE_CONFIG_ERROR;
  }
  return message;
}
