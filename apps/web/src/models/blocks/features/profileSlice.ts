import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  BlockType,
  PageConfig,
  ProfileData,
  ProjectData,
  ResumeData,
  SkillData,
  SocialLinkData,
} from "@hokori/types";
import type { Block } from "../types";
import type { ThemeId } from "@/models/preview/types";

interface ProfileState {
  blocks: Block[];
  activeTheme: ThemeId;
  published: boolean;
}

/** Stable id per block type — one block of each type per page for now. */
export const BLOCK_IDS: Record<BlockType, string> = {
  PersonalInfo: "personal-info",
  Skills: "skills",
  Projects: "projects",
  Resume: "resume",
};

const initialState: ProfileState = {
  blocks: [
    {
      id: BLOCK_IDS.PersonalInfo,
      type: "PersonalInfo",
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
        block.data = {
          profile: action.payload,
          socialLinks: block.data?.socialLinks ?? [],
        };
      }
    },
    setSocialLinks: (state, action: PayloadAction<SocialLinkData[]>) => {
      const block = state.blocks.find((b) => b.type === "PersonalInfo");
      if (block && block.type === "PersonalInfo") {
        block.data = {
          profile: block.data?.profile ?? null,
          socialLinks: action.payload,
        };
      }
    },
    setSkills: (state, action: PayloadAction<SkillData[]>) => {
      const block = state.blocks.find((b) => b.type === "Skills");
      if (block && block.type === "Skills") {
        block.data = action.payload;
      }
    },
    setProjects: (state, action: PayloadAction<ProjectData[]>) => {
      const block = state.blocks.find((b) => b.type === "Projects");
      if (block && block.type === "Projects") {
        block.data = action.payload;
      }
    },
    setResume: (state, action: PayloadAction<ResumeData | null>) => {
      const block = state.blocks.find((b) => b.type === "Resume");
      if (block && block.type === "Resume") {
        block.data = action.payload;
      }
    },
    addBlock: (state, action: PayloadAction<BlockType>) => {
      const type = action.payload;
      if (state.blocks.some((b) => b.type === type)) return;
      state.blocks.push({
        id: BLOCK_IDS[type],
        type,
        visible: true,
        data: null,
      } as Block);
    },
    removeBlock: (state, action: PayloadAction<string>) => {
      state.blocks = state.blocks.filter((b) => b.id !== action.payload);
    },
    setBlocksOrder: (state, action: PayloadAction<Block[]>) => {
      state.blocks = action.payload;
    },
    toggleBlockVisibility: (state, action: PayloadAction<string>) => {
      const block = state.blocks.find((b) => b.id === action.payload);
      if (block) block.visible = !block.visible;
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

export const {
  setProfileData,
  setSocialLinks,
  setSkills,
  setProjects,
  setResume,
  addBlock,
  removeBlock,
  setBlocksOrder,
  toggleBlockVisibility,
  setTheme,
  setPageConfig,
  setPublished,
} = profileSlice.actions;
export default profileSlice.reducer;
