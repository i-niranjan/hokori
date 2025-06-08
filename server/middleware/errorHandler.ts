import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Error) {
    res.status(500).json({ message: err.message });
  } else {
    res.status(500).json({ message: "Something went wrong" });
  }
};
