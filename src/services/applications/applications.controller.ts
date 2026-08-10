import { Request, Response } from "express";
import { AppError } from "../../middleware/error.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import * as applicationsService from "./applications.service";

export const applyToJob = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const application = await applicationsService.applyToJob(req.user.id, req.body);
  sendResponse(res, 201, "Application submitted successfully", application);
});

export const getMyApplications = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const { data, meta } = await applicationsService.listMyApplications(req.user.id, req.query);
  sendResponse(res, 200, "Applications retrieved successfully", data, meta);
});

export const getApplication = asyncHandler(async (req: Request, res: Response) => {
  const application = await applicationsService.getApplicationById(req.params.id as string);

  const isAdmin = req.user?.role === "ADMIN";
  const isOwner = application.userId === req.user?.id;
  const isJobOwner = application.job.company.ownerId === req.user?.id;
  if (!isAdmin && !isOwner && !isJobOwner) {
    throw new AppError("Forbidden: insufficient permissions", 403);
  }

  sendResponse(res, 200, "Application retrieved successfully", application);
});

export const getApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
  const application = await applicationsService.getApplicationById(req.params.id as string);
  sendResponse(res, 200, "Application status retrieved successfully", {
    status: application.status,
  });
});

export const updateApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const application = await applicationsService.updateApplicationStatus(
    req.params.id as string,
    req.body.status,
    req.user.id,
    req.user.role
  );
  sendResponse(res, 200, "Application status updated successfully", application);
});

export const deleteApplication = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  await applicationsService.softDeleteApplication(req.params.id as string, req.user.id, req.user.role);
  sendResponse(res, 200, "Application deleted successfully", null);
});