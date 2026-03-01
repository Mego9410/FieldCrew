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
- `SUPABASE_SERVICE_ROLE_KEY`

**Twilio (SMS magic links):**
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

**Auth:**
- `AUTH_SECRET`

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
├── components/       # React components
│   └── landing/     # Landing page components
├── docs/             # Project documentation
└── public/           # Static assets
```

## License

Private - All rights reserved
