import { z } from "zod";

export const createSavedJobSchema = z
  .object({
    jobId: z.string({ error: "Job is required" }),
  })
  .strict();

export type CreateSavedJobInput = z.infer<typeof createSavedJobSchema>;