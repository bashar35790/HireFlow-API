import { CookieOptions } from "express";
import { env } from "../config/env";

export const COOKIE_NAME = "token";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: env.nodeEnv === "production",
  maxAge: SEVEN_DAYS_MS,
  path: "/",
};