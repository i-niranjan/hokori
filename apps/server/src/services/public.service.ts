import prisma from "../lib/prisma.js";
import type { ProfileData, PublicProfilePayload } from "@hokori/types";
import { toPageConfig } from "./page.service.js";

export const publicService = {
  getPublicProfile: async (
    username: string
  ): Promise<PublicProfilePayload> => {
    const user = await prisma.user.findUnique({
      where: { userName: username },
      include: { Profile: true, Page: true, Skill: { orderBy: { id: "asc" } } },
    });

    if (!user || !user.Page || !user.Page.published) {
      throw { status: 404, message: "Page not found" };
    }

    const page = toPageConfig(user.Page);

    let profile: ProfileData | null = null;
    if (user.Profile) {
      // Strip internal fields (userId, avatarFileId) from the public payload.
      profile = {
        id: user.Profile.id,
        userId: "",
        avatarFileId: "",
        avatarUrl: user.Profile.avatarUrl,
        name: user.Profile.name,
        title: user.Profile.title,
        bio: user.Profile.bio,
        github: user.Profile.github,
        instagram: user.Profile.instagram,
        twitter: user.Profile.twitter,
        linkedin: user.Profile.linkedin,
      };
    }

    return {
      username: user.userName,
      theme: page.theme,
      blocks: page.blocks,
      profile,
      skills: user.Skill.map((s) => ({
        id: s.id,
        name: s.name,
        icon: s.icon,
      })),
    };
  },
};
