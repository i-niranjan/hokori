import { Card } from "@/components/ui/card";

interface CookingCardProps {
  title: string;
  description: string;
}

/** Honest "we're still building this" state for not-yet-real pages. */
export default function CookingCard({ title, description }: CookingCardProps) {
  return (
    <Card className="mt-10 mx-auto flex max-w-md flex-col items-center gap-4 rounded-md border bg-card p-10 text-center shadow-none">
      <span
        className="font-display text-2xl font-light text-muted-foreground/60"
        aria-hidden
      >
        …<span className="text-primary">.</span>
      </span>
      <h2 className="font-display text-xl">{title}</h2>
      <p className="text-sm text-muted-foreground">{description}</p>
      <span className="rounded-full border px-3 py-1 text-xs text-muted-foreground">
        Still cooking
      </span>
    </Card>
  );
}
