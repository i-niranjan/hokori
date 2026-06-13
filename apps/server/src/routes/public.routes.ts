import { Router, Request, Response, NextFunction } from "express";
import { publicService } from "../services/public.service.js";
import { usernameSchema } from "../lib/schemas.js";
import prisma from "../lib/prisma.js";
import { z } from "zod";

const router = Router();

// Live availability checks for the signup form. Deliberately outside the
// strict auth rate limit; the global limiter still applies.
router.get(
  "/email-check/:email",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const email = String(req.params.email);
      const parsed = z.string().email().safeParse(email);
      if (!parsed.success) {
        res
          .status(200)
          .json({ available: false, message: "Enter a valid email" });
        return;
      }

      const existing = await prisma.user.findUnique({
        where: { email },
        select: { id: true },
      });
      res.status(200).json({
        available: !existing,
        message: existing
          ? "You already have an account with this email"
          : "Available",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/username-check/:username",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const username = String(req.params.username);
      const parsed = usernameSchema.safeParse(username);
      if (!parsed.success) {
        res.status(200).json({
          available: false,
          message: parsed.error.issues[0]?.message ?? "Invalid username",
        });
        return;
      }

      const existing = await prisma.user.findUnique({
        where: { userName: username },
        select: { id: true },
      });
      res.status(200).json({
        available: !existing,
        message: existing ? "This username is already taken" : "Available",
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:username",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload = await publicService.getPublicProfile(
        String(req.params.username)
      );
      res.status(200).json({ data: payload });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
