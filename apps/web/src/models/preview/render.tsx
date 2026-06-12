import type { Block } from "@/models/blocks/types";
import type { ThemeDefinition } from "./types";
import { BLOCK_GHOSTS } from "./ghosts";

const isEmpty = (block: Block): boolean => {
  if (!block.data) return true;
  if (block.type === "PersonalInfo") {
    return !block.data.profile && block.data.socialLinks.length === 0;
  }
  return Array.isArray(block.data) && block.data.length === 0;
};

/**
 * Renders one block with the active theme's renderer. The switch gives
 * TypeScript the block-type/data pairing the generic map can't express
 * at a call site.
 *
 * `ghostWhenEmpty` shows a skeleton for content-less blocks — used by the
 * dashboard preview only, never the public page.
 */
export function renderBlock(
  theme: ThemeDefinition,
  block: Block,
  options?: { ghostWhenEmpty?: boolean },
) {
  if (!block.visible) return null;

  if (isEmpty(block)) {
    if (!options?.ghostWhenEmpty) return null;
    const Ghost = BLOCK_GHOSTS[block.type];
    return <Ghost key={block.id} />;
  }

  switch (block.type) {
    case "PersonalInfo":
      return <theme.renderers.PersonalInfo key={block.id} data={block.data!} />;
    case "Skills":
      return <theme.renderers.Skills key={block.id} data={block.data!} />;
    case "Projects":
      return <theme.renderers.Projects key={block.id} data={block.data!} />;
    case "Resume":
      return <theme.renderers.Resume key={block.id} data={block.data!} />;
  }
}
