import { Request, Response } from "express";
import { AppError } from "../../middleware/error.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { JobStatus } from "../../generated/prisma-client";
import * as jobsService from "./jobs.service";

export const getJobs = asyncHandler(async (req: Request, res: Response) => {
  const { data, meta } = await jobsService.listJobs(req.query);
  sendResponse(res, 200, "Jobs retrieved successfully", data, meta);
});

export const getMyJobs = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const companyId =
    typeof req.query.companyId === "string" ? req.query.companyId : undefined;
  const { data, meta } = await jobsService.listMyJobs(req.user.id, req.user.role, companyId);
  sendResponse(res, 200, "Jobs retrieved successfully", data, meta);
});

export const getJob = asyncHandler(async (req: Request, res: Response) => {
  const job = await jobsService.getJobById(req.params.id as string);

  const canView =
    job.status === JobStatus.PUBLISHED ||
    req.user?.role === "ADMIN" ||
    job.company.ownerId === req.user?.id;

  if (!canView) {
    throw new AppError("Job not found", 404);
  }

  sendResponse(res, 200, "Job retrieved successfully", job);
});

export const createJob = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const job = await jobsService.createJob(req.body, req.user.id, req.user.role);
  sendResponse(res, 201, "Job created successfully", job);
});

export const updateJob = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const job = await jobsService.updateJob(req.params.id as string, req.body, req.user.id, req.user.role);
  sendResponse(res, 200, "Job updated successfully", job);
});

export const deleteJob = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  await jobsService.softDeleteJob(req.params.id as string, req.user.id, req.user.role);
  sendResponse(res, 200, "Job deleted successfully", null);
});