import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import imageKitRoutes from "./routes/imagekit.routes";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3003;
const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`😼 Server is running at http://localhost:${PORT}`);
});
app.get("/", (req: Request, res: Response) => {
  res.send("The Backend is Live");
});

app.use("/auth", authRoutes);
app.use("/image-kit", imageKitRoutes);
app.use("/component/profile", profileRoutes);

app.use(errorHandler);

export default app;
