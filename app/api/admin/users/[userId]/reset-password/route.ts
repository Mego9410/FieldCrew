import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { writeAdminAuditLog } from "@/lib/admin/audit";
import { sendOpsAlert, sendPasswordRecoveryEmail } from "@/lib/email/notifications";

function getAppOrigin() {
  const raw =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  return raw.replace(/\/$/, "");
}

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ userId: string }> }
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

  const { userId } = await params;
  const { data } = await supabase.auth.admin.getUserById(userId);
  const email = data.user?.email ?? null;
  if (!email) {
    return NextResponse.json({ error: "User email not found" }, { status: 404 });
  }

  const origin = getAppOrigin();
  const redirectTo = `${origin}${routesResetPath()}`;

  const { data: link, error } = await supabase.auth.admin.generateLink({
    type: "recovery",
    email,
    options: { redirectTo },
  });

  if (error || !link?.properties?.action_link) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to generate recovery link" },
      { status: 500 }
    );
  }

  let emailed = false;
  let emailError: string | null = null;
  try {
    await sendPasswordRecoveryEmail({
      to: email,
      email,
      requestedBy: adminGate.admin.email,
      setPasswordLink: link.properties.action_link,
    });
    emailed = true;
  } catch (e) {
    emailError = e instanceof Error ? e.message : "Failed to send email";
    try {
      await sendOpsAlert({
        title: "Password recovery email failed",
        message: "Failed to send a password recovery email from admin action.",
        details: { userId, email, error: emailError },
      });
    } catch {}
  }

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: "user.reset_password_link",
    targetUserId: userId,
    metadata: { redirectTo, emailed },
  });

  return NextResponse.json({ ok: true, emailed, ...(emailError ? { emailError } : {}) });
}

function routesResetPath() {
  // Use /login as a safe landing point (no dedicated reset UI yet).
  return "/login";
}

