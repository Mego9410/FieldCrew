import { NextResponse } from "next/server";
import { getAuthProxyConfig, getSupabaseProjectOrigin } from "@/lib/supabase/auth-proxy";
import { getServerSupabasePublicConfig } from "@/lib/supabase/server-public-config";
import {
  isSupabaseConfigured,
  resolveSupabaseConfig,
} from "@/lib/supabase/env";
import { agentLog } from "@/lib/debug/agent-log";

/**
 * Auth configuration audit (no secrets). Disabled in production unless
 * DEBUG_AUTH_AUDIT=1 is set on the server.
 */
export async function GET(request: Request) {
  const allow =
    process.env.NODE_ENV === "development" ||
    process.env.DEBUG_AUTH_AUDIT === "1";
  if (!allow) {
    return NextResponse.json({ error: "disabled" }, { status: 404 });
  }

  const host =
    request.headers.get("x-forwarded-host") ??
    request.headers.get("host") ??
    "";
  const hostname = host.split(",")[0]?.trim().replace(/:\d+$/, "") ?? "";

  const serverConfig = getServerSupabasePublicConfig();
  const authProxy = getAuthProxyConfig();
  const projectOrigin = getSupabaseProjectOrigin();

  const audit = {
    hostname,
    serverConfig: {
      urlHost: serverConfig.url ? new URL(serverConfig.url).hostname : "",
      anonKeyLength: serverConfig.anonKey.length,
      configured: isSupabaseConfigured(serverConfig),
    },
    authProxy: authProxy
      ? { authHost: authProxy.authHost, supabaseOrigin: authProxy.supabaseOrigin }
      : null,
    projectOrigin,
    envPresent: {
      NEXT_PUBLIC_SUPABASE_URL: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
      ),
      SUPABASE_PROJECT_URL: Boolean(process.env.SUPABASE_PROJECT_URL?.trim()),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
      ),
      NEXT_PUBLIC_APP_URL: Boolean(process.env.NEXT_PUBLIC_APP_URL?.trim()),
    },
    middlewareModuleConfigured: isSupabaseConfigured(),
    resolvedWithoutRuntime: {
      urlHost: (() => {
        try {
          return new URL(resolveSupabaseConfig(null).url).hostname;
        } catch {
          return "";
        }
      })(),
      anonKeyLength: resolveSupabaseConfig(null).anonKey.length,
    },
    crossDomainRisk:
      authProxy != null &&
      hostname !== authProxy.authHost &&
      serverConfig.url.includes(authProxy.authHost),
  };

  agentLog(
    "app/api/debug/auth-audit/route.ts:GET",
    "auth audit snapshot",
    audit as Record<string, unknown>,
    "H1-H5"
  );

  return NextResponse.json(audit);
}
