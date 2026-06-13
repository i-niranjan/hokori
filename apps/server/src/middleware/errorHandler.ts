import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof Error) {
    console.log(err.message);

    res.status(500).json({ message: err.message });
  } else {
    console.log(err);
    res.status(err?.status || 500).json({
      message: err?.message || "Something went wrong",
      ...(err?.code && { code: err.code }),
      ...(err?.email && { email: err.email }),
      ...(err?.fields && { fields: err.fields }),
    });
  }
};
