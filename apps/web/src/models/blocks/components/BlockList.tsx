import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import {
  AnimatePresence,
  motion,
  Reorder,
  useDragControls,
} from "motion/react";
import {
  IconEye,
  IconEyeOff,
  IconGripVertical,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/confirm-dialog";
import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/app/store";
import {
  removeBlock,
  setBlocksOrder,
  toggleBlockVisibility,
} from "../features/profileSlice";
import { BLOCK_REGISTRY } from "../registry";
import type { Block } from "../types";
import { updatePage } from "@/services/pageService";
import clsx from "clsx";

const toSkeleton = (blocks: Block[]) =>
  blocks.map(({ id, type, visible }) => ({ id, type, visible }));

const persist = (blocks: Block[]) => {
  updatePage({ blocks: toSkeleton(blocks) }).catch(() => {
    toast.error("Couldn't save your page layout");
  });
};

interface BlockRowProps {
  block: Block;
  onToggle(block: Block): void;
  onRemove(block: Block): void;
  onDragEnd(): void;
}

function BlockRow({ block, onToggle, onRemove, onDragEnd }: BlockRowProps) {
  const meta = BLOCK_REGISTRY[block.type];
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={block}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={onDragEnd}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative"
    >
      <div className="absolute right-3 top-3 z-10 flex gap-1.5">
        {meta.removable && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="size-8 cursor-grab touch-none bg-background text-muted-foreground hover:text-foreground active:cursor-grabbing"
              aria-label={`Reorder ${meta.label} block`}
              onPointerDown={(e) => dragControls.start(e)}
            >
              <IconGripVertical className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 bg-background text-muted-foreground hover:text-foreground"
              aria-label={
                block.visible ? `Hide ${meta.label}` : `Show ${meta.label}`
              }
              onClick={() => onToggle(block)}
            >
              {block.visible ? (
                <IconEye className="size-4" />
              ) : (
                <IconEyeOff className="size-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="size-8 bg-background text-muted-foreground hover:border-destructive/50 hover:text-destructive"
              aria-label={`Remove ${meta.label} block`}
              onClick={() => onRemove(block)}
            >
              <IconTrash className="size-4" />
            </Button>
          </>
        )}
      </div>
      <div
        className={clsx("transition-opacity", !block.visible && "opacity-50")}
      >
        <meta.Editor />
      </div>
    </Reorder.Item>
  );
}

export default function BlockList() {
  const blocks = useAppSelector((state) => state.profile.blocks);
  const dispatch = useAppDispatch();
  const [pendingRemove, setPendingRemove] = useState<Block | null>(null);

  // Latest blocks for persisting on drag end (closures in row callbacks
  // would otherwise see the pre-drag array).
  const blocksRef = useRef(blocks);
  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  const handleToggle = (block: Block) => {
    dispatch(toggleBlockVisibility(block.id));
    persist(
      blocks.map((b) =>
        b.id === block.id ? { ...b, visible: !b.visible } : b,
      ),
    );
  };

  const handleRemove = (block: Block) => {
    dispatch(removeBlock(block.id));
    persist(blocks.filter((b) => b.id !== block.id));
    toast.success(`${BLOCK_REGISTRY[block.type].label} block removed`, {
      description: "Its content is saved. Add the block again to restore it.",
    });
  };

  // Profile is the page's identity: pinned first, never part of the
  // reorderable set.
  const profileBlock = blocks.find((b) => b.type === "PersonalInfo");
  const reorderable = blocks.filter((b) => b.type !== "PersonalInfo");
  const ProfileEditor = profileBlock
    ? BLOCK_REGISTRY[profileBlock.type].Editor
    : null;

  return (
    <div className="flex flex-col gap-3">
      {profileBlock && ProfileEditor && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className={clsx(
            "transition-opacity",
            !profileBlock.visible && "opacity-50",
          )}
        >
          <ProfileEditor />
        </motion.div>
      )}

      <Reorder.Group
        axis="y"
        values={reorderable}
        onReorder={(next) =>
          dispatch(
            setBlocksOrder(profileBlock ? [profileBlock, ...next] : next),
          )
        }
        className="flex flex-col gap-3"
      >
        <AnimatePresence initial={false}>
          {reorderable.map((block) => (
            <BlockRow
              key={block.id}
              block={block}
              onToggle={handleToggle}
              onRemove={setPendingRemove}
              onDragEnd={() => persist(blocksRef.current)}
            />
          ))}
        </AnimatePresence>
      </Reorder.Group>

      <ConfirmDialog
        open={!!pendingRemove}
        onOpenChange={(open) => !open && setPendingRemove(null)}
        title={`Remove the ${
          pendingRemove ? BLOCK_REGISTRY[pendingRemove.type].label : ""
        } block?`}
        description="It disappears from your page, but its content stays saved. Add the block again any time to bring everything back."
        confirmLabel="Remove block"
        onConfirm={() => {
          if (pendingRemove) handleRemove(pendingRemove);
        }}
      />
    </div>
  );
}
