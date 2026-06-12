import CookingCard from "@/components/cooking-card";

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

      <CookingCard
        title="Templates are on the way"
        description="Curated page layouts you can start from with one click. We're shaping them now."
      />
    </div>
  );
}
