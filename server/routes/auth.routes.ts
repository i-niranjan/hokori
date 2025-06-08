import { Router } from "express";
import { AuthController } from "../controller/auth.controller";
const router = Router();
router.post("/signup", AuthController.signUp);
router.get("/login", AuthController.login);

export default router;
