import type { CookieOptions } from "express";
import { env } from "../lib/env.js";

const isProd = env.NODE_ENV === "production";

/**
 * Refresh-token cookie options. In production the web app and API live on
 * different origins, so the cookie must be SameSite=None + Secure for the
 * browser to send it on cross-site XHR. In dev (same-site localhost), Lax
 * keeps things working without HTTPS.
 */
export const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

/** Short-lived access token cookie, must match the JWT's 15m expiry. */
export const accessCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
  maxAge: 15 * 60 * 1000,
};

/** clearCookie must match the options the cookie was set with. */
export const clearAuthCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: isProd ? "none" : "lax",
  path: "/",
};
