import { Router } from "express";
import { profileController } from "../controller/profile.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";
import { createProfileSchema, updateProfileSchema } from "../lib/schemas.js";

const router = Router();

router.post(
  "/add",
  authMiddleware,
  validateBody(createProfileSchema),
  profileController.create
);
router.patch(
  "/update",
  authMiddleware,
  validateBody(updateProfileSchema),
  profileController.update
);
router.get("/getProfile", authMiddleware, profileController.getUnique);

export default router;
