import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

if (process.argv.includes("--prod")) {
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://auth.getfieldcrew.com";
  process.env.SUPABASE_PROJECT_URL =
    process.env.SUPABASE_PROJECT_URL ||
    "https://dndmaagfzgnelwnoqnjf.supabase.co";
}

const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const projectUrl = process.env.SUPABASE_PROJECT_URL?.trim();

function projectOrigin() {
  for (const raw of [projectUrl, process.env.SUPABASE_URL, publicUrl]) {
    if (!raw) continue;
    try {
      const { hostname, origin } = new URL(raw);
      if (hostname.endsWith(".supabase.co")) return origin;
    } catch {
      /* skip */
    }
  }
  return null;
}

function authProxy() {
  if (!publicUrl) return null;
  const publicHost = new URL(publicUrl).hostname;
  if (publicHost.endsWith(".supabase.co")) return null;
  const supabaseOrigin = projectOrigin();
  if (!supabaseOrigin) return null;
  return { authHost: publicHost, supabaseOrigin };
}

const proxy = authProxy();
console.log(JSON.stringify({ publicUrl, projectUrl, proxy, crossDomainRisk: Boolean(proxy && publicUrl?.includes(proxy.authHost)) }, null, 2));
