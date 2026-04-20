"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";

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
        "rounded-lg border px-2 py-1 text-xs",
        on
          ? "border-amber-200 bg-amber-50 text-amber-900"
          : "border-fc-border bg-white text-fc-muted",
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
    <Card className="mt-6 rounded-xl">
      <div className="text-sm font-semibold text-fc-brand">Usage & churn risk</div>
      <div className="mt-0.5 text-sm text-fc-muted">
        Early warning system. Helps you intervene before churn.
      </div>

      {error ? <div className="mt-3 text-sm text-red-700">{error}</div> : null}

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
                className="rounded-lg border border-fc-border bg-fc-surface-muted p-4"
              >
                <div className="text-xs font-semibold text-fc-muted">
                  {card.title}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <div className="text-xs text-fc-muted">Jobs</div>
                    <div className="mt-0.5 font-semibold text-fc-brand">
                      {card.w.jobsCreated}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-fc-muted">Clock-ins</div>
                    <div className="mt-0.5 font-semibold text-fc-brand">
                      {card.w.clockIns}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-fc-muted">Active workers</div>
                    <div className="mt-0.5 font-semibold text-fc-brand">
                      {card.w.activeWorkers}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-fc-muted">Reports</div>
                    <div className="mt-0.5 font-semibold text-fc-brand">
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

          <div className="mt-3 text-xs text-fc-muted">
            Note: “reports viewed” and “insights generated” are currently 0 until
            we instrument events (still useful for jobs + clock-ins).
          </div>
        </>
      ) : (
        <div className="mt-3 text-sm text-fc-muted">Loading…</div>
      )}
    </Card>
  );
}

