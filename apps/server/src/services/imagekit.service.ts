import { NextFunction, Request, Response } from "express";
import { imagekit } from "../utils/helper.js";

export const deleteFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const fileId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!fileId) {
      res.status(400).json({ message: "File ID is required" });
      return;
    }

    const response = await imagekit.deleteFile(fileId);
    res
      .status(200)
      .json({ message: "Profile removed successfully", data: response });
  } catch (err) {
    next(err);
  }
};
