import { projectService } from "../services/project.service.js";
import { Request, Response, NextFunction } from "express";

export const projectController = {
  list: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projects = await projectService.getProjects(req.user.id);
      res.status(200).json({ data: projects });
    } catch (error) {
      next(error);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await projectService.addProject(req.body, req.user.id);
      res.status(201).json({ message: "Project added", data: project });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const project = await projectService.updateProject(
        String(req.params.id),
        req.body,
        req.user.id
      );
      res.status(200).json({ message: "Project updated", data: project });
    } catch (error) {
      next(error);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await projectService.deleteProject(String(req.params.id), req.user.id);
      res.status(200).json({ message: "Project removed" });
    } catch (error) {
      next(error);
    }
  },
};
