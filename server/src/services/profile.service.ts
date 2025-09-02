import prisma from "../lib/prisma";
import { createProfile } from "../lib/type";
export const profileService = {
  addProfile: async (data: createProfile, userId: string) => {
    console.log(JSON.stringify(data, null, 2));

    if (!data) throw new Error("Invalid Input");
    const profile = await prisma.profile.create({
      data: {
        userId: userId,
        name: data.fullName,
        avatarUrl: data.profileImageUrl,
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
  editProfile: async () => {},
};
