import { type DocsNavGroup } from "@/components/docs/DocsSidebar";

export const docsNavGroups: DocsNavGroup[] = [
  {
    title: "Start",
    links: [{ label: "Docs Home", href: "/docs" }],
  },
  {
    title: "Owner/Admin",
    links: [
      { label: "Getting Started", href: "/docs/owner/getting-started" },
      { label: "Jobs and Projects", href: "/docs/owner/jobs-and-projects" },
      { label: "Workers and Time", href: "/docs/owner/workers-and-time" },
      { label: "Payroll and Export", href: "/docs/owner/payroll-and-export" },
      { label: "Reporting and Insights", href: "/docs/owner/reporting-and-insights" },
      { label: "Settings and Security", href: "/docs/owner/settings-and-security" },
    ],
  },
  {
    title: "Worker",
    links: [
      { label: "First Login and Dashboard", href: "/docs/worker/first-login-and-dashboard" },
      { label: "Clock and Job Workflow", href: "/docs/worker/clock-and-job-workflow" },
      { label: "Timesheet Habits", href: "/docs/worker/timesheet-habits" },
      { label: "Common Errors and Fixes", href: "/docs/worker/common-errors-and-fixes" },
    ],
  },
  {
    title: "Playbooks",
    links: [
      { label: "Margin Recovery Cadence", href: "/docs/playbooks/margin-recovery-cadence" },
      { label: "Overtime Reduction", href: "/docs/playbooks/overtime-reduction" },
      { label: "Estimate Accuracy", href: "/docs/playbooks/estimate-accuracy" },
      { label: "Weekly Review Template", href: "/docs/playbooks/weekly-review-template" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Troubleshooting Matrix", href: "/docs/help/troubleshooting-matrix" },
      { label: "FAQ", href: "/docs/help/faq" },
      { label: "Glossary", href: "/docs/help/glossary" },
    ],
  },
];
