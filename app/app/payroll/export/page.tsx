"use client";

import { useState, useMemo, useCallback } from "react";
import { Calendar, Download, FileSpreadsheet, FileText } from "lucide-react";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useWorkers } from "@/lib/hooks/useData";
import { useJobs } from "@/lib/hooks/useData";
import { useTimeEntries } from "@/lib/hooks/useData";
import {
  entryInRange,
  aggregatePayrollRows,
  type PayrollRow,
} from "@/lib/payrollExport";

function getDefaultDateRange(): { dateFrom: string; dateTo: string } {
  const today = new Date();
  const dateTo = today.toISOString().slice(0, 10);
  const from = new Date(today);
  from.setDate(from.getDate() - 6);
  const dateFrom = from.toISOString().slice(0, 10);
  return { dateFrom, dateTo };
}

const CURRENCY_SYMBOL = "$";

export default function PayrollExportPage() {
  const defaults = useMemo(getDefaultDateRange, []);
  const [dateFrom, setDateFrom] = useState(defaults.dateFrom);
  const [dateTo, setDateTo] = useState(defaults.dateTo);
  const [format, setFormat] = useState<"csv" | "pdf">("csv");
  const [template, setTemplate] = useState("generic-csv");
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { items: workers } = useWorkers();
  const { items: jobs } = useJobs();
  const { items: timeEntries } = useTimeEntries();

  const filteredEntries = useMemo(
    () => timeEntries.filter((e) => entryInRange(e, dateFrom, dateTo)),
    [timeEntries, dateFrom, dateTo]
  );

  const payrollRows = useMemo(
    () => aggregatePayrollRows(filteredEntries, workers, jobs),
    [filteredEntries, workers, jobs]
  );

  const isValidRange =
    dateFrom &&
    dateTo &&
    dateFrom <= dateTo;

  const triggerDownload = useCallback(
    (blob: Blob, filename: string) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    },
    []
  );

  const buildCSV = useCallback((rows: PayrollRow[]) => {
    const headers = ["Worker name", "Total hours", "Job name/ID", "Labour cost"];
    const escape = (s: string) => `"${String(s).replace(/"/g, '""')}"`;
    const csv =
      headers.join(",") +
      "\n" +
      rows
        .map((r) =>
          [
            escape(r.workerName),
            r.totalHours.toFixed(2),
            escape(r.jobNameOrId),
            `${CURRENCY_SYMBOL}${r.labourCost.toFixed(2)}`,
          ].join(",")
        )
        .join("\n");
    return new Blob([csv], { type: "text/csv;charset=utf-8;" });
  }, []);

  const buildPDF = useCallback(
    (rows: PayrollRow[]) => {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("Payroll export", 14, 20);
      doc.setFontSize(10);
      doc.text(`Period: ${dateFrom} to ${dateTo}`, 14, 28);

      const tableData = rows.map((r) => [
        r.workerName,
        r.totalHours.toFixed(2),
        r.jobNameOrId,
        `${CURRENCY_SYMBOL}${r.labourCost.toFixed(2)}`,
      ]);

      autoTable(doc, {
        startY: 34,
        head: [["Worker name", "Total hours", "Job name/ID", "Labour cost"]],
        body: tableData,
      });

      return doc.output("blob");
    },
    [dateFrom, dateTo]
  );

  const handleExport = useCallback(() => {
    setError(null);
    if (!isValidRange) {
      setError("Please select a valid date range (From must be on or before To).");
      return;
    }
    if (payrollRows.length === 0) {
      setError("No payroll data in the selected date range.");
      return;
    }
    setExporting(true);
    try {
      const filename = `payroll-export-${dateFrom}-${dateTo}`;
      if (format === "csv") {
        const blob = buildCSV(payrollRows);
        triggerDownload(blob, `${filename}.csv`);
      } else {
        const blob = buildPDF(payrollRows);
        triggerDownload(blob, `${filename}.pdf`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Export failed.");
    } finally {
      setExporting(false);
    }
  }, [
    format,
    isValidRange,
    payrollRows,
    dateFrom,
    dateTo,
    buildCSV,
    buildPDF,
    triggerDownload,
  ]);

  return (
    <div className="px-4 py-6 sm:px-6">
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
                <label
                  htmlFor="export-start"
                  className="mb-1 block text-xs font-bold uppercase tracking-widest text-fc-muted"
                >
                  From
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted" />
                  <input
                    id="export-start"
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full border border-fc-border bg-fc-surface py-2 pl-8 pr-3 text-sm text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="export-end"
                  className="mb-1 block text-xs font-bold uppercase tracking-widest text-fc-muted"
                >
                  To
                </label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fc-muted" />
                  <input
                    id="export-end"
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
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
                <input
                  type="radio"
                  name="format"
                  value="csv"
                  checked={format === "csv"}
                  onChange={() => setFormat("csv")}
                  className="h-4 w-4 text-fc-accent"
                />
                <FileSpreadsheet className="h-5 w-5 text-fc-muted" />
                <span className="text-sm font-semibold text-fc-brand">CSV</span>
                <span className="text-xs text-fc-muted">Spreadsheet-friendly</span>
              </label>
              <label className="flex cursor-pointer items-center gap-3 border border-fc-border p-3 hover:bg-fc-surface-muted has-[:checked]:border-fc-accent has-[:checked]:bg-fc-warning-bg">
                <input
                  type="radio"
                  name="format"
                  value="pdf"
                  checked={format === "pdf"}
                  onChange={() => setFormat("pdf")}
                  className="h-4 w-4 text-fc-accent"
                />
                <FileText className="h-5 w-5 text-fc-muted" />
                <span className="text-sm font-semibold text-fc-brand">PDF</span>
                <span className="text-xs text-fc-muted">Summary report</span>
              </label>
            </div>

            {format === "csv" && (
              <div className="mt-4">
                <label
                  htmlFor="export-template"
                  className="mb-1 block text-xs font-bold uppercase tracking-widest text-fc-muted"
                >
                  Export template
                </label>
                <select
                  id="export-template"
                  value={template}
                  onChange={(e) => setTemplate(e.target.value)}
                  className="w-full border border-fc-border bg-fc-surface py-2 px-3 text-sm text-fc-brand focus:border-fc-accent focus:outline-none focus:ring-1 focus:ring-fc-accent"
                >
                  <option value="generic-csv">Generic CSV</option>
                </select>
              </div>
            )}
          </Card>
        </section>

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <Button
            type="button"
            onClick={handleExport}
            disabled={exporting || !isValidRange}
          >
            <Download className="h-4 w-4" />
            {exporting ? "Exporting…" : "Export payroll"}
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
