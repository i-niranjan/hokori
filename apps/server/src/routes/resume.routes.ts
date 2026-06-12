import { Router, Request, Response, NextFunction } from "express";
import { resumeService } from "../services/resume.service.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";
import { setResumeSchema } from "../lib/schemas.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resume = await resumeService.getResume(req.user.id);
      res.status(200).json({ data: resume });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/",
  authMiddleware,
  validateBody(setResumeSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const resume = await resumeService.setResume(req.body, req.user.id);
      res.status(200).json({ message: "Resume saved", data: resume });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await resumeService.deleteResume(req.user.id);
      res.status(200).json({ message: "Resume removed" });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
