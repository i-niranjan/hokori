import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
import ImageKit from "imagekit";
import { imagekit } from "../utils/helper";

const router = Router();

router.post("/signup", AuthController.signUp);
router.post("/login", AuthController.login);

export default router;
