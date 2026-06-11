import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/app/store";
import { setTheme } from "@/models/blocks/features/profileSlice";
import { updatePage } from "@/services/pageService";
import { themes } from "../themes/registry";
import type { ThemeId } from "../types";

export default function ThemeController() {
  const activeTheme = useAppSelector((state) => state.profile.activeTheme);
  const dispatch = useAppDispatch();

  const handleChange = (value: string) => {
    const theme = value as ThemeId;
    dispatch(setTheme(theme));
    updatePage({ theme }).catch(() => {
      toast.error("Couldn't save your theme choice");
    });
  };

  return (
    <Tabs value={activeTheme} onValueChange={handleChange}>
      <TabsList className="h-8">
        {Object.values(themes).map((theme) => (
          <TabsTrigger key={theme.id} value={theme.id} className="px-3 text-xs">
            {theme.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
