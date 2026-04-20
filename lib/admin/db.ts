import type { createServiceRoleClient } from "@/lib/supabase/server";

type ServiceRoleClient = NonNullable<ReturnType<typeof createServiceRoleClient>>;

type UntypedUpdate = {
  update: (values: Record<string, unknown>) => {
    eq: (column: string, value: string) => Promise<{ error?: { message?: string } | null }>;
  };
};

export async function adminUpdateCompany(
  supabase: ServiceRoleClient,
  companyId: string,
  values: Record<string, unknown>
) {
  const companiesTable = (
    supabase as unknown as { from: (t: "companies") => UntypedUpdate }
  ).from("companies");
  return companiesTable.update(values).eq("id", companyId);
}

type UntypedUpsert = {
  upsert: (
    values: Record<string, unknown>[],
    options?: { onConflict?: string }
  ) => Promise<{ error?: { message?: string } | null }>;
};

export async function adminUpsertCompanyUsageDaily(
  supabase: ServiceRoleClient,
  rows: Record<string, unknown>[]
) {
  const table = (
    supabase as unknown as { from: (t: "company_usage_daily") => UntypedUpsert }
  ).from("company_usage_daily");
  return table.upsert(rows, { onConflict: "company_id,day" });
}

type UntypedInsert = {
  insert: (values: Record<string, unknown>) => Promise<unknown>;
};

export async function adminInsertAuditLog(
  supabase: ServiceRoleClient,
  values: Record<string, unknown>
) {
  const table = (
    supabase as unknown as { from: (t: "admin_action_logs") => UntypedInsert }
  ).from("admin_action_logs");
  return table.insert(values);
}

