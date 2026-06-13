import { Router } from "express";
import { AuthController } from "../controller/auth.controller.js";
import { validateBody } from "../middleware/validate.js";
import {
  signUpSchema,
  loginSchema,
  verifyOtpSchema,
  resendOtpSchema,
} from "../lib/schemas.js";
import { clearAuthCookieOptions } from "../utils/cookies.js";

const router = Router();

router.post("/signup", validateBody(signUpSchema), AuthController.signUp);
router.post(
  "/verify-otp",
  validateBody(verifyOtpSchema),
  AuthController.verifyOtp
);
router.post(
  "/resend-otp",
  validateBody(resendOtpSchema),
  AuthController.resendOtp
);
router.post("/login", validateBody(loginSchema), AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", (req, res) => {
  res.clearCookie("accessToken", clearAuthCookieOptions);
  res.clearCookie("refreshToken", clearAuthCookieOptions);
  res.json({ message: "Logged out successfully" });
});

export default router;
