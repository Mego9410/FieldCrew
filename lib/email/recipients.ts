import type { createServiceRoleClient } from "@/lib/supabase/server";

type SupabaseLike = NonNullable<ReturnType<typeof createServiceRoleClient>>;

export async function getCompanyOwnerRecipient(args: {
  supabase: SupabaseLike;
  companyId: string;
}): Promise<{ email: string; ownerUserId: string | null; companyName: string | null } | null> {
  const { data: c } = await args.supabase
    .from("companies")
    .select("id,name,owner_user_id")
    .eq("id", args.companyId)
    .maybeSingle();

  const companyName = (c as { name?: string } | null)?.name ?? null;
  const ownerUserId = (c as { owner_user_id?: string | null } | null)?.owner_user_id ?? null;
  if (!ownerUserId) return null;

  const { data: ou } = await args.supabase
    .from("owner_users")
    .select("id,email")
    .eq("id", ownerUserId)
    .maybeSingle();

  const email = (ou as { email?: string } | null)?.email?.trim() ?? "";
  if (!email) return null;

  return { email, ownerUserId, companyName };
}

