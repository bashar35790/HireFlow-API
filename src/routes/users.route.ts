import { Router } from "express";
import { UserRole } from "../generated/prisma-client";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";
import { validate } from "../middleware/validate.middleware";
import { getUsers, getUser, updateUser, deleteUser } from "../services/users/users.controller";
import { updateUserSchema } from "../services/users/users.schema";

const router = Router();

router.get("/", authMiddleware, requireRole(UserRole.ADMIN), getUsers);
router.get("/:id", authMiddleware, getUser);
router.patch("/:id", authMiddleware, validate(updateUserSchema), updateUser);
router.delete("/:id", authMiddleware, requireRole(UserRole.ADMIN), deleteUser);

export default router;