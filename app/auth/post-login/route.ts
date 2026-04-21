import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { routes } from "@/lib/routes";
import { isAllowlistedAdminEmail } from "@/lib/admin/allowlist";

function isSafeInternalPath(path: string | null): path is string {
  return Boolean(path && path.startsWith("/") && !path.startsWith("//"));
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const nextParam = url.searchParams.get("next");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  const user = error ? null : data?.user ?? null;

  if (!user) {
    const loginUrl = new URL(routes.public.login, url.origin);
    if (isSafeInternalPath(nextParam)) loginUrl.searchParams.set("next", nextParam);
    return NextResponse.redirect(loginUrl);
  }

  const isAdmin = isAllowlistedAdminEmail(user.email);
  const defaultTarget = isAdmin ? routes.admin.home : routes.owner.home;

  let target = defaultTarget;
  if (isSafeInternalPath(nextParam)) {
    // If a non-admin tries to hit /admin, fall back silently.
    if (
      (nextParam === routes.admin.home || nextParam.startsWith(`${routes.admin.home}/`)) &&
      !isAdmin
    ) {
      target = routes.owner.home;
    } else {
      target = nextParam;
    }
  }

  return NextResponse.redirect(new URL(target, url.origin));
}

