"use client";

import type { SupabasePublicConfig } from "@/lib/supabase/env";

let runtimeConfig: SupabasePublicConfig | null = null;

export function setSupabaseRuntimeConfig(config: SupabasePublicConfig) {
  runtimeConfig = config;
}

export function getSupabaseRuntimeConfig(): SupabasePublicConfig | null {
  return runtimeConfig;
}
