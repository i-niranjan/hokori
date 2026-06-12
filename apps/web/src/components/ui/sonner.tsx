import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  ErrorGlyph,
  InfoGlyph,
  LoadingGlyph,
  SuccessGlyph,
  WarningGlyph,
} from "@/components/toast-icons";

/**
 * Quiet Craft toasts — fully unstyled sonner (per
 * https://sonner.emilkowal.ski/styling) rebuilt with app tokens:
 * paper card, hairline border, vermillion ink mark on the left edge.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="top-center"
      duration={3500}
      gap={10}
      visibleToasts={3}
      icons={{
        success: <SuccessGlyph className="size-5 text-primary" />,
        error: <ErrorGlyph className="size-5 text-destructive" />,
        warning: <WarningGlyph className="size-5 text-primary" />,
        info: <InfoGlyph className="size-5 text-muted-foreground" />,
        loading: (
          <LoadingGlyph className="size-5 animate-spin text-muted-foreground" />
        ),
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group flex w-89 items-center gap-3 rounded-md border border-border border-l-2 border-l-primary bg-card px-4 py-3 font-sans text-card-foreground select-none",
          content: "flex min-w-0 flex-col gap-0.5",
          title: "text-sm font-medium tracking-tight leading-snug",
          description: "text-xs leading-relaxed text-muted-foreground",
          icon: "flex shrink-0 items-center",
          actionButton:
            "ml-auto shrink-0 rounded-sm bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90",
          cancelButton:
            "ml-auto shrink-0 rounded-sm bg-muted px-2.5 py-1 text-xs text-muted-foreground",
          error: "border-l-destructive",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
