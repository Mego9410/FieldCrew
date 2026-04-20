"use client";

import { useState } from "react";

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
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm font-medium text-slate-200">Impersonation</div>
          <div className="mt-1 text-sm text-slate-300">
            Opens a new tab as the owner user (real session + RLS).
          </div>
        </div>
        <button
          type="button"
          onClick={onImpersonate}
          disabled={loading || !ownerUserId}
          className="rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Generating…" : "Impersonate"}
        </button>
      </div>
      {!ownerUserId ? (
        <div className="mt-3 text-sm text-amber-300">
          This company has no owner user set.
        </div>
      ) : null}
      {error ? <div className="mt-3 text-sm text-red-300">{error}</div> : null}
    </div>
  );
}

