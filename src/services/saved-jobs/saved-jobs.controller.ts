import { Request, Response } from "express";
import { AppError } from "../../middleware/error.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import * as savedJobsService from "./saved-jobs.service";

export const saveJob = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const savedJob = await savedJobsService.saveJob(req.user.id, req.body.jobId);
  sendResponse(res, 201, "Job saved successfully", savedJob);
});

export const getMySavedJobs = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const { data, meta } = await savedJobsService.listMySavedJobs(req.user.id, req.query);
  sendResponse(res, 200, "Saved jobs retrieved successfully", data, meta);
});

export const unsaveJob = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  await savedJobsService.unsaveJob(req.user.id, req.params.jobId as string);
  sendResponse(res, 200, "Job removed from saved jobs", null);
});