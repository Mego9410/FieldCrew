/**
 * Central route paths for Public, Owner (/app), and Worker (/w/:token).
 * Use these for links and redirects to keep URLs consistent.
 */
export const routes = {
  /** Public: landing, marketing, login, signup */
  public: {
    home: "/",
    blog: "/blog",
    book: "/book",
    demo: "/demo",
    sampleReport: "/sample-report",
    profitLeak: "/profit-leak",
    hiddenProfit: "/hidden-profit",
    about: "/about",
    careers: "/careers",
    docs: "/docs",
    support: "/support",
    contact: "/contact",
    privacy: "/privacy",
    terms: "/terms",
    security: "/security",
    solutionsHvac: "/solutions/hvac",
    solutionsContractors: "/solutions/contractors",
    solutionsSmallTeams: "/solutions/small-teams",
    login: "/login",
    signup: "/signup",
  },
  /** Auth helper routes (server redirects, callbacks) */
  auth: {
    postLogin: "/auth/post-login",
    finish: "/auth/finish",
  },
  /** Admin: internal tools and finance dashboards */
  admin: {
    home: "/admin",
  },
  /** Owner: business owner app (dashboard, jobs, workers, timesheets, payroll, settings) */
  owner: {
    home: "/app",
    subscribe: "/subscribe",
    onboarding: "/onboarding",
    /** Re-open first-insight onboarding to edit answers (requires `edit=1` + completed onboarding). */
    onboardingEdit: "/onboarding?edit=1",
    jobs: "/app/jobs",
    job: (jobId: string) => `/app/jobs/${jobId}`,
    workers: "/app/workers",
    worker: (workerId: string) => `/app/workers/${workerId}`,
    timesheets: "/app/timesheets",
    payrollExport: "/app/payroll/export",
    settings: "/app/settings",
    settingsProfile: "/app/settings/profile",
    settingsCompany: "/app/settings/company",
    settingsNotifications: "/app/settings/notifications",
    settingsBilling: "/app/settings/billing",
    settingsSecurity: "/app/settings/security",
    data: "/app/data",
    reporting: "/app/reporting",
    projects: "/app/projects",
    projectJobs: (projectId: string) => `/app/projects/${projectId}`,
    jobTypes: "/app/job-types",
    jobType: (id: string) => `/app/job-types/${id}`,
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
  /** Worker: crew member views; use with token (workerId), e.g. routes.worker.home(token) */
  worker: {
    home: (token: string) => `/w/${token}`,
    dashboard: (token: string) => `/w/${token}/dashboard`,
    jobs: (token: string) => `/w/${token}/jobs`,
    job: (token: string, jobId: string) => `/w/${token}/jobs/${jobId}`,
    clock: (token: string, jobId?: string) =>
      jobId ? `/w/${token}/clock?jobId=${encodeURIComponent(jobId)}` : `/w/${token}/clock`,
  },
} as const;

export type PublicRoute = keyof typeof routes.public;
export type OwnerRoute = keyof typeof routes.owner;
