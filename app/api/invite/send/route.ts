import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, getWorker, getWorkerInvitesByCompany, updateWorkerInvite, updateWorker } from "@/lib/data";
import { NextResponse } from "next/server";

/** Stub: in production wire to Twilio. See docs/ONBOARDING_SMS.md */
async function sendSmsStub(phone: string, message: string): Promise<boolean> {
  if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER) {
    const res = await fetch("https://api.twilio.com/2010-04-01/Accounts/" + process.env.TWILIO_ACCOUNT_SID + "/Messages.json", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: "Basic " + Buffer.from(process.env.TWILIO_ACCOUNT_SID + ":" + process.env.TWILIO_AUTH_TOKEN).toString("base64"),
      },
      body: new URLSearchParams({
        To: phone,
        From: process.env.TWILIO_PHONE_NUMBER,
        Body: message,
      }),
    });
    return res.ok;
  }
  console.log("[invite/send] Stub SMS:", { phone, message: message.slice(0, 60) + "..." });
  return true;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  let body: { workerId: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const worker = await getWorker(body.workerId, supabase);
  if (!worker || worker.companyId !== company.id) {
    return NextResponse.json({ error: "Worker not found" }, { status: 404 });
  }

  const invites = await getWorkerInvitesByCompany(company.id, supabase);
  const invite = invites.find((i) => i.workerId === body.workerId);
  if (!invite) {
    return NextResponse.json({ error: "Invite not found for this worker. Create tokens first." }, { status: 404 });
  }

  const origin = request.headers.get("x-forwarded-host")
    ? `https://${request.headers.get("x-forwarded-host")}`
    : request.headers.get("origin") ?? "https://fieldcrew.app";
  const link = `${origin}/w/${invite.token}`;
  const message = `You're invited to FieldCrew. Open this link to get started: ${link}`;

  const sent = await sendSmsStub(worker.phone, message);
  if (!sent) {
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 502 });
  }

  const now = new Date().toISOString();
  await updateWorkerInvite(invite.id, { sentAt: now }, supabase);
  await updateWorker(body.workerId, { inviteStatus: "sent" } as Parameters<typeof updateWorker>[1], supabase);

  return NextResponse.json({ ok: true, sentAt: now });
}
