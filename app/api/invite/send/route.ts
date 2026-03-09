import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, getWorker, getWorkerInvitesByCompany, addWorkerInvite, updateWorkerInvite, updateWorker } from "@/lib/data";
import { createShortLink } from "@/lib/shortLink";
import { sendSms } from "@/lib/twilio";
import { NextResponse } from "next/server";

function generateToken(): string {
  const bytes = new Uint8Array(24);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  }
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
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
  let invite = invites.find((i) => i.workerId === body.workerId && new Date(i.expiresAt) > new Date());
  if (!invite) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 14);
    invite = await addWorkerInvite(
      {
        workerId: body.workerId,
        companyId: company.id,
        token: generateToken(),
        sentAt: null,
        acceptedAt: null,
        expiresAt: expiresAt.toISOString(),
        channel: "sms",
      },
      supabase
    );
  }

  const origin = request.headers.get("x-forwarded-host")
    ? `https://${request.headers.get("x-forwarded-host")}`
    : request.headers.get("origin") ?? "https://fieldcrew.app";
  const fullPath = `/w/${invite.token}`;
  const shortCode = await createShortLink(supabase, fullPath);
  const link = `${origin}/s/${shortCode}`;
  const message = `You're invited to FieldCrew. Open this link to get started: ${link}`;

  const sent = await sendSms(worker.phone, message);
  if (!sent) {
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 502 });
  }

  const now = new Date().toISOString();
  await updateWorkerInvite(invite.id, { sentAt: now }, supabase);
  await updateWorker(body.workerId, { inviteStatus: "sent" } as Parameters<typeof updateWorker>[1], supabase);

  return NextResponse.json({ ok: true, sentAt: now });
}
