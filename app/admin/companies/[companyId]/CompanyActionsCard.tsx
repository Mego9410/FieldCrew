"use client";

import { useMemo, useState } from "react";

export function CompanyActionsCard({
  companyId,
  companyName,
  accountStatus,
}: {
  companyId: string;
  companyName: string;
  accountStatus: string | null;
}) {
  const [busy, setBusy] = useState<null | "suspend" | "unsuspend" | "delete">(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmName, setConfirmName] = useState("");

  const isSuspended = (accountStatus ?? "active") === "suspended";
  const canDelete = useMemo(
    () => !!companyName && confirmName.trim() === companyName,
    [companyName, confirmName]
  );

  const post = async (path: string, body?: unknown) => {
    const res = await fetch(path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: body ? JSON.stringify(body) : "{}",
    });
    const json = (await res.json().catch(() => ({}))) as { error?: string };
    if (!res.ok) throw new Error(json.error ?? res.statusText);
  };

  const onSuspendToggle = async () => {
    setError(null);
    setBusy(isSuspended ? "unsuspend" : "suspend");
    try {
      await post(
        `/api/admin/companies/${encodeURIComponent(companyId)}/${isSuspended ? "unsuspend" : "suspend"}`
      );
      window.location.reload();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  };

  const onDelete = async () => {
    setError(null);
    setBusy("delete");
    try {
      await post(
        `/api/admin/companies/${encodeURIComponent(companyId)}/delete`,
        { confirmName: confirmName.trim() }
      );
      window.location.href = "/admin/companies";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="text-sm font-medium text-slate-200">Safety controls</div>
      <div className="mt-1 text-sm text-slate-300">
        Suspend first. Deleting is a soft-delete marker (V1) and is always logged.
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onSuspendToggle}
          disabled={busy !== null}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm font-medium text-slate-200 hover:bg-slate-900 disabled:opacity-60"
        >
          {busy === "suspend" || busy === "unsuspend"
            ? "Saving…"
            : isSuspended
              ? "Unsuspend"
              : "Suspend"}
        </button>
      </div>

      <div className="mt-5 rounded-lg border border-red-900/40 bg-red-950/30 p-4">
        <div className="text-sm font-medium text-red-200">Soft delete</div>
        <div className="mt-1 text-sm text-red-200/80">
          Type <span className="font-semibold text-red-100">{companyName}</span>{" "}
          to confirm.
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={companyName}
            className="w-72 rounded-md border border-red-900/40 bg-slate-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
          />
          <button
            type="button"
            onClick={onDelete}
            disabled={busy !== null || !canDelete}
            className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy === "delete" ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      {error ? <div className="mt-3 text-sm text-red-300">{error}</div> : null}
    </div>
  );
}

