export const THEME_IDS = ["minimal", "terminal"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export const BLOCK_TYPES = [
  "PersonalInfo",
  "Skills",
  "Projects",
  "Resume",
] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

export interface ResumeData {
  id: string;
  url: string;
  fileName: string;
  fileId?: string | null;
}

export interface SetResumePayload {
  url: string;
  fileId: string;
  fileName: string;
}

export interface ProjectData {
  id: string;
  title: string;
  desc: string;
  longDesc?: string | null;
  link?: string | null;
  thumbnail?: string | null;
  thumbnailFileId?: string | null;
}

export interface AddProjectPayload {
  title: string;
  desc: string;
  longDesc?: string;
  link?: string;
  thumbnail?: string;
  thumbnailFileId?: string;
}

export type UpdateProjectPayload = Partial<AddProjectPayload>;

export const MAX_SKILLS = 40;
export const MAX_PROJECTS = 12;

export const SOCIAL_PLATFORMS = [
  "github",
  "linkedin",
  "twitter",
  "instagram",
  "behance",
  "dribbble",
  "youtube",
  "website",
  "blog",
] as const;
export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number];

export interface SocialLinkData {
  id: string;
  platform: SocialPlatform;
  url: string;
}

export interface SetSocialLinksPayload {
  links: { platform: SocialPlatform; url: string }[];
}

/**
 * Resolves user-typed links like "iniranjan.com" or "www.iniranjan.com"
 * to "https://iniranjan.com". Leaves http(s) URLs untouched.
 */
export function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

export interface SkillData {
  id: string;
  name: string;
  icon?: string | null;
}

export interface AddSkillPayload {
  name: string;
  icon?: string;
}

/** Ordered skeleton of a page — block data lives in its own tables. */
export interface PageBlockConfig {
  id: string;
  type: BlockType;
  visible: boolean;
}

export interface PageConfig {
  id: string;
  theme: ThemeId;
  published: boolean;
  blocks: PageBlockConfig[];
}

export interface UpdatePagePayload {
  theme?: ThemeId;
  published?: boolean;
  blocks?: PageBlockConfig[];
}

/** Payload served to visitors at hokori.app/:username — no auth. */
export interface PublicProfilePayload {
  username: string;
  theme: ThemeId;
  blocks: PageBlockConfig[];
  profile: ProfileData | null;
  skills: SkillData[];
  projects: ProjectData[];
  socialLinks: SocialLinkData[];
  resume: ResumeData | null;
}

export interface CreateProfilePayload {
  fullName: string;
  profileImageUrl: string;
  avatarFileId: string;
  role: string;
  bio: string;
  contactEmail?: string;
  phone?: string;
}

export type UpdateProfilePayload = Partial<CreateProfilePayload>;

export interface ProfileData {
  id: string;
  userId: string;
  avatarUrl: string;
  avatarFileId: string;
  bio: string;
  title: string;
  name: string;
  contactEmail?: string | null;
  phone?: string | null;
}
