import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { IconExternalLink } from "@tabler/icons-react";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/app/store";
import { setPublished } from "@/models/blocks/features/profileSlice";
import { updatePage } from "@/services/pageService";

export default function PublishToggle() {
  const published = useAppSelector((state) => state.profile.published);
  const userName = useAppSelector((state) => state.auth.user?.userName);
  const dispatch = useAppDispatch();

  const handleToggle = async (next: boolean) => {
    dispatch(setPublished(next));
    try {
      await updatePage({ published: next });
      toast.success(next ? "Your page is live" : "Your page is now private");
    } catch {
      dispatch(setPublished(!next));
      toast.error("Couldn't update publish status");
    }
  };

  return (
    <div className="flex items-center gap-3">
      {published && userName && (
        <Button variant="ghost" size="sm" asChild>
          <a href={`/${userName}`} target="_blank" rel="noreferrer">
            <IconExternalLink className="size-4" /> View page
          </a>
        </Button>
      )}
      <div className="flex items-center gap-2">
        <Switch
          id="publish-toggle"
          checked={published}
          onCheckedChange={handleToggle}
        />
        <Label
          htmlFor="publish-toggle"
          className="text-sm text-muted-foreground"
        >
          {published ? "Published" : "Draft"}
        </Label>
      </div>
    </div>
  );
}
