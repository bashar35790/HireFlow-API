import { JobStatus, Prisma } from "../../generated/prisma-client";
import prisma from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { buildMeta, parsePagination } from "../../utils/pagination";
import { CreateJobInput, UpdateJobInput } from "./jobs.schema";

const jobInclude = {
  company: true,
  category: true,
} satisfies Prisma.JobInclude;

export const listJobs = async (query: Record<string, unknown>) => {
  const { page, limit, skip } = parsePagination(query);
  const where: Prisma.JobWhereInput = {
    isDeleted: false,
    status: JobStatus.PUBLISHED,
  };

  if (query.search) {
    const search = String(query.search);
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  if (query.category) {
    const category = await prisma.category.findFirst({
      where: {
        OR: [{ slug: String(query.category) }, { id: String(query.category) }],
        isDeleted: false,
      },
    });
    if (!category) {
      return { data: [], meta: buildMeta(page, limit, 0) };
    }
    where.categoryId = category.id;
  }

  if (query.location) {
    where.location = { contains: String(query.location), mode: "insensitive" };
  }

  if (query.jobType) {
    where.jobType = String(query.jobType);
  }

  if (query.salaryMin) {
    where.salaryMax = { gte: Number(query.salaryMin) };
  }

  if (query.salaryMax) {
    where.salaryMin = { lte: Number(query.salaryMax) };
  }

  const [data, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: jobInclude,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.job.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
};

export const getJobById = async (id: string) => {
  const job = await prisma.job.findUnique({ where: { id }, include: jobInclude });
  if (!job || job.isDeleted) {
    throw new AppError("Job not found", 404);
  }
  return job;
};

export const createJob = async (input: CreateJobInput, userId: string, role: string) => {
  const company = await prisma.company.findUnique({ where: { id: input.companyId } });
  if (!company || company.isDeleted) {
    throw new AppError("Company not found", 404);
  }
  if (role !== "ADMIN" && company.ownerId !== userId) {
    throw new AppError("Forbidden: you can only create jobs for your own company", 403);
  }

  const category = await prisma.category.findUnique({ where: { id: input.categoryId } });
  if (!category || category.isDeleted) {
    throw new AppError("Category not found", 404);
  }

  return prisma.job.create({
    data: {
      ...input,
      status: input.status ?? JobStatus.DRAFT,
    },
    include: jobInclude,
  });
};

export const updateJob = async (id: string, input: UpdateJobInput, userId: string, role: string) => {
  const job = await prisma.job.findUnique({ where: { id }, include: { company: true } });
  if (!job || job.isDeleted) {
    throw new AppError("Job not found", 404);
  }
  if (role !== "ADMIN" && job.company.ownerId !== userId) {
    throw new AppError("Forbidden: you can only update your own jobs", 403);
  }

  return prisma.job.update({
    where: { id },
    data: input,
    include: jobInclude,
  });
};

export const softDeleteJob = async (id: string, userId: string, role: string) => {
  const job = await prisma.job.findUnique({ where: { id }, include: { company: true } });
  if (!job || job.isDeleted) {
    throw new AppError("Job not found", 404);
  }
  if (role !== "ADMIN" && job.company.ownerId !== userId) {
    throw new AppError("Forbidden: you can only delete your own jobs", 403);
  }

  return prisma.job.update({ where: { id }, data: { isDeleted: true } });
};