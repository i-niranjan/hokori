import { profileService } from "../services/profile.service.js";
import { Request, Response, NextFunction } from "express";

export const profileController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const data = req.body;
    try {
      const result = await profileService.addProfile(data, userId);
      res.status(201).json({
        message: `Hooray ${result.name}!,  Profile component added successfully`,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const data = req.body;
    try {
      const profile = await profileService.updateProfile(data, userId);
      res.status(200).json({
        message: "Profile updated successfully",
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  },

  getUnique: async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    try {
      const profile = await profileService.getProfile(userId);
      res.status(200).json({
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  },
};
