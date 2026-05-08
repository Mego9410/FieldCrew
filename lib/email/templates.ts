function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderLink(href: string, label?: string) {
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label ?? href);
  return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${safeLabel}</a>`;
}

function wrapHtml(title: string, bodyHtml: string) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(title)}</title>
  </head>
  <body style="margin:0;padding:0;background:#ffffff;font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial;">
    <div style="max-width:640px;margin:0 auto;padding:24px;">
      <div style="font-size:18px;font-weight:700;color:#0f172a;">${escapeHtml(
        title
      )}</div>
      <div style="margin-top:12px;font-size:14px;line-height:1.6;color:#0f172a;">
        ${bodyHtml}
      </div>
      <div style="margin-top:24px;font-size:12px;line-height:1.5;color:#64748b;">
        If you didn’t request this, you can ignore this email.
      </div>
    </div>
  </body>
</html>`;
}

export type EmailTemplate = { subject: string; text: string; html: string };

export function welcomeOwnerEmail(args: {
  ownerName: string;
  companyName: string;
  magicLink: string;
  setPasswordLink: string;
}): EmailTemplate {
  const subject = `Welcome to FieldCrew — set up your account`;
  const greeting = args.ownerName?.trim() ? `Hi ${args.ownerName.trim()},` : "Hi,";
  const text = `${greeting}

Your FieldCrew account for ${args.companyName} is ready.

1) Sign in (magic link)
${args.magicLink}

2) Set your password
${args.setPasswordLink}

If you have any questions, reply to this email.`;

  const htmlBody = `
<div>${escapeHtml(greeting)}</div>
<p>Your FieldCrew account for <strong>${escapeHtml(args.companyName)}</strong> is ready.</p>
<ol>
  <li>
    <div style="font-weight:600;">Sign in (magic link)</div>
    <div style="margin-top:6px;">${renderLink(args.magicLink, "Sign in to FieldCrew")}</div>
  </li>
  <li style="margin-top:12px;">
    <div style="font-weight:600;">Set your password</div>
    <div style="margin-top:6px;">${renderLink(args.setPasswordLink, "Set password")}</div>
  </li>
</ol>
<p>If you have any questions, just reply to this email.</p>`;

  return { subject, text, html: wrapHtml(subject, htmlBody) };
}

export function userMagicLinkEmail(args: {
  email: string;
  requestedBy: string;
  magicLink: string;
}): EmailTemplate {
  const subject = `Your FieldCrew sign-in link`;
  const text = `You’ve been sent a FieldCrew sign-in link by ${args.requestedBy}.

Sign in:
${args.magicLink}

This link is for ${args.email}.`;

  const htmlBody = `
<p>You’ve been sent a FieldCrew sign-in link by <strong>${escapeHtml(
    args.requestedBy
  )}</strong>.</p>
<p>${renderLink(args.magicLink, "Sign in to FieldCrew")}</p>
<p style="color:#64748b;font-size:12px;">This link is for ${escapeHtml(args.email)}.</p>`;

  return { subject, text, html: wrapHtml(subject, htmlBody) };
}

export function passwordRecoveryEmail(args: {
  email: string;
  requestedBy: string;
  setPasswordLink: string;
}): EmailTemplate {
  const subject = `Reset your FieldCrew password`;
  const text = `A FieldCrew password reset was requested by ${args.requestedBy}.

Reset password:
${args.setPasswordLink}

This link is for ${args.email}.`;

  const htmlBody = `
<p>A FieldCrew password reset was requested by <strong>${escapeHtml(
    args.requestedBy
  )}</strong>.</p>
<p>${renderLink(args.setPasswordLink, "Reset password")}</p>
<p style="color:#64748b;font-size:12px;">This link is for ${escapeHtml(args.email)}.</p>`;

  return { subject, text, html: wrapHtml(subject, htmlBody) };
}

export function opsAlertEmail(args: {
  title: string;
  message: string;
  details?: Record<string, unknown>;
}): EmailTemplate {
  const subject = `[FieldCrew Ops] ${args.title}`;
  const detailsJson = args.details ? JSON.stringify(args.details, null, 2) : "";
  const text = `${args.message}${detailsJson ? `\n\nDetails:\n${detailsJson}` : ""}`;

  const htmlBody = `
<p>${escapeHtml(args.message)}</p>
${
  detailsJson
    ? `<pre style="margin-top:12px;padding:12px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;overflow:auto;font-size:12px;line-height:1.4;">${escapeHtml(
        detailsJson
      )}</pre>`
    : ""
}`;

  return { subject, text, html: wrapHtml(subject, htmlBody) };
}

