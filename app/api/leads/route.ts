import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LeadPayload {
  email: string;
  source?: string;
  inputs?: Record<string, unknown>;
  outputs?: Record<string, unknown>;
  isHvacOwnerManager?: boolean;
}

function validateEmail(email: unknown): email is string {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  return trimmed.length > 0 && EMAIL_REGEX.test(trimmed);
}

export async function POST(request: Request) {
  let body: LeadPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  if (!validateEmail(body.email)) {
    return NextResponse.json(
      { error: "Valid email is required" },
      { status: 400 }
    );
  }

  const payload = {
    email: body.email.trim().toLowerCase(),
    source: body.source ?? "hidden_profit",
    inputs: body.inputs ?? null,
    outputs: body.outputs ?? null,
    created_at: new Date().toISOString(),
  };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && serviceKey) {
    try {
      const supabase = createClient(url, serviceKey);
      const { error } = await supabase.from("leads").insert({
        email: payload.email,
        source: payload.source,
        inputs: payload.inputs,
        outputs: payload.outputs,
      });
      if (error) {
        console.error("[leads] Supabase insert error:", error);
        return NextResponse.json(
          { error: "Failed to save lead" },
          { status: 500 }
        );
      }
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("[leads] Error:", err);
      return NextResponse.json(
        { error: "Failed to save lead" },
        { status: 500 }
      );
    }
  }

  console.log("[leads] No Supabase config; logging lead:", payload);
  return NextResponse.json({ ok: true });
}
