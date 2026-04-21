"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";

type PostResult = { url?: string; isolated?: boolean; redirectTo?: string };

async function post(path: string, body?: unknown): Promise<PostResult> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: body ? JSON.stringify(body) : "{}",
  });
  const json = (await res.json().catch(() => ({}))) as {
    error?: string;
    url?: string;
    isolated?: boolean;
    redirectTo?: string;
  };
  if (!res.ok) throw new Error(json.error ?? res.statusText);
  return json;
}

function openLink(url?: string) {
  if (!url) return;
  window.open(url, "_blank", "noopener,noreferrer");
}

export function AdminUserActionsCard({
  userId,
  email,
  currentRole,
  compact,
}: {
  userId: string;
  email?: string | null;
  currentRole?: string | null;
  compact?: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [roleInput, setRoleInput] = useState<string>(currentRole ?? "");
  const [impersonationDebug, setImpersonationDebug] = useState<{
    isolated: boolean;
    redirectTo: string | null;
    linkRedirectTo: string | null;
    actionLinkHost: string | null;
  } | null>(null);

  const title = compact ? "Actions" : "User actions";
  const help = compact
    ? "Support + security actions for this user."
    : "Support + security actions (magic link, password reset, force logout, role, delete).";

  const rolePlaceholder = useMemo(() => {
    if (currentRole) return `Role (current: ${currentRole})`;
    return "Role (e.g. owner, support_admin)";
  }, [currentRole]);

  return (
    <Card className="rounded-xl">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-fc-brand">{title}</div>
          <div className="mt-0.5 text-sm text-fc-muted">{help}</div>
          {email ? (
            <div className="mt-1 text-xs text-fc-muted">
              Target: <span className="font-mono text-fc-brand">{email}</span>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            disabled={busy !== null}
            onClick={async () => {
              setError(null);
              setImpersonationDebug(null);
              setBusy("impersonate");
              try {
                const r = await post("/api/admin/impersonate", { ownerUserId: userId });
                const host = (() => {
                  try {
                    return r.url ? new URL(r.url).host : null;
                  } catch {
                    return null;
                  }
                })();
                setImpersonationDebug({
                  isolated: Boolean(r.isolated),
                  redirectTo: r.redirectTo ?? null,
                  linkRedirectTo: (r as unknown as { linkRedirectTo?: string | null }).linkRedirectTo ?? null,
                  actionLinkHost: host,
                });
                // Make debugging unmissable even if UI is stale/cached.
                // Do NOT include the action link URL (contains credentials).
                const msg = [
                  `isolated=${String(Boolean(r.isolated))}`,
                  `redirectTo=${r.redirectTo ?? "—"}`,
                  `linkRedirectTo=${(r as unknown as { linkRedirectTo?: string | null }).linkRedirectTo ?? "—"}`,
                  `actionLinkHost=${host ?? "—"}`,
                  "",
                  "If redirectTo is NOT https://imp.getfieldcrew.com/auth/finish?... then Vercel env vars are not applied to this deployment.",
                  "If redirectTo IS correct but you still land on getfieldcrew.com/#access_token..., Supabase is rejecting redirectTo (Redirect URLs allowlist).",
                ].join("\n");
                // eslint-disable-next-line no-alert
                window.alert(msg);
                openLink(r.url);
              } catch (e) {
                setError(e instanceof Error ? e.message : "Failed");
              } finally {
                setBusy(null);
              }
            }}
            className="rounded-lg bg-fc-brand px-3 py-2 text-sm font-medium text-white hover:bg-fc-brand/90 disabled:opacity-50"
          >
            {busy === "impersonate" ? "Opening…" : "Open in app"}
          </button>
          <Link
            href={`/admin/users/${encodeURIComponent(userId)}`}
            className="rounded-lg border border-fc-border bg-white px-3 py-2 text-sm font-medium text-fc-brand hover:bg-fc-surface-muted"
          >
            Admin view
          </Link>
        </div>
      </div>

      {error ? (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      ) : null}
      {impersonationDebug ? (
        <div className="mt-3 rounded-lg border border-fc-border bg-fc-surface-muted px-3 py-2 text-xs text-fc-muted">
          <div>
            Impersonation isolated:{" "}
            <span className="font-mono text-fc-brand">
              {String(impersonationDebug.isolated)}
            </span>
          </div>
          <div className="mt-1">
            redirectTo:{" "}
            <span className="font-mono text-fc-brand break-all">
              {impersonationDebug.redirectTo ?? "—"}
            </span>
          </div>
          <div className="mt-1">
            action link host:{" "}
            <span className="font-mono text-fc-brand">
              {impersonationDebug.actionLinkHost ?? "—"}
            </span>
          </div>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={async () => {
            setError(null);
            setBusy("magic");
            try {
              const r = await post(`/api/admin/users/${userId}/magic-link`);
              openLink(r.url);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed");
            } finally {
              setBusy(null);
            }
          }}
          className="rounded-lg border border-fc-border px-3 py-2 text-sm font-medium text-fc-brand hover:bg-white disabled:opacity-50"
        >
          Send magic link
        </button>

        <button
          type="button"
          disabled={busy !== null}
          onClick={async () => {
            setError(null);
            setBusy("reset");
            try {
              const r = await post(`/api/admin/users/${userId}/reset-password`);
              openLink(r.url);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed");
            } finally {
              setBusy(null);
            }
          }}
          className="rounded-lg border border-fc-border px-3 py-2 text-sm font-medium text-fc-brand hover:bg-white disabled:opacity-50"
        >
          Reset password
        </button>

        <button
          type="button"
          disabled={busy !== null}
          onClick={async () => {
            setError(null);
            setBusy("logout");
            try {
              await post(`/api/admin/users/${userId}/force-logout`);
              router.refresh();
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed");
            } finally {
              setBusy(null);
            }
          }}
          className="rounded-lg border border-fc-border px-3 py-2 text-sm font-medium text-fc-brand hover:bg-white disabled:opacity-50"
        >
          Force logout
        </button>
      </div>

      <div className="mt-4 rounded-lg border border-fc-border bg-fc-surface-muted p-3">
        <div className="text-xs font-semibold text-fc-muted">Role + deletion</div>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <input
            value={roleInput}
            onChange={(e) => setRoleInput(e.target.value)}
            placeholder={rolePlaceholder}
            className="w-64 rounded-lg border border-fc-border bg-white px-3 py-2 text-sm text-fc-brand placeholder:text-fc-muted"
          />
          <button
            type="button"
            disabled={busy !== null || !roleInput.trim()}
            onClick={async () => {
              setError(null);
              setBusy("role");
              try {
                await post(`/api/admin/users/${userId}/role`, {
                  role: roleInput.trim(),
                });
                router.refresh();
              } catch (e) {
                setError(e instanceof Error ? e.message : "Failed");
              } finally {
                setBusy(null);
              }
            }}
            className="rounded-lg border border-fc-border px-3 py-2 text-sm font-medium text-fc-brand hover:bg-fc-surface-muted disabled:opacity-50"
          >
            {busy === "role" ? "Saving…" : "Change role"}
          </button>

          <button
            type="button"
            disabled={busy !== null}
            onClick={async () => {
              const ok = window.confirm(
                "Delete this auth user? This will remove their ability to sign in."
              );
              if (!ok) return;
              setError(null);
              setBusy("delete");
              try {
                await post(`/api/admin/users/${userId}/delete`);
                router.push("/admin/users");
                router.refresh();
              } catch (e) {
                setError(e instanceof Error ? e.message : "Failed");
              } finally {
                setBusy(null);
              }
            }}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-50"
          >
            {busy === "delete" ? "Deleting…" : "Delete user"}
          </button>
        </div>
      </div>
    </Card>
  );
}

