export type ResendTemplateVariable = {
  key: string;
  type: "string" | "number" | "boolean" | "object" | "list";
  fallback_value?: string | number | boolean | Record<string, unknown> | unknown[];
};

export type ResendTemplateDefinition = {
  alias: string;
  name: string;
  subject: string;
  html: string;
  text: string;
  variables: ResendTemplateVariable[];
};

function layoutEmail(args: { title: string; preheader?: string; body: string; cta?: { href: string; label: string } }) {
  const preheader = args.preheader
    ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;visibility:hidden;mso-hide:all;">${args.preheader}</div>`
    : "";

  const cta = args.cta
    ? `<div style="margin-top:18px;">
        <a href="${args.cta.href}" target="_blank" rel="noopener noreferrer"
           style="display:inline-block;background:#f97316;color:#0b1220;text-decoration:none;font-weight:700;
                  padding:12px 16px;border-radius:12px;letter-spacing:0.2px;">
          ${args.cta.label}
        </a>
      </div>`
    : "";

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="light" />
    <title>${args.title}</title>
  </head>
  <body style="margin:0;padding:0;background:#ffffff;">
    ${preheader}
    <div style="padding:28px 12px;background:#ffffff;">
      <div style="max-width:640px;margin:0 auto;">
        <div style="background:linear-gradient(135deg,#1e293b 0%,#0b1220 60%,#0b1220 100%);border:1px solid rgba(148,163,184,0.18);border-radius:18px;overflow:hidden;box-shadow:0 18px 50px rgba(15,23,42,0.18);">
          <div style="padding:18px 18px 14px 18px;">
            <div style="display:flex;align-items:center;gap:10px;">
              <div style="width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,#f97316 0%,#fb923c 100%);box-shadow:0 10px 30px rgba(249,115,22,0.25);"></div>
              <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;font-weight:800;font-size:16px;letter-spacing:0.2px;color:#e2e8f0;">
                FieldCrew
              </div>
            </div>
            <div style="margin-top:14px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;font-weight:800;font-size:20px;line-height:1.2;color:#f8fafc;">
              ${args.title}
            </div>
          </div>
          <div style="padding:0 18px 18px 18px;">
            <div style="background:#0f172a;border:1px solid rgba(148,163,184,0.16);border-radius:16px;padding:16px;">
              <div style="font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;font-size:14px;line-height:1.65;color:#e2e8f0;">
                ${args.body}
                ${cta}
              </div>
            </div>
            <div style="margin-top:14px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;font-size:12px;line-height:1.6;color:#94a3b8;">
              If you didn’t request this, you can ignore this email.
            </div>
            <div style="margin-top:10px;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;font-size:12px;line-height:1.6;color:#64748b;">
              © ${new Date().getFullYear()} FieldCrew
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

function pill(label: string) {
  return `<span style="display:inline-block;background:rgba(249,115,22,0.16);border:1px solid rgba(249,115,22,0.32);color:#fdba74;
    padding:3px 8px;border-radius:999px;font-size:12px;font-weight:700;letter-spacing:0.2px;">${label}</span>`;
}

function monoBlock(content: string) {
  return `<pre style="margin:12px 0 0 0;padding:12px;background:rgba(2,6,23,0.65);border:1px solid rgba(148,163,184,0.16);
    border-radius:14px;overflow:auto;font-size:12px;line-height:1.5;color:#e2e8f0;white-space:pre-wrap;word-break:break-word;">${content}</pre>`;
}

/**
 * FieldCrew Resend Templates
 *
 * Notes:
 * - Variables use Resend triple-stache: {{{KEY}}}
 * - `fallback_value` matches Resend API schema (snake_case).
 */
export const RESEND_TEMPLATES: ResendTemplateDefinition[] = [
  {
    alias: "fieldcrew-welcome-owner",
    name: "FieldCrew — Welcome Owner",
    subject: "Welcome to FieldCrew — set up your account",
    html: layoutEmail({
      title: "Welcome — set up your account",
      preheader: "Your FieldCrew account is ready. Sign in and set your password.",
      body: `
        <div style="margin-bottom:10px;">${pill("ACCOUNT")}</div>
        <div style="font-weight:700;font-size:15px;margin-bottom:6px;">Hi {{{OWNER_NAME}}},</div>
        <div>Your FieldCrew account for <strong>{{{COMPANY_NAME}}}</strong> is ready.</div>
        <div style="margin-top:14px;">
          <div style="font-weight:800;margin-bottom:6px;">1) Sign in</div>
          <div><a href="{{{MAGIC_LINK}}}" target="_blank" rel="noopener noreferrer" style="color:#93c5fd;text-decoration:none;font-weight:700;">Open your sign-in link</a></div>
        </div>
        <div style="margin-top:14px;">
          <div style="font-weight:800;margin-bottom:6px;">2) Set your password</div>
          <div><a href="{{{SET_PASSWORD_LINK}}}" target="_blank" rel="noopener noreferrer" style="color:#93c5fd;text-decoration:none;font-weight:700;">Set password</a></div>
        </div>
        ${monoBlock("Magic link: {{{MAGIC_LINK}}}\\nSet password: {{{SET_PASSWORD_LINK}}}")}
      `,
      cta: { href: "{{{MAGIC_LINK}}}", label: "Sign in to FieldCrew" },
    }),
    text: `Hi {{{OWNER_NAME}}},

Your FieldCrew account for {{{COMPANY_NAME}}} is ready.

1) Sign in (magic link)
{{{MAGIC_LINK}}}

2) Set your password
{{{SET_PASSWORD_LINK}}}

If you have any questions, reply to this email.`,
    variables: [
      { key: "OWNER_NAME", type: "string", fallback_value: "there" },
      { key: "COMPANY_NAME", type: "string", fallback_value: "your company" },
      { key: "MAGIC_LINK", type: "string", fallback_value: "https://fieldcrew.app" },
      { key: "SET_PASSWORD_LINK", type: "string", fallback_value: "https://fieldcrew.app" },
    ],
  },
  {
    alias: "fieldcrew-user-magic-link",
    name: "FieldCrew — User Magic Link",
    subject: "Your FieldCrew sign-in link",
    html: layoutEmail({
      title: "Your sign-in link",
      preheader: "Use this link to sign in to FieldCrew.",
      body: `
        <div style="margin-bottom:10px;">${pill("SECURITY")}</div>
        <div style="margin-bottom:8px;">
          You’ve been sent a sign-in link by <strong>{{{REQUESTED_BY}}}</strong>.
        </div>
        <div style="color:#cbd5e1;font-size:13px;">This link is for <strong>{{{USER_EMAIL}}}</strong>.</div>
        ${monoBlock("Sign-in link: {{{MAGIC_LINK}}}")}
      `,
      cta: { href: "{{{MAGIC_LINK}}}", label: "Sign in" },
    }),
    text: `You’ve been sent a FieldCrew sign-in link by {{{REQUESTED_BY}}}.

Sign in:
{{{MAGIC_LINK}}}

This link is for {{{USER_EMAIL}}}.`,
    variables: [
      { key: "REQUESTED_BY", type: "string", fallback_value: "FieldCrew Admin" },
      { key: "MAGIC_LINK", type: "string", fallback_value: "https://fieldcrew.app" },
      { key: "USER_EMAIL", type: "string", fallback_value: "user@example.com" },
    ],
  },
  {
    alias: "fieldcrew-password-recovery",
    name: "FieldCrew — Password Recovery",
    subject: "Reset your FieldCrew password",
    html: layoutEmail({
      title: "Reset your password",
      preheader: "Reset your FieldCrew password using this secure link.",
      body: `
        <div style="margin-bottom:10px;">${pill("SECURITY")}</div>
        <div style="margin-bottom:8px;">
          A password reset was requested by <strong>{{{REQUESTED_BY}}}</strong>.
        </div>
        <div style="color:#cbd5e1;font-size:13px;">This link is for <strong>{{{USER_EMAIL}}}</strong>.</div>
        ${monoBlock("Reset link: {{{SET_PASSWORD_LINK}}}")}
      `,
      cta: { href: "{{{SET_PASSWORD_LINK}}}", label: "Reset password" },
    }),
    text: `A FieldCrew password reset was requested by {{{REQUESTED_BY}}}.

Reset password:
{{{SET_PASSWORD_LINK}}}

This link is for {{{USER_EMAIL}}}.`,
    variables: [
      { key: "REQUESTED_BY", type: "string", fallback_value: "FieldCrew Admin" },
      { key: "SET_PASSWORD_LINK", type: "string", fallback_value: "https://fieldcrew.app" },
      { key: "USER_EMAIL", type: "string", fallback_value: "user@example.com" },
    ],
  },
  {
    alias: "fieldcrew-ops-alert",
    name: "FieldCrew — Ops Alert",
    subject: "[FieldCrew Ops] {{{TITLE}}}",
    html: layoutEmail({
      title: "[Ops] {{{TITLE}}}",
      preheader: "FieldCrew operations alert.",
      body: `
        <div style="margin-bottom:10px;">${pill("OPS")}</div>
        <div style="font-weight:800;margin-bottom:6px;">{{{TITLE}}}</div>
        <div>{{{MESSAGE}}}</div>
        ${monoBlock("{{{DETAILS_JSON}}}")}
      `,
    }),
    text: `{{{MESSAGE}}}

Details:
{{{DETAILS_JSON}}}`,
    variables: [
      { key: "TITLE", type: "string", fallback_value: "Alert" },
      { key: "MESSAGE", type: "string", fallback_value: "Something happened." },
      { key: "DETAILS_JSON", type: "string", fallback_value: "{}" },
    ],
  },

  // “Cover all bases” starting set for billing + account lifecycle. You can wire these into
  // your Stripe/Supabase flows as you implement them.
  {
    alias: "fieldcrew-billing-payment-failed",
    name: "FieldCrew — Billing Payment Failed",
    subject: "Action required: payment failed for {{{COMPANY_NAME}}}",
    html: layoutEmail({
      title: "Payment failed",
      preheader: "Update your payment method to keep FieldCrew active.",
      body: `
        <div style="margin-bottom:10px;">${pill("BILLING")}</div>
        <div>We couldn’t process the latest payment for <strong>{{{COMPANY_NAME}}}</strong>.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          Reason: <strong>{{{FAILURE_REASON}}}</strong>
        </div>
        ${monoBlock("Manage billing: {{{BILLING_PORTAL_URL}}}")}
      `,
      cta: { href: "{{{BILLING_PORTAL_URL}}}", label: "Update payment method" },
    }),
    text: `Payment failed for {{{COMPANY_NAME}}}.

Reason: {{{FAILURE_REASON}}}

Manage billing:
{{{BILLING_PORTAL_URL}}}`,
    variables: [
      { key: "COMPANY_NAME", type: "string", fallback_value: "your company" },
      { key: "FAILURE_REASON", type: "string", fallback_value: "Payment could not be processed" },
      { key: "BILLING_PORTAL_URL", type: "string", fallback_value: "https://fieldcrew.app/app/settings/billing" },
    ],
  },
  {
    alias: "fieldcrew-billing-subscription-canceled",
    name: "FieldCrew — Billing Subscription Canceled",
    subject: "Subscription canceled for {{{COMPANY_NAME}}}",
    html: layoutEmail({
      title: "Subscription canceled",
      preheader: "Your FieldCrew subscription has been canceled.",
      body: `
        <div style="margin-bottom:10px;">${pill("BILLING")}</div>
        <div>Your subscription for <strong>{{{COMPANY_NAME}}}</strong> has been canceled.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">If this was a mistake, you can restart anytime.</div>
        ${monoBlock("Manage billing: {{{BILLING_PORTAL_URL}}}")}
      `,
      cta: { href: "{{{BILLING_PORTAL_URL}}}", label: "Manage billing" },
    }),
    text: `Subscription canceled for {{{COMPANY_NAME}}}.

Manage billing:
{{{BILLING_PORTAL_URL}}}`,
    variables: [
      { key: "COMPANY_NAME", type: "string", fallback_value: "your company" },
      { key: "BILLING_PORTAL_URL", type: "string", fallback_value: "https://fieldcrew.app/app/settings/billing" },
    ],
  },

  // Billing: receipts / invoices / plan changes / trial
  {
    alias: "fieldcrew-billing-receipt",
    name: "FieldCrew — Billing Receipt",
    subject: "Receipt: {{{AMOUNT}}} for {{{COMPANY_NAME}}}",
    html: layoutEmail({
      title: "Payment receipt",
      preheader: "Your FieldCrew payment was processed successfully.",
      body: `
        <div style="margin-bottom:10px;">${pill("BILLING")}</div>
        <div>Payment received for <strong>{{{COMPANY_NAME}}}</strong>.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          Amount: <strong>{{{AMOUNT}}}</strong><br/>
          Date: <strong>{{{PAID_AT}}}</strong><br/>
          Reference: <strong>{{{REFERENCE}}}</strong>
        </div>
        ${monoBlock("Invoice/receipt link: {{{RECEIPT_URL}}}")}
      `,
      cta: { href: "{{{RECEIPT_URL}}}", label: "View receipt" },
    }),
    text: `Payment received for {{{COMPANY_NAME}}}.

Amount: {{{AMOUNT}}}
Date: {{{PAID_AT}}}
Reference: {{{REFERENCE}}}

View receipt:
{{{RECEIPT_URL}}}`,
    variables: [
      { key: "COMPANY_NAME", type: "string", fallback_value: "your company" },
      { key: "AMOUNT", type: "string", fallback_value: "$49.00" },
      { key: "PAID_AT", type: "string", fallback_value: "Today" },
      { key: "REFERENCE", type: "string", fallback_value: "—" },
      { key: "RECEIPT_URL", type: "string", fallback_value: "https://fieldcrew.app/app/settings/billing" },
    ],
  },
  {
    alias: "fieldcrew-billing-invoice-ready",
    name: "FieldCrew — Billing Invoice Ready",
    subject: "Invoice ready for {{{COMPANY_NAME}}}",
    html: layoutEmail({
      title: "Invoice ready",
      preheader: "Your FieldCrew invoice is ready to view or download.",
      body: `
        <div style="margin-bottom:10px;">${pill("BILLING")}</div>
        <div>Your invoice for <strong>{{{COMPANY_NAME}}}</strong> is ready.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          Invoice: <strong>{{{INVOICE_NUMBER}}}</strong><br/>
          Total: <strong>{{{TOTAL}}}</strong><br/>
          Due: <strong>{{{DUE_AT}}}</strong>
        </div>
        ${monoBlock("Invoice link: {{{INVOICE_URL}}}")}
      `,
      cta: { href: "{{{INVOICE_URL}}}", label: "View invoice" },
    }),
    text: `Invoice ready for {{{COMPANY_NAME}}}.

Invoice: {{{INVOICE_NUMBER}}}
Total: {{{TOTAL}}}
Due: {{{DUE_AT}}}

View invoice:
{{{INVOICE_URL}}}`,
    variables: [
      { key: "COMPANY_NAME", type: "string", fallback_value: "your company" },
      { key: "INVOICE_NUMBER", type: "string", fallback_value: "INV-0001" },
      { key: "TOTAL", type: "string", fallback_value: "$49.00" },
      { key: "DUE_AT", type: "string", fallback_value: "—" },
      { key: "INVOICE_URL", type: "string", fallback_value: "https://fieldcrew.app/app/settings/billing" },
    ],
  },
  {
    alias: "fieldcrew-billing-plan-changed",
    name: "FieldCrew — Billing Plan Changed",
    subject: "Plan updated for {{{COMPANY_NAME}}}: {{{PLAN_NAME}}}",
    html: layoutEmail({
      title: "Plan updated",
      preheader: "Your FieldCrew plan has been updated.",
      body: `
        <div style="margin-bottom:10px;">${pill("BILLING")}</div>
        <div>Your plan for <strong>{{{COMPANY_NAME}}}</strong> is now <strong>{{{PLAN_NAME}}}</strong>.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          Effective: <strong>{{{EFFECTIVE_AT}}}</strong>
        </div>
        ${monoBlock("Manage billing: {{{BILLING_PORTAL_URL}}}")}
      `,
      cta: { href: "{{{BILLING_PORTAL_URL}}}", label: "Manage billing" },
    }),
    text: `Plan updated for {{{COMPANY_NAME}}}.

New plan: {{{PLAN_NAME}}}
Effective: {{{EFFECTIVE_AT}}}

Manage billing:
{{{BILLING_PORTAL_URL}}}`,
    variables: [
      { key: "COMPANY_NAME", type: "string", fallback_value: "your company" },
      { key: "PLAN_NAME", type: "string", fallback_value: "Growth" },
      { key: "EFFECTIVE_AT", type: "string", fallback_value: "Immediately" },
      { key: "BILLING_PORTAL_URL", type: "string", fallback_value: "https://fieldcrew.app/app/settings/billing" },
    ],
  },
  {
    alias: "fieldcrew-billing-trial-ending",
    name: "FieldCrew — Billing Trial Ending",
    subject: "Your FieldCrew trial ends in {{{DAYS_LEFT}}} days",
    html: layoutEmail({
      title: "Trial ending soon",
      preheader: "Add billing to keep FieldCrew active.",
      body: `
        <div style="margin-bottom:10px;">${pill("BILLING")}</div>
        <div>Your trial for <strong>{{{COMPANY_NAME}}}</strong> ends in <strong>{{{DAYS_LEFT}}} days</strong>.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          End date: <strong>{{{TRIAL_END_AT}}}</strong>
        </div>
        ${monoBlock("Manage billing: {{{BILLING_PORTAL_URL}}}")}
      `,
      cta: { href: "{{{BILLING_PORTAL_URL}}}", label: "Add billing" },
    }),
    text: `Your FieldCrew trial ends in {{{DAYS_LEFT}}} days for {{{COMPANY_NAME}}}.

End date: {{{TRIAL_END_AT}}}

Manage billing:
{{{BILLING_PORTAL_URL}}}`,
    variables: [
      { key: "COMPANY_NAME", type: "string", fallback_value: "your company" },
      { key: "DAYS_LEFT", type: "number", fallback_value: 3 },
      { key: "TRIAL_END_AT", type: "string", fallback_value: "—" },
      { key: "BILLING_PORTAL_URL", type: "string", fallback_value: "https://fieldcrew.app/app/settings/billing" },
    ],
  },

  // Security: 2FA / suspicious login / recovery codes
  {
    alias: "fieldcrew-security-2fa-enabled",
    name: "FieldCrew — Security 2FA Enabled",
    subject: "2FA enabled on your FieldCrew account",
    html: layoutEmail({
      title: "2FA enabled",
      preheader: "Two-factor authentication is now enabled for your account.",
      body: `
        <div style="margin-bottom:10px;">${pill("SECURITY")}</div>
        <div>Two-factor authentication (2FA) was enabled for <strong>{{{USER_EMAIL}}}</strong>.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          Time: <strong>{{{EVENT_AT}}}</strong><br/>
          Device: <strong>{{{DEVICE}}}</strong><br/>
          IP: <strong>{{{IP_ADDRESS}}}</strong>
        </div>
        ${monoBlock("Security settings: {{{SECURITY_SETTINGS_URL}}}")}
      `,
      cta: { href: "{{{SECURITY_SETTINGS_URL}}}", label: "Review security" },
    }),
    text: `2FA was enabled for {{{USER_EMAIL}}}.

Time: {{{EVENT_AT}}}
Device: {{{DEVICE}}}
IP: {{{IP_ADDRESS}}}

Review security:
{{{SECURITY_SETTINGS_URL}}}`,
    variables: [
      { key: "USER_EMAIL", type: "string", fallback_value: "user@example.com" },
      { key: "EVENT_AT", type: "string", fallback_value: "—" },
      { key: "DEVICE", type: "string", fallback_value: "—" },
      { key: "IP_ADDRESS", type: "string", fallback_value: "—" },
      { key: "SECURITY_SETTINGS_URL", type: "string", fallback_value: "https://fieldcrew.app/app/settings/security" },
    ],
  },
  {
    alias: "fieldcrew-security-2fa-disabled",
    name: "FieldCrew — Security 2FA Disabled",
    subject: "2FA disabled on your FieldCrew account",
    html: layoutEmail({
      title: "2FA disabled",
      preheader: "Two-factor authentication is now disabled for your account.",
      body: `
        <div style="margin-bottom:10px;">${pill("SECURITY")}</div>
        <div>Two-factor authentication (2FA) was disabled for <strong>{{{USER_EMAIL}}}</strong>.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          Time: <strong>{{{EVENT_AT}}}</strong><br/>
          Device: <strong>{{{DEVICE}}}</strong><br/>
          IP: <strong>{{{IP_ADDRESS}}}</strong>
        </div>
        ${monoBlock("Security settings: {{{SECURITY_SETTINGS_URL}}}")}
      `,
      cta: { href: "{{{SECURITY_SETTINGS_URL}}}", label: "Re-enable 2FA" },
    }),
    text: `2FA was disabled for {{{USER_EMAIL}}}.

Time: {{{EVENT_AT}}}
Device: {{{DEVICE}}}
IP: {{{IP_ADDRESS}}}

Security settings:
{{{SECURITY_SETTINGS_URL}}}`,
    variables: [
      { key: "USER_EMAIL", type: "string", fallback_value: "user@example.com" },
      { key: "EVENT_AT", type: "string", fallback_value: "—" },
      { key: "DEVICE", type: "string", fallback_value: "—" },
      { key: "IP_ADDRESS", type: "string", fallback_value: "—" },
      { key: "SECURITY_SETTINGS_URL", type: "string", fallback_value: "https://fieldcrew.app/app/settings/security" },
    ],
  },
  {
    alias: "fieldcrew-security-recovery-codes-regenerated",
    name: "FieldCrew — Security Recovery Codes Regenerated",
    subject: "Recovery codes updated for your FieldCrew account",
    html: layoutEmail({
      title: "Recovery codes updated",
      preheader: "Your recovery codes were regenerated.",
      body: `
        <div style="margin-bottom:10px;">${pill("SECURITY")}</div>
        <div>Recovery codes were regenerated for <strong>{{{USER_EMAIL}}}</strong>.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          Time: <strong>{{{EVENT_AT}}}</strong><br/>
          Device: <strong>{{{DEVICE}}}</strong><br/>
          IP: <strong>{{{IP_ADDRESS}}}</strong>
        </div>
        ${monoBlock("Security settings: {{{SECURITY_SETTINGS_URL}}}")}
      `,
      cta: { href: "{{{SECURITY_SETTINGS_URL}}}", label: "Review security" },
    }),
    text: `Recovery codes were regenerated for {{{USER_EMAIL}}}.

Time: {{{EVENT_AT}}}
Device: {{{DEVICE}}}
IP: {{{IP_ADDRESS}}}

Security settings:
{{{SECURITY_SETTINGS_URL}}}`,
    variables: [
      { key: "USER_EMAIL", type: "string", fallback_value: "user@example.com" },
      { key: "EVENT_AT", type: "string", fallback_value: "—" },
      { key: "DEVICE", type: "string", fallback_value: "—" },
      { key: "IP_ADDRESS", type: "string", fallback_value: "—" },
      { key: "SECURITY_SETTINGS_URL", type: "string", fallback_value: "https://fieldcrew.app/app/settings/security" },
    ],
  },
  {
    alias: "fieldcrew-security-suspicious-login",
    name: "FieldCrew — Security Suspicious Login",
    subject: "Security alert: unusual sign-in for {{{USER_EMAIL}}}",
    html: layoutEmail({
      title: "Unusual sign-in",
      preheader: "We noticed an unusual sign-in to your FieldCrew account.",
      body: `
        <div style="margin-bottom:10px;">${pill("SECURITY")}</div>
        <div>We noticed an unusual sign-in for <strong>{{{USER_EMAIL}}}</strong>.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          Time: <strong>{{{EVENT_AT}}}</strong><br/>
          Location: <strong>{{{LOCATION}}}</strong><br/>
          Device: <strong>{{{DEVICE}}}</strong><br/>
          IP: <strong>{{{IP_ADDRESS}}}</strong>
        </div>
        <div style="margin-top:12px;">If this wasn’t you, reset your password and review 2FA immediately.</div>
        ${monoBlock("Reset password: {{{RESET_PASSWORD_URL}}}\\nSecurity settings: {{{SECURITY_SETTINGS_URL}}}")}
      `,
      cta: { href: "{{{RESET_PASSWORD_URL}}}", label: "Reset password" },
    }),
    text: `Security alert: unusual sign-in for {{{USER_EMAIL}}}.

Time: {{{EVENT_AT}}}
Location: {{{LOCATION}}}
Device: {{{DEVICE}}}
IP: {{{IP_ADDRESS}}}

If this wasn’t you, reset your password:
{{{RESET_PASSWORD_URL}}}

Security settings:
{{{SECURITY_SETTINGS_URL}}}`,
    variables: [
      { key: "USER_EMAIL", type: "string", fallback_value: "user@example.com" },
      { key: "EVENT_AT", type: "string", fallback_value: "—" },
      { key: "LOCATION", type: "string", fallback_value: "—" },
      { key: "DEVICE", type: "string", fallback_value: "—" },
      { key: "IP_ADDRESS", type: "string", fallback_value: "—" },
      { key: "RESET_PASSWORD_URL", type: "string", fallback_value: "https://fieldcrew.app/login" },
      { key: "SECURITY_SETTINGS_URL", type: "string", fallback_value: "https://fieldcrew.app/app/settings/security" },
    ],
  },

  // Operational: exports / webhooks / cron / integrations
  {
    alias: "fieldcrew-ops-export-ready",
    name: "FieldCrew — Ops Export Ready",
    subject: "Your export is ready: {{{EXPORT_NAME}}}",
    html: layoutEmail({
      title: "Export ready",
      preheader: "Your FieldCrew export is ready to download.",
      body: `
        <div style="margin-bottom:10px;">${pill("OPS")}</div>
        <div>Your export <strong>{{{EXPORT_NAME}}}</strong> is ready.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          Created: <strong>{{{CREATED_AT}}}</strong><br/>
          Requested by: <strong>{{{REQUESTED_BY}}}</strong>
        </div>
        ${monoBlock("Download: {{{DOWNLOAD_URL}}}")}
      `,
      cta: { href: "{{{DOWNLOAD_URL}}}", label: "Download export" },
    }),
    text: `Your export is ready: {{{EXPORT_NAME}}}

Created: {{{CREATED_AT}}}
Requested by: {{{REQUESTED_BY}}}

Download:
{{{DOWNLOAD_URL}}}`,
    variables: [
      { key: "EXPORT_NAME", type: "string", fallback_value: "Payroll export" },
      { key: "CREATED_AT", type: "string", fallback_value: "—" },
      { key: "REQUESTED_BY", type: "string", fallback_value: "—" },
      { key: "DOWNLOAD_URL", type: "string", fallback_value: "https://fieldcrew.app/app" },
    ],
  },
  {
    alias: "fieldcrew-ops-webhook-failed",
    name: "FieldCrew — Ops Webhook Failed",
    subject: "[FieldCrew Ops] Webhook failed: {{{WEBHOOK_NAME}}}",
    html: layoutEmail({
      title: "Webhook failed",
      preheader: "A webhook delivery failed and may need attention.",
      body: `
        <div style="margin-bottom:10px;">${pill("OPS")}</div>
        <div>A webhook delivery failed for <strong>{{{WEBHOOK_NAME}}}</strong>.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          Endpoint: <strong>{{{ENDPOINT}}}</strong><br/>
          Status: <strong>{{{STATUS_CODE}}}</strong><br/>
          Attempt: <strong>{{{ATTEMPT}}}</strong>
        </div>
        ${monoBlock("Error: {{{ERROR_MESSAGE}}}\\nEvent: {{{EVENT_ID}}}")}
      `,
    }),
    text: `Webhook failed: {{{WEBHOOK_NAME}}}

Endpoint: {{{ENDPOINT}}}
Status: {{{STATUS_CODE}}}
Attempt: {{{ATTEMPT}}}

Error: {{{ERROR_MESSAGE}}}
Event: {{{EVENT_ID}}}`,
    variables: [
      { key: "WEBHOOK_NAME", type: "string", fallback_value: "Stripe" },
      { key: "ENDPOINT", type: "string", fallback_value: "—" },
      { key: "STATUS_CODE", type: "number", fallback_value: 500 },
      { key: "ATTEMPT", type: "number", fallback_value: 1 },
      { key: "ERROR_MESSAGE", type: "string", fallback_value: "—" },
      { key: "EVENT_ID", type: "string", fallback_value: "—" },
    ],
  },
  {
    alias: "fieldcrew-ops-cron-failed",
    name: "FieldCrew — Ops Cron Failed",
    subject: "[FieldCrew Ops] Cron failed: {{{CRON_NAME}}}",
    html: layoutEmail({
      title: "Cron failed",
      preheader: "A scheduled job failed and may need attention.",
      body: `
        <div style="margin-bottom:10px;">${pill("OPS")}</div>
        <div>A scheduled job failed: <strong>{{{CRON_NAME}}}</strong>.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          Time: <strong>{{{EVENT_AT}}}</strong><br/>
          Run ID: <strong>{{{RUN_ID}}}</strong>
        </div>
        ${monoBlock("Error: {{{ERROR_MESSAGE}}}")}
      `,
    }),
    text: `Cron failed: {{{CRON_NAME}}}

Time: {{{EVENT_AT}}}
Run ID: {{{RUN_ID}}}

Error: {{{ERROR_MESSAGE}}}`,
    variables: [
      { key: "CRON_NAME", type: "string", fallback_value: "job-reminders" },
      { key: "EVENT_AT", type: "string", fallback_value: "—" },
      { key: "RUN_ID", type: "string", fallback_value: "—" },
      { key: "ERROR_MESSAGE", type: "string", fallback_value: "—" },
    ],
  },
  {
    alias: "fieldcrew-ops-integration-disconnected",
    name: "FieldCrew — Ops Integration Disconnected",
    subject: "Integration disconnected: {{{INTEGRATION_NAME}}}",
    html: layoutEmail({
      title: "Integration disconnected",
      preheader: "Reconnect the integration to avoid interruptions.",
      body: `
        <div style="margin-bottom:10px;">${pill("OPS")}</div>
        <div><strong>{{{INTEGRATION_NAME}}}</strong> was disconnected for <strong>{{{COMPANY_NAME}}}</strong>.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">If this wasn’t expected, reconnect it to restore service.</div>
        ${monoBlock("Reconnect: {{{RECONNECT_URL}}}")}
      `,
      cta: { href: "{{{RECONNECT_URL}}}", label: "Reconnect" },
    }),
    text: `Integration disconnected: {{{INTEGRATION_NAME}}}

Company: {{{COMPANY_NAME}}}

Reconnect:
{{{RECONNECT_URL}}}`,
    variables: [
      { key: "INTEGRATION_NAME", type: "string", fallback_value: "Stripe" },
      { key: "COMPANY_NAME", type: "string", fallback_value: "your company" },
      { key: "RECONNECT_URL", type: "string", fallback_value: "https://fieldcrew.app/app" },
    ],
  },

  // Product: summaries + notifications (email fallback)
  {
    alias: "fieldcrew-product-weekly-summary",
    name: "FieldCrew — Product Weekly Summary",
    subject: "Weekly summary for {{{COMPANY_NAME}}}",
    html: layoutEmail({
      title: "Weekly summary",
      preheader: "Your week in FieldCrew: jobs, hours, and highlights.",
      body: `
        <div style="margin-bottom:10px;">${pill("SUMMARY")}</div>
        <div>Here’s your weekly snapshot for <strong>{{{COMPANY_NAME}}}</strong>.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          Week: <strong>{{{WEEK_RANGE}}}</strong>
        </div>
        <div style="margin-top:12px;">
          <div><strong>Jobs completed:</strong> {{{JOBS_COMPLETED}}}</div>
          <div><strong>Total hours:</strong> {{{TOTAL_HOURS}}}</div>
          <div><strong>Overtime hours:</strong> {{{OVERTIME_HOURS}}}</div>
        </div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">Highlights:</div>
        ${monoBlock("{{{HIGHLIGHTS}}}")}
      `,
      cta: { href: "{{{DASHBOARD_URL}}}", label: "Open dashboard" },
    }),
    text: `Weekly summary for {{{COMPANY_NAME}}}

Week: {{{WEEK_RANGE}}}
Jobs completed: {{{JOBS_COMPLETED}}}
Total hours: {{{TOTAL_HOURS}}}
Overtime hours: {{{OVERTIME_HOURS}}}

Highlights:
{{{HIGHLIGHTS}}}

Open dashboard:
{{{DASHBOARD_URL}}}`,
    variables: [
      { key: "COMPANY_NAME", type: "string", fallback_value: "your company" },
      { key: "WEEK_RANGE", type: "string", fallback_value: "—" },
      { key: "JOBS_COMPLETED", type: "number", fallback_value: 0 },
      { key: "TOTAL_HOURS", type: "string", fallback_value: "0" },
      { key: "OVERTIME_HOURS", type: "string", fallback_value: "0" },
      { key: "HIGHLIGHTS", type: "string", fallback_value: "No highlights this week." },
      { key: "DASHBOARD_URL", type: "string", fallback_value: "https://fieldcrew.app/app" },
    ],
  },
  {
    alias: "fieldcrew-product-job-created",
    name: "FieldCrew — Product Job Created",
    subject: "New job created: {{{JOB_NAME}}}",
    html: layoutEmail({
      title: "New job created",
      preheader: "A new job was created in FieldCrew.",
      body: `
        <div style="margin-bottom:10px;">${pill("JOB")}</div>
        <div><strong>{{{JOB_NAME}}}</strong> was created for <strong>{{{COMPANY_NAME}}}</strong>.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          Address: <strong>{{{JOB_ADDRESS}}}</strong><br/>
          Date: <strong>{{{JOB_DATE}}}</strong><br/>
          Assigned: <strong>{{{ASSIGNED_COUNT}}}</strong> workers
        </div>
        ${monoBlock("Open job: {{{JOB_URL}}}")}
      `,
      cta: { href: "{{{JOB_URL}}}", label: "View job" },
    }),
    text: `New job created: {{{JOB_NAME}}}

Company: {{{COMPANY_NAME}}}
Address: {{{JOB_ADDRESS}}}
Date: {{{JOB_DATE}}}
Assigned: {{{ASSIGNED_COUNT}}} workers

Open job:
{{{JOB_URL}}}`,
    variables: [
      { key: "JOB_NAME", type: "string", fallback_value: "New job" },
      { key: "COMPANY_NAME", type: "string", fallback_value: "your company" },
      { key: "JOB_ADDRESS", type: "string", fallback_value: "—" },
      { key: "JOB_DATE", type: "string", fallback_value: "—" },
      { key: "ASSIGNED_COUNT", type: "number", fallback_value: 0 },
      { key: "JOB_URL", type: "string", fallback_value: "https://fieldcrew.app/app/jobs" },
    ],
  },
  {
    alias: "fieldcrew-product-worker-invite-email",
    name: "FieldCrew — Product Worker Invite (Email)",
    subject: "You’re invited to FieldCrew",
    html: layoutEmail({
      title: "You’re invited",
      preheader: "Join your team on FieldCrew using this secure link.",
      body: `
        <div style="margin-bottom:10px;">${pill("INVITE")}</div>
        <div>You’ve been invited to join <strong>{{{COMPANY_NAME}}}</strong> on FieldCrew.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          For: <strong>{{{WORKER_NAME}}}</strong>
        </div>
        ${monoBlock("Accept invite: {{{INVITE_URL}}}")}
      `,
      cta: { href: "{{{INVITE_URL}}}", label: "Accept invite" },
    }),
    text: `You’re invited to FieldCrew.

Company: {{{COMPANY_NAME}}}
For: {{{WORKER_NAME}}}

Accept invite:
{{{INVITE_URL}}}`,
    variables: [
      { key: "COMPANY_NAME", type: "string", fallback_value: "your company" },
      { key: "WORKER_NAME", type: "string", fallback_value: "Worker" },
      { key: "INVITE_URL", type: "string", fallback_value: "https://fieldcrew.app" },
    ],
  },
  {
    alias: "fieldcrew-product-job-reminder-email",
    name: "FieldCrew — Product Job Reminder (Email)",
    subject: "Reminder: {{{JOB_NAME}}} starts {{{STARTS_IN}}}",
    html: layoutEmail({
      title: "Job reminder",
      preheader: "Your job starts soon — open the job details.",
      body: `
        <div style="margin-bottom:10px;">${pill("REMINDER")}</div>
        <div><strong>{{{JOB_NAME}}}</strong> starts <strong>{{{STARTS_IN}}}</strong>.</div>
        <div style="margin-top:12px;color:#cbd5e1;font-size:13px;">
          Address: <strong>{{{JOB_ADDRESS}}}</strong><br/>
          Start: <strong>{{{JOB_START_AT}}}</strong>
        </div>
        ${monoBlock("Open job: {{{JOB_URL}}}")}
      `,
      cta: { href: "{{{JOB_URL}}}", label: "Open job" },
    }),
    text: `Reminder: {{{JOB_NAME}}} starts {{{STARTS_IN}}}

Address: {{{JOB_ADDRESS}}}
Start: {{{JOB_START_AT}}}

Open job:
{{{JOB_URL}}}`,
    variables: [
      { key: "JOB_NAME", type: "string", fallback_value: "Job" },
      { key: "STARTS_IN", type: "string", fallback_value: "soon" },
      { key: "JOB_ADDRESS", type: "string", fallback_value: "—" },
      { key: "JOB_START_AT", type: "string", fallback_value: "—" },
      { key: "JOB_URL", type: "string", fallback_value: "https://fieldcrew.app" },
    ],
  },
];

