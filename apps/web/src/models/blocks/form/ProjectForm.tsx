import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { upload } from "@imagekit/react";
import { IconLoader2, IconPhoto, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RephraseButton } from "@/components/ui/rephrase-button";
import { GenerateButton } from "@/components/ui/generate-button";
import { generateProject } from "@/services/aiService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "@/models/auth/refresh";
import { useAppSelector } from "@/lib/hooks";
import { addProject, updateProject } from "@/services/projectService";
import { deletImage } from "@/services/imageKitService";
import { normalizeUrl, type ProjectData } from "@hokori/types";

interface ProjectFormProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  /** When set, the form edits this project instead of creating one. */
  initialData?: ProjectData | null;
  onSaved(project: ProjectData): void;
}

export default function ProjectForm({
  open,
  onOpenChange,
  initialData,
  onSaved,
}: ProjectFormProps) {
  const userId = useAppSelector((state) => state.auth.user?.userId);
  const inputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [longDesc, setLongDesc] = useState("");
  const [link, setLink] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [thumbnailFileId, setThumbnailFileId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // File uploaded in this dialog session but not saved yet. If the dialog
  // closes without saving, it gets deleted from ImageKit so no garbage
  // accumulates.
  const sessionUploadRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setTitle(initialData?.title ?? "");
    setDesc(initialData?.desc ?? "");
    setLongDesc(initialData?.longDesc ?? "");
    setLink(initialData?.link ?? "");
    setThumbnail(initialData?.thumbnail ?? "");
    setThumbnailFileId(initialData?.thumbnailFileId ?? "");
    sessionUploadRef.current = null;
    if (inputRef.current) inputRef.current.value = "";
  }, [open, initialData]);

  const discardSessionUpload = () => {
    if (sessionUploadRef.current) {
      deletImage(sessionUploadRef.current);
      sessionUploadRef.current = null;
    }
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) discardSessionUpload();
    onOpenChange(next);
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const res = await api.get("/image-kit/auth");
      const { expire, token, signature } = res.data;
      const result = await upload({
        file,
        fileName: file.name,
        expire,
        token,
        signature,
        folder: `/user/${userId}/projects`,
        publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
      });
      if (!result.url || !result.fileId) {
        toast.error("Something went wrong while uploading");
        return;
      }
      // Replacing an unsaved upload from this session: drop the old file.
      discardSessionUpload();
      sessionUploadRef.current = result.fileId;
      setThumbnail(result.url);
      setThumbnailFileId(result.fileId);
    } catch {
      toast.error("Couldn't upload the banner image");
    } finally {
      setUploading(false);
    }
  };

  const removeThumbnail = () => {
    // Only unsaved session uploads are deleted here. A previously saved
    // banner stays in ImageKit until the change is saved, so cancelling
    // still leaves the project intact; the server cleans it up on save.
    discardSessionUpload();
    setThumbnail("");
    setThumbnailFileId("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!title.trim() || !desc.trim() || saving) return;
    setSaving(true);
    const payload = {
      title: title.trim(),
      desc: desc.trim(),
      longDesc: longDesc.trim(),
      link: normalizeUrl(link),
      thumbnail,
      thumbnailFileId,
    };
    try {
      const project = initialData
        ? await updateProject(initialData.id, payload)
        : await addProject(payload);
      // The upload is now owned by the saved project; don't discard it.
      sessionUploadRef.current = null;
      onSaved(project);
      toast.success(initialData ? "Project updated" : "Project added");
      onOpenChange(false);
    } catch {
      toast.error("Couldn't save the project, check the link is a valid URL");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-130">
        <DialogHeader>
          <div className="flex items-center justify-between gap-2">
            <DialogTitle className="font-display">
              {initialData ? "Edit Project" : "Add Project"}
            </DialogTitle>
            <GenerateButton
              label="Generate with AI"
              placeholder="What's the project? e.g. invoice generator for freelancers, built with React + Node, cut billing time in half"
              onGenerate={async (prompt) => {
                const project = await generateProject(prompt);
                if (project.title) setTitle(project.title);
                if (project.desc) setDesc(project.desc);
                if (project.longDesc) setLongDesc(project.longDesc);
              }}
            />
          </div>
          <DialogDescription>
            Visitors see the title and summary on your page, and the full
            story when they open the project.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          {/* Banner */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="project-banner">Banner</Label>
            {thumbnail ? (
              <div className="relative overflow-hidden rounded-lg border">
                <img
                  src={thumbnail}
                  alt="Project banner"
                  className="h-36 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeThumbnail}
                  aria-label="Remove banner"
                  className="absolute right-2 top-2 rounded-full border bg-background/90 p-1 hover:scale-105 transition-transform"
                >
                  <IconX className="size-4" />
                </button>
              </div>
            ) : (
              <Label
                htmlFor="project-banner"
                className="flex h-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
              >
                {uploading ? (
                  <IconLoader2 className="size-5 animate-spin" />
                ) : (
                  <>
                    <IconPhoto className="size-5" />
                    <span className="text-xs">
                      Upload a banner image (optional)
                    </span>
                  </>
                )}
              </Label>
            )}
            <Input
              ref={inputRef}
              id="project-banner"
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="project-title">Title</Label>
            <Input
              id="project-title"
              value={title}
              maxLength={100}
              placeholder="Invoice Generator"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="project-desc">Summary</Label>
            <div className="relative">
              <Input
                id="project-desc"
                value={desc}
                maxLength={500}
                placeholder="One line about what it does"
                className="pr-9"
                onChange={(e) => setDesc(e.target.value)}
              />
              <RephraseButton
                value={desc}
                field="projectSummary"
                onRephrased={setDesc}
                className="absolute right-1.5 top-1/2 -translate-y-1/2"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="project-longdesc">Long description</Label>
            <div className="relative">
              <Textarea
                id="project-longdesc"
                value={longDesc}
                maxLength={5000}
                rows={5}
                placeholder="The full story: what you built, the stack, the challenges, the results."
                className="max-h-60 overflow-y-auto pr-10"
                onChange={(e) => setLongDesc(e.target.value)}
              />
              <RephraseButton
                value={longDesc}
                field="projectLongDesc"
                onRephrased={setLongDesc}
                className="absolute right-2 top-2"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="project-link">Link</Label>
            <Input
              id="project-link"
              value={link}
              placeholder="https://... (optional)"
              onChange={(e) => setLink(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!title.trim() || !desc.trim() || saving || uploading}
          >
            {saving && <IconLoader2 className="size-4 animate-spin" />}
            {initialData ? "Save changes" : "Add project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
