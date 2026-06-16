import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  IconFileImport,
  IconLoader2,
  IconSparkles,
  IconCheck,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/models/auth/refresh";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/app/store";
import {
  setProfileData,
  setSkills,
  setProjects,
  addBlock,
  BLOCK_IDS,
} from "../features/profileSlice";
import { importResume } from "@/services/aiService";
import { AddProfile, UpdateProfile } from "@/services/profileService";
import { addSkill, getSkills } from "@/services/skillService";
import { addProject, getProjects } from "@/services/projectService";
import { updatePage } from "@/services/pageService";
import {
  MAX_SKILLS,
  MAX_PROJECTS,
  type BlockType,
  type ResumeParseResult,
} from "@hokori/types";

const EMAIL_RE = /\S+@\S+\.\S+/;
const PHONE_RE = /^[+\d][\d\s\-()]{5,19}$/;

/** A small selectable row used across the review screen. */
function ToggleRow({
  checked,
  onToggle,
  children,
  className,
}: {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "flex w-full items-start gap-3 rounded-md border p-3 text-left transition-colors",
        checked ? "border-primary/60 bg-primary/5" : "opacity-60",
        className,
      )}
    >
      <span
        className={cn(
          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
          checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground/40",
        )}
      >
        {checked && <IconCheck className="size-3" />}
      </span>
      <span className="min-w-0 flex-1">{children}</span>
    </button>
  );
}

