import { z } from "zod";
import { JobStatus } from "../../generated/prisma-client";

export const jobTypeEnum = z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "REMOTE"], {
  error: "Invalid job type",
});

export const experienceLevelEnum = z.enum(["ENTRY", "JUNIOR", "MID", "SENIOR", "LEAD"], {
  error: "Invalid experience level",
});

export const createJobSchema = z
  .object({
    title: z.string({ error: "Title is required" }).min(2, "Title must be at least 2 characters").max(200),
    description: z.string({ error: "Description is required" }).min(10, "Description must be at least 10 characters").max(10000),
    salaryMin: z.number({ error: "salaryMin must be a number" }).nonnegative().optional(),
    salaryMax: z.number({ error: "salaryMax must be a number" }).nonnegative().optional(),
    location: z.string({ error: "Location is required" }).min(2, "Location must be at least 2 characters").max(200),
    jobType: jobTypeEnum,
    experienceLevel: experienceLevelEnum.optional(),
    companyId: z.string({ error: "Company is required" }),
    categoryId: z.string({ error: "Category is required" }),
    status: z
      .enum([JobStatus.DRAFT, JobStatus.PUBLISHED, JobStatus.CLOSED], {
        error: "Invalid job status",
      })
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.salaryMin != null && data.salaryMax != null && data.salaryMax < data.salaryMin) {
      ctx.addIssue({
        code: "custom",
        path: ["salaryMax"],
        message: "salaryMax must be greater than or equal to salaryMin",
      });
    }
  });

export const updateJobSchema = z
  .object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().min(10).max(10000).optional(),
    salaryMin: z.number().nonnegative().optional(),
    salaryMax: z.number().nonnegative().optional(),
    location: z.string().min(2).max(200).optional(),
    jobType: jobTypeEnum.optional(),
    experienceLevel: experienceLevelEnum.optional(),
    companyId: z.string().optional(),
    categoryId: z.string().optional(),
    status: z
      .enum([JobStatus.DRAFT, JobStatus.PUBLISHED, JobStatus.CLOSED], {
        error: "Invalid job status",
      })
      .optional(),
  })
  .strict()
  .superRefine((data, ctx) => {
    if (data.salaryMin != null && data.salaryMax != null && data.salaryMax < data.salaryMin) {
      ctx.addIssue({
        code: "custom",
        path: ["salaryMax"],
        message: "salaryMax must be greater than or equal to salaryMin",
      });
    }
  });

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;