import { sendEmail, sendTemplateEmail } from "@/lib/email/resend";
import { opsAlertEmail } from "@/lib/email/templates";

function getOpsEmail(): string {
  return process.env.OPS_SUPPORT_EMAIL?.trim() || "support@mg.fieldcrew.app";
}

export async function sendOwnerWelcomeEmail(args: {
  to: string;
  ownerName: string;
  companyName: string;
  magicLink: string;
  setPasswordLink: string;
}) {
  return await sendTemplateEmail({
    to: args.to,
    templateId: "fieldcrew-welcome-owner",
    variables: {
      OWNER_NAME: args.ownerName?.trim() || "there",
      COMPANY_NAME: args.companyName,
      MAGIC_LINK: args.magicLink,
      SET_PASSWORD_LINK: args.setPasswordLink,
    },
  });
}

export async function sendUserMagicLinkEmail(args: {
  to: string;
  email: string;
  requestedBy: string;
  magicLink: string;
}) {
  return await sendTemplateEmail({
    to: args.to,
    templateId: "fieldcrew-user-magic-link",
    variables: {
      REQUESTED_BY: args.requestedBy,
      MAGIC_LINK: args.magicLink,
      USER_EMAIL: args.email,
    },
  });
}

export async function sendPasswordRecoveryEmail(args: {
  to: string;
  email: string;
  requestedBy: string;
  setPasswordLink: string;
}) {
  return await sendTemplateEmail({
    to: args.to,
    templateId: "fieldcrew-password-recovery",
    variables: {
      REQUESTED_BY: args.requestedBy,
      SET_PASSWORD_LINK: args.setPasswordLink,
      USER_EMAIL: args.email,
    },
  });
}

export async function sendOpsAlert(args: {
  title: string;
  message: string;
  details?: Record<string, unknown>;
}) {
  // Use templates when available, but keep fallback to raw html/text for resilience.
  try {
    return await sendTemplateEmail({
      to: getOpsEmail(),
      templateId: "fieldcrew-ops-alert",
      variables: {
        TITLE: args.title,
        MESSAGE: args.message,
        DETAILS_JSON: args.details ? JSON.stringify(args.details, null, 2) : "{}",
      },
    });
  } catch {
    const tpl = opsAlertEmail(args);
    return await sendEmail({ to: getOpsEmail(), ...tpl });
  }
}

export async function adminNotify(args: {
  to: string | string[];
  subject: string;
  text: string;
  html?: string;
}) {
  return await sendEmail(args);
}

export async function sendBillingPaymentFailedEmail(args: {
  to: string;
  companyName: string;
  failureReason: string;
  billingPortalUrl: string;
}) {
  return await sendTemplateEmail({
    to: args.to,
    templateId: "fieldcrew-billing-payment-failed",
    variables: {
      COMPANY_NAME: args.companyName,
      FAILURE_REASON: args.failureReason,
      BILLING_PORTAL_URL: args.billingPortalUrl,
    },
  });
}

export async function sendBillingReceiptEmail(args: {
  to: string;
  companyName: string;
  amount: string;
  paidAt: string;
  reference: string;
  receiptUrl: string;
}) {
  return await sendTemplateEmail({
    to: args.to,
    templateId: "fieldcrew-billing-receipt",
    variables: {
      COMPANY_NAME: args.companyName,
      AMOUNT: args.amount,
      PAID_AT: args.paidAt,
      REFERENCE: args.reference,
      RECEIPT_URL: args.receiptUrl,
    },
  });
}

export async function sendBillingInvoiceReadyEmail(args: {
  to: string;
  companyName: string;
  invoiceNumber: string;
  total: string;
  dueAt: string;
  invoiceUrl: string;
}) {
  return await sendTemplateEmail({
    to: args.to,
    templateId: "fieldcrew-billing-invoice-ready",
    variables: {
      COMPANY_NAME: args.companyName,
      INVOICE_NUMBER: args.invoiceNumber,
      TOTAL: args.total,
      DUE_AT: args.dueAt,
      INVOICE_URL: args.invoiceUrl,
    },
  });
}

export async function sendBillingSubscriptionCanceledEmail(args: {
  to: string;
  companyName: string;
  billingPortalUrl: string;
}) {
  return await sendTemplateEmail({
    to: args.to,
    templateId: "fieldcrew-billing-subscription-canceled",
    variables: {
      COMPANY_NAME: args.companyName,
      BILLING_PORTAL_URL: args.billingPortalUrl,
    },
  });
}

export async function sendBillingPlanChangedEmail(args: {
  to: string;
  companyName: string;
  planName: string;
  effectiveAt: string;
  billingPortalUrl: string;
}) {
  return await sendTemplateEmail({
    to: args.to,
    templateId: "fieldcrew-billing-plan-changed",
    variables: {
      COMPANY_NAME: args.companyName,
      PLAN_NAME: args.planName,
      EFFECTIVE_AT: args.effectiveAt,
      BILLING_PORTAL_URL: args.billingPortalUrl,
    },
  });
}

export async function sendBillingTrialEndingEmail(args: {
  to: string;
  companyName: string;
  daysLeft: number;
  trialEndAt: string;
  billingPortalUrl: string;
}) {
  return await sendTemplateEmail({
    to: args.to,
    templateId: "fieldcrew-billing-trial-ending",
    variables: {
      COMPANY_NAME: args.companyName,
      DAYS_LEFT: args.daysLeft,
      TRIAL_END_AT: args.trialEndAt,
      BILLING_PORTAL_URL: args.billingPortalUrl,
    },
  });
}

export async function sendSecurity2faEnabledEmail(args: {
  to: string;
  userEmail: string;
  eventAt: string;
  device: string;
  ipAddress: string;
  securitySettingsUrl: string;
}) {
  return await sendTemplateEmail({
    to: args.to,
    templateId: "fieldcrew-security-2fa-enabled",
    variables: {
      USER_EMAIL: args.userEmail,
      EVENT_AT: args.eventAt,
      DEVICE: args.device,
      IP_ADDRESS: args.ipAddress,
      SECURITY_SETTINGS_URL: args.securitySettingsUrl,
    },
  });
}

export async function sendSecurity2faDisabledEmail(args: {
  to: string;
  userEmail: string;
  eventAt: string;
  device: string;
  ipAddress: string;
  securitySettingsUrl: string;
}) {
  return await sendTemplateEmail({
    to: args.to,
    templateId: "fieldcrew-security-2fa-disabled",
    variables: {
      USER_EMAIL: args.userEmail,
      EVENT_AT: args.eventAt,
      DEVICE: args.device,
      IP_ADDRESS: args.ipAddress,
      SECURITY_SETTINGS_URL: args.securitySettingsUrl,
    },
  });
}

export async function sendSecurityRecoveryCodesRegeneratedEmail(args: {
  to: string;
  userEmail: string;
  eventAt: string;
  device: string;
  ipAddress: string;
  securitySettingsUrl: string;
}) {
  return await sendTemplateEmail({
    to: args.to,
    templateId: "fieldcrew-security-recovery-codes-regenerated",
    variables: {
      USER_EMAIL: args.userEmail,
      EVENT_AT: args.eventAt,
      DEVICE: args.device,
      IP_ADDRESS: args.ipAddress,
      SECURITY_SETTINGS_URL: args.securitySettingsUrl,
    },
  });
}

