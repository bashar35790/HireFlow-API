import { Router } from "express";
import { UserRole } from "../generated/prisma-client";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  applyToJob,
  listApplications,
  getMyApplications,
  getApplication,
  getApplicationStatus,
  updateApplicationStatus,
  deleteApplication,
} from "../services/applications/applications.controller";
import {
  createApplicationSchema,
  updateApplicationStatusSchema,
} from "../services/applications/applications.schema";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole(UserRole.JOB_SEEKER),
  validate(createApplicationSchema),
  applyToJob
);
router.get("/", authMiddleware, requireRole(UserRole.ADMIN, UserRole.EMPLOYER), listApplications);
router.get("/my", authMiddleware, requireRole(UserRole.JOB_SEEKER), getMyApplications);
router.get("/:id/status", authMiddleware, getApplicationStatus);
router.get("/:id", authMiddleware, getApplication);
router.patch(
  "/:id/status",
  authMiddleware,
  validate(updateApplicationStatusSchema),
  updateApplicationStatus
);
router.delete("/:id", authMiddleware, deleteApplication);

export default router;