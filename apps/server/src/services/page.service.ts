import prisma from "../lib/prisma.js";
import type { Prisma } from "@prisma/client";
import {
  THEME_IDS,
  BLOCK_TYPES,
  type PageBlockConfig,
  type PageConfig,
  type ThemeId,
  type UpdatePagePayload,
} from "@hokori/types";

const DEFAULT_BLOCKS: PageBlockConfig[] = [
  { id: "personal-info", type: "PersonalInfo", visible: true },
];

// PageBlockConfig[] is valid JSON but Prisma's InputJsonValue rejects
// interface arrays without index signatures.
const asJson = (blocks: PageBlockConfig[]) =>
  blocks as unknown as Prisma.InputJsonValue;

const isValidTheme = (theme: unknown): theme is ThemeId =>
  typeof theme === "string" && THEME_IDS.includes(theme as ThemeId);

const isValidBlocks = (blocks: unknown): blocks is PageBlockConfig[] =>
  Array.isArray(blocks) &&
  blocks.every(
    (b) =>
      b &&
      typeof b.id === "string" &&
      BLOCK_TYPES.includes(b.type) &&
      typeof b.visible === "boolean"
  );

const toPageConfig = (page: {
  id: string;
  theme: string;
  published: boolean;
  blocks: unknown;
}): PageConfig => ({
  id: page.id,
  theme: isValidTheme(page.theme) ? page.theme : "minimal",
  published: page.published,
  blocks: isValidBlocks(page.blocks) ? page.blocks : DEFAULT_BLOCKS,
});

export const pageService = {
  getPage: async (userId: string): Promise<PageConfig> => {
    const page = await prisma.page.upsert({
      where: { userId },
      update: {},
      create: { userId, blocks: asJson(DEFAULT_BLOCKS) },
    });
    return toPageConfig(page);
  },

  updatePage: async (
    data: UpdatePagePayload,
    userId: string
  ): Promise<PageConfig> => {
    if (!data || Object.keys(data).length === 0) {
      throw new Error("No page fields provided for update");
    }

    const updateData: Record<string, unknown> = {};
    if (data.theme !== undefined) {
      if (!isValidTheme(data.theme)) throw new Error("Unknown theme");
      updateData.theme = data.theme;
    }
    if (data.published !== undefined) {
      if (typeof data.published !== "boolean")
        throw new Error("Invalid published flag");
      updateData.published = data.published;
    }
    if (data.blocks !== undefined) {
      if (!isValidBlocks(data.blocks)) throw new Error("Invalid blocks shape");
      updateData.blocks = asJson(data.blocks);
    }

    const page = await prisma.page.upsert({
      where: { userId },
      update: updateData,
      create: {
        userId,
        theme: isValidTheme(data.theme) ? data.theme : "minimal",
        published: data.published ?? false,
        blocks: asJson(
          isValidBlocks(data.blocks) ? data.blocks : DEFAULT_BLOCKS
        ),
      },
    });
    return toPageConfig(page);
  },
};
