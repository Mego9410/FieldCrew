import { updateSession } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    return await updateSession(request);
  } catch (e) {
    console.error("[middleware]", e);
    return NextResponse.next({ request });
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/* (dev/prod assets: CSS chunks, HMR, flight, image optimizer, etc.)
     * - favicon.ico
     * - common static file extensions
     */
    "/((?!_next/|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
