import { AuthService } from "../services/auth.service";
import { Request, Response, NextFunction } from "express";
import { generateToken } from "../utils/jwt";

const authService = new AuthService();

export const AuthController = {
  signUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, ...data } = req.body;
      await authService.signUp({ email, password, ...data });

      const user = await authService.login({ identifier: email, password });

      const token = generateToken({ id: user.id, email: user.email });

      res.status(201).json({ message: "User registered successfully", token });
    } catch (err) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { identifier, password } = req.body;

      const user = await authService.login({ identifier, password });

      const token = generateToken({ id: user.id, email: user.email });

      res.status(200).json({ message: "Login successful", token });
    } catch (err) {
      next(err);
    }
  },
};
