import type { BlockType, ProfileData } from "@hokori/types";

export type { BlockType };

export interface BlockDataMap {
  PersonalInfo: ProfileData;
}

interface BaseBlock<T extends BlockType> {
  id: string;
  type: T;
  visible: boolean;
  /** null until the user has created the underlying data */
  data: BlockDataMap[T] | null;
}

export type Block = BaseBlock<"PersonalInfo">;
