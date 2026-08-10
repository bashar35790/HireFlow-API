import prisma from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { buildMeta, parsePagination } from "../../utils/pagination";
import { slugify } from "../../utils/slugify";

export const listCategories = async (query: Record<string, unknown>) => {
  const { page, limit, skip } = parsePagination(query);
  const where = { isDeleted: false };

  const [data, total] = await Promise.all([
    prisma.category.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: "asc" },
    }),
    prisma.category.count({ where }),
  ]);

  return { data, meta: buildMeta(page, limit, total) };
};

export const getCategoryById = async (id: string) => {
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category || category.isDeleted) {
    throw new AppError("Category not found", 404);
  }
  return category;
};

export const createCategory = async (data: {
  name: string;
  slug?: string;
  description?: string;
}) => {
  return prisma.category.create({
    data: {
      name: data.name,
      slug: data.slug ?? slugify(data.name),
      description: data.description,
    },
  });
};

export const updateCategory = async (id: string, data: Record<string, unknown>) => {
  await getCategoryById(id);
  return prisma.category.update({ where: { id }, data });
};

export const softDeleteCategory = async (id: string) => {
  await getCategoryById(id);
  return prisma.category.update({ where: { id }, data: { isDeleted: true } });
};