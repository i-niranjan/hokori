import { profileService } from "../services/profile.service";
import { Request, Response, NextFunction } from "express";

export const profileController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.userId!;
    const data = req.body;
    try {
      const result = await profileService.addProfile(data, userId);
      res.status(201).json({
        message: `Hooray ${result.name}!,  Profile component added successfully`,
      });
    } catch (error) {
      next(error);
    }
  },
};
