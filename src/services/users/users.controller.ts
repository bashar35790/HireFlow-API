import { Request, Response } from "express";
import { AppError } from "../../middleware/error.middleware";
import { asyncHandler } from "../../utils/asyncHandler";
import { sendResponse } from "../../utils/response";
import { UpdateUserInput } from "./users.schema";
import * as usersService from "./users.service";

export const getUsers = asyncHandler(async (req: Request, res: Response) => {
  const { data, meta } = await usersService.listUsers(req.query);
  sendResponse(res, 200, "Users retrieved successfully", data, meta);
});

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await usersService.getUserById(req.params.id as string);

  const isAdmin = req.user?.role === "ADMIN";
  const isSelf = req.user?.id === user.id;
  if (!isAdmin && !isSelf) {
    throw new AppError("Forbidden: insufficient permissions", 403);
  }

  sendResponse(res, 200, "User retrieved successfully", user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const target = await usersService.getUserById(req.params.id as string);

  const isAdmin = req.user?.role === "ADMIN";
  const isOwner = req.user?.id === target.id;
  if (!isAdmin && !isOwner) {
    throw new AppError("Forbidden: insufficient permissions", 403);
  }

  let data: UpdateUserInput;
  if (isAdmin) {
    data = req.body;
  } else {
    const { name } = req.body as UpdateUserInput;
    if (!name) {
      throw new AppError("Only name can be updated in your own profile", 400);
    }
    data = { name };
  }

  const user = await usersService.updateUser(target.id, data);
  sendResponse(res, 200, "User updated successfully", user);
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await usersService.softDeleteUser(req.params.id as string);
  sendResponse(res, 200, "User deleted successfully", null);
});