import { Router, Request, Response, NextFunction } from "express";
import { publicService } from "../services/public.service.js";

const router = Router();

router.get(
  "/:username",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = await publicService.getPublicProfile(
        String(req.params.username)
      );
      res.status(200).json({ data: payload });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
