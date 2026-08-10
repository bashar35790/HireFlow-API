import { Response } from "express";

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
  meta?: PaginationMeta
): Response<SuccessResponse<T>> => {
  const body: SuccessResponse<T> = { success: true, message, data };
  if (meta) {
    body.meta = meta;
  }
  return res.status(statusCode).json(body);
};
