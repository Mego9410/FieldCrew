# Google Auth setup (FieldCrew)

The app already has Google sign-in wired in code. To make it work, configure Google Cloud and Supabase once.

## Run on both localhost and Vercel

Use **one** Google OAuth client and **one** Supabase project. Add **all** of the URLs below so sign-in works from localhost and from your Vercel URL.

| Where | What to add |
|-------|-------------|
| **Google** → Authorized JavaScript origins | `http://localhost:3000`, `http://localhost:3001`, `https://field-crew.vercel.app` |
| **Google** → Authorized redirect URIs | `https://<PROJECT_REF>.supabase.co/auth/v1/callback` (only this one; copy from Supabase Dashboard) |
| **Supabase** → Redirect URLs | `http://localhost:3000/auth/callback`, `http://localhost:3001/auth/callback`, `https://field-crew.vercel.app/auth/callback` (if missing, Supabase may send users to `/` with `?code=...`; the app will still redirect the code to the callback) |
| **Supabase** → Site URL | Set to whichever you’re testing (e.g. `http://localhost:3000` for local, `https://field-crew.vercel.app` for prod). Both work as long as the matching callback URL is in the list above. |

No code or env changes are needed: the app uses the current origin for redirects, so localhost and Vercel both work.

---

## 1. Google Cloud Console

