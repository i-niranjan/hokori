import z from "zod";

export const eventAddSchema = z.object({
  profileImageUrl: z.string().optional(),
  fullName: z.string().min(2).max(50),
  role: z.string(),
  instagramUrl: z.string().url().optional(),
  githubUrl: z.string().url().optional(),
  linkedInUrl: z.string().url().optional(),
  xUrl: z.string().url().optional(),
});
