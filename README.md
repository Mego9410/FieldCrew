# FieldCrew

Job-based payroll intelligence for HVAC crews. See labour cost per job, stop payroll leakage, and run payroll with job context—not just hours.

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Deployment to Vercel

This project is configured for Vercel deployment.

### Quick Deploy

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will auto-detect Next.js and configure the build settings
4. Add environment variables in the Vercel dashboard (see below)
5. Deploy!

### Environment Variables

Add these environment variables in your Vercel project settings:

**Supabase:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — also used for local seeding when Row Level Security (RLS) is enabled; see `scripts/seed-supabase.ts`

**Twilio (SMS magic links / onboarding invites):**
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`
- See [docs/ONBOARDING_SMS.md](docs/ONBOARDING_SMS.md) to configure real SMS for first-time onboarding invites (stub used if unset).

**Auth:**
- `AUTH_SECRET`

If users get “Invalid login credentials” after signing up, Supabase may require email confirmation. They must click the confirmation link sent to their email before they can sign in. On the login page they can use “Resend confirmation email” to get a new link. To skip confirmation (e.g. for development), in Supabase Dashboard go to **Authentication → Providers → Email** and turn off **Confirm email**.

### Database and row-level security (RLS)

Apply Supabase migrations so each owner only sees their own data (companies, jobs, workers, time entries, etc.):

```bash
npx supabase db push
```

Or run the SQL in `supabase/migrations/` in order in the Supabase Dashboard → SQL Editor. The migration `20250303100000_enforce_owner_rls.sql` enforces owner-only access; run it if users can still see other users’ data.

### Manual Configuration

If needed, you can customize the deployment in `vercel.json`. The default configuration:
- Builds using `npm run build`
- Uses Next.js framework detection
- Deploys to `iad1` region (Washington, D.C.)

## Git: Preserving Local Config

When **pulling** or **force-pulling** from git, **do not overwrite or delete `.env.local`**. This is the only file that must not be changed by pull operations. It holds your local environment variables (API keys, secrets) and should stay as-is on your machine.

## Project Structure

```
├── app/              # Next.js app router pages
│   └── onboarding/  # First-time setup wizard
├── components/       # React components
│   ├── onboarding/  # Onboarding step components
│   └── landing/     # Landing page components
├── docs/             # Project documentation
└── public/           # Static assets
```

## License

Private - All rights reserved
