import { Calendar, Download, FileSpreadsheet, FileText } from "lucide-react";
import { routes } from "@/lib/routes";

export default function PayrollExportPage() {
  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-fc-brand">Payroll export</h1>
        <p className="mt-1 text-sm text-fc-muted">
          Export payroll data for your accounting or payroll system.
        </p>
      </div>

      <div className="max-w-xl space-y-6">
        {/* Date range */}
        <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-fc-brand">Date range</h2>
          <p className="mt-1 text-sm text-fc-muted">
            Choose the pay period to include in the export.
          </p>
          <div className="mt-4 flex flex-wrap gap-4">
            <div>
              <label htmlFor="export-start" className="mb-1 block text-xs font-medium text-fc-muted">
                From
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted" />
                <input
                  id="export-start"
                  type="date"
                  className="w-full rounded-lg border border-fc-border bg-white py-2 pl-9 pr-3 text-sm text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
                />
              </div>
            </div>
            <div>
              <label htmlFor="export-end" className="mb-1 block text-xs font-medium text-fc-muted">
                To
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted" />
                <input
                  id="export-end"
                  type="date"
                  className="w-full rounded-lg border border-fc-border bg-white py-2 pl-9 pr-3 text-sm text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Format */}
        <div className="rounded-lg border border-fc-border bg-white p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-fc-brand">Export format</h2>
          <p className="mt-1 text-sm text-fc-muted">
            Select the format for your payroll system or accountant.
          </p>
          <div className="mt-4 space-y-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-fc-border p-3 hover:bg-slate-50 has-[:checked]:border-fc-accent has-[:checked]:bg-fc-accent/5">
              <input type="radio" name="format" value="csv" defaultChecked className="h-4 w-4 text-fc-accent" />
              <FileSpreadsheet className="h-5 w-5 text-fc-muted" />
              <span className="text-sm font-medium text-fc-brand">CSV</span>
              <span className="text-xs text-fc-muted">Spreadsheet-friendly</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-fc-border p-3 hover:bg-slate-50 has-[:checked]:border-fc-accent has-[:checked]:bg-fc-accent/5">
              <input type="radio" name="format" value="pdf" className="h-4 w-4 text-fc-accent" />
              <FileText className="h-5 w-5 text-fc-muted" />
              <span className="text-sm font-medium text-fc-brand">PDF</span>
              <span className="text-xs text-fc-muted">Summary report</span>
            </label>
          </div>
        </div>

        {/* Export button */}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-fc-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-fc-brand/90"
          >
            <Download className="h-4 w-4" />
            Export payroll
          </button>
          <a
            href={routes.owner.home}
            className="text-sm font-medium text-fc-accent hover:underline"
          >
            Back to dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
