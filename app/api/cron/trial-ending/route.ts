import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { getCompanies } from "@/lib/data";
import { getCompanyOwnerRecipient } from "@/lib/email/recipients";
import { logEmailSent, wasEmailSent } from "@/lib/email/deliveryLog";
import { sendBillingTrialEndingEmail } from "@/lib/email/notifications";

const CRON_SECRET = process.env.CRON_SECRET;
const stripeKey = process.env.STRIPE_SECRET_KEY;
const APP_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL ??
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://fieldcrew.app");

function authCron(request: Request) {
  const authHeader = request.headers.get("authorization");
  const secret = authHeader?.replace(/^Bearer\s+/i, "") ?? request.headers.get("x-cron-secret");
  return Boolean(CRON_SECRET && secret === CRON_SECRET);
}

export async function POST(request: Request) {
  if (!authCron(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!stripeKey) return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });

  const supabase = createServiceRoleClient();
  if (!supabase) return NextResponse.json({ error: "Service role not configured" }, { status: 503 });

  const stripe = new Stripe(stripeKey);
  const companies = await getCompanies(supabase);
  const now = Date.now();
  const daysThreshold = 3;

  let sent = 0;
  let skipped = 0;

  for (const company of companies) {
    const subId = company.stripeSubscriptionId ?? null;
    if (!subId) continue;

    let sub: Stripe.Subscription;
    try {
      sub = await stripe.subscriptions.retrieve(subId);
    } catch {
      skipped++;
      continue;
    }

    const trialEnd = sub.trial_end ? sub.trial_end * 1000 : null;
    if (!trialEnd) {
      skipped++;
      continue;
    }

    const msLeft = trialEnd - now;
    const daysLeft = Math.ceil(msLeft / (24 * 60 * 60 * 1000));
    if (daysLeft <= 0 || daysLeft > daysThreshold) {
      skipped++;
      continue;
    }

    const recipient = await getCompanyOwnerRecipient({ supabase, companyId: company.id });
    if (!recipient) {
      skipped++;
      continue;
    }

    const providerEventId = `trial-ending:${subId}:${new Date(trialEnd).toISOString().slice(0, 10)}`;
    const templateAlias = "fieldcrew-billing-trial-ending";
    const already = await wasEmailSent({
      supabase,
      provider: "cron",
      providerEventId,
      templateAlias,
      recipientEmail: recipient.email,
    });
    if (already) {
      skipped++;
      continue;
    }

    const billingPortalUrl = `${APP_ORIGIN.replace(/\/$/, "")}/app/settings/billing`;
    await sendBillingTrialEndingEmail({
      to: recipient.email,
      companyName: recipient.companyName ?? company.name,
      daysLeft,
      trialEndAt: new Date(trialEnd).toISOString(),
      billingPortalUrl,
    });

    await logEmailSent({
      supabase,
      provider: "cron",
      providerEventId,
      templateAlias,
      companyId: company.id,
      recipientEmail: recipient.email,
      metadata: { stripe_subscription_id: subId, trial_end: sub.trial_end },
    });

    sent++;
  }

  return NextResponse.json({ ok: true, sent, skipped, daysThreshold });
}

