import type {
  BlockType,
  ProfileData,
  ProjectData,
  SkillData,
  SocialLinkData,
} from "@hokori/types";

export type { BlockType };

export interface PersonalInfoBlockData {
  profile: ProfileData | null;
  socialLinks: SocialLinkData[];
}

export interface BlockDataMap {
  PersonalInfo: PersonalInfoBlockData;
  Skills: SkillData[];
  Projects: ProjectData[];
}

interface BaseBlock<T extends BlockType> {
  id: string;
  type: T;
  visible: boolean;
  /** null until the user has created the underlying data */
  data: BlockDataMap[T] | null;
}

export type Block = { [T in BlockType]: BaseBlock<T> }[BlockType];

export type BlockOfType<T extends BlockType> = Extract<Block, { type: T }>;
