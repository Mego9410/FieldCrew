# Resend + Supabase email checklist (`mg.fieldcrew.app`)

This repo sends operational admin/owner emails via Resend (API), and Supabase Auth emails can optionally be delivered via custom SMTP.

## Resend setup (sending domain)

- **Add domain**: add `mg.fieldcrew.app` in Resend Domains.
- **SPF**: publish the Resend-provided SPF TXT record (often includes `include:resend.com` or similar).
- **DKIM**: publish the Resend-provided DKIM TXT/CNAME records.
- **Return-Path / tracking domain** (if Resend provides one): publish the records they ask for.
- **DMARC** (recommended): create `_dmarc.mg.fieldcrew.app` TXT, start permissive, then tighten:
  - `v=DMARC1; p=none; rua=mailto:dmarc@fieldcrew.app; ruf=mailto:dmarc@fieldcrew.app; fo=1; adkim=s; aspf=s`
- **Verify**: wait for DNS propagation, then click “Verify” in Resend.
- **From address**: set `RESEND_FROM` (example: `FieldCrew <no-reply@mg.fieldcrew.app>`).
- **Support inbox**: set `OPS_SUPPORT_EMAIL` and optionally `RESEND_REPLY_TO` (example: `support@mg.fieldcrew.app`).

## App environment variables

- **`RESEND_API_KEY`**: required for sending Resend emails (server-only).
- **`RESEND_FROM`**: optional; defaults to `FieldCrew <no-reply@mg.fieldcrew.app>`.
- **`RESEND_REPLY_TO`**: optional; used for reply handling.
- **`OPS_SUPPORT_EMAIL`**: optional; defaults to `support@mg.fieldcrew.app`.

## Supabase Auth SMTP (optional but recommended)

If you want Supabase’s built-in Auth emails (confirmations, OTPs, etc.) to come from your domain rather than Supabase defaults:

- **Supabase Dashboard → Authentication → Email** (or “SMTP” section)
  - **Enable custom SMTP**
  - **Host/port/user/pass**: use Resend SMTP credentials (from Resend SMTP settings), or another provider.
  - **Sender name / sender email**: match `mg.fieldcrew.app` (example: `no-reply@mg.fieldcrew.app`).
- **Supabase Dashboard → Authentication → URL Configuration**
  - Ensure **Site URL** and **Redirect URLs** include your production origins (and any impersonation origin if used).
- **Deliverability check**
  - Send a test Auth email from Supabase.
  - Confirm SPF/DKIM/DMARC alignment for `mg.fieldcrew.app`.

## Operational notes

- **Do not return magic/recovery links from admin APIs** in production UIs. Email them instead.
- **Rotate keys** if a magic/recovery link is ever exposed to a place it shouldn’t be (logs, client responses, screenshots).

