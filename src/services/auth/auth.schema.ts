import { z } from "zod";
import { UserRole } from "../../generated/prisma-client";

export const registerSchema = z
  .object({
    name: z.string({ error: "Name is required" }).min(2, "Name must be at least 2 characters").max(100),
    email: z.string({ error: "Email is required" }).email("Invalid email address"),
    password: z
      .string({ error: "Password is required" })
      .min(6, "Password must be at least 6 characters")
      .max(72),
    role: z
      .enum([UserRole.JOB_SEEKER, UserRole.EMPLOYER], {
        error: "Role must be JOB_SEEKER or EMPLOYER",
      })
      .optional(),
  })
  .strict();

export const loginSchema = z
  .object({
    email: z.string({ error: "Email is required" }).email("Invalid email address"),
    password: z.string({ error: "Password is required" }).min(1),
  })
  .strict();

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;