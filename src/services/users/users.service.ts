import prisma from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { buildMeta, parsePagination } from "../../utils/pagination";

export const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const listUsers = async (query: Record<string, unknown>) => {
  const { page, limit, skip } = parsePagination(query);
  const where = { isDeleted: false };

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userSelect,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
  if (!user || user.isDeleted) {
    throw new AppError("User not found", 404);
  }
  return user;
};

export const updateUser = async (id: string, data: Record<string, unknown>) => {
  await getUserById(id);
  return prisma.user.update({ where: { id }, data, select: userSelect });
};

export const softDeleteUser = async (id: string) => {
  await getUserById(id);
  return prisma.user.update({ where: { id }, data: { isDeleted: true }, select: userSelect });
};