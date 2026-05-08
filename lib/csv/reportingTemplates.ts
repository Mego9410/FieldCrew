/**
 * Job profitability CSV layouts for reporting exports (FSM + accounting tools).
 * Validate column sets against vendor reporting/import guidance when adjusting layouts.
 */

import type {
  AllJobsProfitRow,
  DateRangePreset,
} from "@/lib/reporting.analytics";
import { csvStringToBlob, rowsToCsvString } from "@/lib/csv/formatCsv";

export interface ReportingExportContext {
  rangeStart: string;
  rangeEnd: string;
  datePreset: DateRangePreset;
}

export type ReportingCsvTemplateId =
  | "generic"
  | "google-sheets"
  | "quickbooks"
  | "servicetitan"
  | "housecall-pro"
  | "jobber"
  | "fieldpulse"
  | "workiz"
  | "service-fusion"
  | "connecteam"
  | "xero"
  | "sage"
  | "freshbooks"
  | "wave"
  | "netsuite"
  | "zoho-books"
  | "dynamics-bc";

export interface ReportingTemplateMeta {
  id: ReportingCsvTemplateId;
  label: string;
  description: string;
}

export const REPORTING_TEMPLATE_GROUPS: {
  label: string;
  templates: ReportingTemplateMeta[];
}[] = [
  {
    label: "Spreadsheet",
    templates: [
      {
        id: "generic",
        label: "Generic CSV",
        description: "Job profitability columns suitable for any spreadsheet.",
      },
      {
        id: "google-sheets",
        label: "Google Sheets / Excel",
        description: "Same data as generic with UTF-8 BOM for Excel.",
      },
    ],
  },
  {
    label: "Field service",
    templates: [
      {
        id: "servicetitan",
        label: "ServiceTitan",
        description: "Job revenue and labor summary for comparison or bridge imports.",
      },
      {
        id: "housecall-pro",
        label: "Housecall Pro",
        description: "Job name and key profit metrics.",
      },
      {
        id: "jobber",
        label: "Jobber",
        description: "Job-level revenue, labor, and margin export.",
      },
      {
        id: "fieldpulse",
        label: "FieldPulse",
        description: "Job profitability with internal ID for matching.",
      },
      {
        id: "workiz",
        label: "Workiz",
        description: "Job revenue vs labor cost summary.",
      },
      {
        id: "service-fusion",
        label: "Service Fusion",
        description: "Job number and financial breakdown.",
      },
      {
        id: "connecteam",
        label: "Connecteam",
        description: "Job profitability snapshot.",
      },
    ],
  },
  {
    label: "Accounting",
    templates: [
      {
        id: "quickbooks",
        label: "QuickBooks",
        description:
          "Customer/job style columns—map revenue and COGS (labor) in QuickBooks reporting.",
      },
      {
        id: "xero",
        label: "Xero",
        description: "Tracking category style job names with amounts for margin analysis.",
      },
      {
        id: "sage",
        label: "Sage",
        description: "Job reference and profit figures for Sage reporting imports.",
      },
      {
        id: "freshbooks",
        label: "FreshBooks",
        description: "Project revenue, expenses (labor), and profit.",
      },
      {
        id: "wave",
        label: "Wave",
        description: "Job income vs labor cost.",
      },
      {
        id: "netsuite",
        label: "NetSuite",
        description: "Job/project profitability columns.",
      },
      {
        id: "zoho-books",
        label: "Zoho Books",
        description: "Project profit breakdown.",
      },
      {
        id: "dynamics-bc",
        label: "Dynamics 365 Business Central",
        description: "Job and quantity-style profitability—map in BC.",
      },
    ],
  },
];

const REPORT_META_BY_ID: Record<ReportingCsvTemplateId, ReportingTemplateMeta> =
  {} as Record<ReportingCsvTemplateId, ReportingTemplateMeta>;
for (const g of REPORTING_TEMPLATE_GROUPS) {
  for (const t of g.templates) {
    REPORT_META_BY_ID[t.id] = t;
  }
}

export function getReportingTemplateMeta(id: ReportingCsvTemplateId): ReportingTemplateMeta {
  return REPORT_META_BY_ID[id];
}

function marginStr(r: AllJobsProfitRow): string {
  return r.marginPct != null ? r.marginPct.toFixed(1) : "";
}

function rplhStr(r: AllJobsProfitRow): string {
  return r.rplh != null ? r.rplh.toFixed(2) : "";
}

function presetSlug(preset: DateRangePreset): string {
  switch (preset) {
    case "this_week":
      return "this-week";
    case "last_week":
      return "last-week";
    case "last_30_days":
      return "last-30-days";
    case "custom":
      return "custom";
    default: {
      const _e: never = preset;
      return _e;
    }
  }
}

