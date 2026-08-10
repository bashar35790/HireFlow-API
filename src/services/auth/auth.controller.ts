import { Request, Response } from "express";
import prisma from "../../lib/prisma";
import { AppError } from "../../middleware/error.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { generateToken } from "../../utils/generateToken";
import { sanitizeUser } from "../../utils/sanitizeUser";
import { COOKIE_NAME, cookieOptions } from "../../utils/cookie";
import { registerUser, loginUser } from "./auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);

  const token = generateToken({ id: user.id, role: user.role });
  res.cookie(COOKIE_NAME, token, cookieOptions);

  sendResponse(res, 201, "Registration successful", sanitizeUser(user));
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await loginUser(email, password);

  const token = generateToken({ id: user.id, role: user.role });
  res.cookie(COOKIE_NAME, token, cookieOptions);

  sendResponse(res, 200, "Login successful", sanitizeUser(user));
});

export const logout = (req: Request, res: Response): void => {
  res.clearCookie(COOKIE_NAME, cookieOptions);
  sendResponse(res, 200, "Logout successful", null);
};

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError("Authentication required", 401);
  }

  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  sendResponse(res, 200, "User retrieved successfully", sanitizeUser(user));
});