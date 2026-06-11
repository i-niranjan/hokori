import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PageConfig, ProfileData, SkillData } from "@hokori/types";
import type { Block } from "../types";
import type { ThemeId } from "@/models/preview/types";

interface ProfileState {
  blocks: Block[];
  activeTheme: ThemeId;
  published: boolean;
}

const initialState: ProfileState = {
  blocks: [
    {
      id: "personal-info",
      type: "PersonalInfo",
      visible: true,
      data: null,
    },
    {
      id: "skills",
      type: "Skills",
      visible: true,
      data: null,
    },
  ],
  activeTheme: "minimal",
  published: false,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<ProfileData | null>) => {
      const block = state.blocks.find((b) => b.type === "PersonalInfo");
      if (block && block.type === "PersonalInfo") {
        block.data = action.payload;
      }
    },
    setSkills: (state, action: PayloadAction<SkillData[]>) => {
      const block = state.blocks.find((b) => b.type === "Skills");
      if (block && block.type === "Skills") {
        block.data = action.payload;
      }
    },
    setTheme: (state, action: PayloadAction<ThemeId>) => {
      state.activeTheme = action.payload;
    },
    setPublished: (state, action: PayloadAction<boolean>) => {
      state.published = action.payload;
    },
    /**
     * Hydrate theme + block skeleton (order/visibility) from the persisted
     * page config, preserving any block data already loaded.
     */
    setPageConfig: (state, action: PayloadAction<PageConfig>) => {
      const { theme, blocks, published } = action.payload;
      state.activeTheme = theme;
      state.published = published;
      state.blocks = blocks.map((config) => {
        const existing = state.blocks.find((b) => b.type === config.type);
        return {
          id: config.id,
          type: config.type,
          visible: config.visible,
          data: existing?.data ?? null,
        } as Block;
      });
    },
  },
});

export const { setProfileData, setSkills, setTheme, setPageConfig, setPublished } =
  profileSlice.actions;
export default profileSlice.reducer;
