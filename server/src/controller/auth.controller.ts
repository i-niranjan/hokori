import { AuthService } from "../services/auth.service";
import { Request, Response, NextFunction } from "express";
import { generateToken, verifyRefreshToken } from "../utils/jwt";
import jwt from "jsonwebtoken";
const ACCESS_SECRET = process.env.ACCESS_SECRET!;
const authService = new AuthService();

export const AuthController = {
  signUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, ...data } = req.body;

      await authService.signUp({ email, password, ...data });

      const user = await authService.login({ identifier: email, password });

      const token = generateToken({ id: user.id, email: user.email });

      res.cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(201).json({
        user,
        message: "User registered successfully",
        accessToken: token.accessToken,
      });
    } catch (err) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { identifier, password } = req.body;

      const user = await authService.login({ identifier, password });

      const token = generateToken({ id: user.id, email: user.email });

      res.cookie("refreshToken", token.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      res.status(200).json({
        user,
        message: "Login successful",
        accessToken: token.accessToken,
      });
    } catch (err) {
      next(err);
    }
  },

  refreshToken: async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const token = req.cookies.refreshToken;
      if (!token) {
        res.sendStatus(401);
        return;
      }

      const payload = verifyRefreshToken(token);
      const newAccessToken = jwt.sign(
        { id: payload.id, email: payload.email },
        ACCESS_SECRET,
        { expiresIn: "15m" }
      );
      res.status(200).json({ accessToken: newAccessToken });
    } catch (error) {
      next(error);
    }
  },
};
