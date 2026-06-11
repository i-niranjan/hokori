import { Router } from "express";
import { AuthController } from "../controller/auth.controller.js";
import { validateBody } from "../middleware/validate.js";
import { signUpSchema, loginSchema } from "../lib/schemas.js";

const router = Router();

router.post("/signup", validateBody(signUpSchema), AuthController.signUp);
router.post("/login", validateBody(loginSchema), AuthController.login);
router.post("/refresh-token", AuthController.refreshToken);
router.post("/logout", (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  res.json({ message: "Logged out successfully" });
});

export default router;
