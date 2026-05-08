import { RESEND_TEMPLATES, type ResendTemplateDefinition } from "@/lib/email/resend-templates";
import dotenv from "dotenv";

// Ensure local file values win even if the shell already has env vars set.
dotenv.config({ path: ".env.local", override: true });
dotenv.config({ path: ".env", override: true });

type ListTemplatesResponse = {
  object: "list";
  data: Array<{ id: string; name: string; alias?: string; status?: "draft" | "published" }>;
  has_more: boolean;
};

type TemplateCreateResponse = { id: string; object: "template" };

function requireEnv(name: string) {
  const raw = process.env[name];
  const v = raw?.trim();
  if (!v) throw new Error(`Missing env: ${name}`);
  // `.env.local` often uses quoted values. Resend expects the raw key.
  return v.replace(/^"(.*)"$/, "$1").replace(/^'(.*)'$/, "$1");
}

function getApiKey() {
  // Prefer the existing convention in `lib/email/resend.ts`
  return requireEnv("RESEND_API_KEY");
}

async function resendFetch<T>(path: string, init?: RequestInit): Promise<T> {
  // Resend rate limit: 5 req/sec. We throttle + retry on 429.
  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  const minSpacingMs = 240;
  (globalThis as any).__fc_resend_last_req_at ??= 0;

  const doFetch = async () => {
    const last = Number((globalThis as any).__fc_resend_last_req_at) || 0;
    const now = Date.now();
    const wait = minSpacingMs - (now - last);
    if (wait > 0) await sleep(wait);

    (globalThis as any).__fc_resend_last_req_at = Date.now();
    return await fetch(`https://api.resend.com${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${getApiKey()}`,
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
    });
  };

  let r = await doFetch();
  if (r.status === 429) {
    const retryAfter = Number(r.headers.get("retry-after") ?? "");
    await sleep(Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1200);
    r = await doFetch();
  }

  const text = await r.text();
  const json = text ? (JSON.parse(text) as unknown) : null;

  if (!r.ok) {
    const msg =
      typeof json === "object" && json && "message" in json
        ? String((json as any).message)
        : `HTTP ${r.status} ${r.statusText}`;
    throw new Error(`${path}: ${msg}`);
  }

  return json as T;
}

async function listAllTemplates(): Promise<ListTemplatesResponse["data"]> {
  const all: ListTemplatesResponse["data"] = [];
  let after: string | undefined;

  while (true) {
    const qs = new URLSearchParams();
    qs.set("limit", "100");
    if (after) qs.set("after", after);

    const res = await resendFetch<ListTemplatesResponse>(`/templates?${qs.toString()}`, {
      method: "GET",
    });

    all.push(...res.data);
    if (!res.has_more || res.data.length === 0) break;
    after = res.data[res.data.length - 1]?.id;
  }

  return all;
}

async function createTemplate(def: ResendTemplateDefinition): Promise<string> {
  const created = await resendFetch<TemplateCreateResponse>("/templates", {
    method: "POST",
    body: JSON.stringify(def),
  });
  return created.id;
}

async function updateTemplate(id: string, def: ResendTemplateDefinition): Promise<void> {
  await resendFetch(`/templates/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(def),
  });
}

async function publishTemplate(idOrAlias: string): Promise<void> {
  await resendFetch(`/templates/${encodeURIComponent(idOrAlias)}/publish`, { method: "POST" });
}

async function upsertTemplate(def: ResendTemplateDefinition, existing: ListTemplatesResponse["data"]) {
  const match = existing.find((t) => t.alias === def.alias) ?? existing.find((t) => t.name === def.name);

  if (!match) {
    const id = await createTemplate(def);
    await publishTemplate(id);
    console.log(`Created + published: ${def.alias} (${id})`);
    return;
  }

  await updateTemplate(match.id, def);
  await publishTemplate(match.id);
  console.log(`Updated + published: ${def.alias} (${match.id})`);
}

async function main() {
  const existing = await listAllTemplates();
  for (const def of RESEND_TEMPLATES) {
    await upsertTemplate(def, existing);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

