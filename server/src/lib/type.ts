interface createProfile {
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

type updateProfile = Partial<createProfile>;

export { createProfile, updateProfile };
