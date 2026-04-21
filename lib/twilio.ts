/**
 * Shared Twilio SMS helper. Used by invite send and job reminder cron.
 * When env vars are set, sends via Twilio API; otherwise stub (logs and returns ok:false).
 * See docs/ONBOARDING_SMS.md.
 */
export type SmsSendResult =
  | { ok: true; mode: "twilio" }
  | { ok: false; mode: "twilio" | "stub"; error: string };

export async function sendSms(phone: string, message: string): Promise<SmsSendResult> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (sid && token && from) {
    try {
      const res = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " + Buffer.from(`${sid}:${token}`).toString("base64"),
          },
          body: new URLSearchParams({
            To: phone,
            From: from,
            Body: message,
          }),
        }
      );
      if (res.ok) return { ok: true, mode: "twilio" };
      return { ok: false, mode: "twilio", error: `Twilio returned ${res.status}` };
    } catch (e) {
      return { ok: false, mode: "twilio", error: e instanceof Error ? e.message : "Twilio request failed" };
    }
  }

  console.log("[twilio] Stub SMS:", { phone, message: message.slice(0, 60) + "..." });
  return { ok: false, mode: "stub", error: "Twilio not configured" };
}
