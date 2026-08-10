import bcrypt from "bcrypt";
import prisma from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { RegisterInput } from "./auth.schema";
import { UserRole } from "../../generated/prisma-client";

const SALT_ROUNDS = 10;

export const registerUser = async (input: RegisterInput) => {
  const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
      role: input.role ?? UserRole.JOB_SEEKER,
    },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || user.isDeleted || user.status !== "ACTIVE") {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  return user;
};