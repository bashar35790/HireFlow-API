import { Router } from "express";
import { UserRole } from "../generated/prisma-client";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categories/categories.controller";
import { createCategorySchema, updateCategorySchema } from "../services/categories/categories.schema";

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post(
  "/",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.EMPLOYER),
  validate(createCategorySchema),
  createCategory
);
router.patch(
  "/:id",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.EMPLOYER),
  validate(updateCategorySchema),
  updateCategory
);
router.delete(
  "/:id",
  authMiddleware,
  requireRole(UserRole.ADMIN, UserRole.EMPLOYER),
  deleteCategory
);

export default router;