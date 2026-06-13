import BlockList from "@/models/blocks/components/BlockList";
import AddBlockButton from "@/models/blocks/components/AddBlockButton";
import PreviewCanvas from "@/models/preview/components/PreviewCanvas";
import ThemeController from "@/models/preview/components/ThemeController";
import PageLinkBar from "../components/PageLinkBar";
import { useEffect } from "react";
import { useAppDispatch } from "@/app/store";
import { setPageConfig } from "@/models/blocks/features/profileSlice";
import { getPage } from "@/services/pageService";
import { toast } from "sonner";

function Dashboard() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    (async () => {
      try {
        const page = await getPage();
        dispatch(setPageConfig(page));
      } catch {
        toast.error("Couldn't load your page settings");
      }
    })();
  }, [dispatch]);
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <PageLinkBar />

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Blocks
            </h2>
            <AddBlockButton />
          </div>
          <BlockList />
        </section>

        <aside className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Preview
            </h2>
            <ThemeController />
          </div>
          <PreviewCanvas />
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
