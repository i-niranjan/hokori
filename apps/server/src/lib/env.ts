import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3003),
  DATABASE_URL: z.string().min(1),
  ACCESS_SECRET: z.string().min(16),
  REFRESH_SECRET: z.string().min(16),
  CLIENT_URL: z.string().url(),
  IMAGEKIT_URL_ENDPOINT: z.string().url(),
  IMAGEKIT_PUBLIC_KEY: z.string().min(1),
  IMAGEKIT_PRIVATE_KEY: z.string().min(1),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment configuration:\n${missing}`);
}

export const env = parsed.data;
