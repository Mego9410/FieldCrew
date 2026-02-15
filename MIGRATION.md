# Supabase Migration Guide

Test data has been migrated from localStorage to Supabase for better performance.

## Setup

1. **Apply the database migration**  
   Open your [Supabase Dashboard](https://supabase.com/dashboard) → SQL Editor, and run the contents of:
   ```
   supabase/migrations/20250215000000_create_fc_tables.sql
   ```

2. **Seed the database** with test data:
   ```bash
   npm run db:seed
   ```

3. Ensure `.env.local` has your Supabase credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## What Changed

- **`lib/mock-storage.ts`** – No longer used; data now comes from Supabase.
- **`lib/data.ts`** – New async Supabase-backed data layer.
- **`lib/hooks/useData.ts`** – React hooks for client-side data fetching.
- **`MockStorageInit`** – Removed from layout (no longer needed).
- All pages and forms now use the Supabase data layer via `lib/data` or `useData` hooks.
