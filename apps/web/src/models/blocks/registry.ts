import type { ComponentType } from "react";
import type { BlockType } from "@hokori/types";
import PersonalInfo from "./components/PersonalInfo";
import SkillsBlock from "./components/SkillsBlock";
import ProjectsBlock from "./components/ProjectsBlock";
import ResumeBlock from "./components/ResumeBlock";
import {
  ProfileGlyph,
  ProjectsGlyph,
  ResumeGlyph,
  SkillsGlyph,
} from "./components/BlockIcons";

interface BlockMeta {
  label: string;
  description: string;
  /** Longer copy shown in the block picker. */
  detail: string;
  icon: ComponentType<{ className?: string }>;
  /** The Profile block is the page's identity and can't be removed. */
  removable: boolean;
  Editor: ComponentType;
}

export const BLOCK_REGISTRY: Record<BlockType, BlockMeta> = {
  PersonalInfo: {
    label: "Profile",
    description: "Your name, role, bio and social links",
    detail:
      "The heart of your page: avatar, name, role, a short bio and your social links.",
    icon: ProfileGlyph,
    removable: false,
    Editor: PersonalInfo,
  },
  Skills: {
    label: "Skills",
    description: "Highlight what you're good at",
    detail:
      "A clean tag list of your skills and tools like React, SEO or brand strategy.",
    icon: SkillsGlyph,
    removable: true,
    Editor: SkillsBlock,
  },
  Projects: {
    label: "Projects",
    description: "Showcase the work you're proud of",
    detail:
      "Cards for your best work with a short description and a link visitors can open.",
    icon: ProjectsGlyph,
    removable: true,
    Editor: ProjectsBlock,
  },
  Resume: {
    label: "Resume",
    description: "Share your resume as a PDF",
    detail:
      "Upload your resume once; visitors can view or download it straight from your page.",
    icon: ResumeGlyph,
    removable: true,
    Editor: ResumeBlock,
  },
};
