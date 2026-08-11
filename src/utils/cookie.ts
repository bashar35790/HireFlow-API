import { CookieOptions } from "express";
import { env } from "../config/env";

export const COOKIE_NAME = "token";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

// In production the client (Vercel) and API (Render) live on different sites,
// so SameSite=Lax would prevent the auth cookie from being sent cross-site.
// SameSite=None requires Secure, which is enabled in production.
export const cookieOptions: CookieOptions = {
  httpOnly: true,
  sameSite: env.nodeEnv === "production" ? "none" : "lax",
  secure: env.nodeEnv === "production",
  maxAge: SEVEN_DAYS_MS,
  path: "/",
};