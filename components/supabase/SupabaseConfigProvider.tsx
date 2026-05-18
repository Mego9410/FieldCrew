"use client";

import type { SupabasePublicConfig } from "@/lib/supabase/env";
import { setSupabaseRuntimeConfig } from "@/lib/supabase/runtime-config";

export function SupabaseConfigProvider({
  config,
  children,
}: {
  config: SupabasePublicConfig;
  children: React.ReactNode;
}) {
  setSupabaseRuntimeConfig(config);
  return children;
}
