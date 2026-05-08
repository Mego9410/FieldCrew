import { NextResponse } from "next/server";
import { requireAdminOrResponse } from "@/lib/admin/requireAdmin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { writeAdminAuditLog } from "@/lib/admin/audit";
import { sendOpsAlert, sendUserMagicLinkEmail } from "@/lib/email/notifications";

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
  const redirectTo = `${origin}/auth/finish?next=/app`;

  const { data: link, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo },
  });

  if (error || !link?.properties?.action_link) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to generate link" },
      { status: 500 }
    );
  }

  let emailed = false;
  let emailError: string | null = null;
  try {
    await sendUserMagicLinkEmail({
      to: email,
      email,
      requestedBy: adminGate.admin.email,
      magicLink: link.properties.action_link,
    });
    emailed = true;
  } catch (e) {
    emailError = e instanceof Error ? e.message : "Failed to send email";
    try {
      await sendOpsAlert({
        title: "Magic link email failed",
        message: "Failed to send a magic link email from admin action.",
        details: { userId, email, error: emailError },
      });
    } catch {}
  }

  await writeAdminAuditLog({
    actorUserId: adminGate.admin.userId,
    actorEmail: adminGate.admin.email,
    action: "user.send_magic_link",
    targetUserId: userId,
    metadata: { redirectTo, emailed },
  });

  return NextResponse.json({ ok: true, emailed, ...(emailError ? { emailError } : {}) });
}