1. Open [Google Cloud Console](https://console.cloud.google.com/) and select or create a project.
2. **APIs & Services → Credentials** → Create **OAuth 2.0 Client ID** (type: **Web application**).
3. **Authorized JavaScript origins**
   - Dev: `http://localhost:3000` or `http://localhost:3001` (match the port your app actually uses)
   - Prod: `https://field-crew.vercel.app` (or your production domain)
4. **Authorized redirect URIs**
   - Hosted Supabase: `https://<PROJECT_REF>.supabase.co/auth/v1/callback`  
     Get `<PROJECT_REF>` from your Supabase URL (e.g. `https://abcdefgh.supabase.co` → `abcdefgh`).  
     Or copy the exact URL from **Supabase Dashboard → Authentication → Providers → Google**.
   - Local Supabase: `http://127.0.0.1:54321/auth/v1/callback`
5. **OAuth consent screen** → ensure scopes include `userinfo.profile`, `userinfo.email`, and `openid`.
6. Save and copy **Client ID** and **Client Secret**.

## 2. Supabase Dashboard

1. **Authentication → Providers → Google**
   - Enable Google.
   - Paste **Client ID** and **Client Secret**.
   - Save.
2. **Authentication → URL Configuration**
   - **Site URL**: your app URL (e.g. `http://localhost:3000` or `http://localhost:3001` — use the port you run the app on).
   - **Redirect URLs**: add **every** URL your app uses for `redirectTo` (the port must match):
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3001/auth/callback` (if you use port 3001)
     - `https://field-crew.vercel.app/auth/callback` (for production on Vercel)

## 3. Verify

1. Restart dev server, open `/login`, click **Sign in with Google**.
2. You should go to Google → back to `/auth/callback` → then to the dashboard.
3. If it fails: check redirect URI in Google matches Supabase’s callback URL, and that your app’s `/auth/callback` is in Supabase Redirect URLs.

No extra environment variables are needed; Google credentials are configured in the Supabase Dashboard only.

---

## Troubleshooting: “Unable to exchange external code”

If you land on your app with `?error=server_error&error_code=unexpected_failure&error_description=Unable+to+exchange+external+code` (often on the root URL or login page), Supabase received the code from Google but **failed to exchange it** with Google. Fix the following; then try again.

1. **Port must match everywhere**  
   Your app runs on a specific port (e.g. **3001**). In **Supabase → URL Configuration → Redirect URLs** add exactly that origin and path, e.g. `http://localhost:3001/auth/callback`. In **Google → Authorized JavaScript origins** add `http://localhost:3001`. The port in both must match the URL you use in the browser.

2. **Google Client Secret in Supabase**  
   In **Supabase → Authentication → Providers → Google**, re-paste the **Client Secret** from Google Cloud Console (Credentials → your OAuth 2.0 Client ID). No extra spaces; if you regenerated the secret in Google, update it in Supabase.

3. **Redirect URI in Google is Supabase’s URL, not your app’s**  
   In **Google Cloud Console → Credentials → your OAuth client → Authorized redirect URIs** you must have **only** Supabase’s callback, e.g. `https://<PROJECT_REF>.supabase.co/auth/v1/callback`. Do **not** put `http://localhost:3001/auth/callback` here — that is for Supabase’s “Redirect URLs” only. Google must redirect back to Supabase; then Supabase redirects to your app.

4. **One-time use of the code**  
   After a failed attempt, try “Sign in with Google” again in a fresh flow (new code). Old codes cannot be reused.

5. **Production (Vercel)**  
   For `https://field-crew.vercel.app`: **Google** → Authorized JavaScript origins: add `https://field-crew.vercel.app`. **Supabase** → URL Configuration → Redirect URLs: add `https://field-crew.vercel.app/auth/callback`; set Site URL to `https://field-crew.vercel.app` when testing production. Use the same Google OAuth client (same Client ID/Secret in Supabase); one Supabase callback URL in Google works for both dev and prod.

---

## Production (Vercel) still failing with “Unable to exchange external code”?

Do these in order and test again on **https://field-crew.vercel.app/login** (use an incognito window after each change).

1. **Get your exact Supabase callback URL**  
   Supabase Dashboard → **Authentication** → **Providers** → **Google**. On that page you’ll see the **Callback URL (for OAuth)**. It looks like `https://XXXXXXXX.supabase.co/auth/v1/callback`. Copy it exactly (no trailing slash).

2. **Google: Authorized redirect URIs**  
   Google Cloud Console → **APIs & Services** → **Credentials** → your **OAuth 2.0 Client ID** (Web application). Under **Authorized redirect URIs**:  
   - Remove any entry that is **not** your Supabase callback URL (e.g. remove `https://field-crew.vercel.app/auth/callback` if it’s there).  
   - Add **one** entry: the Supabase callback URL from step 1.  
   - Save.

3. **Supabase: Google Client Secret**  
   Supabase → **Authentication** → **Providers** → **Google**. Open Google Cloud Console → **Credentials** → same OAuth client → copy the **Client secret** again (no spaces before/after). Paste into Supabase, **Save**.

4. **Supabase: Redirect URLs**  
   Supabase → **Authentication** → **URL Configuration** → **Redirect URLs**. Ensure this exact line is in the list: `https://field-crew.vercel.app/auth/callback`. Add it if missing, Save.

5. **Retry in incognito**  
   Open `https://field-crew.vercel.app/login` in an incognito/private window and click **Sign in with Google**. Auth codes are one-time; a fresh window avoids cached state.

---

## New user not showing / redirected to homepage

**Redirect to homepage instead of dashboard**  
The app now preserves full session cookie options (httpOnly, secure, sameSite) when exchanging the code on `/`, so the session should persist and you should land on `/app`. If you still end up on the homepage, try in an incognito window and ensure you’re on `https://field-crew.vercel.app` (not http).

**New user not in the table**  
- **Authentication → Users**: New sign-ups appear here first (Supabase Auth).  
- **Table Editor → owner_users**: The app creates a row here (and in **companies**) when you sign in. Columns are `id`, `email`, `name`, `company_id` (not `company_name`). If you use a view that joins `company_name`, the new row will show once both `owner_users` and `companies` have the new records.  
- **RLS (2 policies)**: If Row Level Security is on, policies can hide rows. Viewing as **Role postgres** usually shows all rows. If you added policies that restrict by `auth.uid()`, the new user’s row should still be visible to that user when they’re logged in; in Table Editor, switch to the appropriate role or use the service role to see all rows.
