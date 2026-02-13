/**
 * Central route paths for Public, Owner (/app), and Worker (/w/:token).
 * Use these for links and redirects to keep URLs consistent.
 */
export const routes = {
  /** Public: landing, marketing, login, signup */
  public: {
    home: "/",
    login: "/login",
    signup: "/signup",
  },
  /** Owner: business owner app (dashboard, jobs, workers, timesheets, payroll, settings) */
  owner: {
    home: "/app",
    jobs: "/app/jobs",
    workers: "/app/workers",
    timesheets: "/app/timesheets",
    payrollExport: "/app/payroll/export",
    settings: "/app/settings",
    data: "/app/data",
    projects: "/app/projects",
    projectJobs: (projectId: string) => `/app/projects/${projectId}`,
    dashboard: {
      margin: "/app/dashboard/margin",
      overtime: "/app/dashboard/overtime",
      overruns: "/app/dashboard/overruns",
      revenueLabour: "/app/dashboard/revenue-labour",
      recovery: "/app/dashboard/recovery",
      labourCostTrend: "/app/dashboard/labour-cost-trend",
      estimateAccuracy: "/app/dashboard/estimate-accuracy",
      revenuePerLabourHour: "/app/dashboard/revenue-per-labour-hour",
    },
  },
  /** Worker: crew member views; use with token, e.g. routes.worker.home(token) */
  worker: {
    home: (token: string) => `/w/${token}`,
    jobs: (token: string) => `/w/${token}/jobs`,
    clock: (token: string) => `/w/${token}/clock`,
  },
} as const;

export type PublicRoute = keyof typeof routes.public;
export type OwnerRoute = keyof typeof routes.owner;
