import { Router } from "express";
import { profileController } from "../controller/profile.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/add", authMiddleware, profileController.create);
router.patch("/update", authMiddleware, profileController.update);
router.get("/getProfile", authMiddleware, profileController.getUnique);

export default router;
