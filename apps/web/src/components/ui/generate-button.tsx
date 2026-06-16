import { useState } from "react";
import { IconSparkles, IconLoader2 } from "@tabler/icons-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface GenerateButtonProps {
  /** Runs the generation + applies the result. Throws to surface an error toast. */
  onGenerate: (prompt: string) => Promise<void>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * A small "Generate" trigger that opens a popover asking for a few keywords,
 * then hands the prompt to `onGenerate`. The caller owns the AI call and where
 * the result lands, so the same button works for bios, projects, etc.
 */
export function GenerateButton({
  onGenerate,
  label = "Generate",
  placeholder = "A few keywords to generate from…",
  disabled,
  className,
}: GenerateButtonProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const canGenerate = prompt.trim().length >= 3 && !loading;

  const handleGenerate = async () => {
    if (!canGenerate) return;
    setLoading(true);
    try {
      await onGenerate(prompt.trim());
      setOpen(false);
      setPrompt("");
    } catch {
      toast.error("Couldn't generate that, give it another try");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={(next) => !loading && setOpen(next)}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-violet-600 transition-colors hover:bg-violet-500/10 disabled:pointer-events-none disabled:opacity-40 dark:text-violet-400",
            className,
          )}
        >
          <IconSparkles className="size-3.5" />
          {label}
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <IconSparkles className="size-3.5 text-violet-500" />
            <span className="text-xs font-medium text-muted-foreground">
              Generate with AI
            </span>
          </div>
          <Textarea
            rows={3}
            autoFocus
            value={prompt}
            placeholder={placeholder}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                e.preventDefault();
                handleGenerate();
              }
            }}
          />
          <Button
            type="button"
            size="sm"
            disabled={!canGenerate}
            onClick={handleGenerate}
            className="self-end"
          >
            {loading && <IconLoader2 className="size-4 animate-spin" />}
            Generate
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
