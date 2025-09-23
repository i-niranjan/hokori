import { Router } from "express";
import { profileController } from "../controller/profile.controller";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();

router.post("/add", authMiddleware, profileController.create);
router.get("/getProfile", authMiddleware, profileController.getUnique);

export default router;
