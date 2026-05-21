import { Router } from "express";
import { AuthController } from "../controller/auth.controller.js";
import ImageKit from "imagekit";
import { imagekit } from "../utils/helper.js";

const router = Router();

router.post("/signup", AuthController.signUp);
router.post("/login", AuthController.login);
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
