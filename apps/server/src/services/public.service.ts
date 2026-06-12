import prisma from "../lib/prisma.js";
import type {
  ProfileData,
  PublicProfilePayload,
  SocialLinkData,
} from "@hokori/types";
import { toPageConfig } from "./page.service.js";

export const publicService = {
  getPublicProfile: async (
    username: string
  ): Promise<PublicProfilePayload> => {
    const user = await prisma.user.findUnique({
      where: { userName: username },
      include: {
        Profile: true,
        Page: true,
        Skill: { orderBy: { id: "asc" } },
        Project: { orderBy: { id: "asc" } },
        SocialLink: { orderBy: { order: "asc" } },
        Resume: true,
      },
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
        contactEmail: user.Profile.contactEmail,
        phone: user.Profile.phone,
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
      projects: user.Project.map((p) => ({
        id: p.id,
        title: p.title,
        desc: p.desc,
        longDesc: p.longDesc,
        link: p.link,
        thumbnail: p.thumbnail,
      })),
      socialLinks: user.SocialLink.map((s) => ({
        id: s.id,
        platform: s.platform as SocialLinkData["platform"],
        url: s.url,
      })),
      resume: user.Resume
        ? {
            id: user.Resume.id,
            url: user.Resume.url,
            fileName: user.Resume.fileName,
          }
        : null,
    };
  },
};
