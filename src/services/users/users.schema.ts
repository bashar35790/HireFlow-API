import { z } from "zod";
import { UserRole, UserStatus } from "../../generated/prisma-client";

export const updateUserSchema = z
  .object({
    name: z.string({ error: "Name is required" }).min(2, "Name must be at least 2 characters").max(100).optional(),
    status: z
      .enum([UserStatus.ACTIVE, UserStatus.INACTIVE, UserStatus.BLOCKED], {
        error: "Invalid user status",
      })
      .optional(),
    role: z
      .enum([UserRole.JOB_SEEKER, UserRole.EMPLOYER, UserRole.ADMIN], {
        error: "Invalid user role",
      })
      .optional(),
  })
  .strict();

export type UpdateUserInput = z.infer<typeof updateUserSchema>;