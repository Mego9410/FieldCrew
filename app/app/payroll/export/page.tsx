import { Calendar, Download, FileSpreadsheet, FileText } from "lucide-react";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function PayrollExportPage() {
  return (
    <div className="px-6 py-6">
      <div className="mb-6">
        <h1 className="font-display text-xl font-bold text-fc-brand">Payroll export</h1>
        <p className="mt-0.5 text-sm text-fc-muted">
          Export payroll data for your accounting or payroll system.
        </p>
      </div>

      <div className="max-w-xl space-y-8">
        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
            Date range
          </h2>
          <Card variant="default" className="p-5">
            <p className="mb-4 text-sm text-fc-muted">
              Choose the pay period to include in the export.
            </p>
            <div className="flex flex-wrap gap-4">
              <div>
                <label htmlFor="export-start" className="mb-1 block text-xs font-bold uppercase tracking-widest text-fc-muted">
                  From
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted" />
                  <input
                    id="export-start"
                    type="date"
                    className="w-full border border-fc-border bg-fc-surface py-2 pl-8 pr-3 text-sm text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="export-end" className="mb-1 block text-xs font-bold uppercase tracking-widest text-fc-muted">
                  To
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted" />
                  <input
                    id="export-end"
                    type="date"
                    className="w-full border border-fc-border bg-fc-surface py-2 pl-8 pr-3 text-sm text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
                  />
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-fc-muted">
            Export format
          </h2>
          <Card variant="default" className="p-5">
            <p className="mb-4 text-sm text-fc-muted">
              Select the format for your payroll system or accountant.
            </p>
            <div className="space-y-2">
              <label className="flex cursor-pointer items-center gap-3 border border-fc-border p-3 hover:bg-fc-surface-muted has-[:checked]:border-fc-accent has-[:checked]:bg-fc-warning-bg">
                <input type="radio" name="format" value="csv" defaultChecked className="h-4 w-4 text-fc-accent" />
                <FileSpreadsheet className="h-5 w-5 text-fc-muted" />
                <span className="text-sm font-semibold text-fc-brand">CSV</span>
                <span className="text-xs text-fc-muted">Spreadsheet-friendly</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 border border-fc-border p-3 hover:bg-fc-surface-muted has-[:checked]:border-fc-accent has-[:checked]:bg-fc-warning-bg">
                <input type="radio" name="format" value="pdf" className="h-4 w-4 text-fc-accent" />
                <FileText className="h-5 w-5 text-fc-muted" />
                <span className="text-sm font-semibold text-fc-brand">PDF</span>
                <span className="text-xs text-fc-muted">Summary report</span>
              </label>
            </div>
          </Card>
        </section>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="button">
            <Download className="h-4 w-4" />
            Export payroll
          </Button>
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
