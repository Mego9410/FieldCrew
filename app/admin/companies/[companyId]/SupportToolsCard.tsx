"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

export function SupportToolsCard({ companyId }: { companyId: string }) {
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const post = async (path: string, body?: unknown) => {
    const res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: body ? JSON.stringify(body) : "{}",
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(json.error ?? res.statusText);
    return json;
  };

  return (
    <Card className="mt-6 rounded-xl">
      <div className="text-sm font-semibold text-fc-brand">Support & debug</div>
      <div className="mt-0.5 text-sm text-fc-muted">
        Quick tools to fix account issues without guessing.
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy !== null}
          onClick={async () => {
            setError(null);
            setOkMsg(null);
            setBusy("recompute");
            try {
              await post("/api/admin/usage/recompute", { companyId, days: 30 });
              setOkMsg("Recomputed usage rollups (last 30 days).");
            } catch (e) {
              setError(e instanceof Error ? e.message : "Failed");
            } finally {
              setBusy(null);
            }
          }}
          className="rounded-lg border border-fc-border bg-white px-3 py-2 text-sm font-medium text-fc-brand hover:bg-fc-surface-muted disabled:opacity-50"
        >
          {busy === "recompute" ? "Recomputing…" : "Recompute usage (30d)"}
        </button>

        <a
          href={`/api/admin/companies/${encodeURIComponent(companyId)}/usage`}
          target="_blank"
          rel="noreferrer"
          className="rounded-lg border border-fc-border bg-white px-3 py-2 text-sm font-medium text-fc-brand hover:bg-fc-surface-muted"
        >
          View raw usage JSON
        </a>
      </div>

      {okMsg ? (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
          {okMsg}
        </div>
      ) : null}
      {error ? (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
          {error}
        </div>
      ) : null}

      <div className="mt-4 text-xs text-fc-muted">
        Coming next: error logs, failed Stripe invoice history, resync hooks, and data anomaly detectors.
      </div>
    </Card>
  );
}

