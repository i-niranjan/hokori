import { AuthService } from "../services/auth.service";
import { Request, Response, NextFunction } from "express";
const authService = new AuthService();

export const AuthController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.login(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
  signUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await authService.signUp(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
};
