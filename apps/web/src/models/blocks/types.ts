import type { BlockType, ProfileData, SkillData } from "@hokori/types";

export type { BlockType };

export interface BlockDataMap {
  PersonalInfo: ProfileData;
  Skills: SkillData[];
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
