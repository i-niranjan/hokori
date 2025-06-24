import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
const router = Router();
router.post("/signup", AuthController.signUp);
router.post("/login", AuthController.login);

export default router;
