/**
 * Shared Twilio SMS helper. Used by invite send and job reminder cron.
 * When env vars are set, sends via Twilio API; otherwise stub (logs and returns true).
 * See docs/ONBOARDING_SMS.md.
 */
export async function sendSms(phone: string, message: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (sid && token && from) {
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
    return res.ok;
  }

  console.log("[twilio] Stub SMS:", { phone, message: message.slice(0, 60) + "..." });
  return true;
}
