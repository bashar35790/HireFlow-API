import { z } from "zod";

export const createReviewSchema = z
  .object({
    companyId: z.string({ error: "Company is required" }),
    rating: z
      .number({ error: "Rating is required" })
      .int("Rating must be a whole number")
      .min(1, "Rating must be between 1 and 5")
      .max(5, "Rating must be between 1 and 5"),
    comment: z.string().max(2000).optional(),
  })
  .strict();

export const updateReviewSchema = z
  .object({
    rating: z.number().int().min(1).max(5).optional(),
    comment: z.string().max(2000).optional(),
  })
  .strict();

export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;