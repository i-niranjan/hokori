import CookingCard from "@/components/cooking-card";

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
      </div>

      <CookingCard
        title="Insights are on the way"
        description="Page views, referrers and visitor trends for your public page. We're building it now."
      />
    </div>
  );
}
