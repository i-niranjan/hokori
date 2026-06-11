export const THEME_IDS = ["minimal", "terminal"] as const;
export type ThemeId = (typeof THEME_IDS)[number];

export const BLOCK_TYPES = ["PersonalInfo"] as const;
export type BlockType = (typeof BLOCK_TYPES)[number];

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
