import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactPayload {
  name: string;
  email: string;
  company: string;
  role?: string;
  topic: "support" | "onboarding" | "partnership" | "general";
  message: string;
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isValidEmail(v: unknown): v is string {
  return typeof v === "string" && EMAIL_REGEX.test(v.trim());
}

function isValidTopic(v: unknown): v is ContactPayload["topic"] {
  return v === "support" || v === "onboarding" || v === "partnership" || v === "general";
}

export async function POST(request: Request) {
  let body: ContactPayload;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  if (!isNonEmptyString(body.name)) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (!isValidEmail(body.email)) {
    return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
  }
  if (!isNonEmptyString(body.company)) {
    return NextResponse.json({ error: "Company is required." }, { status: 400 });
  }
  if (!isValidTopic(body.topic)) {
    return NextResponse.json({ error: "Valid topic is required." }, { status: 400 });
  }
  if (!isNonEmptyString(body.message)) {
    return NextResponse.json({ error: "Message is required." }, { status: 400 });
  }

  const payload = {
    email: body.email.trim().toLowerCase(),
    source: "contact_form",
    inputs: {
      name: body.name.trim(),
      company: body.company.trim(),
      role: body.role?.trim() || "",
      topic: body.topic,
      message: body.message.trim(),
    },
    outputs: null,
  };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && serviceKey) {
    try {
      const supabase = createClient(url, serviceKey);
      const { error } = await supabase.from("leads").insert(payload);
      if (error) {
        console.error("[contact] Supabase insert error:", error);
        return NextResponse.json({ error: "Failed to submit contact form." }, { status: 500 });
      }
      return NextResponse.json({ ok: true, persisted: true });
    } catch (err) {
      console.error("[contact] Error:", err);
      return NextResponse.json({ error: "Failed to submit contact form." }, { status: 500 });
    }
  }

  console.log("[contact] No Supabase config; logging payload:", payload);
  return NextResponse.json({ ok: true, persisted: false });
}
