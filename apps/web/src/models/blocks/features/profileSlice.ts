import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PageConfig, ProfileData } from "@hokori/types";
import type { Block } from "../types";
import type { ThemeId } from "@/models/preview/types";

interface ProfileState {
  blocks: Block[];
  activeTheme: ThemeId;
}

const initialState: ProfileState = {
  blocks: [
    {
      id: "personal-info",
      type: "PersonalInfo",
      visible: true,
      data: null,
    },
  ],
  activeTheme: "minimal",
};

export const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<ProfileData | null>) => {
      const block = state.blocks.find((b) => b.type === "PersonalInfo");
      if (block) {
        block.data = action.payload;
      }
    },
    setTheme: (state, action: PayloadAction<ThemeId>) => {
      state.activeTheme = action.payload;
    },
    /**
     * Hydrate theme + block skeleton (order/visibility) from the persisted
     * page config, preserving any block data already loaded.
     */
    setPageConfig: (state, action: PayloadAction<PageConfig>) => {
      const { theme, blocks } = action.payload;
      state.activeTheme = theme;
      state.blocks = blocks.map((config) => {
        const existing = state.blocks.find((b) => b.type === config.type);
        return {
          id: config.id,
          type: config.type,
          visible: config.visible,
          data: existing?.data ?? null,
        };
      });
    },
  },
});

export const { setProfileData, setTheme, setPageConfig } =
  profileSlice.actions;
export default profileSlice.reducer;
