import prisma from "../lib/prisma";
import { createProfile } from "../lib/type";
export const profileService = {
  addProfile: async (data: createProfile) => {
    if (!data) throw new Error("Empty data");
    const profile = await prisma.profile.create({
      data: {
        userId: data.userId,
        name: data.name,
        avatarUrl: data.avatarUrl,
        title: data.title,
        bio: data.bio,
        instagram: data.instagram ?? null,
        github: data.github ?? null,
        twitter: data.twitter ?? null,
        linkedin: data.linkedin ?? null,
      },
    });
    return profile;
  },
  editProfile: async () => {},
};
