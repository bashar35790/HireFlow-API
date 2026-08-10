import { Prisma } from "../../generated/prisma-client";
import prisma from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { buildMeta, parsePagination } from "../../utils/pagination";
import { CreateReviewInput } from "./reviews.schema";

const reviewInclude = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.ReviewInclude;

export const createReview = async (userId: string, input: CreateReviewInput) => {
  const company = await prisma.company.findUnique({ where: { id: input.companyId } });
  if (!company || company.isDeleted) {
    throw new AppError("Company not found", 404);
  }

  const interaction = await prisma.application.findFirst({
    where: {
      userId,
      isDeleted: false,
      job: { companyId: company.id, isDeleted: false },
    },
  });
  if (!interaction) {
    throw new AppError("You can only review a company you have applied to", 403);
  }

  const existing = await prisma.review.findFirst({
    where: { userId, companyId: company.id, isDeleted: false },
  });
  if (existing) {
    throw new AppError("You have already reviewed this company", 409);
  }

  return prisma.review.create({
    data: {
      userId,
      companyId: company.id,
      rating: input.rating,
      comment: input.comment,
    },
    include: reviewInclude,
  });
};

export const listReviews = async (query: Record<string, unknown>) => {
  const { page, limit, skip } = parsePagination(query);
  const where: Prisma.ReviewWhereInput = { isDeleted: false, status: "ACTIVE" };

  if (query.companyId) {
    where.companyId = String(query.companyId);
  }

  const [data, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: reviewInclude,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.review.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
};

export const getReviewById = async (id: string) => {
  const review = await prisma.review.findUnique({ where: { id }, include: reviewInclude });
  if (!review || review.isDeleted || review.status !== "ACTIVE") {
    throw new AppError("Review not found", 404);
  }
  return review;
};

export const updateReview = async (
  id: string,
  userId: string,
  role: string,
  data: Record<string, unknown>
) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review || review.isDeleted) {
    throw new AppError("Review not found", 404);
  }

  const isAdmin = role === "ADMIN";
  const isAuthor = review.userId === userId;
  if (!isAdmin && !isAuthor) {
    throw new AppError("Forbidden: you can only update your own reviews", 403);
  }

  return prisma.review.update({
    where: { id },
    data,
    include: reviewInclude,
  });
};

export const softDeleteReview = async (id: string, userId: string, role: string) => {
  const review = await prisma.review.findUnique({ where: { id } });
  if (!review || review.isDeleted) {
    throw new AppError("Review not found", 404);
  }

  const isAdmin = role === "ADMIN";
  const isAuthor = review.userId === userId;
  if (!isAdmin && !isAuthor) {
    throw new AppError("Forbidden: you can only delete your own reviews", 403);
  }

  return prisma.review.update({ where: { id }, data: { isDeleted: true } });
};