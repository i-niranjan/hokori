import { Router } from "express";
import { projectController } from "../controller/project.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";
import { addProjectSchema, updateProjectSchema } from "../lib/schemas.js";

const router = Router();

router.get("/", authMiddleware, projectController.list);
router.post(
  "/add",
  authMiddleware,
  validateBody(addProjectSchema),
  projectController.create
);
router.patch(
  "/:id",
  authMiddleware,
  validateBody(updateProjectSchema),
  projectController.update
);
router.delete("/:id", authMiddleware, projectController.remove);

export default router;
