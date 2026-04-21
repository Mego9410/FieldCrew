import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { writeAdminAuditLog } from "@/lib/admin/audit";

function getAppOrigin() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  return normalizeOrigin(raw);
}

function getImpersonationOrigin() {
  const raw =
    process.env.IMPERSONATION_APP_URL ??
    process.env.NEXT_PUBLIC_IMPERSONATION_APP_URL ??
    "";
  return normalizeOrigin(raw);
}

function normalizeOrigin(raw: string) {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return "";
  const withScheme =
    trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? trimmed
      : `https://${trimmed}`;
  return withScheme.replace(/\/$/, "");
}

export async function POST(request: Request) {
  const adminGate = await requireAdminOrResponse();
  if (!adminGate.ok) return adminGate.response;

  const supabase = createServiceRoleClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Service role not configured" },
      { status: 503 }
    );
  }

  let body: { companyId?: string; ownerUserId?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const companyId = body.companyId?.trim();
  const ownerUserId = body.ownerUserId?.trim();
  if (!companyId && !ownerUserId) {
    return NextResponse.json(
      { error: "Missing companyId or ownerUserId" },
      { status: 400 }
    );
  }

  let ownerId = ownerUserId ?? "";
  if (!ownerId && companyId) {
    const { data: company } = await supabase
      .from("companies")
      .select("owner_user_id")
      .eq("id", companyId)
      .single();
    ownerId = (company as { owner_user_id?: string | null } | null)?.owner_user_id ?? "";
  }

  if (!ownerId) {
    return NextResponse.json(
      { error: "Company has no owner user" },
      { status: 400 }
    );
  }

  const { data: owner } = await supabase
    .from("owner_users")
    .select("id,email,company_id")
    .eq("id", ownerId)
    .single();

  const email = (owner as { email?: string | null } | null)?.email ?? "";
  const targetCompanyId =
    (owner as { company_id?: string | null } | null)?.company_id ?? companyId ?? null;

  if (!email) {
    return NextResponse.json(
      { error: "Owner email not found" },
      { status: 404 }
    );
  }

  const isolatedOrigin = getImpersonationOrigin();
  const origin = isolatedOrigin || getAppOrigin();
  const redirectTo = `${origin}/auth/finish?next=${encodeURIComponent("/app")}`;

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (error || !data?.properties?.action_link) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to generate link" },
      { status: 500 }
    );
  }

  let linkRedirectTo: string | null = null;
  try {
    const u = new URL(data.properties.action_link);
    const rt = u.searchParams.get("redirect_to");
    linkRedirectTo = rt ? decodeURIComponent(rt) : null;
  } catch {
    linkRedirectTo = null;
  }

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: "impersonate.magic_link_generated",
    targetCompanyId,
    targetUserId: ownerId,
    metadata: { redirectTo },
  });

  return NextResponse.json({
    url: data.properties.action_link,
    isolated: Boolean(isolatedOrigin),
    redirectTo,
    linkRedirectTo,
    target: { ownerUserId: ownerId, companyId: targetCompanyId, email },
  });
}

