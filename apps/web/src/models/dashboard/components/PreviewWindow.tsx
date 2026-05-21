import { Card } from "@/components/ui/card";

export default function PreviewWindow() {
  return (
    <Card className="flex h-[calc(100vh-12rem)] min-h-[28rem] w-full items-center justify-center rounded-md border bg-card p-0 text-muted-foreground shadow-none">
      <div className="flex flex-col items-center gap-3">
        <span className="size-2.5 rounded-full bg-primary" aria-hidden />
        <p className="font-display text-sm">Preview</p>
        <p className="max-w-[20rem] text-center text-xs text-muted-foreground">
          Your Hokori page renders here as you compose blocks on the left.
        </p>
      </div>
    </Card>
  );
}
