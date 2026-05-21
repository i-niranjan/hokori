import z from "zod";
import type { CreateProfilePayload } from "@hokori/types";

export const eventAddSchema = z.object({
  profileImageUrl: z.string(),
  avatarFileId: z.string(),
  fullName: z.string().min(2).max(50),
  bio: z.string().min(5).max(120),
  role: z.string(),
  instagramUrl: z.string().optional(),
  githubUrl: z.string().optional(),
  linkedInUrl: z.string().optional(),
  xUrl: z.string().optional(),
});

export type EventAddPayload = CreateProfilePayload;
