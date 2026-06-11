import { Router } from "express";
import { pageController } from "../controller/page.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";
import { updatePageSchema } from "../lib/schemas.js";

const router = Router();

router.get("/", authMiddleware, pageController.get);
router.put("/", authMiddleware, validateBody(updatePageSchema), pageController.update);

export default router;
