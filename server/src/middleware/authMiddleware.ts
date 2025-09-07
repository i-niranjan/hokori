import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import { AuthRequest } from "../types/types";
import { verifyAccessToken } from "../utils/jwt";

export const authMiddleware: RequestHandler = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = verifyAccessToken(token);

    req.user = { id: decoded.id, email: decoded.email ?? "" };
    next();
  } catch (error) {
    console.log(error);

    res.status(401).json({ message: "Invalid token" });
  }
};
