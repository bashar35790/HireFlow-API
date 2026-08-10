import { Router } from "express";
import { UserRole } from "../generated/prisma-client";
import { optionalAuth } from "../middleware/auth.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { getJobs, getMyJobs, getJob, createJob, updateJob, deleteJob } from "../services/jobs/jobs.controller";
import { createJobSchema, updateJobSchema } from "../services/jobs/jobs.schema";

const router = Router();

router.get("/", getJobs);
router.get("/mine", authMiddleware, requireRole(UserRole.EMPLOYER, UserRole.ADMIN), getMyJobs);
router.get("/:id", optionalAuth, getJob);
router.post("/", authMiddleware, requireRole(UserRole.EMPLOYER, UserRole.ADMIN), validate(createJobSchema), createJob);
router.patch("/:id", authMiddleware, requireRole(UserRole.EMPLOYER, UserRole.ADMIN), validate(updateJobSchema), updateJob);
router.delete("/:id", authMiddleware, requireRole(UserRole.EMPLOYER, UserRole.ADMIN), deleteJob);

export default router;