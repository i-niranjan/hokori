import { AuthService } from "../services/auth.service.js";
import { otpService } from "../services/otp.service.js";
import { Request, Response, NextFunction } from "express";
import { generateToken, verifyRefreshToken } from "../utils/jwt.js";
import { env } from "../lib/env.js";
import {
  accessCookieOptions,
  refreshCookieOptions,
} from "../utils/cookies.js";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

const ACCESS_SECRET = env.ACCESS_SECRET;
const authService = new AuthService();

type UserRecord = Awaited<ReturnType<AuthService["login"]>>;
const sanitizeUser = (user: UserRecord) => {
  const { password: _password, ...safeUser } = user;
  return safeUser;
};

const issueAuthCookies = (res: Response, user: { id: string; email: string }) => {
  const token = generateToken({ id: user.id, email: user.email });
  res.cookie("accessToken", token.accessToken, accessCookieOptions);
  res.cookie("refreshToken", token.refreshToken, refreshCookieOptions);
};

export const AuthController = {
  signUp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, firstName, userName } = req.body;

      await authService.assertSignupAvailable({ email, userName });
      await otpService.requestOtp(email, firstName);

      res.status(201).json({
        message: "Check your email for a verification code",
        requiresVerification: true,
        email,
      });
    } catch (err) {
      next(err);
    }
  },

  verifyOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, ...signUpData } = req.body;

      await authService.assertSignupAvailable(signUpData);
      await otpService.verifyOtp(signUpData.email, code);
      const user = await authService.signUp(signUpData);

      issueAuthCookies(res, user);
      res.status(200).json({
        user: sanitizeUser(user),
        message: "Email verified, welcome to Hokori",
      });
    } catch (err) {
      next(err);
    }
  },

  resendOtp: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        throw { status: 400, message: "This email is already verified" };
      }

      await otpService.requestOtp(email);
      res.status(200).json({ message: "A new code is on its way" });
    } catch (err) {
      next(err);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { identifier, password } = req.body;

      const user = await authService.login({ identifier, password });

      if (!user.emailVerified) {
        // Re-send a code so the user lands on the verify screen ready to go.
        await otpService
          .requestOtp(user.email, user.firstName)
          .catch(() => undefined);
        res.status(403).json({
          message: "Verify your email to continue",
          code: "EMAIL_NOT_VERIFIED",
          email: user.email,
        });
        return;
      }

      issueAuthCookies(res, user);
      res.status(200).json({
        user: sanitizeUser(user),
        message: "Login successful",
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
      res.cookie("accessToken", newAccessToken, accessCookieOptions);
      res.status(200).json({ message: "Session refreshed" });
    } catch (error) {
      next(error);
    }
  },
};
