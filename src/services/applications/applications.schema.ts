import { z } from "zod";
import { ApplicationStatus } from "../../generated/prisma-client";

export const createApplicationSchema = z
  .object({
    jobId: z.string({ error: "Job is required" }),
    resume: z.string().max(1000).optional(),
    coverLetter: z.string().max(5000).optional(),
  })
  .strict();

export const updateApplicationStatusSchema = z
  .object({
    status: z.enum(
      [
        ApplicationStatus.PENDING,
        ApplicationStatus.REVIEWING,
        ApplicationStatus.SHORTLISTED,
        ApplicationStatus.REJECTED,
        ApplicationStatus.ACCEPTED,
      ],
      { error: "Invalid application status" }
    ),
  })
  .strict();

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;
export type UpdateApplicationStatusInput = z.infer<typeof updateApplicationStatusSchema>;