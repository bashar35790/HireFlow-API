import { Request, Response } from "express";
import { AppError } from "../../middleware/error.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import * as reviewsService from "./reviews.service";

export const getReviews = asyncHandler(async (req: Request, res: Response) => {
  const { data, meta } = await reviewsService.listReviews(req.query);
  sendResponse(res, 200, "Reviews retrieved successfully", data, meta);
});

export const getReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await reviewsService.getReviewById(req.params.id as string);
  sendResponse(res, 200, "Review retrieved successfully", review);
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const review = await reviewsService.createReview(req.user.id, req.body);
  sendResponse(res, 201, "Review created successfully", review);
});

export const updateReview = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  const review = await reviewsService.updateReview(
    req.params.id as string,
    req.user.id,
    req.user.role,
    req.body
  );
  sendResponse(res, 200, "Review updated successfully", review);
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }
  await reviewsService.softDeleteReview(req.params.id as string, req.user.id, req.user.role);
  sendResponse(res, 200, "Review deleted successfully", null);
});