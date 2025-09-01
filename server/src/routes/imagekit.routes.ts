import { Router } from "express";
import { deleteFile } from "../services/imagekit.service";
import { imagekit } from "../utils/helper";

const router = Router();

router.get("/auth", (req, res) => {
  const authenticationParameters = imagekit.getAuthenticationParameters();
  res.json(authenticationParameters);
});
router.get("/delete/:id", deleteFile);

export default router;
