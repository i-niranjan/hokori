import { useState } from "react";
import { toast } from "sonner";
import { motion } from "motion/react";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { BLOCK_TYPES, type BlockType } from "@hokori/types";
import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/app/store";
import { addBlock, BLOCK_IDS } from "../features/profileSlice";
import { BLOCK_REGISTRY } from "../registry";
import { updatePage } from "@/services/pageService";

export default function AddBlockButton() {
  const [open, setOpen] = useState(false);
  const blocks = useAppSelector((state) => state.profile.blocks);
  const dispatch = useAppDispatch();

  const isAdded = (type: BlockType) => blocks.some((b) => b.type === type);

  const handleAdd = (type: BlockType) => {
    if (isAdded(type)) return;
    dispatch(addBlock(type));
    const skeleton = [
      ...blocks.map(({ id, type: t, visible }) => ({ id, type: t, visible })),
      { id: BLOCK_IDS[type], type, visible: true },
    ];
    updatePage({ blocks: skeleton }).catch(() => {
      toast.error("Couldn't save your page layout");
    });
    toast.success(`${BLOCK_REGISTRY[type].label} block added`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <IconPlus className="size-4" /> Add block
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Add a block
          </DialogTitle>
          <DialogDescription className="text-sm">
            Blocks are the sections of your public page. Pick one to add it,
            you can hide or remove it any time.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2.5">
          {BLOCK_TYPES.map((type, index) => {
            const meta = BLOCK_REGISTRY[type];
            const added = isAdded(type);
            const Glyph = meta.icon;
            return (
              <motion.button
                key={type}
                type="button"
                disabled={added}
                onClick={() => handleAdd(type)}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.25,
                  delay: index * 0.06,
                  ease: "easeOut",
                }}
                whileHover={added ? undefined : { scale: 1.01 }}
                whileTap={added ? undefined : { scale: 0.99 }}
                className="group flex items-stretch overflow-hidden rounded-lg border bg-card text-left transition-colors enabled:cursor-pointer enabled:hover:border-primary enabled:hover:bg-primary/5 disabled:opacity-55"
              >
                <div className="relative flex w-28 shrink-0 items-center justify-center border-r bg-linear-to-br from-primary/10 via-muted/50 to-muted/80 text-foreground">
                  <Glyph className="size-12 transition-transform duration-200 group-enabled:group-hover:scale-110" />
                </div>
                <div className="flex flex-1 flex-col justify-center gap-1 px-4 py-3.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base font-semibold text-foreground group-enabled:group-hover:text-primary transition-colors">
                      {meta.label}
                    </span>
                    {added ? (
                      <Badge variant="secondary" className="gap-1">
                        <IconCheck className="size-3" /> Added
                      </Badge>
                    ) : (
                      <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary opacity-0 transition-opacity group-hover:opacity-100">
                        <IconPlus className="size-3.5" />
                      </span>
                    )}
                  </div>
                  <span className="text-sm leading-relaxed text-muted-foreground">
                    {meta.detail}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        <p className="text-xs text-muted-foreground">
          More blocks like resume, GitHub stats and testimonials are on the
          way.
        </p>
      </DialogContent>
    </Dialog>
  );
}
