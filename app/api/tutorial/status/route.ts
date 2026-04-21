import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import {
  countJobsWithLabourEntries,
  getCompanyForCurrentUser,
  getJobs,
  getOwnerUserById,
  getProjects,
  getWorkers,
} from "@/lib/data";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const company = await getCompanyForCurrentUser(supabase);
  if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });

  const owner = await getOwnerUserById(user.id, supabase);
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

  return NextResponse.json({
    tour,
    completion: {
      companySetup,
      profileSetup,
      workersAdded,
      jobOrProjectCreated,
      timeEntryLogged,
      reportExported,
    },
  });
}

