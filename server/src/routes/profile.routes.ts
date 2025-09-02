import { Router } from "express";
import { profileController } from "../controller/profile.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/add", authMiddleware, profileController.create);

export default router;