export function buildReportingCsvString(
  templateId: ReportingCsvTemplateId,
  rows: AllJobsProfitRow[],
  _ctx: ReportingExportContext
): string {
  void _ctx;
  const bom = templateId === "google-sheets";

  const rowGeneric = (r: AllJobsProfitRow) => [
    r.jobName,
    r.jobId,
    r.revenue.toFixed(2),
    r.labourCost.toFixed(2),
    r.grossProfit.toFixed(2),
    marginStr(r),
    rplhStr(r),
  ];

  switch (templateId) {
    case "generic":
      return rowsToCsvString(
        [
          "Job name",
          "Job ID",
          "Revenue",
          "Labor cost",
          "Gross profit",
          "Margin %",
          "RPLH ($/hr)",
        ],
        rows.map(rowGeneric),
        { bom: false }
      );

    case "google-sheets":
      return rowsToCsvString(
        [
          "Job name",
          "Job ID",
          "Revenue",
          "Labor cost",
          "Gross profit",
          "Margin %",
          "RPLH ($/hr)",
        ],
        rows.map(rowGeneric),
        { bom: true }
      );

    case "quickbooks":
      return rowsToCsvString(
        [
          "Customer job",
          "Job ID",
          "Income",
          "COGS labor",
          "Gross profit",
          "Margin %",
          "Revenue per labor hour",
        ],
        rows.map((r) => [
          r.jobName,
          r.jobId,
          r.revenue.toFixed(2),
          r.labourCost.toFixed(2),
          r.grossProfit.toFixed(2),
          marginStr(r),
          rplhStr(r),
        ]),
        { bom }
      );

    case "servicetitan":
      return rowsToCsvString(
        [
          "Job name",
          "Job ID",
          "Revenue",
          "Labor cost",
          "Gross profit",
          "Margin %",
          "RPLH",
        ],
        rows.map((r) => [
          r.jobName,
          r.jobId,
          r.revenue.toFixed(2),
          r.labourCost.toFixed(2),
          r.grossProfit.toFixed(2),
          marginStr(r),
          rplhStr(r),
        ]),
        { bom }
      );

    case "housecall-pro":
      return rowsToCsvString(
        [
          "Job",
          "Reference ID",
          "Total revenue",
          "Labor cost",
          "Profit",
          "Margin %",
          "RPLH",
        ],
        rows.map((r) => [
          r.jobName,
          r.jobId,
          r.revenue.toFixed(2),
          r.labourCost.toFixed(2),
          r.grossProfit.toFixed(2),
          marginStr(r),
          rplhStr(r),
        ]),
        { bom }
      );

    case "jobber":
      return rowsToCsvString(
        [
          "Job",
          "Job ID",
          "Revenue",
          "Labor",
          "Gross profit",
          "Margin %",
          "RPLH",
        ],
        rows.map((r) => [
          r.jobName,
          r.jobId,
          r.revenue.toFixed(2),
          r.labourCost.toFixed(2),
          r.grossProfit.toFixed(2),
          marginStr(r),
          rplhStr(r),
        ]),
        { bom }
      );

    case "fieldpulse":
      return rowsToCsvString(
        [
          "Job name",
          "Job ID",
          "Revenue",
          "Labor cost",
          "Gross profit",
          "Margin %",
          "RPLH ($/hr)",
        ],
        rows.map((r) => [
          r.jobName,
          r.jobId,
          r.revenue.toFixed(2),
          r.labourCost.toFixed(2),
          r.grossProfit.toFixed(2),
          marginStr(r),
          rplhStr(r),
        ]),
        { bom }
      );

    case "workiz":
      return rowsToCsvString(
        [
          "Job",
          "Job ID",
          "Revenue",
          "Labor cost",
          "Gross profit",
          "Margin %",
          "RPLH",
        ],
        rows.map((r) => [
          r.jobName,
          r.jobId,
          r.revenue.toFixed(2),
          r.labourCost.toFixed(2),
          r.grossProfit.toFixed(2),
          marginStr(r),
          rplhStr(r),
        ]),
        { bom }
      );

    case "service-fusion":
      return rowsToCsvString(
        [
          "Job number",
          "Internal ID",
          "Revenue",
          "Labor amount",
          "Gross profit",
          "Margin %",
          "RPLH",
        ],
        rows.map((r) => [
          r.jobName,
          r.jobId,
          r.revenue.toFixed(2),
          r.labourCost.toFixed(2),
          r.grossProfit.toFixed(2),
          marginStr(r),
          rplhStr(r),
        ]),
        { bom }
      );

    case "connecteam":
      return rowsToCsvString(
        [
          "Job",
          "Job ID",
          "Revenue",
          "Labor cost",
          "Gross profit",
          "Margin %",
          "RPLH",
        ],
        rows.map((r) => [
          r.jobName,
          r.jobId,
          r.revenue.toFixed(2),
          r.labourCost.toFixed(2),
          r.grossProfit.toFixed(2),
          marginStr(r),
          rplhStr(r),
        ]),
        { bom }
      );

    case "xero":
      return rowsToCsvString(
        [
          "Tracking name",
          "Job ID",
          "Sales",
          "Direct costs",
          "Gross profit",
          "Margin %",
          "Revenue per labor hour",
        ],
        rows.map((r) => [
          r.jobName,
          r.jobId,
          r.revenue.toFixed(2),
          r.labourCost.toFixed(2),
          r.grossProfit.toFixed(2),
          marginStr(r),
          rplhStr(r),
        ]),
        { bom }
      );

    case "sage":
      return rowsToCsvString(
        [
          "Job name",
          "Job reference",
          "Revenue",
          "Labor cost",
          "Gross profit",
          "Margin %",
          "RPLH",
        ],
        rows.map((r) => [
          r.jobName,
          r.jobId,
          r.revenue.toFixed(2),
          r.labourCost.toFixed(2),
          r.grossProfit.toFixed(2),
          marginStr(r),
          rplhStr(r),
        ]),
        { bom }
      );

    case "freshbooks":
      return rowsToCsvString(
        [
          "Project",
          "Project ID",
          "Income",
          "Labor expense",
          "Profit",
          "Margin %",
          "RPLH",
        ],
        rows.map((r) => [
          r.jobName,
          r.jobId,
          r.revenue.toFixed(2),
          r.labourCost.toFixed(2),
          r.grossProfit.toFixed(2),
          marginStr(r),
          rplhStr(r),
        ]),
        { bom }
      );

    case "wave":
      return rowsToCsvString(
        [
          "Job",
          "Job ID",
          "Income",
          "Labor cost",
          "Gross profit",
          "Margin %",
          "RPLH",
        ],
        rows.map((r) => [
          r.jobName,
          r.jobId,
          r.revenue.toFixed(2),
          r.labourCost.toFixed(2),
          r.grossProfit.toFixed(2),
          marginStr(r),
          rplhStr(r),
        ]),
        { bom }
      );

    case "netsuite":
      return rowsToCsvString(
        [
          "Job / project",
          "Internal ID",
          "Revenue",
          "Labor cost",
          "Gross profit",
          "Margin %",
          "RPLH",
        ],
        rows.map((r) => [
          r.jobName,
          r.jobId,
          r.revenue.toFixed(2),
          r.labourCost.toFixed(2),
          r.grossProfit.toFixed(2),
          marginStr(r),
          rplhStr(r),
        ]),
        { bom }
      );

    case "zoho-books":
      return rowsToCsvString(
        [
          "Project name",
          "Project ID",
          "Revenue",
          "Labor cost",
          "Gross profit",
          "Margin %",
          "RPLH",
        ],
        rows.map((r) => [
          r.jobName,
          r.jobId,
          r.revenue.toFixed(2),
          r.labourCost.toFixed(2),
          r.grossProfit.toFixed(2),
          marginStr(r),
          rplhStr(r),
        ]),
        { bom }
      );

    case "dynamics-bc":
      return rowsToCsvString(
        [
          "Job",
          "Job no.",
          "Revenue",
          "Labor cost",
          "Gross profit",
          "Margin %",
          "Revenue per labor hr",
        ],
        rows.map((r) => [
          r.jobName,
          r.jobId,
          r.revenue.toFixed(2),
          r.labourCost.toFixed(2),
          r.grossProfit.toFixed(2),
          marginStr(r),
          rplhStr(r),
        ]),
        { bom }
      );

    default: {
      const _exhaustive: never = templateId;
      return _exhaustive;
    }
  }
}

export function buildReportingCsvBlob(
  templateId: ReportingCsvTemplateId,
  rows: AllJobsProfitRow[],
  ctx: ReportingExportContext
): Blob {
  return csvStringToBlob(buildReportingCsvString(templateId, rows, ctx));
}

export function reportingExportFilenameSlug(templateId: ReportingCsvTemplateId): string {
  return templateId;
}

export function reportingExportFilename(
  templateId: ReportingCsvTemplateId,
  ctx: ReportingExportContext
): string {
  const slug = reportingExportFilenameSlug(templateId);
  const preset = presetSlug(ctx.datePreset);
  return `fieldcrew-report-${slug}-${preset}-${ctx.rangeStart}_${ctx.rangeEnd}.csv`;
}
