import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconSparkles, IconLoader2 } from "@tabler/icons-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  rephraseVariants,
  type RephraseField,
} from "@/services/aiService";
import type { RephraseTone, RephraseVariant } from "@hokori/types";

interface RephraseButtonProps {
  /** Current text in the field being rephrased. */
  value: string;
  field: RephraseField;
  /** Called with the chosen rewrite. */
  onRephrased: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

const TONE_LABEL: Record<RephraseTone, string> = {
  professional: "Professional",
  casual: "Casual",
  concise: "Concise",
};

const TONE_ORDER: RephraseTone[] = ["professional", "casual", "concise"];

/**
 * A small spark button that rewrites the given text with AI. Opening it fetches
 * three tone variants (Professional / Casual / Concise) to pick from. Drop it
 * inside a `relative` wrapper around an input/textarea and position it with
 * `className`.
 */
export function RephraseButton({
  value,
  field,
  onRephrased,
  disabled,
  className,
}: RephraseButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<RephraseVariant[]>([]);
  const canRephrase = value.trim().length >= 3 && !disabled;

  const byTone = (tone: RephraseTone) =>
    variants.find((v) => v.tone === tone);

  const handleOpenChange = async (next: boolean) => {
    setOpen(next);
    if (!next) return;
    setLoading(true);
    setVariants([]);
    try {
      const result = await rephraseVariants(value.trim(), field);
      setVariants(result);
    } catch {
      toast.error("Couldn't rephrase that, give it another try");
      setOpen(false);
    } finally {
      setLoading(false);
    }
  };

  const pick = (text: string) => {
    onRephrased(text);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={(next) => canRephrase && handleOpenChange(next)}>
      <PopoverTrigger asChild>
        <motion.button
          type="button"
          disabled={!canRephrase}
          aria-label="Rephrase with AI"
          title="Rephrase with AI"
          whileTap={{ scale: 0.85 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={cn(
            "group relative inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40",
            className,
          )}
        >
          {/* Soft animated glow while the model is working. */}
          <AnimatePresence>
            {loading && (
              <motion.span
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1.15 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.25 }}
                className="pointer-events-none absolute inset-0 rounded-md bg-linear-to-tr from-violet-500/25 via-fuchsia-500/25 to-sky-500/25 blur-[3px]"
              />
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait" initial={false}>
            {loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18 }}
                className="relative"
              >
                <IconLoader2 className="size-4 animate-spin text-foreground" />
              </motion.span>
            ) : (
              <motion.span
                key="idle"
                initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative"
              >
                <IconSparkles className="size-4 transition-colors group-hover:text-violet-500 group-enabled:group-hover:drop-shadow-[0_0_4px_rgba(139,92,246,0.5)]" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-2">
        <div className="flex items-center gap-1.5 px-2 pb-1.5 pt-1">
          <IconSparkles className="size-3.5 text-violet-500" />
          <span className="text-xs font-medium text-muted-foreground">
            Pick a rewrite
          </span>
        </div>

        <div className="flex flex-col gap-1">
          {TONE_ORDER.map((tone) => {
            const variant = byTone(tone);
            return (
              <button
                key={tone}
                type="button"
                disabled={loading || !variant}
                onClick={() => variant && pick(variant.text)}
                className="group flex flex-col gap-1 rounded-md p-2 text-left transition-colors hover:bg-accent disabled:cursor-default disabled:hover:bg-transparent"
              >
                <span className="text-xs font-semibold text-foreground">
                  {TONE_LABEL[tone]}
                </span>
                {loading || !variant ? (
                  <span className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                ) : (
                  <span className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
                    {variant.text}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
