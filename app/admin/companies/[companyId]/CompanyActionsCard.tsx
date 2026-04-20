"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/Card";

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
    <Card className="rounded-xl">
      <div className="text-sm font-semibold text-fc-brand">Safety controls</div>
      <div className="mt-0.5 text-sm text-fc-muted">
        Suspend first. Deleting is a soft-delete marker (V1) and is always logged.
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onSuspendToggle}
          disabled={busy !== null}
          className="rounded-lg border border-fc-border bg-white px-3 py-2 text-sm font-medium text-fc-brand hover:bg-fc-surface-muted disabled:opacity-60"
        >
          {busy === "suspend" || busy === "unsuspend"
            ? "Saving…"
            : isSuspended
              ? "Unsuspend"
              : "Suspend"}
        </button>
      </div>

      <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="text-sm font-semibold text-red-900">Soft delete</div>
        <div className="mt-1 text-sm text-red-800">
          Type <span className="font-semibold text-red-900">{companyName}</span>{" "}
          to confirm.
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <input
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            placeholder={companyName}
            className="w-72 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm text-fc-brand placeholder:text-fc-muted"
          />
          <button
            type="button"
            onClick={onDelete}
            disabled={busy !== null || !canDelete}
            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy === "delete" ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      {error ? <div className="mt-3 text-sm text-red-700">{error}</div> : null}
    </Card>
  );
}

