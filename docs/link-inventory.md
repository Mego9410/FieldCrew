# Link Inventory and Status

This inventory tracks navigation and common user-facing links across marketing and app routes.

## Classification Rules

- `valid-page`: Link resolves to an existing route with usable content.
- `exists-but-holding`: Route exists but copy/content is still placeholder quality.
- `placeholder-target`: Link uses a dummy target such as `#`.
- `invalid-route`: Internal route does not exist.

## Findings (Baseline)

### Footer Links (`components/landing/Footer.tsx`)

- **Product**
  - `#calculator` - `valid-page` (home anchor)
  - `#how-it-works` - `valid-page` (home anchor)
- **Solutions**
  - `/solutions/hvac` - `invalid-route` (missing at baseline)
  - `/solutions/contractors` - `invalid-route` (missing at baseline)
  - `/solutions/small-teams` - `invalid-route` (missing at baseline)
- **Company**
  - `/about` - `invalid-route` (missing at baseline)
  - `/blog` - `valid-page`
  - `/careers` - `invalid-route` (missing at baseline)
- **Resources**
  - `/docs` - `invalid-route` (missing at baseline)
  - `/support` - `invalid-route` (missing at baseline)
  - `/contact` - `invalid-route` (missing at baseline)
- **Legal**
  - `/privacy` - `invalid-route` (missing at baseline)
  - `/terms` - `invalid-route` (missing at baseline)
  - `/security` - `invalid-route` (missing at baseline)
- **Social**
  - `#` links - `placeholder-target` (baseline)

### Holding Pages (Known)

- `app/book/page.tsx` - `exists-but-holding`
- `app/demo/page.tsx` - `exists-but-holding`
- `app/app/dashboard/margin/page.tsx` - `exists-but-holding`
- `app/app/dashboard/estimate-accuracy/page.tsx` - `exists-but-holding`
- `app/app/dashboard/revenue-labour/page.tsx` - `exists-but-holding`
- `app/app/dashboard/revenue-per-labour-hour/page.tsx` - `exists-but-holding`
- `app/app/dashboard/time-allocation/page.tsx` - `exists-but-holding`

## Completion Checklist

- [x] Replace placeholder footer/social links
- [x] Build all missing footer destination pages
- [x] Upgrade known holding pages with real utility content
- [x] Add automated checks for placeholder links and missing internal routes
