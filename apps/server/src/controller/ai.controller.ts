import { Request, Response, NextFunction } from "express";
import {
  rephraseText,
  rephraseVariants,
  generateBio,
  generateProject,
  parseResume,
} from "../lib/gemeni.js";

export const aiController = {
  rephrase: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, field } = req.body;
      const result = await rephraseText(text, field);
      res.status(200).json({ data: { text: result } });
    } catch (error) {
      next(error);
    }
  },

  rephraseVariants: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text, field } = req.body;
      const variants = await rephraseVariants(text, field);
      res.status(200).json({ data: { variants } });
    } catch (error) {
      next(error);
    }
  },

  generate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { field, prompt } = req.body;
      if (field === "bio") {
        const text = await generateBio(prompt);
        res.status(200).json({ data: { text } });
      } else {
        const project = await generateProject(prompt);
        res.status(200).json({ data: { project } });
      }
    } catch (error) {
      next(error);
    }
  },

  importResume: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const file = req.file;
      if (!file) {
        res.status(400).json({ message: "Attach a résumé PDF to import" });
        return;
      }
      if (file.mimetype !== "application/pdf") {
        res.status(400).json({ message: "Only PDF résumés are supported" });
        return;
      }
      const result = await parseResume(file.buffer, file.mimetype);
      res.status(200).json({ data: result });
    } catch (error) {
      next(error);
    }
  },
};
