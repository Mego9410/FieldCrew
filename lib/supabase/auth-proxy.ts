/**
 * Branded auth host (e.g. auth.getfieldcrew.com) on Vercel must proxy to the real
 * Supabase project URL — otherwise /auth/v1/authorize returns the app 404 page.
 */
export type AuthProxyConfig = {
  authHost: string;
  supabaseOrigin: string;
};

function trimOrigin(url: string) {
  return url.replace(/\/$/, "");
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
  return null;
}

export function getAuthProxyConfig(): AuthProxyConfig | null {
  const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  // #region agent log
  if (typeof fetch !== "undefined") {
    fetch("http://127.0.0.1:7645/ingest/a668a102-dde3-42a2-b40c-2c27cb853024", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Debug-Session-Id": "00297d",
      },
      body: JSON.stringify({
        sessionId: "00297d",
        runId: "pre-fix",
        hypothesisId: "H1",
        location: "lib/supabase/auth-proxy.ts:getAuthProxyConfig",
        message: "resolve proxy config",
        data: {
          hasPublicUrl: Boolean(publicUrl),
          publicHost: publicUrl ? new URL(publicUrl).hostname : null,
          projectOrigin: getSupabaseProjectOrigin(),
        },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
  }
  // #endregion
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
