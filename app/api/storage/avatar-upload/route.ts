import { NextResponse } from "next/server";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";

const BUCKET = process.env.AVATAR_BUCKET ?? "avatars";

function extFromType(contentType: string): string {
  const ct = contentType.toLowerCase();
  if (ct.includes("png")) return "png";
  if (ct.includes("jpeg") || ct.includes("jpg")) return "jpg";
  if (ct.includes("webp")) return "webp";
  return "png";
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const service = createServiceRoleClient();
  if (!service) {
    return NextResponse.json(
      { error: "Service role not configured" },
      { status: 503 }
    );
  }

  let body: { contentType?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const contentType = (body.contentType ?? "image/png").trim();
  if (!contentType.startsWith("image/")) {
    return NextResponse.json({ error: "Only image uploads are supported" }, { status: 400 });
  }

  const ext = extFromType(contentType);
  const path = `owner/${user.id}/avatar.${ext}`;

  // Signed upload URL (PUT). Requires service role.
  const { data, error } = await service.storage
    .from(BUCKET)
    .createSignedUploadUrl(path);

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: error?.message ?? "Failed to create signed upload URL" },
      { status: 500 }
    );
  }

  const publicUrl = service.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;

  return NextResponse.json({
    ok: true,
    bucket: BUCKET,
    path,
    signedUrl: data.signedUrl,
    token: data.token,
    publicUrl,
  });
}

