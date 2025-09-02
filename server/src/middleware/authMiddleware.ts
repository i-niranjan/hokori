import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
interface JwtPayload {
  userId: string;
}

export const authMiddleware: RequestHandler = (req, res, next) => {
  const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};
