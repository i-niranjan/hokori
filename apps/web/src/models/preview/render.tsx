import type { Block } from "@/models/blocks/types";
import type { ThemeDefinition } from "./types";

/**
 * Renders one block with the active theme's renderer. The switch gives
 * TypeScript the block-type/data pairing the generic map can't express
 * at a call site.
 */
export function renderBlock(theme: ThemeDefinition, block: Block) {
  if (!block.visible || !block.data) return null;
  switch (block.type) {
    case "PersonalInfo":
      return <theme.renderers.PersonalInfo key={block.id} data={block.data} />;
    case "Skills":
      return <theme.renderers.Skills key={block.id} data={block.data} />;
  }
}
