import "server-only";
import type { SupabasePublicConfig } from "@/lib/supabase/env";

/**
 * Supabase URL + anon key for browser clients, read at request time on the server.
 * Use this in Server Components so production works even when NEXT_PUBLIC_* were
 * missing at build time (e.g. Vercel env added after the last deploy).
 */
export function getServerSupabasePublicConfig(): SupabasePublicConfig {
  return {
    url:
      process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
      process.env.NEXT_PUBLIC_SUPABASE_AUTH_URL?.trim() ||
      process.env.SUPABASE_URL?.trim() ||
      "",
    anonKey:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
      process.env.SUPABASE_ANON_KEY?.trim() ||
      "",
  };
}
