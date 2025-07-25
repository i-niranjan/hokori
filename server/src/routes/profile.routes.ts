import { Router } from "express";
import { profileController } from "../controller/profile.controller";

const router = Router();

router.post("/add", profileController.create);

export default router;
