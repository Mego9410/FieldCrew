import type { FAQItem } from "@/components/blog/FAQ";

export type MoneyPageConfig = {
  path: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  description: string;
  directAnswer: string;
  howItWorksTitle: string;
  howItWorksSteps: Array<{ title: string; body: string }>;
  benefitsTitle: string;
  benefits: string[];
  costTitle: string;
  costBody: string;
  faq: FAQItem[];
  softwareDescription: string;
  relatedBlogSlugs?: string[];
};

export const moneyPages: Record<string, MoneyPageConfig> = {
  timeTracking: {
    path: "/hvac-time-tracking",
    title: "HVAC Technician Time Tracking",
    metaTitle: "HVAC Technician Time Tracking App | FieldCrew",
    metaDescription:
      "Track HVAC technician hours by job from the van — no app install. Job-coded time tracking for accurate payroll and job costing. Start for $9.",
    eyebrow: "Time tracking",
    h1: "HVAC technician time tracking that ties every hour to a job",
    description:
      "Stop guessing how long jobs took. FieldCrew gives you job-coded time tracking so payroll and job costing match what happened in the field.",
    directAnswer:
      "The best way to track HVAC technician hours is job-coded time tracking — techs clock in and out against the specific job from their phone, so every hour maps to a job and shows up in labor cost. That removes rounding and lost time, and makes payroll match what actually happened in the field. FieldCrew does this without your crew installing an app.",
    howItWorksTitle: "How job-coded time tracking works",
    howItWorksSteps: [
      {
        title: "Techs clock in on the job",
        body: "Each technician opens a simple link and clocks in against the job they are on — from the van, between calls.",
      },
      {
        title: "Hours map to labor cost automatically",
        body: "Time rolls into job-level labor cost in real time. You see quoted vs actual as work happens, not after payroll.",
      },
      {
        title: "Payroll exports with job context",
        body: "Export QuickBooks-ready payroll with hours tied to jobs. No more hours you cannot explain on Friday.",
      },
    ],
    benefitsTitle: "What you get with accurate time tracking",
    benefits: [
      "Every hour assigned to a job or non-billable code",
      "Real-time labor cost per job",
      "Fewer timesheet errors and rounding",
      "Payroll that matches the field",
      "Better estimate accuracy over time",
      "No app installs for your crew",
    ],
    costTitle: "What manual tracking costs you",
    costBody:
      "Paper timesheets and end-of-week guessing typically hide 8–15% of labor profit through unallocated hours, rounding, and job creep. Job-coded tracking surfaces that leak in the first month.",
    faq: [
      {
        q: "How do I track HVAC technician hours on jobs?",
        a: "Use job-coded time tracking: techs clock in and out on the specific job from a phone link. Every hour is assigned to a job or a clear non-billable code, so labor cost per job is accurate and payroll is defensible.",
      },
      {
        q: "Do my technicians need to install an app?",
        a: "No. FieldCrew uses a simple web link — no app store, no passwords to remember. Techs clock in from the van in seconds.",
      },
      {
        q: "How is this different from a generic time clock?",
        a: "A generic clock tells you someone worked 8 hours. Job-coded tracking tells you those 8 hours went to Job #1042, Job #1045, and 30 minutes of shop time — which is what you need for job costing and payroll.",
      },
      {
        q: "Does it work with QuickBooks?",
        a: "Yes. FieldCrew exports payroll data that is ready for QuickBooks, with hours tied to jobs.",
      },
    ],
    softwareDescription:
      "Job-coded HVAC technician time tracking software. Track field tech hours by job from the van, see labor cost per job in real time, and export QuickBooks-ready payroll.",
    relatedBlogSlugs: ["manual-vs-digital-time-tracking", "labour-spend-per-job-real-time"],
  },
  scheduling: {
    path: "/hvac-scheduling-software",
    title: "HVAC Scheduling Software",
    metaTitle: "HVAC Scheduling Software for Crews | FieldCrew",
    metaDescription:
      "HVAC crew scheduling software that ties the schedule to real labor cost. See which jobs run over and adjust before overtime hits. Start for $9.",
    eyebrow: "Scheduling",
    h1: "HVAC scheduling software built around real labor cost",
    description:
      "A schedule only works if you know what jobs actually cost. FieldCrew connects crew scheduling to live time tracking and job-level labor visibility.",
    directAnswer:
      "HVAC scheduling software should do more than put names on a calendar — it should show you when jobs are running over, when overtime is forming, and which crews are carrying the load. FieldCrew ties your schedule to job-coded time tracking so you see quoted vs actual labor as work happens, not after payroll.",
    howItWorksTitle: "How scheduling connects to margin",
    howItWorksSteps: [
      {
        title: "Plan the week",
        body: "Assign techs to jobs with estimated labor hours. You know what the week should cost before it starts.",
      },
      {
        title: "Track actuals live",
        body: "As techs clock in on jobs, you see which appointments are running long and which crews are falling behind.",
      },
      {
        title: "Adjust before overtime",
        body: "Spot overrun patterns early — reschedule, reassign, or fix estimates using real data instead of reacting on Friday.",
      },
    ],
    benefitsTitle: "Why HVAC owners switch to connected scheduling",
    benefits: [
      "Schedule tied to real labor hours",
      "Early warning on job overruns",
      "Less reactive overtime",
      "Clear view of crew utilization",
      "Better quoting from historical job data",
      "Owner-friendly weekly pulse",
    ],
    costTitle: "When the schedule and the clock disagree",
    costBody:
      "Most small HVAC shops lose margin when jobs finish late, push the next appointment, and trigger overtime nobody planned for. Connecting schedule to actual hours closes that gap.",
    faq: [
      {
        q: "What is the best software to schedule HVAC crews and run their payroll?",
        a: "Look for software that combines crew scheduling with job-coded time tracking and payroll export. FieldCrew ties scheduled labor estimates to actual hours per job, so scheduling decisions are based on real cost — not guesswork.",
      },
      {
        q: "Can I see which jobs are running over schedule?",
        a: "Yes. FieldCrew compares quoted labor to actual hours per job in real time, so you see overruns while there is still time to adjust.",
      },
      {
        q: "Do I need a separate dispatch tool?",
        a: "FieldCrew covers scheduling, dispatch visibility, time tracking, and payroll in one workflow. Many small HVAC shops run everything here without a separate dispatch system.",
      },
    ],
    softwareDescription:
      "HVAC crew scheduling software with live labor cost visibility. Schedule technicians, track quoted vs actual hours per job, and reduce overtime before payroll.",
    relatedBlogSlugs: ["jobs-take-longer-than-estimated", "reduce-overtime-costs"],
  },
  payroll: {
    path: "/hvac-payroll-software",
    title: "HVAC Payroll Software",
    metaTitle: "HVAC Payroll Software for Field Techs | FieldCrew",
    metaDescription:
      "HVAC payroll software with job-coded time tracking. Pay field techs accurately, export to QuickBooks, and reduce wage-and-hour risk. Start for $9.",
    eyebrow: "Payroll",
    h1: "HVAC payroll software that matches what happened in the field",
    description:
      "Payroll should not be a Friday surprise. FieldCrew ties every hour to a job so you pay techs accurately and export clean data to QuickBooks.",
    directAnswer:
      "Small HVAC companies pay field techs accurately by using job-coded time tracking — every hour is logged against the job it belongs to before payroll runs. That removes rounding, unallocated time, and the guesswork that triggers wage-and-hour risk. FieldCrew exports QuickBooks-ready payroll with full job context.",
    howItWorksTitle: "From clock-in to payroll export",
    howItWorksSteps: [
      {
        title: "Capture hours on the job",
        body: "Techs clock in against the job from a phone link. No end-of-week reconstruction.",
      },
      {
        title: "Review before you pay",
        body: "See labor cost per job, flag overruns, and catch unallocated hours before payroll is finalized.",
      },
      {
        title: "Export to QuickBooks",
        body: "One-click export with hours tied to jobs. Your books match the field.",
      },
    ],
    benefitsTitle: "What accurate HVAC payroll looks like",
    benefits: [
      "Hours tied to specific jobs",
      "QuickBooks-ready export",
      "Less payroll leakage (8–15% typical)",
      "Clear overtime visibility",
      "Stronger wage-and-hour compliance",
      "Job-level labor cost for quoting",
    ],
    costTitle: "The cost of payroll you cannot explain",
    costBody:
      "When payroll is full of hours you cannot tie to any job, margin disappears quietly. Job-coded tracking makes every dollar of labor visible before it leaves your account.",
    faq: [
      {
        q: "How do small HVAC companies pay field techs accurately?",
        a: "Use job-coded time tracking so every hour is logged to a job (or a clear non-billable code) as work happens. Review labor cost per job weekly, then export payroll with that context. FieldCrew automates the link between field time and payroll.",
      },
      {
        q: "Does FieldCrew replace my payroll provider?",
        a: "FieldCrew handles time tracking, job costing, and payroll export. Many shops export to QuickBooks or Gusto for final processing. FieldCrew makes sure the hours are right before they get there.",
      },
      {
        q: "How does this help with wage-and-hour compliance?",
        a: "Accurate, contemporaneous time records tied to jobs reduce rounding errors, misclassification, and unallocated hours — the most common payroll mistakes that trigger compliance risk for HVAC contractors.",
      },
    ],
    softwareDescription:
      "HVAC payroll software with job-coded time tracking. Pay field technicians accurately, see labor cost per job, and export QuickBooks-ready payroll.",
    relatedBlogSlugs: ["hidden-payroll-leak", "hvac-payroll-mistakes-compliance"],
  },
  dispatch: {
    path: "/dispatch-software",
    title: "HVAC Dispatch Software",
    metaTitle: "HVAC Dispatch Software for Small Crews | FieldCrew",
    metaDescription:
      "HVAC dispatch software for small crews. Assign jobs, track tech hours live, and see labor cost per job without a whiteboard. Start for $9.",
    eyebrow: "Dispatch",
    h1: "HVAC dispatch software for crews that need visibility, not complexity",
    description:
      "Assign jobs, see where your techs are on labor, and catch overruns before they become overtime — without a whiteboard or a software expert on staff.",
    directAnswer:
      "HVAC dispatch software for small crews should let you assign jobs, see which techs are on which jobs, and track whether work is running over estimate — all in one place. FieldCrew combines dispatch visibility with job-coded time tracking so you know the labor cost of every appointment, not just who is where.",
    howItWorksTitle: "Dispatch that shows labor cost, not just location",
    howItWorksSteps: [
      {
        title: "Assign the day's jobs",
        body: "Put the right tech on the right job with estimated labor hours attached.",
      },
      {
        title: "Track progress live",
        body: "See clock-ins per job and whether actual hours are tracking over the estimate.",
      },
      {
        title: "Recover before overtime",
        body: "Reassign, reschedule, or flag overruns while there is still time to fix the week.",
      },
    ],
    benefitsTitle: "Built for owner-operators, not enterprise dispatch",
    benefits: [
      "Simple job assignment",
      "Live labor hours per job",
      "Overrun and overtime alerts",
      "No whiteboard required",
      "Works from your phone between jobs",
      "Payroll export when the week is done",
    ],
    costTitle: "When dispatch and payroll do not talk",
    costBody:
      "Dispatching from a whiteboard and paying from a spreadsheet means you never see the full cost of a late job until payroll lands. Connecting dispatch to time tracking closes that blind spot.",
    faq: [
      {
        q: "How do I dispatch HVAC techs without a whiteboard?",
        a: "Use dispatch software that assigns jobs to techs and tracks clock-in times per job. FieldCrew lets small HVAC shops assign work and see labor cost per appointment without enterprise complexity.",
      },
      {
        q: "Is this only for large HVAC companies?",
        a: "No. FieldCrew is built for owner-operators with 3–50 field techs who need dispatch visibility without a long onboarding process.",
      },
      {
        q: "Can I see overtime forming during the week?",
        a: "Yes. FieldCrew flags overtime pressure and job overruns as they develop, so you can adjust before payroll — not after.",
      },
    ],
    softwareDescription:
      "HVAC dispatch software for small crews. Assign jobs, track technician hours live, see labor cost per job, and export payroll.",
    relatedBlogSlugs: ["reduce-overtime-costs", "labour-spend-per-job-real-time"],
  },
};
