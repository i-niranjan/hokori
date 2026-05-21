import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

import PersonalInfo from "@/models/blocks/components/PersonalInfo";
import PreviewWindow from "../components/PreviewWindow";

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="flex items-baseline justify-between border-b pb-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Compose your Hokori page, one block at a time.
          </p>
        </div>
        <span className="font-display text-sm text-muted-foreground hidden sm:inline">
          ダッシュボード
        </span>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Blocks
            </h2>
            <Button size="sm" variant="outline">
              <IconPlus className="size-4" /> Add block
            </Button>
          </div>
          <PersonalInfo />
        </section>

        <aside className="flex flex-col gap-4">
          <h2 className="font-display text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Preview
          </h2>
          <PreviewWindow />
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
