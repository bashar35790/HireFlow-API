import { z } from "zod";
import { CategoryStatus } from "../../generated/prisma-client";

export const createCategorySchema = z
  .object({
    name: z.string({ error: "Name is required" }).min(2, "Name must be at least 2 characters").max(100),
    slug: z
      .string()
      .min(2)
      .max(100)
      .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes")
      .optional(),
    description: z.string().max(1000).optional(),
  })
  .strict();

export const updateCategorySchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    slug: z
      .string()
      .min(2)
      .max(100)
      .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with dashes")
      .optional(),
    description: z.string().max(1000).optional(),
    status: z
      .enum([CategoryStatus.ACTIVE, CategoryStatus.INACTIVE], {
        error: "Invalid category status",
      })
      .optional(),
  })
  .strict();

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;