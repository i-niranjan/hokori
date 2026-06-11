export const THEME_IDS = ["minimal", "terminal"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export const BLOCK_TYPES = ["PersonalInfo", "Skills"] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

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
}

export interface CreateProfilePayload {
  fullName: string;
  profileImageUrl: string;
  avatarFileId: string;
  role: string;
  bio: string;
  instagramUrl?: string;
  githubUrl?: string;
  xUrl?: string;
  linkedInUrl?: string;
}

export type UpdateProfilePayload = Partial<CreateProfilePayload>;

export interface ProfileData {
  id: string;
  userId: string;
  avatarUrl: string;
  avatarFileId: string;
  bio: string;
  github?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  twitter?: string | null;
  title: string;
  name: string;
}
