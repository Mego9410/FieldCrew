"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";

export function ImpersonateCard({
  companyId,
  ownerUserId,
}: {
  companyId: string;
  ownerUserId: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onImpersonate = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/impersonate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ companyId, ownerUserId: ownerUserId ?? undefined }),
      });
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!res.ok || !json.url) {
        setError(json.error ?? "Failed to impersonate");
        return;
      }
      window.open(json.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to impersonate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-fc-brand">Impersonation</div>
          <div className="mt-0.5 text-sm text-fc-muted">
            Opens a new tab as the owner user (real session + RLS).
          </div>
        </div>
        <button
          type="button"
          onClick={onImpersonate}
          disabled={loading || !ownerUserId}
          className="rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white hover:bg-fc-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Generating…" : "Impersonate"}
        </button>
      </div>
      {!ownerUserId ? (
        <div className="mt-3 text-sm text-amber-800">
          This company has no owner user set.
        </div>
      ) : null}
      {error ? <div className="mt-3 text-sm text-red-700">{error}</div> : null}
    </Card>
  );
}

