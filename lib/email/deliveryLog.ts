import type { createServiceRoleClient } from "@/lib/supabase/server";

type SupabaseLike = NonNullable<ReturnType<typeof createServiceRoleClient>>;

type UntypedFrom = {
  from: (table: "email_delivery_log") => {
    select: (cols: string) => unknown;
    insert: (values: Record<string, unknown>) => Promise<{ error?: { message?: string } | null }>;
  };
};

type EmailLogSelectChain = {
  eq: (col: string, v: unknown) => EmailLogSelectChain;
  maybeSingle: () => Promise<{ data: unknown }>;
};

export async function wasEmailSent(args: {
  supabase: SupabaseLike;
  provider: string;
  providerEventId: string | null;
  templateAlias: string;
  recipientEmail: string;
}): Promise<boolean> {
  if (!args.providerEventId) return false;
  const untyped = args.supabase as unknown as UntypedFrom;
  const query = untyped.from("email_delivery_log").select("id") as EmailLogSelectChain;
  const { data } = await query
    .eq("provider", args.provider)
    .eq("provider_event_id", args.providerEventId)
    .eq("template_alias", args.templateAlias)
    .eq("recipient_email", args.recipientEmail)
    .maybeSingle();

  return Boolean((data as { id?: string } | null)?.id);
}

export async function logEmailSent(args: {
  supabase: SupabaseLike;
  provider: string;
  providerEventId: string | null;
  templateAlias: string;
  companyId: string | null;
  recipientEmail: string;
  metadata?: Record<string, unknown>;
}) {
  const untyped = args.supabase as unknown as UntypedFrom;
  await untyped.from("email_delivery_log").insert({
    provider: args.provider,
    provider_event_id: args.providerEventId,
    template_alias: args.templateAlias,
    company_id: args.companyId,
    recipient_email: args.recipientEmail,
    metadata: args.metadata ?? null,
  });
}

