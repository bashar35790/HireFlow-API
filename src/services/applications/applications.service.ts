import { ApplicationStatus, JobStatus, Prisma } from "../../generated/prisma-client";
import prisma from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { buildMeta, parsePagination } from "../../utils/pagination";
import { CreateApplicationInput } from "./applications.schema";

const applicationInclude = {
  job: {
    include: {
      company: true,
      category: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.ApplicationInclude;

export const applyToJob = async (userId: string, input: CreateApplicationInput) => {
  const job = await prisma.job.findUnique({ where: { id: input.jobId } });
  if (!job || job.isDeleted || job.status !== JobStatus.PUBLISHED) {
    throw new AppError("Job not found", 404);
  }

  const existing = await prisma.application.findFirst({
    where: { userId, jobId: input.jobId, isDeleted: false },
  });
  if (existing) {
    throw new AppError("You have already applied to this job", 409);
  }

  return prisma.application.create({
    data: {
      userId,
      jobId: input.jobId,
      resume: input.resume,
      coverLetter: input.coverLetter,
    },
    include: applicationInclude,
  });
};

export const listMyApplications = async (userId: string, query: Record<string, unknown>) => {
  const { page, limit, skip } = parsePagination(query);
  const where: Prisma.ApplicationWhereInput = { userId, isDeleted: false };

  const [data, total] = await Promise.all([
    prisma.application.findMany({
      where,
      include: applicationInclude,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.application.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
};

export const getApplicationById = async (id: string) => {
  const application = await prisma.application.findUnique({
    where: { id },
    include: applicationInclude,
  });
  if (!application || application.isDeleted) {
    throw new AppError("Application not found", 404);
  }
  return application;
};

export const updateApplicationStatus = async (
  id: string,
  status: ApplicationStatus,
  userId: string,
  role: string
) => {
  const application = await prisma.application.findUnique({
    where: { id },
    include: { job: { include: { company: true } } },
  });
  if (!application || application.isDeleted) {
    throw new AppError("Application not found", 404);
  }

  const isAdmin = role === "ADMIN";
  const isJobOwner = application.job.company.ownerId === userId;
  if (!isAdmin && !isJobOwner) {
    throw new AppError("Forbidden: insufficient permissions", 403);
  }

  return prisma.application.update({
    where: { id },
    data: { status },
    include: applicationInclude,
  });
};

export const softDeleteApplication = async (id: string, userId: string, role: string) => {
  const application = await prisma.application.findUnique({ where: { id } });
  if (!application || application.isDeleted) {
    throw new AppError("Application not found", 404);
  }

  const isAdmin = role === "ADMIN";
  const isOwner = application.userId === userId;
  if (!isAdmin && !isOwner) {
    throw new AppError("Forbidden: insufficient permissions", 403);
  }

  return prisma.application.update({ where: { id }, data: { isDeleted: true } });
};