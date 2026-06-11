import { Router } from "express";
import { skillController } from "../controller/skill.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";
import { addSkillSchema } from "../lib/schemas.js";

const router = Router();

router.get("/", authMiddleware, skillController.list);
router.post("/add", authMiddleware, validateBody(addSkillSchema), skillController.create);
router.delete("/:id", authMiddleware, skillController.remove);

export default router;
