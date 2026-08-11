import { Router } from "express";
import { UserRole } from "../generated/prisma-client";
import { authMiddleware, optionalAuth } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
} from "../services/companies/companies.controller";
import { createCompanySchema, updateCompanySchema } from "../services/companies/companies.schema";

const router = Router();

router.post(
  "/",
  authMiddleware,
  requireRole(UserRole.EMPLOYER, UserRole.ADMIN),
  validate(createCompanySchema),
  createCompany
);
router.get("/", optionalAuth, getCompanies);
router.get("/:id", getCompany);
router.patch("/:id", authMiddleware, validate(updateCompanySchema), updateCompany);
router.delete("/:id", authMiddleware, deleteCompany);

export default router;