export default function ResumeImportButton() {
  const dispatch = useAppDispatch();
  const blocks = useAppSelector((state) => state.profile.blocks);
  const inputRef = useRef<HTMLInputElement>(null);

  const [parsing, setParsing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [parsed, setParsed] = useState<ResumeParseResult | null>(null);

  // Selection state, parallel to parsed.skills / parsed.projects.
  const [includeProfile, setIncludeProfile] = useState(true);
  const [skillSel, setSkillSel] = useState<boolean[]>([]);
  const [projSel, setProjSel] = useState<boolean[]>([]);

  const hasProfileFields = (r: ResumeParseResult) =>
    !!(r.name || r.role || r.bio || r.contactEmail || r.phone);

  const handleFile = async (file: File) => {
    setParsing(true);
    try {
      const result = await importResume(file);
      if (
        !hasProfileFields(result) &&
        result.skills.length === 0 &&
        result.projects.length === 0
      ) {
        toast.error("Couldn't read anything useful from that résumé");
        return;
      }
      setParsed(result);
      setIncludeProfile(hasProfileFields(result));
      setSkillSel(result.skills.map(() => true));
      setProjSel(result.projects.map(() => true));
      setReviewOpen(true);
    } catch {
      toast.error("Couldn't import that résumé, give it another try");
    } finally {
      setParsing(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const ensureBlocks = async (types: BlockType[]) => {
    const missing = types.filter((t) => !blocks.some((b) => b.type === t));
    if (missing.length === 0) return;
    missing.forEach((t) => dispatch(addBlock(t)));
    const skeleton = [
      ...blocks.map(({ id, type, visible }) => ({ id, type, visible })),
      ...missing.map((t) => ({ id: BLOCK_IDS[t], type: t, visible: true })),
    ];
    await updatePage({ blocks: skeleton }).catch(() => {});
  };

  const applyProfile = async () => {
    if (!parsed || !includeProfile) return;
    const payload: Record<string, string> = {};
    if (parsed.name) payload.fullName = parsed.name;
    if (parsed.role) payload.role = parsed.role;
    if (parsed.bio) payload.bio = parsed.bio.slice(0, 500);
    if (parsed.contactEmail && EMAIL_RE.test(parsed.contactEmail))
      payload.contactEmail = parsed.contactEmail;
    if (parsed.phone && PHONE_RE.test(parsed.phone))
      payload.phone = parsed.phone;

    const existing = (await api.get("/component/profile/getProfile")).data.data;
    if (existing) {
      const res = await UpdateProfile(payload);
      dispatch(setProfileData(res.data.data));
    } else if (parsed.name && parsed.role) {
      const res = await AddProfile({
        fullName: parsed.name,
        role: parsed.role,
        bio: payload.bio ?? "",
        profileImageUrl: "",
        avatarFileId: "",
        contactEmail: payload.contactEmail ?? "",
        phone: payload.phone ?? "",
      });
      dispatch(setProfileData(res.data.data));
    } else {
      throw new Error("needs name and role");
    }
  };

  const applySkills = async () => {
    if (!parsed) return 0;
    const chosen = parsed.skills.filter((_, i) => skillSel[i]);
    if (chosen.length === 0) return 0;
    let current = await getSkills();
    let added = 0;
    for (const name of chosen) {
      if (current.length >= MAX_SKILLS) break;
      if (current.some((s) => s.name.toLowerCase() === name.toLowerCase()))
        continue;
      const skill = await addSkill({ name });
      current = [...current, skill];
      added += 1;
    }
    dispatch(setSkills(current));
    return added;
  };

  const applyProjects = async () => {
    if (!parsed) return 0;
    const chosen = parsed.projects.filter((_, i) => projSel[i]);
    if (chosen.length === 0) return 0;
    let current = await getProjects();
    let added = 0;
    for (const p of chosen) {
      if (current.length >= MAX_PROJECTS) break;
      const project = await addProject({
        title: p.title,
        desc: p.desc || p.title,
        longDesc: p.longDesc,
      });
      current = [...current, project];
      added += 1;
    }
    dispatch(setProjects(current));
    return added;
  };

  const handleApply = async () => {
    if (!parsed || applying) return;
    setApplying(true);
    const done: string[] = [];
    const failed: string[] = [];

    // Each section is independent — a failure in one doesn't abort the rest.
    try {
      await applyProfile();
      if (includeProfile) done.push("profile");
    } catch {
      if (includeProfile) failed.push("profile");
    }

    const blocksToEnsure: BlockType[] = [];
    try {
      const n = await applySkills();
      if (n > 0) {
        done.push(`${n} skill${n > 1 ? "s" : ""}`);
        blocksToEnsure.push("Skills");
      }
    } catch {
      failed.push("skills");
    }
    try {
      const n = await applyProjects();
      if (n > 0) {
        done.push(`${n} project${n > 1 ? "s" : ""}`);
        blocksToEnsure.push("Projects");
      }
    } catch {
      failed.push("projects");
    }

    await ensureBlocks(blocksToEnsure);

    setApplying(false);
    setReviewOpen(false);
    setParsed(null);

    if (done.length) toast.success(`Imported ${done.join(", ")}`);
    if (failed.length)
      toast.error(`Couldn't import ${failed.join(", ")} — add those manually`);
    if (!done.length && !failed.length)
      toast.message("Nothing selected to import");
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <Button
        size="sm"
        variant="outline"
        disabled={parsing}
        onClick={() => inputRef.current?.click()}
      >
        {parsing ? (
          <IconLoader2 className="size-4 animate-spin" />
        ) : (
          <IconFileImport className="size-4" />
        )}
        Import from résumé
      </Button>

      <Dialog
        open={reviewOpen}
        onOpenChange={(next) => !applying && setReviewOpen(next)}
      >
        <DialogContent className="flex max-h-[88vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-130">
          <DialogHeader className="border-b px-6 pb-4 pt-6">
            <DialogTitle className="flex items-center gap-2 font-display text-xl">
              <IconSparkles className="size-5 text-violet-500" />
              Review imported details
            </DialogTitle>
            <DialogDescription>
              We pulled these from your résumé. Untick anything you don't want,
              then apply.
            </DialogDescription>
          </DialogHeader>

          <div className="flex min-h-0 flex-col gap-5 overflow-y-auto px-6 py-5">
            {parsed && hasProfileFields(parsed) && (
              <section className="flex flex-col gap-2">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Profile
                </h3>
                <ToggleRow
                  checked={includeProfile}
                  onToggle={() => setIncludeProfile((v) => !v)}
                >
                  <div className="flex flex-col gap-0.5">
                    {parsed.name && (
                      <span className="font-medium">{parsed.name}</span>
                    )}
                    {parsed.role && (
                      <span className="text-sm text-muted-foreground">
                        {parsed.role}
                      </span>
                    )}
                    {parsed.bio && (
                      <span className="mt-1 text-sm italic text-muted-foreground">
                        "{parsed.bio}"
                      </span>
                    )}
                    {(parsed.contactEmail || parsed.phone) && (
                      <span className="mt-1 text-xs text-muted-foreground">
                        {[parsed.contactEmail, parsed.phone]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    )}
                  </div>
                </ToggleRow>
              </section>
            )}

            {parsed && parsed.skills.length > 0 && (
              <section className="flex flex-col gap-2">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {parsed.skills.map((skill, i) => (
                    <button
                      key={`${skill}-${i}`}
                      type="button"
                      onClick={() =>
                        setSkillSel((sel) =>
                          sel.map((v, idx) => (idx === i ? !v : v)),
                        )
                      }
                    >
                      <Badge
                        variant={skillSel[i] ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer gap-1",
                          !skillSel[i] && "opacity-50",
                        )}
                      >
                        {skillSel[i] && <IconCheck className="size-3" />}
                        {skill}
                      </Badge>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {parsed && parsed.projects.length > 0 && (
              <section className="flex flex-col gap-2">
                <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Projects
                </h3>
                <div className="flex flex-col gap-2">
                  {parsed.projects.map((project, i) => (
                    <ToggleRow
                      key={`${project.title}-${i}`}
                      checked={projSel[i]}
                      onToggle={() =>
                        setProjSel((sel) =>
                          sel.map((v, idx) => (idx === i ? !v : v)),
                        )
                      }
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{project.title}</span>
                        {project.desc && (
                          <span className="text-sm text-muted-foreground line-clamp-2">
                            {project.desc}
                          </span>
                        )}
                      </div>
                    </ToggleRow>
                  ))}
                </div>
              </section>
            )}
          </div>

          <DialogFooter className="border-t px-6 py-4">
            <Button
              variant="outline"
              disabled={applying}
              onClick={() => setReviewOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={applying}>
              {applying && <IconLoader2 className="size-4 animate-spin" />}
              Apply to my page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
