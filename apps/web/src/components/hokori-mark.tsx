import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
  showSubscript?: boolean;
};

const sizes = {
  sm: { text: "text-lg", sub: "text-[10px]" },
  md: { text: "text-2xl", sub: "text-xs" },
  lg: { text: "text-4xl", sub: "text-sm" },
};

/** Wordmark: lowercase serif with a vermillion full stop. */
export default function HokoriMark({
  className = "",
  size = "md",
  showSubscript = true,
}: Props) {
  const s = sizes[size];
  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <span
        className={cn(
          "font-display font-semibold tracking-tight text-foreground",
          s.text,
        )}
      >
        hokori<span className="text-primary">.</span>
      </span>
      {showSubscript && (
        <span className={cn("font-display text-muted-foreground", s.sub)}>
          誇り
        </span>
      )}
    </div>
  );
}
