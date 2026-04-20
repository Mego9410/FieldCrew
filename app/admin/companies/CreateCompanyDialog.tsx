"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

export function CreateCompanyDialog({
  onCreated,
}: {
  onCreated?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [companyName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [planId, setPlanId] = useState<"starter" | "growth" | "pro">("starter");
  const [magicLink, setMagicLink] = useState<string | null>(null);

  const create = async () => {
    setError(null);
    setBusy(true);
    setMagicLink(null);
    try {
      const res = await fetch("/api/admin/companies/create", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          companyName,
          ownerName,
          ownerEmail,
          planId,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        magicLink?: string | null;
      };
      if (!res.ok || !json.ok) throw new Error(json.error ?? res.statusText);
      setMagicLink(json.magicLink ?? null);
      onCreated?.();
      // Server component list won't auto-refresh; reload to show new account immediately.
      if (typeof window !== "undefined") window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90"
      >
        Create account
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <Card className="w-full max-w-xl rounded-xl p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-display text-lg font-bold text-fc-brand">
                  Create company
                </div>
                <div className="mt-0.5 text-sm text-fc-muted">
                  Creates the company + owner user. Returns a magic link for immediate access.
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-fc-border px-3 py-2 text-sm font-medium text-fc-brand hover:bg-fc-surface-muted"
              >
                Close
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-fc-muted">
                  Company name
                </label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-fc-border bg-white px-3 py-2 text-sm text-fc-brand"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-fc-muted">
                  Owner name
                </label>
                <input
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-fc-border bg-white px-3 py-2 text-sm text-fc-brand"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-fc-muted">
                  Owner email
                </label>
                <input
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-fc-border bg-white px-3 py-2 text-sm text-fc-brand"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-fc-muted">
                  Plan
                </label>
                <select
                  value={planId}
                  onChange={(e) =>
                    setPlanId(e.target.value as "starter" | "growth" | "pro")
                  }
                  className="mt-1 w-full rounded-lg border border-fc-border bg-white px-3 py-2 text-sm text-fc-brand"
                >
                  <option value="starter">Starter</option>
                  <option value="growth">Growth</option>
                  <option value="pro">Pro</option>
                </select>
              </div>
            </div>

            {magicLink ? (
              <div className="mt-4 rounded-lg border border-fc-border bg-fc-surface-muted p-3">
                <div className="text-xs font-semibold text-fc-muted">Magic link</div>
                <div className="mt-1 break-all text-xs text-fc-brand">
                  {magicLink}
                </div>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(magicLink)}
                    className="rounded-lg border border-fc-border px-3 py-2 text-sm font-medium text-fc-brand hover:bg-white"
                  >
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={() => window.open(magicLink, "_blank", "noopener,noreferrer")}
                    className="rounded-lg bg-fc-brand px-3 py-2 text-sm font-medium text-white hover:bg-fc-brand/90"
                  >
                    Open
                  </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg border border-fc-border px-3 py-2 text-sm font-medium text-fc-brand hover:bg-fc-surface-muted"
                >
                  Done
                </button>
                </div>
              </div>
            ) : null}

            {error ? (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                {error}
              </div>
            ) : null}

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={create}
                disabled={
                  busy ||
                  !companyName.trim() ||
                  !ownerName.trim() ||
                  !ownerEmail.trim()
                }
                className="rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90 disabled:opacity-50"
              >
                {busy ? "Creating…" : "Create"}
              </button>
            </div>
          </Card>
        </div>
      ) : null}
    </>
  );
}

