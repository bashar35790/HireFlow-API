import { Router } from "express";
import { UserRole } from "../generated/prisma-client";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} from "../services/reviews/reviews.controller";
import { createReviewSchema, updateReviewSchema } from "../services/reviews/reviews.schema";

const router = Router();

router.post("/", authMiddleware, requireRole(UserRole.JOB_SEEKER), validate(createReviewSchema), createReview);
router.get("/", getReviews);
router.get("/:id", getReview);
router.patch("/:id", authMiddleware, validate(updateReviewSchema), updateReview);
router.delete("/:id", authMiddleware, deleteReview);

export default router;