import prisma from "../lib/prisma.js";
import type { CreateProfilePayload, UpdateProfilePayload } from "@hokori/types";
export const profileService = {
  addProfile: async (data: CreateProfilePayload, userId: string) => {
    if (!data) throw new Error("Invalid Input");
    const profile = await prisma.profile.create({
      data: {
        userId: userId,
        name: data.fullName,
        avatarUrl: data.profileImageUrl,
        avatarFileId: data.avatarFileId,
        title: data.role,
        bio: data.bio,
        contactEmail: data.contactEmail || null,
        phone: data.phone || null,
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
  updateProfile: async (data: UpdateProfilePayload, userId: string) => {
    if (!data || Object.keys(data).length === 0) {
      throw new Error("No profile fields provided for update");
    }

    const updateData: Record<string, string | null> = {};

    if (data.fullName !== undefined) updateData.name = data.fullName;
    if (data.profileImageUrl !== undefined) {
      updateData.avatarUrl = data.profileImageUrl;
    }
    if (data.avatarFileId !== undefined) {
      updateData.avatarFileId = data.avatarFileId;
    }
    if (data.role !== undefined) updateData.title = data.role;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.contactEmail !== undefined) {
      updateData.contactEmail = data.contactEmail || null;
    }
    if (data.phone !== undefined) updateData.phone = data.phone || null;

    const profile = await prisma.profile.update({
      where: { userId: userId },
      data: updateData,
    });

    return profile;
  },
};
