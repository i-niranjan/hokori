import { motion } from "motion/react";
import { Card } from "@/components/ui/card";

interface CookingCardProps {
  title: string;
  description: string;
}

/** Honest "we're still building this" state for not-yet-real pages. */
export default function CookingCard({ title, description }: CookingCardProps) {
  return (
    <Card className="mt-10 mx-auto flex max-w-md flex-col items-center gap-4 rounded-md border bg-card p-10 text-center shadow-none">
      <div className="flex items-center gap-1.5" aria-hidden>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="size-2 rounded-full bg-primary"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              delay: i * 0.25,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <h2 className="font-display text-xl">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
        Still cooking
      </span>
    </Card>
  );
}
