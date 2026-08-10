import { Router } from "express";
import { register, login, logout, getMe } from "../services/auth/auth.controller";
import { loginSchema, registerSchema } from "../services/auth/auth.schema";
import { validate } from "../middleware/validate.middleware";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);

export default router;