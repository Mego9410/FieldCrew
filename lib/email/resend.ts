import { Resend } from "resend";

function requireEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

export type SendEmailArgs = {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
};

export type SendTemplateEmailArgs = {
  to: string | string[];
  /**
   * Resend template ID or alias (must be published).
   * We use aliases like `fieldcrew-password-recovery`.
   */
  templateId: string;
  variables: Record<string, string | number>;
  /**
   * Optional overrides. If provided, Resend will use these instead of template defaults.
   * Avoid overriding unless you have a specific need.
   */
  from?: string;
  subject?: string;
  replyTo?: string;
};

let cached: Resend | null = null;

export function getResend(): Resend {
  if (cached) return cached;
  cached = new Resend(requireEnv("RESEND_API_KEY"));
  return cached;
}

export function getDefaultFrom(): string {
  return process.env.RESEND_FROM?.trim() || "FieldCrew <no-reply@mg.fieldcrew.app>";
}

export async function sendEmail(args: SendEmailArgs) {
  const resend = getResend();
  const from = getDefaultFrom();
  const replyTo = args.replyTo?.trim() || process.env.RESEND_REPLY_TO?.trim() || undefined;

  const { data, error } = await resend.emails.send({
    from,
    to: args.to,
    subject: args.subject,
    text: args.text,
    html: args.html,
    ...(replyTo ? { replyTo } : {}),
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function sendTemplateEmail(args: SendTemplateEmailArgs) {
  const resend = getResend();
  const from = args.from?.trim() || getDefaultFrom();
  const replyTo = args.replyTo?.trim() || process.env.RESEND_REPLY_TO?.trim() || undefined;

  const payload = {
    from,
    to: args.to,
    ...(args.subject ? { subject: args.subject } : {}),
    template: { id: args.templateId, variables: args.variables },
    ...(replyTo ? { replyTo } : {}),
  } satisfies Parameters<typeof resend.emails.send>[0];

  const { data, error } = await resend.emails.send(payload);

  if (error) throw new Error(error.message);
  return data;
}

