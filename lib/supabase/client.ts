"use client";

import { createBrowserClient, parse, serialize } from "@supabase/ssr";
import { resolveSupabaseConfig } from "@/lib/supabase/env";
import { getSupabaseRuntimeConfig } from "@/lib/supabase/runtime-config";

/**
 * Remove any leftover PKCE code-verifier cookies before starting a new OAuth flow.
 * A stale verifier (from an earlier interrupted/failed attempt) causes Supabase to
 * reject the exchange with "code challenge does not match previously saved code
 * verifier". Clearing first guarantees the new flow's verifier is the only one.
 */
export function clearStaleAuthCookies() {
  if (typeof document === "undefined") return;
  const cookies = document.cookie ? document.cookie.split(";") : [];
  for (const cookie of cookies) {
    const name = cookie.split("=")[0]?.trim();
    if (name && name.includes("code-verifier")) {
      document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
    }
  }
}

/**
 * Supabase browser client for Client Components.
 * Prefers runtime config from SupabaseConfigProvider (server env at request time).
 */
export function createClient() {
  const { url, anonKey: key } = resolveSupabaseConfig(getSupabaseRuntimeConfig());
  const isSecure =
    typeof window !== "undefined" && window.location?.protocol === "https:";
  return createBrowserClient(url, key, {
    cookies: {
      getAll() {
        if (typeof document === "undefined") return [];
        const parsed = parse(document.cookie ?? "") as Record<string, string>;
        return Object.keys(parsed).map((name) => ({
          name,
          value: parsed[name] ?? "",
        }));
      },
      setAll(cookiesToSet) {
        if (typeof document === "undefined") return;
        cookiesToSet.forEach(({ name, value, options }) => {
          document.cookie = serialize(name, value, { path: "/", ...options });
        });
      },
    },
    cookieOptions: { path: "/", sameSite: "lax", secure: isSecure },
  });
}
