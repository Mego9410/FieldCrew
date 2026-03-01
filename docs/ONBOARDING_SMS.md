# SMS Invites (Twilio) for Onboarding

The first-time onboarding flow can send SMS invites to workers. By default the app **stubs** SMS (logs to console and marks invites as sent in the DB). To send real SMS:

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

## 2. Where it’s used

- **Invite send:** `app/api/invite/send/route.ts`  
  If the three env vars above are set, it calls the Twilio API to send the invite link. Otherwise it runs in stub mode (no SMS, invite still marked sent in DB for testing).

- **Token creation:** `app/api/invite/createTokens/route.ts`  
  Creates one invite token per worker; the onboarding UI then calls `/api/invite/send` for each worker when the owner chooses “Send SMS invites now”.

## 3. Message content

The message is built in `app/api/invite/send/route.ts` and includes a link to the worker app:

`/w/{token}` — e.g. `https://your-domain.com/w/abc123...`

You can change the copy or link format in that file.

## 4. Security

- Do not commit `.env.local`. Twilio credentials must stay server-side; the send API is server-only.
- Restrict the Twilio number and account to sending only (no inbound) if you don’t need replies.
