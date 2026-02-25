"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ComposedChart,
  Area,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  DollarSign,
  Download,
  HelpCircle,
} from "lucide-react";
import { routes } from "@/lib/routes";
import { getReportingData } from "@/lib/reporting.mock";
import {
  getDateRangeFromPreset,
  isMarginWarning,
  isOvertimeWarning,
  isRplhWarning,
  RPLH_TARGET,
  type DateRangePreset,
} from "@/lib/reporting.analytics";
import { chartTheme } from "@/components/charts";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

type ActiveTab = "overruns" | "overtime" | "all";

export default function ReportingPage() {
  const [datePreset, setDatePreset] = useState<DateRangePreset>("last_30_days");
  const [jobTypeId, setJobTypeId] = useState<string>("");
  const [workerId, setWorkerId] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState<ActiveTab>("overruns");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Awaited<ReturnType<typeof getReportingData>> | null>(null);

  const range = useMemo(() => getDateRangeFromPreset(datePreset), [datePreset]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getReportingData({
      dateRange: range,
      dateRangePreset: datePreset,
      jobTypeId: jobTypeId || undefined,
      workerId: workerId || undefined,
      status: status || undefined,
    }).then((d) => {
      if (!cancelled) {
        setData(d);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [range, datePreset, jobTypeId, workerId, status]);

  const marginWarning = data && isMarginWarning(data.kpis.marginPct);
  const otWarning =
    data && isOvertimeWarning(data.kpis.overtime.otPctPayroll);
  const rplhWarning = data && isRplhWarning(data.kpis.rplh);

  const handleExportCSV = () => {
    if (!data) return;
    const rows = data.tables.allJobsProfit;
    const headers = [
      "Job",
      "Revenue",
      "Labour Cost",
      "Gross Profit",
      "Margin %",
      "RPLH ($/hr)",
    ];
    const csv =
      headers.join(",") +
      "\n" +
      rows
        .map((r) =>
          [
            `"${r.jobName.replace(/"/g, '""')}"`,
            r.revenue.toFixed(2),
            r.labourCost.toFixed(2),
            r.grossProfit.toFixed(2),
            r.marginPct != null ? r.marginPct.toFixed(1) : "",
            r.rplh != null ? r.rplh.toFixed(2) : "",
          ].join(",")
        )
        .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fieldcrew-report-${range.start}-${range.end}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const [prevData, setPrevData] = useState<Awaited<ReturnType<typeof getReportingData>> | null>(null);
  const prevRange = useMemo(() => {
    if (datePreset === "this_week") return getDateRangeFromPreset("last_week");
    if (datePreset === "last_week") return getDateRangeFromPreset("last_30_days");
    return getDateRangeFromPreset("last_30_days");
  }, [datePreset]);

  useEffect(() => {
    getReportingData({
      dateRange: prevRange,
      jobTypeId: jobTypeId || undefined,
      workerId: workerId || undefined,
      status: status || undefined,
    }).then(setPrevData);
  }, [prevRange, jobTypeId, workerId, status]);

  const marginTrend =
    data && prevData && prevData.kpis.marginPct != null && prevData.kpis.marginPct > 0
      ? ((data.kpis.marginPct ?? 0) - prevData.kpis.marginPct) / prevData.kpis.marginPct
      : null;
  const rplhDelta =
    data && prevData && prevData.kpis.rplh != null && prevData.kpis.rplh > 0
      ? ((data.kpis.rplh ?? 0) - prevData.kpis.rplh) / prevData.kpis.rplh
      : null;

  const selectClass =
    "border border-fc-border bg-fc-surface py-2 px-3 text-sm text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent";

  return (
    <div className="px-4 py-6 sm:px-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="font-display text-xl font-bold text-fc-brand">
            Reporting
          </h1>
          <p className="mt-0.5 text-sm text-fc-muted">
            Labour cost, overtime, and job profitability insights.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={datePreset}
            onChange={(e) => setDatePreset(e.target.value as DateRangePreset)}
            className={selectClass}
            aria-label="Date range"
          >
            <option value="this_week">This week</option>
            <option value="last_week">Last week</option>
            <option value="last_30_days">Last 30 days</option>
          </select>
          <select
            value={jobTypeId}
            onChange={(e) => setJobTypeId(e.target.value)}
            className={selectClass}
            aria-label="Job type filter"
          >
            <option value="">All job types</option>
            {data?.jobTypes.map((jt) => (
              <option key={jt.id} value={jt.id}>
                {jt.name}
              </option>
            ))}
          </select>
          <select
            value={workerId}
            onChange={(e) => setWorkerId(e.target.value)}
            className={selectClass}
            aria-label="Worker filter"
          >
            <option value="">All workers</option>
            {data?.workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className={selectClass}
            aria-label="Status filter"
          >
            <option value="">All statuses</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_progress">In progress</option>
            <option value="completed">Completed</option>
          </select>
          <Button type="button" variant="secondary" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-fc-lg border border-fc-border-subtle bg-fc-surface-muted"
              />
            ))}
          </div>
        </div>
      ) : !data ? (
        <Card variant="default" className="py-12 text-center">
          <p className="text-fc-muted">No data available for this range.</p>
        </Card>
      ) : (
        <>
          <section className="mb-8">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
              Key metrics
            </h2>
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Labour Margin"
              primaryValue={
                data.kpis.marginPct != null
                  ? `${data.kpis.marginPct.toFixed(1)}%`
                  : "—"
              }
              secondaryValue={`Revenue $${data.kpis.revenue.toLocaleString()} • Labour $${data.kpis.labourCost.toLocaleString()}`}
              trend={
                marginTrend != null
                  ? { value: marginTrend * 100, label: "previous period" }
                  : undefined
              }
              icon={TrendingUp}
              warning={marginWarning ?? false}
              tooltip="Margin = (Revenue - Labour Cost) / Revenue × 100"
            />
            <KpiCard
              title="Overtime Cost"
              primaryValue={`$${Math.round(data.kpis.overtime.otCost).toLocaleString()}`}
              secondaryValue={`OT hrs ${data.kpis.overtime.otHours.toFixed(1)} • ${data.kpis.overtime.otPctPayroll.toFixed(1)}% payroll`}
              icon={Clock}
              warning={otWarning ?? false}
              tooltip="Overtime cost includes 1.5× premium"
            />
            <KpiCard
              title="Jobs Over Budget"
              primaryValue={`${data.kpis.overruns.count} jobs`}
              secondaryValue={`+${data.kpis.overruns.hours.toFixed(1)} hrs • $${Math.round(data.kpis.overruns.cost).toLocaleString()} est overrun`}
              icon={AlertTriangle}
              href={`${routes.owner.jobs}?filter=overrun`}
              tooltip="Jobs where actual hours exceed estimated"
            />
            <KpiCard
              title="Revenue per Labour Hour"
              primaryValue={
                data.kpis.rplh != null
                  ? `$${data.kpis.rplh.toFixed(0)}/hr`
                  : "—"
              }
              secondaryValue={`Target $${RPLH_TARGET}/hr • ${rplhDelta != null ? `Δ ${(rplhDelta * 100).toFixed(1)}% vs prev` : ""}`}
              trend={
                rplhDelta != null
                  ? { value: rplhDelta * 100, label: "previous period" }
                  : undefined
              }
              icon={DollarSign}
              warning={rplhWarning ?? false}
              tooltip="RPLH = Total Revenue ÷ Total Labour Hours"
            />
          </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
              Performance trends
            </h2>
          <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard title="Revenue vs Labour Cost (Over Time)">
              {data.series.revenueVsLabour.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={data.series.revenueVsLabour}>
                    <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} strokeOpacity={chartTheme.grid.strokeOpacity} />
                    <XAxis
                      dataKey="label"
                      tick={chartTheme.axis.tick}
                    />
                    <YAxis
                      tick={chartTheme.axis.tick}
                      tickFormatter={(v) => `$${v >= 1000 ? v / 1000 + "k" : v}`}
                    />
                    <Tooltip
                      contentStyle={chartTheme.tooltip.contentStyle}
                      formatter={(value: number | undefined) => [value != null ? `$${value.toLocaleString()}` : "", ""]}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke={chartTheme.colors.primary}
                      fill={chartTheme.colors.primary}
                      fillOpacity={0.3}
                      name="Revenue"
                    />
                    <Area
                      type="monotone"
                      dataKey="labourCost"
                      stroke={chartTheme.colors.secondary}
                      fill={chartTheme.colors.secondary}
                      fillOpacity={0.3}
                      name="Labour Cost"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard title="Overtime Hours (Over Time)">
              {data.series.overtime.every((p) => p.otHours === 0) ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.series.overtime}>
                    <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} strokeOpacity={chartTheme.grid.strokeOpacity} />
                    <XAxis dataKey="label" tick={chartTheme.axis.tick} />
                    <YAxis tick={chartTheme.axis.tick} tickFormatter={(v) => `${v}h`} />
                    <Tooltip
                      contentStyle={chartTheme.tooltip.contentStyle}
                      formatter={(value: number | undefined, name?: string) => [
                        value ?? 0,
                        name === "otHours" ? "OT hours" : "OT cost",
                      ]}
                    />
                    <Bar
                      dataKey="otHours"
                      fill={chartTheme.colors.warning}
                      name="OT hours"
                      radius={chartTheme.bar.radius}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>
          </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
              Estimated vs actual & job type margin
            </h2>
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard title="Estimated vs Actual Hours (Top 10 Jobs)">
              {data.tables.topOverrunning.length === 0 ? (
                <EmptyChart />
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={data.tables.topOverrunning.slice(0, 10).map((r) => ({
                      ...r,
                      name: r.jobName.length > 20 ? r.jobName.slice(0, 20) + "…" : r.jobName,
                    }))}
                    layout="vertical"
                    margin={{ left: 60, right: 20 }}
                  >
                    <CartesianGrid strokeDasharray={chartTheme.grid.strokeDasharray} stroke={chartTheme.grid.stroke} strokeOpacity={chartTheme.grid.strokeOpacity} />
                    <XAxis type="number" tick={chartTheme.axis.tick} tickFormatter={(v) => `${v}h`} />
                    <YAxis type="category" dataKey="name" width={100} tick={chartTheme.axis.tick} />
                    <Tooltip contentStyle={chartTheme.tooltip.contentStyle} formatter={(value: number | undefined) => [value != null ? `${value.toFixed(1)} hrs` : "", ""]} />
                    <Legend />
                    <Bar dataKey="estimatedHours" fill={chartTheme.colors.secondary} name="Estimated" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="actualHours" fill={chartTheme.colors.danger} name="Actual" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </ChartCard>

            <ChartCard title="Lowest Margin Job Types">
              {data.tables.jobTypeMargin.length === 0 ? (
                <EmptyChart />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" aria-label="Job type margins">
                    <thead>
                      <tr className="border-b border-fc-border">
                        <th className="py-2 text-left font-medium text-fc-brand">
                          Job type
                        </th>
                        <th className="py-2 text-right font-medium text-fc-brand">
                          Jobs
                        </th>
                        <th className="py-2 text-right font-medium text-fc-brand">
                          Revenue
                        </th>
                        <th className="py-2 text-right font-medium text-fc-brand">
                          Labour
                        </th>
                        <th className="py-2 text-right font-medium text-fc-brand">
                          Margin
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.tables.jobTypeMargin.slice(0, 8).map((r) => (
                        <tr
                          key={r.jobTypeId}
                          className="border-b border-fc-border last:border-0 hover:bg-slate-50"
                        >
                          <td className="py-2 text-fc-brand">{r.jobTypeName}</td>
                          <td className="py-2 text-right">{r.jobsCount}</td>
                          <td className="py-2 text-right">
                            ${r.revenue.toLocaleString()}
                          </td>
                          <td className="py-2 text-right">
                            ${Math.round(r.labourCost).toLocaleString()}
                          </td>
                          <td
                            className={`py-2 text-right font-medium ${
                              r.marginPct != null && r.marginPct < 40
                                ? "text-amber-600"
                                : ""
                            }`}
                          >
                            {r.marginPct != null
                              ? `${r.marginPct.toFixed(1)}%`
                              : "—"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </ChartCard>
          </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
              Detail tables
            </h2>
          <div className="border border-fc-border bg-fc-surface">
            <div className="flex border-b border-fc-border bg-fc-surface-muted">
              {(
                [
                  { id: "overruns" as const, label: "Overrunning jobs" },
                  { id: "overtime" as const, label: "Overtime workers" },
                  { id: "all" as const, label: "All jobs (profit view)" },
                ] as const
              ).map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                    activeTab === id
                      ? "border-fc-accent text-fc-brand bg-fc-surface"
                      : "border-transparent text-fc-muted hover:text-fc-brand"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="overflow-x-auto p-4 border-t-0">
              {activeTab === "overruns" && (
                <ReportingTable
                  columns={[
                    { key: "jobName", label: "Job", render: (r) => r.jobName },
                    { key: "customerName", label: "Customer", render: (r) => r.customerName ?? "—" },
                    { key: "estimatedHours", label: "Est hrs", render: (r) => r.estimatedHours.toFixed(1) },
                    { key: "actualHours", label: "Actual hrs", render: (r) => r.actualHours.toFixed(1) },
                    { key: "overrunHours", label: "Overrun hrs", render: (r) => r.overrunHours.toFixed(1) },
                    { key: "overrunCost", label: "Overrun cost", render: (r) => `$${Math.round(r.overrunCost)}` },
                    { key: "status", label: "Status", render: (r) => r.status ?? "—" },
                  ]}
                  rows={data.tables.overrunningJobs}
                  href={(r) => routes.owner.job(r.jobId)}
                  emptyMessage="No overrunning jobs in this period."
                />
              )}
              {activeTab === "overtime" && (
                <ReportingTable
                  columns={[
                    { key: "workerName", label: "Worker", render: (r) => r.workerName },
                    { key: "totalHours", label: "Total hrs", render: (r) => r.totalHours.toFixed(1) },
                    { key: "otHours", label: "OT hrs", render: (r) => r.otHours.toFixed(1) },
                    { key: "otCost", label: "OT cost", render: (r) => `$${Math.round(r.otCost)}` },
                    { key: "jobsWorked", label: "Jobs worked", render: (r) => String(r.jobsWorked) },
                  ]}
                  rows={data.tables.overtimeWorkers}
                  href={(r) => routes.owner.worker(r.workerId)}
                  emptyMessage="No overtime in this period."
                />
              )}
              {activeTab === "all" && (
                <ReportingTable
                  columns={[
                    { key: "jobName", label: "Job", render: (r) => r.jobName },
                    { key: "revenue", label: "Revenue", render: (r) => `$${r.revenue.toLocaleString()}` },
                    { key: "labourCost", label: "Labour cost", render: (r) => `$${Math.round(r.labourCost).toLocaleString()}` },
                    { key: "grossProfit", label: "Gross profit", render: (r) => `$${r.grossProfit.toLocaleString()}` },
                    { key: "marginPct", label: "Margin %", render: (r) => r.marginPct != null ? `${r.marginPct.toFixed(1)}%` : "—" },
                    { key: "rplh", label: "RPLH ($/hr)", render: (r) => r.rplh != null ? `$${r.rplh.toFixed(0)}` : "—" },
                  ]}
                  rows={data.tables.allJobsProfit}
                  href={(r) => routes.owner.job(r.jobId)}
                  emptyMessage="No jobs in this period."
                />
              )}
            </div>
          </div>
          </section>
        </>
      )}
    </div>
  );
}

function KpiCard({
  title,
  primaryValue,
  secondaryValue,
  trend,
  icon: Icon,
  warning,
  href,
  tooltip,
}: {
  title: string;
  primaryValue: string;
  secondaryValue: string;
  trend?: { value: number; label?: string };
  icon: React.ElementType;
  warning?: boolean;
  href?: string;
  tooltip?: string;
}) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isPositive = (trend?.value ?? 0) >= 0;
  const content = (
    <Card variant={warning ? "warning" : "default"} className={href ? "" : ""}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="mb-2 flex items-center gap-2">
            <Icon className="h-4 w-4 shrink-0 text-fc-muted" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-fc-muted">{title}</p>
            {warning && <Badge variant="warning">Warning</Badge>}
            {tooltip && (
              <div className="relative">
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="text-fc-muted hover:text-fc-brand"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
                {showTooltip && (
                  <div className="absolute left-0 top-6 z-10 w-48 border border-fc-border bg-fc-surface p-2 text-xs">
                    {tooltip}
                  </div>
                )}
              </div>
            )}
          </div>
          <p className="text-2xl font-bold tracking-tight text-fc-brand">{primaryValue}</p>
          <div className="mt-2 border-t border-fc-border pt-2">
            <p className="text-sm text-fc-muted">{secondaryValue}</p>
            {trend != null && (
              <p
                className={`mt-1 text-xs font-medium ${
                  isPositive ? "text-fc-success" : "text-fc-danger"
                }`}
              >
                {isPositive ? "↑" : "↓"} {Math.abs(trend.value).toFixed(1)}% vs{" "}
                {trend.label ?? "prev"}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card variant="default">
      <h3 className="mb-4 text-[10px] font-bold uppercase tracking-widest text-fc-muted">{title}</h3>
      <div className="min-h-[260px]">{children}</div>
    </Card>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-48 items-center justify-center text-sm text-fc-muted">
      No data for this period
    </div>
  );
}

function ReportingTable<T extends { jobId?: string; workerId?: string }>({
  columns,
  rows,
  href,
  emptyMessage,
}: {
  columns: { key: string; label: string; render: (r: T) => string }[];
  rows: T[];
  href: (r: T) => string;
  emptyMessage: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="py-12 text-center text-sm text-fc-muted">
        {emptyMessage}
      </div>
    );
  }
  return (
    <table className="w-full text-sm" aria-label="Report table">
      <thead>
        <tr className="border-b border-fc-border">
          {columns.map((c) => (
            <th
              key={c.key}
              className="py-2 text-left font-medium text-fc-brand first:pl-0"
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr
            key={i}
            className="border-b border-fc-border last:border-0 hover:bg-slate-50"
          >
            {columns.map((c) => (
              <td key={c.key} className="py-3 first:pl-0">
                {columns.indexOf(c) === 0 ? (
                  <Link
                    href={href(r)}
                    className="font-medium text-fc-accent hover:underline"
                  >
                    {c.render(r)}
                  </Link>
                ) : (
                  c.render(r)
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
