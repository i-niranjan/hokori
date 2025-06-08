import express, { Request, Response } from "express";
import cors from "cors";

const PORT = process.env.PORT || 3003;
const app = express();

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`😼 Server is running at http://localhost:${PORT}`);
});
app.get("/", (req: Request, res: Response) => {
  res.send("The Backend is Live");
});

export default app;
