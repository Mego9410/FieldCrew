import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ companyId: string }> }
) {
  const adminGate = await requireAdminOrResponse();
  if (!adminGate.ok) return adminGate.response;

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service role not configured" },
      { status: 503 }
    );
  }

  const { companyId } = await params;

  // FieldCrew currently has a single auth user per company: the owner (owner_users.id = auth.users.id).
  const { data: ownerRow } = await supabase
    .from("owner_users")
    .select("id,email,name")
    .eq("company_id", companyId)
    .maybeSingle();

  const ownerId = (ownerRow as { id?: string } | null)?.id ?? null;
  const ownerAuth =
    ownerId ? await supabase.auth.admin.getUserById(ownerId) : null;

  const owner = ownerAuth?.data?.user
    ? {
        id: ownerAuth.data.user.id,
        email: ownerAuth.data.user.email ?? (ownerRow as { email?: string } | null)?.email ?? null,
        role:
          (ownerAuth.data.user.app_metadata as { role?: string } | undefined)
            ?.role ?? "owner",
        lastSignInAt: ownerAuth.data.user.last_sign_in_at ?? null,
        createdAt: ownerAuth.data.user.created_at ?? null,
      }
    : ownerRow
      ? {
          id: (ownerRow as { id: string }).id,
          email: (ownerRow as { email?: string | null }).email ?? null,
          role: "owner",
          lastSignInAt: null,
          createdAt: null,
        }
      : null;

  // Workers are not Supabase Auth users in FieldCrew (they use token links). Include them here for support visibility.
  const { data: workers } = await supabase
    .from("workers")
    .select("id,name,phone,role,invite_status")
    .eq("company_id", companyId)
    .order("name", { ascending: true });

  return NextResponse.json({
    users: owner ? [owner] : [],
    workers: (workers ?? []).map((w) => ({
      id: (w as { id: string }).id,
      name: (w as { name: string }).name,
      phone: (w as { phone?: string | null }).phone ?? null,
      role: (w as { role?: string | null }).role ?? "tech",
      inviteStatus: (w as { invite_status?: string | null }).invite_status ?? null,
    })),
  });
}

