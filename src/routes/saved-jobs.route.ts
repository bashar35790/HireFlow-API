import { Router } from "express";
import { UserRole } from "../generated/prisma-client";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { saveJob, getMySavedJobs, unsaveJob } from "../services/saved-jobs/saved-jobs.controller";
import { createSavedJobSchema } from "../services/saved-jobs/saved-jobs.schema";

const router = Router();

router.post("/", authMiddleware, requireRole(UserRole.JOB_SEEKER), validate(createSavedJobSchema), saveJob);
router.get("/my", authMiddleware, requireRole(UserRole.JOB_SEEKER), getMySavedJobs);
router.delete("/:jobId", authMiddleware, requireRole(UserRole.JOB_SEEKER), unsaveJob);

export default router;