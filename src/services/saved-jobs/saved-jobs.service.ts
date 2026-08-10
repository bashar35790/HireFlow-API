import { JobStatus, Prisma } from "../../generated/prisma-client";
import prisma from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { buildMeta, parsePagination } from "../../utils/pagination";

const savedJobInclude = {
  job: {
    include: {
      company: true,
      category: true,
    },
  },
} satisfies Prisma.SavedJobInclude;

export const saveJob = async (userId: string, jobId: string) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job || job.isDeleted || job.status !== JobStatus.PUBLISHED) {
    throw new AppError("Job not found", 404);
  }

  const existing = await prisma.savedJob.findFirst({
    where: { userId, jobId, isDeleted: false },
  });
  if (existing) {
    throw new AppError("Job already saved", 409);
  }

  return prisma.savedJob.create({ data: { userId, jobId }, include: savedJobInclude });
};

export const listMySavedJobs = async (userId: string, query: Record<string, unknown>) => {
  const { page, limit, skip } = parsePagination(query);
  const where: Prisma.SavedJobWhereInput = { userId, isDeleted: false };

  const [data, total] = await Promise.all([
    prisma.savedJob.findMany({
      where,
      include: savedJobInclude,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.savedJob.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
};

export const unsaveJob = async (userId: string, jobId: string) => {
  const saved = await prisma.savedJob.findFirst({
    where: { userId, jobId, isDeleted: false },
  });
  if (!saved) {
    throw new AppError("Saved job not found", 404);
  }

  return prisma.savedJob.update({ where: { id: saved.id }, data: { isDeleted: true } });
};