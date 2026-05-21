import { GiShintoShrine } from "react-icons/gi";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  size?: "sm" | "md" | "lg";
  showSubscript?: boolean;
};

const sizes = {
  sm: { icon: 18, text: "text-base", sub: "text-[10px]" },
  md: { icon: 22, text: "text-xl", sub: "text-xs" },
  lg: { icon: 32, text: "text-3xl", sub: "text-sm" },
};

export default function HokoriMark({
  className = "",
  size = "md",
  showSubscript = true,
}: Props) {
  const s = sizes[size];
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <GiShintoShrine size={s.icon} className="text-primary shrink-0" />
      <div className="flex items-baseline gap-1.5">
        <span className={cn("font-display font-semibold tracking-tight text-foreground", s.text)}>
          Hokori
        </span>
        {showSubscript && (
          <span className={cn("font-display text-primary/80", s.sub)}>誇り</span>
        )}
      </div>
    </div>
  );
}
