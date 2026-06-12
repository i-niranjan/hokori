import { Router, Request, Response, NextFunction } from "express";
import { socialService } from "../services/social.service.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";
import { setSocialLinksSchema } from "../lib/schemas.js";

const router = Router();

router.get(
  "/",
  authMiddleware,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const links = await socialService.getLinks(req.user.id);
      res.status(200).json({ data: links });
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  "/",
  authMiddleware,
  validateBody(setSocialLinksSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const links = await socialService.setLinks(req.body, req.user.id);
      res.status(200).json({ message: "Social links updated", data: links });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
