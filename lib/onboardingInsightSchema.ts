import { z } from "zod";

const tradeType = z.enum(["hvac", "plumbing", "electrical", "general_contractor", "other"]);
const avgJobDurationBand = z.enum(["under_2h", "hours_2_4", "hours_4_8", "full_day_plus"]);
const overrunFrequency = z.enum(["rarely", "sometimes", "often"]);
const overtimeFrequency = z.enum(["rarely", "sometimes", "most_weeks"]);

export const onboardingInsightBodySchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required"),
  tradeType: tradeType,
  fieldTechCount: z.coerce.number().int().min(1, "Need at least one field tech"),
  officeStaffCount: z.coerce.number().int().min(0).optional().nullable(),
  jobsPerWeek: z.coerce.number().int().min(1, "Jobs per week must be at least 1"),
  avgJobDurationBand: avgJobDurationBand,
  overrunFrequency: overrunFrequency,
  overtimeFrequency: overtimeFrequency.optional().nullable(),
});

export type OnboardingInsightBody = z.infer<typeof onboardingInsightBodySchema>;
