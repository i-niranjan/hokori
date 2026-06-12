import prisma from "../lib/prisma.js";
import type { SetSocialLinksPayload, SocialLinkData } from "@hokori/types";

export const socialService = {
  getLinks: async (userId: string): Promise<SocialLinkData[]> => {
    const links = await prisma.socialLink.findMany({
      where: { userId },
      orderBy: { order: "asc" },
    });
    return links.map((l) => ({
      id: l.id,
      platform: l.platform as SocialLinkData["platform"],
      url: l.url,
    }));
  },

  /** Replaces the user's full set of links (the editor sends them all). */
  setLinks: async (
    payload: SetSocialLinksPayload,
    userId: string
  ): Promise<SocialLinkData[]> => {
    // Last entry wins on duplicate platforms.
    const deduped = [
      ...new Map(payload.links.map((l) => [l.platform, l])).values(),
    ];

    await prisma.$transaction([
      prisma.socialLink.deleteMany({ where: { userId } }),
      prisma.socialLink.createMany({
        data: deduped.map((link, index) => ({
          userId,
          platform: link.platform,
          url: link.url,
          order: index,
        })),
      }),
    ]);

    return socialService.getLinks(userId);
  },
};
