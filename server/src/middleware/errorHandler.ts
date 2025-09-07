import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Error) {
    console.log(err.message);

    res.status(500).json({ message: err.message });
  } else {
    console.log(err);

    res.status(500).json({ message: "Something went wrong" });
  }
};
