/**
 * Payroll CSV layouts tuned for common FSM, accounting, and payroll imports.
 * Column names follow typical vendor mapping flows; users may still map columns in-product.
 * Before changing headers, confirm against each vendor’s current CSV/timesheet import docs.
 */

import type { PayrollRow } from "@/lib/payrollExport";
import { csvStringToBlob, rowsToCsvString } from "@/lib/csv/formatCsv";

export interface PayrollExportContext {
  dateFrom: string;
  dateTo: string;
  /** Display symbol for money columns (default "$"). */
  currencySymbol?: string;
}

export type PayrollCsvTemplateId =
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
  | "dynamics-bc"
  | "adp"
  | "gusto"
  | "paychex"
  | "paycom"
  | "rippling";

export interface PayrollTemplateMeta {
  id: PayrollCsvTemplateId;
  label: string;
  /** Shown under the dropdown; explains mapping expectations. */
  description: string;
}

export const PAYROLL_TEMPLATE_GROUPS: {
  label: string;
  templates: PayrollTemplateMeta[];
}[] = [
  {
    label: "Spreadsheet",
    templates: [
      {
        id: "generic",
        label: "Generic CSV",
        description: "Worker, hours, job, and labor cost—works in any spreadsheet.",
      },
      {
        id: "google-sheets",
        label: "Google Sheets / Excel",
        description: "Same columns as generic with a UTF-8 BOM so Excel opens encoding cleanly.",
      },
    ],
  },
  {
    label: "Field service",
    templates: [
      {
        id: "servicetitan",
        label: "ServiceTitan",
        description:
          "Technician, job, hours, and labor—map to ServiceTitan payroll or timesheet import.",
      },
      {
        id: "housecall-pro",
        label: "Housecall Pro",
        description: "Employee and job labor lines for Housecall Pro reporting or payroll bridge.",
      },
      {
        id: "jobber",
        label: "Jobber",
        description: "Staff, job, hours, and labor total aligned with Jobber time exports.",
      },
      {
        id: "fieldpulse",
        label: "FieldPulse",
        description: "Employee, job, hours, and cost with pay period columns.",
      },
      {
        id: "workiz",
        label: "Workiz",
        description: "Technician and job labor summary for Workiz workflows.",
      },
      {
        id: "service-fusion",
        label: "Service Fusion",
        description: "Employee, job number, hours, and amount with period dates.",
      },
      {
        id: "connecteam",
        label: "Connecteam",
        description: "Employee, job, hours, and labor cost for workforce time imports.",
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
          "Employee, customer/job, hours, and labor amount—map columns in QuickBooks timesheet or payroll tools.",
      },
      {
        id: "xero",
        label: "Xero",
        description:
          "Employee, tracking/job, hours, and amount—map to Xero payroll or project costing.",
      },
      {
        id: "sage",
        label: "Sage",
        description:
          "Employee reference, job/cost center, hours, and labor—map for Sage 50 / Business Cloud CSV.",
      },
      {
        id: "freshbooks",
        label: "FreshBooks",
        description: "Staff, project/job, hours, and amount with period range.",
      },
      {
        id: "wave",
        label: "Wave",
        description: "Employee, job, hours, and amount for Wave payroll or contractor imports.",
      },
      {
        id: "netsuite",
        label: "NetSuite",
        description: "Employee, project/job, hours, and labor cost with period dates.",
      },
      {
        id: "zoho-books",
        label: "Zoho Books",
        description: "Employee, project, hours, and labor cost with date range.",
      },
      {
        id: "dynamics-bc",
        label: "Dynamics 365 Business Central",
        description: "Resource, job, quantity (hours), and cost amount—map in BC configuration packages.",
      },
    ],
  },
  {
    label: "Payroll providers",
    templates: [
      {
        id: "adp",
        label: "ADP",
        description:
          "Employee name, job, hours, and amounts—map to ADP Workforce/RUN column requirements.",
      },
      {
        id: "gusto",
        label: "Gusto",
        description: "Employee, job, hours, and gross labor cost with pay period.",
      },
      {
        id: "paychex",
        label: "Paychex",
        description: "Worker, job, hours, and amount with period begin/end.",
      },
      {
        id: "paycom",
        label: "Paycom",
        description: "Employee, job, hours, and amount—match Paycom import template in admin.",
      },
      {
        id: "rippling",
        label: "Rippling",
        description: "Employee, job, hours, and labor cost with period bounds.",
      },
    ],
  },
];

const META_BY_ID: Record<PayrollCsvTemplateId, PayrollTemplateMeta> =
  {} as Record<PayrollCsvTemplateId, PayrollTemplateMeta>;
for (const g of PAYROLL_TEMPLATE_GROUPS) {
  for (const t of g.templates) {
    META_BY_ID[t.id] = t;
  }
}

export function getPayrollTemplateMeta(id: PayrollCsvTemplateId): PayrollTemplateMeta {
  return META_BY_ID[id];
}

function sym(ctx: PayrollExportContext): string {
  return ctx.currencySymbol ?? "$";
}

