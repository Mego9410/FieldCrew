import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser, mergeCompanySettingsForDb, updateCompany } from "@/lib/data";

function buildAddress(input: { street?: string; city?: string; state?: string; zip?: string }): string | null {
  const street = (input.street ?? "").trim();
  const city = (input.city ?? "").trim();
  const state = (input.state ?? "").trim();
  const zip = (input.zip ?? "").trim();
  const line2 = [city, state, zip].filter(Boolean).join(" ").trim();
  const out = [street, line2].filter(Boolean).join(", ").trim();
  return out || null;
}

function parseLegacyAddress(address: string | undefined): { street: string; city: string } {
  const addr = (address ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  return { street: addr[0] ?? "", city: addr[1] ?? "" };
}

export async function GET() {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const legacy = parseLegacyAddress(company.address);
  return NextResponse.json({
    company: {
      name: company.name ?? "",
      email: company.settings?.companyEmail ?? "",
      phone: company.settings?.companyPhone ?? "",
      street: company.settings?.companyStreet ?? legacy.street,
      city: company.settings?.companyCity ?? legacy.city,
      state: company.settings?.companyState ?? "",
      zip: company.settings?.companyZip ?? "",
      country: company.settings?.companyCountry ?? "US",
      taxId: company.settings?.companyTaxId ?? "",
      currency: company.settings?.companyCurrency ?? "USD",
      otDailyThreshold: company.settings?.otDailyThreshold ?? 8,
      otWeeklyThreshold: company.settings?.otWeeklyThreshold ?? 40,
      otMultiplier: company.settings?.otMultiplier ?? 1.5,
    },
  });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const company = await getCompanyForCurrentUser(supabase);
  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  let body: {
    company?: {
      name?: string;
      email?: string;
      phone?: string;
      street?: string;
      city?: string;
      state?: string;
      zip?: string;
      country?: string;
      taxId?: string;
      currency?: string;
      otDailyThreshold?: number;
      otWeeklyThreshold?: number;
      otMultiplier?: number;
    };
  } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const c = body.company ?? {};
  const name = (c.name ?? "").trim();
  if (!name) return NextResponse.json({ error: "Company name is required" }, { status: 400 });

  const otDailyThreshold = c.otDailyThreshold != null ? Number(c.otDailyThreshold) : undefined;
  const otWeeklyThreshold = c.otWeeklyThreshold != null ? Number(c.otWeeklyThreshold) : undefined;
  const otMultiplier = c.otMultiplier != null ? Number(c.otMultiplier) : undefined;
  if (otDailyThreshold !== undefined && (!Number.isFinite(otDailyThreshold) || otDailyThreshold < 0)) {
    return NextResponse.json({ error: "OT daily threshold must be ≥ 0" }, { status: 400 });
  }
  if (otWeeklyThreshold !== undefined && (!Number.isFinite(otWeeklyThreshold) || otWeeklyThreshold < 0)) {
    return NextResponse.json({ error: "OT weekly threshold must be ≥ 0" }, { status: 400 });
  }
  if (otMultiplier !== undefined && (!Number.isFinite(otMultiplier) || otMultiplier < 1)) {
    return NextResponse.json({ error: "OT multiplier must be ≥ 1" }, { status: 400 });
  }

  const settings = mergeCompanySettingsForDb(company.settings, {
    companyEmail: c.email?.trim() ?? "",
    companyPhone: c.phone?.trim() ?? "",
    companyStreet: c.street?.trim() ?? "",
    companyCity: c.city?.trim() ?? "",
    companyState: c.state?.trim() ?? "",
    companyZip: c.zip?.trim() ?? "",
    companyCountry: c.country?.trim() ?? "US",
    companyTaxId: c.taxId?.trim() ?? "",
    companyCurrency: c.currency?.trim() ?? "USD",
    otDailyThreshold: otDailyThreshold ?? company.settings?.otDailyThreshold ?? 8,
    otWeeklyThreshold: otWeeklyThreshold ?? company.settings?.otWeeklyThreshold ?? 40,
    otMultiplier: otMultiplier ?? company.settings?.otMultiplier ?? 1.5,
  });

  const address = buildAddress({
    street: c.street,
    city: c.city,
    state: c.state,
    zip: c.zip,
  });

  const updated = await updateCompany(company.id, { name, address: address ?? undefined, settings }, supabase);
  if (!updated) return NextResponse.json({ error: "Failed to update company" }, { status: 500 });

  return NextResponse.json({
    ok: true,
    company: {
      name: updated.name ?? "",
      email: updated.settings?.companyEmail ?? "",
      phone: updated.settings?.companyPhone ?? "",
      street: updated.settings?.companyStreet ?? "",
      city: updated.settings?.companyCity ?? "",
      state: updated.settings?.companyState ?? "",
      zip: updated.settings?.companyZip ?? "",
      country: updated.settings?.companyCountry ?? "US",
      taxId: updated.settings?.companyTaxId ?? "",
      currency: updated.settings?.companyCurrency ?? "USD",
      otDailyThreshold: updated.settings?.otDailyThreshold ?? 8,
      otWeeklyThreshold: updated.settings?.otWeeklyThreshold ?? 40,
      otMultiplier: updated.settings?.otMultiplier ?? 1.5,
    },
  });
}

