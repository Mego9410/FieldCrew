import { createServiceRoleClient } from "@/lib/supabase/server";
import { adminInsertAuditLog } from "@/lib/admin/db";

export type AdminAuditEvent = {
  actorUserId: string;
  actorEmail: string;
  action: string;
  targetCompanyId?: string | null;
  targetUserId?: string | null;
  metadata?: Record<string, unknown> | null;
};

export async function writeAdminAuditLog(event: AdminAuditEvent) {
  const supabase = createServiceRoleClient();
  if (!supabase) return;

  try {
    await adminInsertAuditLog(supabase, {
      id: crypto.randomUUID(),
      actor_user_id: event.actorUserId,
      actor_email: event.actorEmail,
      action: event.action,
      target_company_id: event.targetCompanyId ?? null,
      target_user_id: event.targetUserId ?? null,
      metadata: event.metadata ?? {},
    });
  } catch {
    // If the table doesn't exist yet (migrations not applied), don't block admin ops.
  }
}

