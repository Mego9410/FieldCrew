# SMS (Twilio) — Profile link and job reminders

Two SMS flows use Twilio: (1) **initial profile link** when the company sets up a worker, and (2) **job reminder** SMS X hours before each job with a direct link to the job and clock-in page. By default the app **stubs** SMS (logs to console). To send real SMS, configure Twilio and optional env for cron and links.

---

## 1. Twilio setup

1. Create a [Twilio](https://www.twilio.com/) account and get:
   - **Account SID**
   - **Auth Token**
   - A **Phone Number** (for sending SMS)

2. Add to `.env.local`:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+15551234567
```

When these are set, both the invite and job-reminder flows use the Twilio API. Otherwise they run in stub mode (no SMS sent; invite/reminder still recorded for testing).

---

## 2. Flow 1 — Initial profile link (magic link)

**When:** Company sets up a worker (add worker from Workers page, or “Send profile link” for an existing worker).

**What:** Worker receives one SMS with a link to their profile: `/w/{token}`. No login; the token is the magic link. The link is unique per worker.

**Where it’s used:**

- **Send API:** `app/api/invite/send/route.ts`  
  - If the worker has no active invite token, one is created (14-day expiry), then the SMS is sent.  
  - Message: “You're invited to FieldCrew. Open this link to get started: {link}”
- **Token creation (bulk):** `app/api/invite/createTokens/route.ts`  
  - Creates one invite token per worker (e.g. for onboarding). The UI then calls `/api/invite/send` per worker.
- **Shared SMS helper:** `lib/twilio.ts` — `sendSms(phone, message)` used by invite and job-reminder routes.

**UI:** Workers list has a “Send profile link” action per worker. The Add worker form has an optional “Send profile link by SMS after adding” checkbox.

---

## 3. Flow 2 — Job reminder SMS (X hours before job)

**When:** X hours before each job start (X is configurable per company in Settings → Notifications → Worker SMS).

**What:** Each worker assigned to the job gets one SMS with a direct link to that job and the clock-in page: `/w/{token}/clock?jobId={jobId}`. Link is unique per user (token) and per job; workers only see jobs they’re assigned to.

**Where it’s used:**

- **Cron API:** `app/api/cron/job-reminders/route.ts`  
  - Runs on a schedule (once per day on Vercel free tier: 06:00 UTC).  
  - For each company with `jobReminderHours` > 0, finds jobs whose start is within the next `jobReminderHours`, then for each assigned worker: ensures an invite token exists, checks dedupe (one reminder per job+worker), sends SMS via `lib/twilio.ts`, and records the send in `job_reminder_sends`.
- **Company setting:** Settings → Notifications → “Send job reminder SMS” dropdown (Off, 1, 2, 4, 8, 24 hours). Stored in `companies.settings.job_reminder_hours`.
- **Dedupe:** Table `job_reminder_sends` (migration `20250304000000_job_reminder_sends.sql`) ensures at most one reminder per (job, worker).

**Scheduler:** `vercel.json` defines a cron that hits `POST /api/cron/job-reminders` once per day at 06:00 UTC (Vercel free tier allows only daily crons). Reminders are sent for jobs starting within the company’s “X hours before” window at that run time. The route must be called with the correct secret (see below).

---

## 4. Environment variables (summary)

| Variable | Required | Description |
|----------|----------|-------------|
| `TWILIO_ACCOUNT_SID` | For real SMS | Twilio Account SID |
| `TWILIO_AUTH_TOKEN` | For real SMS | Twilio Auth Token |
| `TWILIO_PHONE_NUMBER` | For real SMS | Twilio sending number (e.g. +15551234567) |
| `CRON_SECRET` | For job reminders cron | Secret for `POST /api/cron/job-reminders` (Bearer token or `x-cron-secret` header). Set in Vercel env and pass when invoking the cron if not using Vercel’s built-in cron auth. |
| `NEXT_PUBLIC_APP_URL` | Optional | Base URL for SMS links (e.g. `https://yourapp.com`). Falls back to `https://${VERCEL_URL}` or `https://fieldcrew.app`. |
| `SUPABASE_SERVICE_ROLE_KEY` | For cron | Required for the job-reminders cron to read all companies/jobs and write `job_reminder_sends`. |

---

## 5. Security

- Do not commit `.env.local`. Twilio and cron credentials must stay server-side; send and cron APIs are server-only.
- Restrict the Twilio number to sending only (no inbound) if you don’t need replies.
- The job-reminders route returns 401 unless the request includes the correct `CRON_SECRET` (e.g. `Authorization: Bearer <CRON_SECRET>` or `x-cron-secret: <CRON_SECRET>`).
