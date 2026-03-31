import { createBrowserClient, parse, serialize } from "@supabase/ssr";

/**
 * Supabase browser client for Client Components.
 * Uses NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.
 */
function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    ""
  );
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = getSupabaseAnonKey();
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
