import { CompanyStatus, Prisma } from "../../generated/prisma-client";
import prisma from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { buildMeta, parsePagination } from "../../utils/pagination";

export const listCompanies = async (
  query: Record<string, unknown>,
  user?: { id: string; role: string }
) => {
  const { page, limit, skip } = parsePagination(query);
  const where: Prisma.CompanyWhereInput = { isDeleted: false };

  if (query.status) {
    where.status = query.status as CompanyStatus;
  } else if (!user) {
    where.status = CompanyStatus.APPROVED;
  } else if (user.role !== "ADMIN") {
    where.OR = [{ status: CompanyStatus.APPROVED }, { ownerId: user.id }];
  }

  const [data, total] = await Promise.all([
    prisma.company.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.company.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
};

export const getCompanyById = async (id: string) => {
  const company = await prisma.company.findUnique({ where: { id } });
  if (!company || company.isDeleted) {
    throw new AppError("Company not found", 404);
  }
  return company;
};

export const createCompany = async (
  data: {
    name: string;
    description?: string;
    logo?: string;
    website?: string;
    location: string;
  },
  ownerId: string
) => {
  return prisma.company.create({
    data: {
      ...data,
      ownerId,
    },
  });
};

export const updateCompany = async (id: string, data: Record<string, unknown>) => {
  await getCompanyById(id);
  return prisma.company.update({ where: { id }, data });
};

export const softDeleteCompany = async (id: string) => {
  await getCompanyById(id);
  return prisma.company.update({ where: { id }, data: { isDeleted: true } });
};

export const isCompanyOwner = async (companyId: string, userId: string): Promise<boolean> => {
  const company = await prisma.company.findUnique({ where: { id: companyId } });
  return company?.ownerId === userId;
};