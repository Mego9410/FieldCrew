import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSupabaseAnonKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    ""
  );
}

/**
 * Supabase server client for Server Components, Server Actions, and Route Handlers.
 * Create a new client per request; do not cache globally.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = getSupabaseAnonKey();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // setAll from Server Component; middleware will refresh sessions
        }
      },
    },
  });
}

/**
 * Service-role client (bypasses RLS). Use only in trusted server code, e.g. auth callback
 * when creating the initial company/owner_users rows for a new signup.
 * Returns null if SUPABASE_SERVICE_ROLE_KEY is not set.
 */
export function createServiceRoleClient(): ReturnType<typeof createSupabaseClient> | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  if (!url || !key) return null;
  return createSupabaseClient(url, key);
}
