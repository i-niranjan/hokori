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
import { MAX_SKILLS, type SkillData } from "@hokori/types";
import { SkillsGlyph } from "./BlockIcons";
import ConfirmDialog from "@/components/confirm-dialog";

function SkillsBlock() {
  const dispatch = useAppDispatch();
  const skills = useAppSelector((state) => {
    const block = state.profile.blocks.find((b) => b.type === "Skills");
    return block?.type === "Skills" ? block.data : null;
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [pendingDelete, setPendingDelete] = useState<SkillData | null>(null);

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

  const atLimit = (skills?.length ?? 0) >= MAX_SKILLS;

  // Supports comma-separated input ("React, SEO, Node") — typed or pasted.
  const handleAdd = async (raw: string = name) => {
    const names = raw
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (names.length === 0 || saving) return;

    setSaving(true);
    let current = skills ?? [];
    try {
      for (const skillName of names) {
        if (current.length >= MAX_SKILLS) {
          toast.error(`You can add up to ${MAX_SKILLS} skills`);
          break;
        }
        if (
          current.some(
            (s) => s.name.toLowerCase() === skillName.toLowerCase(),
          )
        ) {
          continue;
        }
        const skill = await addSkill({ name: skillName });
        current = [...current, skill];
        dispatch(setSkills(current));
      }
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
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <SkillsGlyph className="size-5 text-foreground" />
            <span className="font-display text-lg font-semibold text-foreground">
              Skills
            </span>
            <span className="text-xs text-muted-foreground">
              {skills?.length ?? 0}/{MAX_SKILLS}
            </span>
          </div>
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
                      onClick={() => setPendingDelete(skill)}
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
                disabled={atLimit}
                onChange={(e) => {
                  const value = e.target.value;
                  // A typed/pasted comma submits everything before it.
                  if (value.includes(",")) {
                    handleAdd(value);
                  } else {
                    setName(value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
              />
              <Button
                onClick={() => handleAdd()}
                disabled={!name.trim() || saving || atLimit}
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

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Remove this skill?"
        description={`"${pendingDelete?.name ?? ""}" will be removed from your page. You can always add it back later.`}
        confirmLabel="Remove skill"
        onConfirm={() => {
          if (pendingDelete) handleRemove(pendingDelete.id);
        }}
      />
    </div>
  );
}

export default SkillsBlock;
