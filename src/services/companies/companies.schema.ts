import { z } from "zod";
import { CompanyStatus } from "../../generated/prisma-client";

export const createCompanySchema = z
  .object({
    name: z.string({ error: "Name is required" }).min(2, "Name must be at least 2 characters").max(200),
    description: z.string().max(5000).optional(),
    logo: z.string().max(500).optional(),
    website: z.string().max(500).optional(),
    location: z.string({ error: "Location is required" }).min(2, "Location must be at least 2 characters").max(200),
  })
  .strict();

export const updateCompanySchema = z
  .object({
    name: z.string().min(2).max(200).optional(),
    description: z.string().max(5000).optional(),
    logo: z.string().max(500).optional(),
    website: z.string().max(500).optional(),
    location: z.string().min(2).max(200).optional(),
    status: z
      .enum([CompanyStatus.PENDING, CompanyStatus.APPROVED, CompanyStatus.REJECTED], {
        error: "Invalid company status",
      })
      .optional(),
  })
  .strict();

export type CreateCompanyInput = z.infer<typeof createCompanySchema>;
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;