/** Plain decimal labor amount (no symbol)—preferred by many accounting imports. */
function laborAmount(r: PayrollRow): string {
  return r.labourCost.toFixed(2);
}

export function buildPayrollCsvString(
  templateId: PayrollCsvTemplateId,
  rows: PayrollRow[],
  ctx: PayrollExportContext
): string {
  const S = sym(ctx);
  const bom = templateId === "google-sheets";

  switch (templateId) {
    case "generic":
      return rowsToCsvString(
        ["Worker name", "Total hours", "Job name/ID", "Labor cost"],
        rows.map((r) => [
          r.workerName,
          r.totalHours.toFixed(2),
          r.jobNameOrId,
          `${S}${r.labourCost.toFixed(2)}`,
        ]),
        { bom: false }
      );

    case "google-sheets":
      return rowsToCsvString(
        ["Worker name", "Total hours", "Job name/ID", "Labor cost"],
        rows.map((r) => [
          r.workerName,
          r.totalHours.toFixed(2),
          r.jobNameOrId,
          `${S}${r.labourCost.toFixed(2)}`,
        ]),
        { bom: true }
      );

    case "quickbooks":
      return rowsToCsvString(
        [
          "Employee",
          "Customer Job",
          "Hours",
          "Labor amount",
          "Pay period start",
          "Pay period end",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "servicetitan":
      return rowsToCsvString(
        [
          "Technician name",
          "Job",
          "Hours",
          "Labor cost",
          "Period start",
          "Period end",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "housecall-pro":
      return rowsToCsvString(
        [
          "Employee name",
          "Job",
          "Hours",
          "Labor amount",
          "Period start",
          "Period end",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "jobber":
      return rowsToCsvString(
        [
          "Staff member",
          "Job",
          "Hours",
          "Labor total",
          "Period start",
          "Period end",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "fieldpulse":
      return rowsToCsvString(
        ["Employee", "Job", "Hours", "Labor cost", "Period from", "Period to"],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "workiz":
      return rowsToCsvString(
        [
          "Technician",
          "Job",
          "Hours",
          "Labor cost",
          "Period start",
          "Period end",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "service-fusion":
      return rowsToCsvString(
        [
          "Employee",
          "Job number",
          "Hours",
          "Labor amount",
          "Date from",
          "Date to",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "connecteam":
      return rowsToCsvString(
        ["Employee", "Job", "Hours", "Labor cost", "Period start", "Period end"],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "xero":
      return rowsToCsvString(
        [
          "Employee",
          "Tracking name",
          "Hours",
          "Amount",
          "Period start",
          "Period end",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "sage":
      return rowsToCsvString(
        [
          "Employee reference",
          "Job / cost center",
          "Hours",
          "Labor amount",
          "Period from",
          "Period to",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "freshbooks":
      return rowsToCsvString(
        ["Staff", "Project / job", "Hours", "Amount", "From date", "To date"],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "wave":
      return rowsToCsvString(
        [
          "Employee",
          "Job description",
          "Hours",
          "Amount",
          "Period start",
          "Period end",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "netsuite":
      return rowsToCsvString(
        [
          "Employee",
          "Job / project",
          "Hours",
          "Labor cost",
          "Start date",
          "End date",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "zoho-books":
      return rowsToCsvString(
        [
          "Employee name",
          "Project",
          "Hours",
          "Labor cost",
          "From",
          "To",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "dynamics-bc":
      return rowsToCsvString(
        [
          "Resource",
          "Job",
          "Quantity hours",
          "Cost amount",
          "Starting date",
          "Ending date",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "adp":
      return rowsToCsvString(
        [
          "Employee name",
          "Job",
          "Hours",
          "Earnings amount",
          "Period start",
          "Period end",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "gusto":
      return rowsToCsvString(
        [
          "Employee name",
          "Job",
          "Hours",
          "Gross labor cost",
          "Pay period start",
          "Pay period end",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "paychex":
      return rowsToCsvString(
        [
          "Worker name",
          "Job",
          "Hours",
          "Amount",
          "Period begin",
          "Period end",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "paycom":
      return rowsToCsvString(
        [
          "Employee name",
          "Job",
          "Hours",
          "Amount",
          "Pay period start",
          "Pay period end",
        ],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    case "rippling":
      return rowsToCsvString(
        ["Employee", "Job", "Hours", "Labor cost", "Period start", "Period end"],
        rows.map((r) => [
          r.workerName,
          r.jobNameOrId,
          r.totalHours.toFixed(2),
          laborAmount(r),
          ctx.dateFrom,
          ctx.dateTo,
        ]),
        { bom }
      );

    default: {
      const _exhaustive: never = templateId;
      return _exhaustive;
    }
  }
}

export function buildPayrollCsvBlob(
  templateId: PayrollCsvTemplateId,
  rows: PayrollRow[],
  ctx: PayrollExportContext
): Blob {
  return csvStringToBlob(buildPayrollCsvString(templateId, rows, ctx));
}

export function payrollExportFilenameSlug(templateId: PayrollCsvTemplateId): string {
  return templateId;
}
