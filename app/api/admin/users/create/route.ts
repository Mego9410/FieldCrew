import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { writeAdminAuditLog } from "@/lib/admin/audit";

const WORKER_LIMITS: Record<"starter" | "growth" | "pro", number> = {
  starter: 5,
  growth: 15,
  pro: 30,
};

function getAppOrigin() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  return raw.replace(/\/$/, "");
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

  let body: {
    companyName?: string;
    ownerName?: string;
    ownerEmail?: string;
    planId?: "starter" | "growth" | "pro";
    userPays?: boolean;
  } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const companyName = (body.companyName ?? "").trim();
  const ownerName = (body.ownerName ?? "").trim();
  const ownerEmail = (body.ownerEmail ?? "").trim().toLowerCase();
  const planId = body.planId ?? "starter";
  const userPays = body.userPays === true;
  const waiveFees = !userPays;

  if (!companyName || !ownerName || !ownerEmail) {
    return NextResponse.json(
      { error: "Missing companyName, ownerName, or ownerEmail" },
      { status: 400 }
    );
  }

  const workerLimit = WORKER_LIMITS[planId] ?? 5;

  // 1) Create auth user for owner.
  const password = crypto.randomUUID();
  const { data: created, error: createErr } = await supabase.auth.admin.createUser({
    email: ownerEmail,
    password,
    email_confirm: true,
    user_metadata: { name: ownerName },
    app_metadata: { role: "owner" },
  });

  if (createErr || !created?.user) {
    return NextResponse.json(
      { error: createErr?.message ?? "Failed to create owner user" },
      { status: 500 }
    );
  }

  const ownerUserId = created.user.id;
  const companyId = crypto.randomUUID();

  // 2) Create company + owner_users row.
  type UntypedInsert = {
    insert: (values: Record<string, unknown>) => Promise<{ error?: { message?: string } | null }>;
  };
  const companiesTable = (
    supabase as unknown as { from: (t: "companies") => UntypedInsert }
  ).from("companies");
  const { error: companyErr } = await companiesTable.insert({
    id: companyId,
    name: companyName,
    address: null,
    owner_user_id: ownerUserId,
    onboarding_status: "incomplete",
    worker_limit: workerLimit,
    subscription_status: waiveFees ? "active" : "inactive",
    account_status: "active",
    signup_at: new Date().toISOString(),
    settings: { billing: { comped: waiveFees } },
  });

  if (companyErr) {
    return NextResponse.json({ error: companyErr.message }, { status: 500 });
  }

  const ownerUsersTable = (
    supabase as unknown as { from: (t: "owner_users") => UntypedInsert }
  ).from("owner_users");
  const { error: ownerRowErr } = await ownerUsersTable.insert({
    id: ownerUserId,
    email: ownerEmail,
    name: ownerName,
    company_id: companyId,
  });

  if (ownerRowErr) {
    return NextResponse.json({ error: ownerRowErr.message }, { status: 500 });
  }

  // 3) Provide a magic link + a password setup link.
  const origin = getAppOrigin();
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent("/auth/post-login")}`;

  const { data: magic } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: ownerEmail,
    options: { redirectTo },
  });
  const { data: recovery } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email: ownerEmail,
    options: { redirectTo: `${origin}/login` },
  });

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: "user.create_owner_account",
    targetCompanyId: companyId,
    targetUserId: ownerUserId,
    metadata: { planId, workerLimit, userPays, waiveFees },
  });

  return NextResponse.json({
    ok: true,
    company: { id: companyId, name: companyName },
    owner: { id: ownerUserId, email: ownerEmail, name: ownerName },
    planId,
    userPays,
    magicLink: magic?.properties?.action_link ?? null,
    setPasswordLink: recovery?.properties?.action_link ?? null,
  });
}

