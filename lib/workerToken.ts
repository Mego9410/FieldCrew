/**
 * Worker magic link token resolution.
 * When Supabase client is provided, looks up worker_invites by token and returns workerId if valid and not expired.
 * Without a client (e.g. tests), falls back to mock: any non-empty token except "invalid" is accepted.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { getWorkerInviteByToken } from "@/lib/data";

export type ResolveWorkerTokenResult =
  | { valid: true; workerId: string }
  | { valid: false };

/**
 * Resolves a worker magic link token.
 * @param token - The invite token from the URL (e.g. /w/:token).
 * @param supabase - Optional. When provided (e.g. in Server Components), validates against worker_invites and expiry.
 */
export async function resolveWorkerToken(
  token: string,
  supabase?: SupabaseClient
): Promise<ResolveWorkerTokenResult> {
  const trimmed = token?.trim() ?? "";
  if (trimmed.length === 0 || trimmed === "invalid") {
    return { valid: false };
  }

  if (supabase) {
    const invite = await getWorkerInviteByToken(trimmed, supabase);
    if (!invite) return { valid: false };
    const expiresAt = new Date(invite.expiresAt);
    if (expiresAt.getTime() < Date.now()) return { valid: false };
    return { valid: true, workerId: invite.workerId };
  }

  return { valid: true, workerId: trimmed };
}
