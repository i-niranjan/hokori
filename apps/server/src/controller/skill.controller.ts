import { skillService } from "../services/skill.service.js";
import { Request, Response, NextFunction } from "express";

export const skillController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skills = await skillService.getSkills(req.user.id);
      res.status(200).json({ data: skills });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const skill = await skillService.addSkill(req.body, req.user.id);
      res.status(201).json({ message: "Skill added", data: skill });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await skillService.deleteSkill(String(req.params.id), req.user.id);
      res.status(200).json({ message: "Skill removed" });
    } catch (error) {
      next(error);
    }
  },
};
