import { NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getCompanyForCurrentUser } from "@/lib/data";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { confirmEmail?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const confirmEmail = (body.confirmEmail ?? "").trim().toLowerCase();
  if (!confirmEmail || confirmEmail !== user.email.trim().toLowerCase()) {
    return NextResponse.json(
      { error: "Confirmation email mismatch" },
      { status: 400 }
    );
  }

  const company = await getCompanyForCurrentUser(supabase);
  if (!company) {
    return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }

  const service = createServiceRoleClient();
  if (!service) {
    return NextResponse.json(
      { error: "Service role not configured" },
      { status: 503 }
    );
  }

  // V1: soft-delete the account. (Hard delete can be added later with a queued job.)
  type UntypedUpdate = {
    update: (values: Record<string, unknown>) => {
      eq: (column: string, value: string) => Promise<{ error?: { message?: string } | null }>;
    };
  };
  const companiesTable = (
    service as unknown as { from: (t: "companies") => UntypedUpdate }
  ).from("companies");
  const { error } = await companiesTable
    .update({ account_status: "deleted" })
    .eq("id", company.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

