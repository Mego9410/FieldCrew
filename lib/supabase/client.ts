"use client";

import { createBrowserClient, parse, serialize } from "@supabase/ssr";
import { resolveSupabaseConfig } from "@/lib/supabase/env";
import { getSupabaseRuntimeConfig } from "@/lib/supabase/runtime-config";

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
