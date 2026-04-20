"use client";

import { useEffect, useState } from "react";

type UsageResponse = {
  windows: {
    last7Days: {
      jobsCreated: number;
      clockIns: number;
      activeWorkers: number;
      reportsViewed: number;
      insightsGenerated: number;
    };
    last30Days: {
      jobsCreated: number;
      clockIns: number;
      activeWorkers: number;
      reportsViewed: number;
      insightsGenerated: number;
    };
  };
  flags: { noActivity7: boolean; lowUsage: boolean; highEngagement: boolean };
};

function Flag({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={[
        "rounded-md border px-2 py-1 text-xs",
        on
          ? "border-amber-700/60 bg-amber-950/30 text-amber-200"
          : "border-slate-700 bg-slate-950 text-slate-400",
      ].join(" ")}
    >
      {label}
    </span>
  );
}

export function UsageCard({ companyId }: { companyId: string }) {
  const [data, setData] = useState<UsageResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/admin/companies/${encodeURIComponent(companyId)}/usage`, {
      cache: "no-store",
    })
      .then(async (r) => {
        const j = (await r.json().catch(() => ({}))) as UsageResponse & {
          error?: string;
        };
        if (!r.ok) throw new Error(j.error ?? r.statusText);
        return j as UsageResponse;
      })
      .then((j) => {
        if (!cancelled) setData(j);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed");
      });
    return () => {
      cancelled = true;
    };
  }, [companyId]);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5">
      <div className="text-sm font-medium text-slate-200">Usage & churn risk</div>
      <div className="mt-1 text-sm text-slate-300">
        Early warning system. Helps you intervene before churn.
      </div>

      {error ? <div className="mt-3 text-sm text-red-300">{error}</div> : null}

      {data ? (
        <>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {[
              {
                title: "Last 7 days",
                w: data.windows.last7Days,
              },
              {
                title: "Last 30 days",
                w: data.windows.last30Days,
              },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-lg border border-slate-800 bg-slate-950/40 p-4"
              >
                <div className="text-xs font-medium text-slate-400">
                  {card.title}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-slate-500">Jobs</div>
                    <div className="mt-0.5 font-semibold text-slate-100">
                      {card.w.jobsCreated}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Clock-ins</div>
                    <div className="mt-0.5 font-semibold text-slate-100">
                      {card.w.clockIns}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Active workers</div>
                    <div className="mt-0.5 font-semibold text-slate-100">
                      {card.w.activeWorkers}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Reports</div>
                    <div className="mt-0.5 font-semibold text-slate-100">
                      {card.w.reportsViewed}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Flag on={data.flags.noActivity7} label="No activity in 7 days" />
            <Flag on={data.flags.lowUsage} label="Low usage" />
            <Flag on={data.flags.highEngagement} label="High engagement" />
          </div>

          <div className="mt-3 text-xs text-slate-500">
            Note: “reports viewed” and “insights generated” are currently 0 until
            we instrument events (still useful for jobs + clock-ins).
          </div>
        </>
      ) : (
        <div className="mt-3 text-sm text-slate-400">Loading…</div>
      )}
    </div>
  );
}

