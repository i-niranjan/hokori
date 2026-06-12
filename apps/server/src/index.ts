import { env } from "./lib/env.js";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import pageRoutes from "./routes/page.routes.js";
import publicRoutes from "./routes/public.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import projectRoutes from "./routes/project.routes.js";
import socialRoutes from "./routes/social.routes.js";
import imageKitRoutes from "./routes/imagekit.routes.js";
import cookieParser from "cookie-parser";

const PORT = env.PORT;
const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts, please try again later" },
});
app.use(globalLimiter);

app.listen(PORT, () => {
  console.log(`😼 Server is running at http://localhost:${PORT}`);
});
app.get("/", (req: Request, res: Response) => {
  res.send("The Backend is Live");
});

app.use("/auth", authLimiter, authRoutes);
app.use("/image-kit", imageKitRoutes);
app.use("/component/profile", profileRoutes);
app.use("/component/skill", skillRoutes);
app.use("/component/project", projectRoutes);
app.use("/component/social", socialRoutes);
app.use("/page", pageRoutes);
app.use("/public", publicRoutes);

app.use(errorHandler);

export default app;
