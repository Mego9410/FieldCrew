import { createClient } from "@/lib/supabase/server";
import { getShortLinkTarget } from "@/lib/shortLink";
import { NextResponse } from "next/server";

function getOrigin(request: Request): string {
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto === "https" ? "https" : "http"}://${host}`;
  try {
    const url = new URL(request.url);
    return url.origin;
  } catch {
    return process.env.NEXT_PUBLIC_APP_URL ?? "https://fieldcrew.app";
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  if (!code || code.length > 32) {
    return NextResponse.redirect(new URL("/", getOrigin(_request)), 302);
  }

  const supabase = await createClient();
  const targetPath = await getShortLinkTarget(supabase, code);
  if (!targetPath) {
    return NextResponse.redirect(new URL("/", getOrigin(_request)), 302);
  }

  const origin = getOrigin(_request);
  const destination = targetPath.startsWith("http")
    ? targetPath
    : `${origin.replace(/\/$/, "")}${targetPath.startsWith("/") ? targetPath : `/${targetPath}`}`;
  return NextResponse.redirect(destination, 302);
}
