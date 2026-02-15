import { Home, ClipboardList, DollarSign, Users, Check, Circle, Clock, AlertTriangle, Mail, FileSpreadsheet, BarChart3, Link2 } from "lucide-react";

export type ViewType = 0 | 1 | 2 | 3 | 4 | 5;

/**
 * Hero visual: stylized view of the FieldCrew app.
 * ClickUp-style high-fidelity mockup with dark sidebar and different views based on selected feature.
 */
export function HeroVisual({ view = 0 }: { view?: ViewType }) {
  const navItems = [
    { Icon: Home, label: "Home" },
    { Icon: ClipboardList, label: "Jobs" },
    { Icon: DollarSign, label: "Payroll" },
    { Icon: Users, label: "Workers" },
  ];

  function renderView(viewType: ViewType) {
    switch (viewType) {
      case 0: // Job-Based Time Tracking
        return renderTimeTrackingView();
      case 1: // Labour Cost Per Job
        return renderLabourCostView();
      case 2: // Payroll Export
        return renderPayrollExportView();
      case 3: // Leak Detection
        return renderLeakDetectionView();
      case 4: // Magic Link Access
        return renderMagicLinkView();
      case 5: // Weekly Reports
        return renderWeeklyReportsView();
      default:
        return renderTimeTrackingView();
    }
  }

  function renderTimeTrackingView() {
    return (
      <>
        <div className="flex items-center justify-between border-b border-fc-border bg-white px-6 py-3">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-fc-muted" />
            <span className="font-body text-sm font-semibold text-fc-brand">Select a job</span>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 rounded-lg border-2 border-fc-accent bg-fc-accent/10 px-4 py-3 cursor-pointer hover:bg-fc-accent/20">
              <Check className="h-5 w-5 text-fc-accent" />
              <span className="flex-1 font-body text-sm font-medium text-fc-brand">123 Main — Install</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-fc-border px-4 py-3 cursor-pointer hover:bg-slate-50">
              <Circle className="h-5 w-5 text-slate-300" />
              <span className="flex-1 font-body text-sm text-fc-muted">456 Oak — Service</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-fc-border px-4 py-3 cursor-pointer hover:bg-slate-50">
              <Circle className="h-5 w-5 text-slate-300" />
              <span className="flex-1 font-body text-sm text-fc-muted">789 Pine — Maintenance</span>
            </div>
          </div>
          <div className="mt-4">
            <button className="w-full rounded-lg bg-fc-accent px-4 py-3 text-sm font-semibold text-white">
              Clock In
            </button>
          </div>
        </div>
      </>
    );
  }

  function renderLabourCostView() {
    return (
      <>
        <div className="border-b border-fc-border bg-white px-6 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-fc-brand">Labour cost per job</h3>
            <span className="rounded-full bg-fc-accent/10 px-3 py-1 text-xs font-medium text-fc-accent">
              This week
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-fc-border bg-white p-4">
              <span className="font-body text-xs text-fc-muted">Hours</span>
              <p className="font-display text-2xl font-bold text-fc-brand">124</p>
            </div>
            <div className="rounded-lg border border-fc-border bg-white p-4">
              <span className="font-body text-xs text-fc-muted">Labour $</span>
              <p className="font-display text-2xl font-bold text-fc-brand">4,960</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-0 rounded-lg border border-fc-border">
            <div className="flex items-center justify-between border-b border-fc-border bg-slate-50 px-4 py-3">
              <span className="font-body text-xs font-semibold text-fc-muted">Job</span>
              <span className="font-body text-xs font-semibold text-fc-muted">Hours</span>
              <span className="font-body text-xs font-semibold text-fc-muted">Labour</span>
            </div>
            <div className="flex items-center justify-between border-b border-fc-border/50 px-4 py-3 hover:bg-slate-50/50">
              <span className="font-body text-sm font-medium text-fc-brand">123 Main — Install</span>
              <span className="font-body text-sm text-fc-muted">42</span>
              <span className="font-body text-sm font-semibold text-fc-accent">$1,680</span>
            </div>
            <div className="flex items-center justify-between border-b border-fc-border/50 px-4 py-3 hover:bg-slate-50/50">
              <span className="font-body text-sm text-fc-muted">456 Oak — Service</span>
              <span className="font-body text-sm text-fc-muted">38</span>
              <span className="font-body text-sm text-fc-muted">$1,520</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3 hover:bg-slate-50/50">
              <span className="font-body text-sm text-fc-muted">789 Pine — Maintenance</span>
              <span className="font-body text-sm text-fc-muted">44</span>
              <span className="font-body text-sm text-fc-muted">$1,760</span>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderPayrollExportView() {
    return (
      <>
        <div className="border-b border-fc-border bg-white px-6 py-4">
          <h3 className="mb-4 font-display text-lg font-bold text-fc-brand">Export Payroll</h3>
          <div className="space-y-3">
            <div className="rounded-lg border border-fc-border bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-fc-accent" />
                <span className="font-body text-sm font-semibold text-fc-brand">QuickBooks CSV</span>
              </div>
              <p className="font-body text-xs text-fc-muted">Worker, hours, job, labour $</p>
            </div>
            <div className="rounded-lg border border-fc-border bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4 text-fc-muted" />
                <span className="font-body text-sm font-semibold text-fc-muted">Generic CSV</span>
              </div>
              <p className="font-body text-xs text-fc-muted">Standard format</p>
            </div>
          </div>
        </div>
        <div className="px-6 py-4">
          <button className="w-full rounded-lg border-2 border-fc-accent bg-fc-accent/10 px-4 py-3 text-sm font-semibold text-fc-accent">
            Download CSV
          </button>
        </div>
      </>
    );
  }

  function renderLeakDetectionView() {
    return (
      <>
        <div className="border-b border-fc-border bg-white px-6 py-4">
          <h3 className="mb-4 font-display text-lg font-bold text-fc-brand">Payroll Leak Detection</h3>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
              <div className="flex-1">
                <p className="font-body text-sm font-semibold text-red-900">Overlapping Shift</p>
                <p className="font-body text-xs text-red-700">John D. clocked in at 8:00 AM while already clocked in</p>
                <p className="mt-1 font-body text-xs text-red-600">123 Main — Install</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-yellow-500" />
              <div className="flex-1">
                <p className="font-body text-sm font-semibold text-yellow-900">Long Shift</p>
                <p className="font-body text-xs text-yellow-700">Mike S. worked 14 hours on 456 Oak — Service</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <AlertTriangle className="h-5 w-5 shrink-0 text-orange-500" />
              <div className="flex-1">
                <p className="font-body text-sm font-semibold text-orange-900">Missing Clock-Out</p>
                <p className="font-body text-xs text-orange-700">Sarah K. didn&apos;t clock out yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderMagicLinkView() {
    return (
      <>
        <div className="border-b border-fc-border bg-white px-6 py-4">
          <h3 className="mb-4 font-display text-lg font-bold text-fc-brand">Worker Access</h3>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-3">
            <div className="rounded-lg border border-fc-border bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-fc-accent" />
                <span className="font-body text-sm font-semibold text-fc-brand">John Doe</span>
              </div>
              <p className="mb-3 font-body text-xs text-fc-muted">fieldcrew.com/w/abc123xyz</p>
              <button className="w-full rounded-lg bg-fc-accent px-4 py-2 text-xs font-semibold text-white">
                Send SMS Link
              </button>
            </div>
            <div className="rounded-lg border border-fc-border bg-white p-4">
              <div className="mb-2 flex items-center gap-2">
                <Link2 className="h-4 w-4 text-fc-muted" />
                <span className="font-body text-sm font-semibold text-fc-muted">Mike Smith</span>
              </div>
              <p className="mb-3 font-body text-xs text-fc-muted">fieldcrew.com/w/def456uvw</p>
              <button className="w-full rounded-lg border border-fc-border px-4 py-2 text-xs font-semibold text-fc-muted">
                Send SMS Link
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  function renderWeeklyReportsView() {
    return (
      <>
        <div className="border-b border-fc-border bg-white px-6 py-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-fc-brand">Weekly Reports</h3>
            <Mail className="h-4 w-4 text-fc-muted" />
          </div>
        </div>
        <div className="px-6 py-4">
          <div className="space-y-4">
            <div className="rounded-lg border border-fc-border bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-body text-sm font-semibold text-fc-brand">This Week</span>
                <BarChart3 className="h-4 w-4 text-fc-accent" />
              </div>
              <p className="font-body text-xs text-fc-muted">124 hours • $4,960 labour cost</p>
              <p className="mt-2 font-body text-xs text-fc-muted">Sent Monday 8:00 AM</p>
            </div>
            <div className="rounded-lg border border-fc-border bg-white p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-body text-sm font-semibold text-fc-muted">Last Week</span>
                <BarChart3 className="h-4 w-4 text-fc-muted" />
              </div>
              <p className="font-body text-xs text-fc-muted">118 hours • $4,720 labour cost</p>
              <p className="mt-2 font-body text-xs text-fc-muted">Sent Monday 8:00 AM</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="relative w-full mb-[-20px] lg:mb-[-16px]" aria-hidden>
      <div className="overflow-hidden rounded-lg border border-fc-border bg-white shadow-[0_8px_30px_rgba(15,23,42,0.12)] w-full">
        {/* Browser frame */}
        <div className="flex items-center gap-2 border-b border-fc-border bg-slate-100 px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-slate-300" />
            <span className="h-3 w-3 rounded-full bg-slate-300" />
            <span className="h-3 w-3 rounded-full bg-slate-300" />
          </div>
          <div className="ml-4 flex-1 rounded-md bg-white px-3 py-1 text-center">
            <span className="font-body text-xs text-fc-muted">
              app.fieldcrew.com/jobs
            </span>
          </div>
        </div>

        <div className="flex min-h-[500px] bg-slate-50">
          {/* Dark Sidebar */}
          <aside className="w-20 shrink-0 border-r border-slate-200 bg-slate-900 py-4">
            <nav className="flex flex-col gap-1 px-3">
              {navItems.map((item, i) => {
                const Icon = item.Icon;
                return (
                  <div
                    key={item.label}
                    className={`flex flex-col items-center gap-1 rounded-lg px-2 py-2.5 transition-colors ${
                      i === 1
                        ? "bg-slate-800"
                        : "hover:bg-slate-800/50"
                    }`}
                  >
                    <Icon
                      className={`h-5 w-5 ${
                        i === 1 ? "text-white" : "text-slate-400"
                      }`}
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className={`font-body text-[10px] ${
                      i === 1 ? "text-white font-medium" : "text-slate-400"
                    }`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </nav>
            <div className="mt-4 border-t border-slate-800 px-3 pt-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-gradient-to-br from-fc-accent to-fc-gradient-mid" />
                <span className="font-body text-[10px] text-slate-400">Team</span>
              </div>
            </div>
          </aside>

          {/* Main content: Different views based on selected feature */}
          <main className="min-w-0 flex-1 bg-white">
            {renderView(view)}
          </main>
        </div>
      </div>
    </div>
  );
}
