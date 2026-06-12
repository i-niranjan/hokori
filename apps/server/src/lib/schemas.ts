import { z } from "zod";
import {
  THEME_IDS,
  BLOCK_TYPES,
  SOCIAL_PLATFORMS,
  normalizeUrl,
} from "@hokori/types";

/** Accepts bare domains  and resolves them to https URLs. */
const isValidUrl = (value: string) => {
  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      url.hostname.includes(".")
    );
  } catch {
    return false;
  }
};

const looseUrl = z
  .string()
  .max(500)
  .transform((value) => normalizeUrl(value))
  .refine((value) => !value || isValidUrl(value), {
    message: "Enter a valid link like iniranjan.com or https://iniranjan.com",
  });

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
    "Username may only contain letters, numbers and hyphens",
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

export const createProfileSchema = z.object({
  fullName: z.string().min(1).max(100),
  profileImageUrl: z.string().max(500),
  avatarFileId: z.string().max(200),
  role: z.string().min(1).max(100),
  bio: z.string().max(500),
  contactEmail: z.string().email().max(200).optional().or(z.literal("")),
  phone: z
    .string()
    .regex(/^[+\d][\d\s\-()]{5,19}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export const updateProfileSchema = createProfileSchema.partial();

export const addSkillSchema = z.object({
  name: z.string().min(1).max(50),
  icon: z.string().max(100).optional(),
});

export const addProjectSchema = z.object({
  title: z.string().min(1).max(100),
  desc: z.string().min(1).max(500),
  longDesc: z.string().max(5000).optional().or(z.literal("")),
  link: looseUrl.optional(),
  thumbnail: z.string().max(500).optional(),
  thumbnailFileId: z.string().max(200).optional(),
});

export const updateProjectSchema = addProjectSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: "No project fields provided for update",
  });

export const setResumeSchema = z.object({
  url: z.string().min(1).max(500),
  fileId: z.string().min(1).max(200),
  fileName: z.string().min(1).max(200),
});

export const setSocialLinksSchema = z.object({
  links: z
    .array(
      z.object({
        platform: z.enum(SOCIAL_PLATFORMS),
        url: looseUrl.refine((value) => value.length > 0, {
          message: "Link can't be empty",
        }),
      }),
    )
    .max(SOCIAL_PLATFORMS.length),
});

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
        }),
      )
      .max(50)
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No page fields provided for update",
  });
