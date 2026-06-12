import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/lib/hooks";
import { themes } from "../themes/registry";
import { renderBlock } from "../render";

export default function PreviewCanvas() {
  const blocks = useAppSelector((state) => state.profile.blocks);
  const activeTheme = useAppSelector((state) => state.profile.activeTheme);

  const theme = themes[activeTheme];
  const visibleBlocks = blocks.filter((block) => block.visible);

  return (
    <Card className="h-[calc(100vh-12rem)] min-h-112 w-full overflow-hidden rounded-md border p-0 shadow-none">
      {visibleBlocks.length > 0 ? (
        <theme.Shell>
          {visibleBlocks.map((block) =>
            renderBlock(theme, block, { ghostWhenEmpty: true }),
          )}
        </theme.Shell>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-card text-muted-foreground">
          <span className="size-2.5 rounded-full bg-primary" aria-hidden />
          <p className="font-display text-sm">Preview</p>
          <p className="max-w-[20rem] text-center text-xs text-muted-foreground">
            Your Hokori page renders here as you compose blocks on the left.
          </p>
        </div>
      )}
    </Card>
  );
}
