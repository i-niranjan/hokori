import { Card } from "@/components/ui/card";

export default function Insights() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="flex items-baseline justify-between border-b pb-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">
            Insights
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            See how visitors discover and engage with your Hokori.
          </p>
        </div>
        <span className="font-display text-sm text-muted-foreground hidden sm:inline">
          洞察
        </span>
      </div>

      <Card className="mt-10 mx-auto flex max-w-md flex-col items-center gap-3 rounded-md border bg-card p-10 text-center shadow-none">
        <span className="size-2.5 rounded-full bg-primary" aria-hidden />
        <h2 className="font-display text-xl">No data yet</h2>
        <p className="text-sm text-muted-foreground">
          Publish your page to start collecting analytics.
        </p>
      </Card>
    </div>
  );
}
