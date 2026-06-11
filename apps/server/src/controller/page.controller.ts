import { pageService } from "../services/page.service.js";
import { Request, Response, NextFunction } from "express";

export const pageController = {
  get: async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    try {
      const page = await pageService.getPage(userId);
      res.status(200).json({ data: page });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    try {
      const page = await pageService.updatePage(req.body, userId);
      res.status(200).json({
        message: "Page updated successfully",
        data: page,
      });
    } catch (error) {
      next(error);
    }
  },
};
