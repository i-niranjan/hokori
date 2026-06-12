import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { IconPlus } from "@tabler/icons-react";

export default function Template() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="flex items-baseline justify-between border-b pb-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Templates
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Start from a curated layout, or save your own.
          </p>
        </div>
      </div>

      <Card className="mt-10 mx-auto flex max-w-md flex-col items-center gap-4 rounded-md border bg-card p-10 text-center shadow-none">
        <span className="size-2.5 rounded-full bg-primary" aria-hidden />
        <h2 className="font-display text-xl">No templates yet</h2>
        <p className="text-sm text-muted-foreground">
          Browse the gallery or create one from your current dashboard.
        </p>
        <Button size="sm">
          <IconPlus className="size-4" /> New template
        </Button>
      </Card>
    </div>
  );
}
