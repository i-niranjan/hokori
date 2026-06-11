import { useEffect, useState } from "react";
import { toast } from "sonner";
import { IconLoader2, IconPlus, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/app/store";
import { setSkills } from "../features/profileSlice";
import { addSkill, deleteSkill, getSkills } from "@/services/skillService";

function SkillsBlock() {
  const dispatch = useAppDispatch();
  const skills = useAppSelector((state) => {
    const block = state.profile.blocks.find((b) => b.type === "Skills");
    return block?.type === "Skills" ? block.data : null;
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      try {
        dispatch(setSkills(await getSkills()));
      } catch {
        toast.error("Couldn't load your skills");
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed || saving) return;
    setSaving(true);
    try {
      const skill = await addSkill({ name: trimmed });
      dispatch(setSkills([...(skills ?? []), skill]));
      setName("");
    } catch {
      toast.error("Couldn't add that skill");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (skillId: string) => {
    const previous = skills ?? [];
    dispatch(setSkills(previous.filter((s) => s.id !== skillId)));
    try {
      await deleteSkill(skillId);
    } catch {
      dispatch(setSkills(previous));
      toast.error("Couldn't remove that skill");
    }
  };

  return (
    <div className="h-max w-full rounded-md border bg-card flex overflow-hidden">
      <div className="flex flex-col gap-3 w-full px-4 py-4">
        <div className="flex items-baseline justify-between border-b pb-2">
          <span className="font-display text-lg font-semibold text-foreground">
            Skills
          </span>
          <span className="font-display text-xs text-muted-foreground">
            技術
          </span>
        </div>

        {loading ? (
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ) : (
          <>
            {skills && skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className="gap-1 pr-1"
                  >
                    {skill.name}
                    <button
                      type="button"
                      aria-label={`Remove ${skill.name}`}
                      onClick={() => handleRemove(skill.id)}
                      className="rounded-full p-0.5 hover:bg-muted-foreground/20"
                    >
                      <IconX className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                value={name}
                placeholder="e.g. React, SEO, Brand Strategy"
                maxLength={50}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
              />
              <Button
                onClick={handleAdd}
                disabled={!name.trim() || saving}
                variant="outline"
              >
                {saving ? (
                  <IconLoader2 className="size-4 animate-spin" />
                ) : (
                  <IconPlus className="size-4" />
                )}
                Add
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SkillsBlock;
