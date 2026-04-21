import { AppLayoutClient } from "@/components/app/AppLayoutClient";
import { ToastProvider } from "@/components/ui/Toast";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import {
  countJobsWithLabourEntries,
  ensureOwnerUserForAuthUser,
  getCompanyForCurrentUser,
  getJobs,
  getOwnerUserById,
  getProjects,
  getWorkers,
} from "@/lib/data";
import type { CompanyTourV1 } from "@/lib/entities";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  let readOnlyMode = false;
  let tutorial:
    | {
        companyId: string;
        tour: CompanyTourV1;
        completion: {
          companySetup: boolean;
          profileSetup: boolean;
          workersAdded: boolean;
          jobOrProjectCreated: boolean;
          timeEntryLogged: boolean;
          reportExported: boolean;
        };
      }
    | undefined;
  try {
    const { data: { user } } = await supabase.auth.getUser();
    const insertClient = createServiceRoleClient() ?? supabase;
    await ensureOwnerUserForAuthUser(user ? insertClient : supabase, user ?? null);
    const company = await getCompanyForCurrentUser(supabase);
    if (company) {
      const status = company.subscriptionStatus ?? null;
      const hasActiveSub = status === "active" || status === "trialing";
      readOnlyMode = !hasActiveSub && company.onboardingStatus !== "complete";

      const owner =
        user?.id ? await getOwnerUserById(user.id, supabase) : null;
      const [workers, jobs, projects, jobsWithEntries] = await Promise.all([
        getWorkers(company.id, supabase),
        getJobs(company.id, undefined, supabase),
        getProjects(company.id, supabase),
        countJobsWithLabourEntries(company.id, supabase),
      ]);

      const companySetup =
        (company.name ?? "").trim() !== "" &&
        (company.name ?? "").trim() !== "My Company" &&
        Boolean(
          company.settings?.companyEmail?.trim() ||
            company.settings?.companyPhone?.trim() ||
            company.settings?.companyStreet?.trim() ||
            company.settings?.companyTaxId?.trim()
        );
      const ownerName = (owner?.name ?? "").trim();
      const profileSetup =
        ownerName.split(/\s+/).filter(Boolean).length >= 2 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((owner?.email ?? "").trim());

      const workersAdded = workers.some((w) => (w.name ?? "").trim() !== "" && w.name !== "Test Worker");
      const jobOrProjectCreated = jobs.length > 0 || projects.length > 0;
      const timeEntryLogged = jobsWithEntries > 0;
      const tour = company.settings?.tourV1 ?? { status: "active", step: 0 };
      const reportExported = Boolean(tour.reportExportedAt || tour.payrollExportedAt);

      tutorial = {
        companyId: company.id,
        tour,
        completion: {
          companySetup,
          profileSetup,
          workersAdded,
          jobOrProjectCreated,
          timeEntryLogged,
          reportExported,
        },
      };
    }
  } catch (err) {
    console.error("[app/layout] ensureOwnerUserForAuthUser failed:", err);
  }

  return (
    <ToastProvider>
      <AppLayoutClient readOnlyMode={readOnlyMode} tutorial={tutorial}>
        {children}
      </AppLayoutClient>
    </ToastProvider>
  );
}
