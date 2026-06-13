import { useState } from "react";
import { toast } from "sonner";
import {
  IconCheck,
  IconCopy,
  IconExternalLink,
  IconShare2,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/app/store";
import { setPublished } from "@/models/blocks/features/profileSlice";
import { updatePage } from "@/services/pageService";
import { cn } from "@/lib/utils";

/**
 * Publishing completes the sentence: the vermillion period at the end of
 * the URL headline IS the publish control. Draft = hollow period, the line
 * unfinished. One-shot stamp animation on publish; nothing loops.
 */
function PublishPeriod({
  checked,
  onToggle,
}: {
  checked: boolean;
  onToggle(next: boolean): void;
}) {
  return (
    <motion.button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={checked ? "Unpublish your page" : "Publish your page"}
      title={checked ? "Live — click to unpublish" : "Click to go live"}
      onClick={() => onToggle(!checked)}
      whileTap={{ scale: 0.85 }}
      className="relative ml-1 inline-flex size-3 cursor-pointer rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 md:size-3.5"
    >
      {/* one-shot ink ripple when the period lands */}
      <AnimatePresence>
        {checked && (
          <motion.span
            key="ripple"
            aria-hidden
            className="absolute inset-0 rounded-full border border-primary"
            initial={{ opacity: 0.7, scale: 1 }}
            animate={{ opacity: 0, scale: 2.6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>
      <motion.span
        aria-hidden
        initial={false}
        animate={checked ? { scale: [0.4, 1.18, 1] } : { scale: 1 }}
        transition={{ duration: 0.32, times: [0, 0.6, 1], ease: "easeOut" }}
        className={cn(
          "size-full rounded-full border-2 transition-colors duration-200",
          checked
            ? "border-primary bg-primary"
            : "border-primary/50 bg-transparent hover:bg-primary/15",
        )}
      />
    </motion.button>
  );
}

export default function PageLinkBar() {
  const published = useAppSelector((state) => state.profile.published);
  const userName = useAppSelector((state) => state.auth.user?.userName);
  const hasProfile = useAppSelector((state) => {
    const block = state.profile.blocks.find((b) => b.type === "PersonalInfo");
    return block?.type === "PersonalInfo" && !!block.data?.profile;
  });
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);

  const host = window.location.host;
  const pageUrl = `${window.location.origin}/${userName ?? ""}`;

  const handleToggle = async (next: boolean) => {
    if (next && !hasProfile) {
      toast.error("Add your profile info before going live", {
        description: "Your page needs at least a name and role on it.",
      });
      return;
    }
    dispatch(setPublished(next));
    try {
      await updatePage({ published: next });
      toast.success(next ? "Your page is live" : "Your page is now private");
    } catch {
      dispatch(setPublished(!next));
      toast.error("Couldn't update publish status");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pageUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy the link");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "My Hokori page", url: pageUrl });
      } catch {
        // user dismissed the share sheet; nothing to do
      }
      return;
    }
    await handleCopy();
    toast("Link copied, share it anywhere");
  };

  const action =
    "inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md px-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground";

  return (
    <div className="border-b pb-6">
      <p className="font-display text-sm font-medium uppercase tracking-wider text-muted-foreground">
        Your page
      </p>
      <h1 className="mt-1.5 flex items-baseline truncate font-display text-3xl tracking-tight md:text-4xl">
        <span className="font-light text-muted-foreground/60">{host}/</span>
        <span className="truncate font-semibold text-foreground">
          {userName ?? "you"}
        </span>
        <PublishPeriod checked={published} onToggle={handleToggle} />
      </h1>

      <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
        {!published && (
          <button
            type="button"
            onClick={() => handleToggle(true)}
            className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go live
          </button>
        )}
        <span className="mx-1 text-sm text-muted-foreground">
          {published ? "Live" : "Draft, only you can see it"}
        </span>
        <span className="mx-1.5 h-4 w-px bg-border" aria-hidden />
        <button type="button" onClick={handleCopy} className={action}>
          {copied ? (
            <IconCheck className="size-4 text-emerald-600" />
          ) : (
            <IconCopy className="size-4" />
          )}
          {copied ? "Copied" : "Copy link"}
        </button>
        <button type="button" onClick={handleShare} className={action}>
          <IconShare2 className="size-4" /> Share
        </button>
        {published && (
          <>
            <a
              href={pageUrl}
              target="_blank"
              rel="noreferrer"
              className={action}
            >
              <IconExternalLink className="size-4" /> Open
            </a>
            <button
              type="button"
              onClick={() => handleToggle(false)}
              className="ml-1 inline-flex h-8 cursor-pointer items-center rounded-md border border-destructive/40 px-3 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
            >
              Unpublish
            </button>
          </>
        )}
      </div>
    </div>
  );
}
