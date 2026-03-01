import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, getWorkers, addWorkerInvite } from "@/lib/data";
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

  let body: { workerIds?: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const workerIds = body.workerIds ?? [];
  const workers = await getWorkers(company.id, supabase);
  const toInvite = workers.filter((w) => workerIds.includes(w.id));
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 14);

  const created: { workerId: string; inviteId: string; token: string }[] = [];
  for (const w of toInvite) {
    const token = generateToken();
    const inv = await addWorkerInvite(
      {
        workerId: w.id,
        companyId: company.id,
        token,
        sentAt: null,
        acceptedAt: null,
        expiresAt: expiresAt.toISOString(),
        channel: "sms",
      },
      supabase
    );
    created.push({ workerId: w.id, inviteId: inv.id, token });
  }

  return NextResponse.json({ ok: true, invites: created });
}
