import { RequestHandler } from "express";
import { UserRole } from "../generated/prisma-client";
import { AppError } from "./error.middleware";

export const requireRole = (...roles: UserRole[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      next(new AppError("Authentication required", 401));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError("Forbidden: insufficient permissions", 403));
      return;
    }
    next();
  };
};