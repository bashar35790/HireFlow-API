import { Request, Response } from "express";
import { AppError } from "../../middleware/error.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import * as companiesService from "./companies.service";

export const getCompanies = asyncHandler(async (req: Request, res: Response) => {
  const { data, meta } = await companiesService.listCompanies(req.query);
  sendResponse(res, 200, "Companies retrieved successfully", data, meta);
});

export const getCompany = asyncHandler(async (req: Request, res: Response) => {
  const company = await companiesService.getCompanyById(req.params.id as string);
  sendResponse(res, 200, "Company retrieved successfully", company);
});

export const createCompany = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const company = await companiesService.createCompany(req.body, req.user.id);
  sendResponse(res, 201, "Company created successfully", company);
});

export const updateCompany = asyncHandler(async (req: Request, res: Response) => {
  const company = await companiesService.getCompanyById(req.params.id as string);

  const isAdmin = req.user?.role === "ADMIN";
  const isOwner = company.ownerId === req.user?.id;
  if (!isAdmin && !isOwner) {
    throw new AppError("Forbidden: insufficient permissions", 403);
  }

  const updated = await companiesService.updateCompany(company.id, req.body);
  sendResponse(res, 200, "Company updated successfully", updated);
});

export const deleteCompany = asyncHandler(async (req: Request, res: Response) => {
  const company = await companiesService.getCompanyById(req.params.id as string);

  const isAdmin = req.user?.role === "ADMIN";
  const isOwner = company.ownerId === req.user?.id;
  if (!isAdmin && !isOwner) {
    throw new AppError("Forbidden: insufficient permissions", 403);
  }

  await companiesService.softDeleteCompany(company.id);
  sendResponse(res, 200, "Company deleted successfully", null);
});