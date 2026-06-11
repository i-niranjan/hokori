import { z } from "zod";
import { THEME_IDS, BLOCK_TYPES } from "@hokori/types";

/** Usernames that collide with app routes or invite abuse. */
export const RESERVED_USERNAMES = new Set([
  "admin",
  "api",
  "auth",
  "blog",
  "dashboard",
  "docs",
  "help",
  "hokori",
  "insights",
  "login",
  "logout",
  "page",
  "privacy",
  "root",
  "settings",
  "signup",
  "support",
  "templates",
  "terms",
  "www",
]);

export const usernameSchema = z
  .string()
  .min(3, "Username must be at least 3 characters")
  .max(30, "Username must be at most 30 characters")
  .regex(
    /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
    "Username may only contain letters, numbers and hyphens"
  )
  .refine((name) => !RESERVED_USERNAMES.has(name.toLowerCase()), {
    message: "This username is reserved",
  });

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  userName: usernameSchema,
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
});

export const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

const optionalUsername = z.string().max(100).optional();

export const createProfileSchema = z.object({
  fullName: z.string().min(1).max(100),
  profileImageUrl: z.string().max(500),
  avatarFileId: z.string().max(200),
  role: z.string().min(1).max(100),
  bio: z.string().max(500),
  instagramUrl: optionalUsername,
  githubUrl: optionalUsername,
  xUrl: optionalUsername,
  linkedInUrl: optionalUsername,
});

export const updateProfileSchema = createProfileSchema.partial();

export const updatePageSchema = z
  .object({
    theme: z.enum(THEME_IDS).optional(),
    published: z.boolean().optional(),
    blocks: z
      .array(
        z.object({
          id: z.string().min(1),
          type: z.enum(BLOCK_TYPES),
          visible: z.boolean(),
        })
      )
      .max(50)
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No page fields provided for update",
  });
