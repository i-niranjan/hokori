import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(3003),
  DATABASE_URL: z.string().min(1),
  ACCESS_SECRET: z.string().min(16),
  REFRESH_SECRET: z.string().min(16),
  // One URL or a comma-separated list (prod + preview origins).
  CLIENT_URL: z
    .string()
    .min(1)
    .refine(
      (value) =>
        value
          .split(",")
          .every((part) => z.string().url().safeParse(part.trim()).success),
      { message: "CLIENT_URL must be a URL or comma-separated URLs" },
    ),
  IMAGEKIT_URL_ENDPOINT: z.string().url(),
  IMAGEKIT_PUBLIC_KEY: z.string().min(1),
  IMAGEKIT_PRIVATE_KEY: z.string().min(1),
  // SMTP is optional in dev: when unset, OTP codes are logged to the console.
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  const missing = parsed.error.issues
    .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
    .join("\n");
  throw new Error(`Invalid environment configuration:\n${missing}`);
}

export const env = parsed.data;
