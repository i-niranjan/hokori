import { Router } from "express";
import rateLimit from "express-rate-limit";
import multer from "multer";
import { aiController } from "../controller/ai.controller.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { validateBody } from "../middleware/validate.js";
import { rephraseSchema, generateSchema } from "../lib/schemas.js";

const router = Router();

// AI hits a paid model, so keep it on a tighter per-user budget.
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Slow down a moment and try again" },
});

// Résumé parsing is the heaviest call — give it its own, stricter budget.
const importLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Give résumé imports a minute between tries" },
});

// PDF arrives as multipart (the global JSON body parser is capped at 100kb).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    cb(null, file.mimetype === "application/pdf");
  },
});

router.post(
  "/rephrase",
  authMiddleware,
  aiLimiter,
  validateBody(rephraseSchema),
  aiController.rephrase,
);

router.post(
  "/rephrase-variants",
  authMiddleware,
  aiLimiter,
  validateBody(rephraseSchema),
  aiController.rephraseVariants,
);

router.post(
  "/generate",
  authMiddleware,
  aiLimiter,
  validateBody(generateSchema),
  aiController.generate,
);

router.post(
  "/import-resume",
  authMiddleware,
  importLimiter,
  upload.single("file"),
  aiController.importResume,
);

export default router;
