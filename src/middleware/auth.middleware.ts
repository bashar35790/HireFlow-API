import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma";
import { env } from "../config/env";
import { AppError } from "./error.middleware";
import { COOKIE_NAME } from "../utils/cookie";

export const authMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const token = req.cookies?.[COOKIE_NAME];

  if (!token) {
    next(new AppError("Authentication required", 401));
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user || user.isDeleted || user.status !== "ACTIVE") {
      next(new AppError("Unauthorized", 401));
      return;
    }

    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
    next();
  } catch {
    next(new AppError("Invalid or expired token", 401));
  }
};