import { User } from "../generated/prisma-client";

export type SafeUser = Omit<User, "password">;

export const sanitizeUser = (user: User): SafeUser => {
  const { password: _password, ...safeUser } = user;
  return safeUser;
};
