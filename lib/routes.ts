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
