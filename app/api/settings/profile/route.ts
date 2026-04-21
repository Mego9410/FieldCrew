import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, getOwnerUserById, mergeCompanySettingsForDb, updateCompany, updateOwnerUser } from "@/lib/data";

function splitName(full: string): { firstName: string; lastName: string } {
  const trimmed = (full ?? "").trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(/\s+/);
  const firstName = parts[0] ?? "";
  const lastName = parts.slice(1).join(" ");
  return { firstName, lastName };
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const owner = await getOwnerUserById(user.id, supabase);
  if (!owner) return NextResponse.json({ error: "Owner not found" }, { status: 404 });
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const { firstName, lastName } = splitName(owner.name);
  return NextResponse.json({
    profile: {
      firstName,
      lastName,
      email: owner.email ?? "",
      phone: company.settings?.ownerPhone ?? "",
      timezone: company.settings?.ownerTimezone ?? "America/New_York",
      avatarUrl: company.settings?.ownerAvatarUrl ?? null,
    },
  });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const owner = await getOwnerUserById(user.id, supabase);
  if (!owner) return NextResponse.json({ error: "Owner not found" }, { status: 404 });
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  let body: {
    profile?: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
      timezone?: string;
      avatarUrl?: string | null;
    };
  } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const p = body.profile ?? {};
  const firstName = (p.firstName ?? "").trim();
  const lastName = (p.lastName ?? "").trim();
  const email = (p.email ?? "").trim().toLowerCase();
  const phone = (p.phone ?? "").trim();
  const timezone = (p.timezone ?? "").trim();
  const avatarUrl = p.avatarUrl ?? null;

  if (!firstName) return NextResponse.json({ error: "First name is required" }, { status: 400 });
  if (!lastName) return NextResponse.json({ error: "Last name is required" }, { status: 400 });
  if (!email || !isValidEmail(email)) return NextResponse.json({ error: "Valid email is required" }, { status: 400 });

  const fullName = `${firstName} ${lastName}`.trim();
  const updatedOwner = await updateOwnerUser(owner.id, { name: fullName, email }, supabase);
  if (!updatedOwner) return NextResponse.json({ error: "Failed to update owner" }, { status: 500 });

  const settings = mergeCompanySettingsForDb(company.settings, {
    ownerPhone: phone,
    ownerTimezone: timezone || company.settings?.ownerTimezone || "America/New_York",
    ownerAvatarUrl: avatarUrl,
  });
  const updatedCompany = await updateCompany(company.id, { settings }, supabase);
  if (!updatedCompany) return NextResponse.json({ error: "Failed to update company settings" }, { status: 500 });

  const split = splitName(updatedOwner.name);
  return NextResponse.json({
    ok: true,
    profile: {
      firstName: split.firstName,
      lastName: split.lastName,
      email: updatedOwner.email,
      phone: updatedCompany.settings?.ownerPhone ?? "",
      timezone: updatedCompany.settings?.ownerTimezone ?? "America/New_York",
      avatarUrl: updatedCompany.settings?.ownerAvatarUrl ?? null,
    },
  });
}

