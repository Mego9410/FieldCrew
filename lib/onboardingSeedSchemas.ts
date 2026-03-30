import { z } from "zod";

export const onboardingSeedWorkersSchema = z.object({
  workers: z.array(
    z.object({
      firstName: z.string().trim().min(1),
      lastName: z.string().trim().optional().nullable(),
      mobileNumber: z.string().trim().min(1),
      role: z.string().trim().optional().nullable(),
      hourlyRate: z.coerce.number().min(0).optional().nullable(),
    })
  ),
});

export const onboardingSeedJobsSchema = z.object({
  jobs: z.array(
    z.object({
      title: z.string().trim().min(1),
      customerOrSiteName: z.string().trim().optional().nullable(),
      jobType: z.string().trim().optional().nullable(),
      estimatedHours: z.coerce.number().min(0.5),
      scheduledDate: z.string().trim().optional().nullable(),
      assignedWorkerIds: z.array(z.string()).optional().nullable(),
    })
  ),
});
