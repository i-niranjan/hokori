import { Router } from "express";
import { deleteFile } from "../services/imagekit.service.js";
import { imagekit } from "../utils/helper.js";

const router = Router();

router.get("/auth", (req, res) => {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  res.json(authenticationParameters);
});
router.get("/delete/:id", deleteFile);

export default router;
