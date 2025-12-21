import prisma from "../lib/prisma";
import { createProfile } from "../lib/type";
export const profileService = {
  addProfile: async (data: createProfile, userId: string) => {
    if (!data) throw new Error("Invalid Input");
    const profile = await prisma.profile.create({
      data: {
        userId: userId,
        name: data.fullName,
        avatarUrl: data.profileImageUrl,
        avatarFileId: data.avatarFileId,
        title: data.role,
        bio: data.bio,
        instagram: data.instagramUrl ?? null,
        github: data.githubUrl ?? null,
        twitter: data.xUrl ?? null,
        linkedin: data.linkedinUrl ?? null,
      },
    });
    return profile;
  },
  getProfile: async (userId: string) => {
    const profile = await prisma.profile.findUnique({
      where: { userId: userId },
    });

    return profile;
  },
};
