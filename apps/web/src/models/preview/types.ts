import type { ComponentType, ReactNode } from "react";
import type { ThemeId } from "@hokori/types";
import type { BlockDataMap, BlockType } from "@/models/blocks/types";

export type { ThemeId };
export { THEME_IDS } from "@hokori/types";

export type BlockRendererProps<T extends BlockType> = {
  data: BlockDataMap[T];
};

/**
 * Every theme must provide a renderer for every block type — the
 * compiler fails the theme when a new block type is added.
 */
export type ThemeRenderers = {
  [T in BlockType]: ComponentType<BlockRendererProps<T>>;
};

export interface ThemeDefinition {
  id: ThemeId;
  name: string;
  /**
   * Outer frame that owns the page's background, typography and spacing.
   * Theme components style themselves with explicit utilities only —
   * never app semantic tokens (bg-card, text-foreground, ...).
   */
  Shell: ComponentType<{ children: ReactNode }>;
  renderers: ThemeRenderers;
}
