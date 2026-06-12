import z from "zod";
import type { CreateProfilePayload } from "@hokori/types";

export const eventAddSchema = z.object({
  profileImageUrl: z.string(),
  avatarFileId: z.string(),
  fullName: z.string().min(2).max(50),
  bio: z.string().min(5).max(120),
  role: z.string(),
  contactEmail: z
    .string()
    .email("Enter a valid email")
    .optional()
    .or(z.literal("")),
  phone: z
    .string()
    .regex(/^[+\d][\d\s\-()]{5,19}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export type EventAddPayload = CreateProfilePayload;
