import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { slugify } from "../../utils/slugify";
import { CreateCategoryInput } from "./categories.schema";
import * as categoriesService from "./categories.service";

export const getCategories = asyncHandler(async (req: Request, res: Response) => {
  const { data, meta } = await categoriesService.listCategories(req.query);
  sendResponse(res, 200, "Categories retrieved successfully", data, meta);
});

export const getCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoriesService.getCategoryById(req.params.id as string);
  sendResponse(res, 200, "Category retrieved successfully", category);
});

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const input: CreateCategoryInput = req.body;
  const category = await categoriesService.createCategory({
    name: input.name,
    slug: input.slug ?? slugify(input.name),
    description: input.description,
  });
  sendResponse(res, 201, "Category created successfully", category);
});

export const updateCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoriesService.updateCategory(req.params.id as string, req.body);
  sendResponse(res, 200, "Category updated successfully", category);
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  await categoriesService.softDeleteCategory(req.params.id as string);
  sendResponse(res, 200, "Category deleted successfully", null);
});