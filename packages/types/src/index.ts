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
