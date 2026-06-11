import type { ThemeDefinition, ThemeId } from "../types";
import { minimalTheme } from "./minimal";
import { terminalTheme } from "./terminal";

export const themes: Record<ThemeId, ThemeDefinition> = {
  minimal: minimalTheme,
  terminal: terminalTheme,
};
