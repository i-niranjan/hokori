import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { upload } from "@imagekit/react";
import {
  IconExternalLink,
  IconFileTypePdf,
  IconLoader2,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import ConfirmDialog from "@/components/confirm-dialog";
import api from "@/models/auth/refresh";
import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/app/store";
import { setResume } from "../features/profileSlice";
import {
  deleteResumeApi,
  getResume,
  setResumeApi,
} from "@/services/resumeService";
import { ResumeGlyph } from "./BlockIcons";

const MAX_PDF_BYTES = 8 * 1024 * 1024;

function ResumeBlock() {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.user?.userId);
  const resume = useAppSelector((state) => {
    const block = state.profile.blocks.find((b) => b.type === "Resume");
    return block?.type === "Resume" ? block.data : null;
  });
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        dispatch(setResume(await getResume()));
      } catch {
        toast.error("Couldn't load your resume");
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Your resume must be a PDF");
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      toast.error("Keep the PDF under 8 MB");
      return;
    }

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
        folder: `/user/${userId}/resume`,
        publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
      });
      if (!result.url || !result.fileId) {
        toast.error("Something went wrong while uploading");
        return;
      }
      // Saving immediately transfers ownership to the server, which also
      // cleans up the previous file.
      const saved = await setResumeApi({
        url: result.url,
        fileId: result.fileId,
        fileName: file.name,
      });
      dispatch(setResume(saved));
      toast.success("Resume uploaded");
    } catch {
      toast.error("Couldn't upload your resume");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    const previous = resume;
    dispatch(setResume(null));
    try {
      await deleteResumeApi();
      toast.success("Resume removed");
    } catch {
      dispatch(setResume(previous));
      toast.error("Couldn't remove your resume");
    }
  };

  return (
    <div className="h-max w-full rounded-md border bg-card flex overflow-hidden">
      <div className="flex flex-col gap-3 w-full px-4 py-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <ResumeGlyph className="size-5 text-foreground" />
            <span className="font-display text-lg font-semibold text-foreground">
              Resume
            </span>
          </div>
        </div>

        {loading ? (
          <Skeleton className="h-14 w-full rounded-md" />
        ) : resume ? (
          <div className="flex items-center justify-between gap-3 rounded-md border px-3 py-2.5">
            <div className="flex min-w-0 items-center gap-3">
              <IconFileTypePdf className="size-6 shrink-0 text-primary" />
              <span className="truncate text-sm font-medium">
                {resume.fileName}
              </span>
            </div>
            <div className="flex shrink-0 gap-0.5">
              <Button
                variant="ghost"
                size="icon"
                aria-label="View resume"
                onClick={() => window.open(resume.url, "_blank")}
              >
                <IconExternalLink className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Replace resume"
                disabled={uploading}
                onClick={() => inputRef.current?.click()}
              >
                {uploading ? (
                  <IconLoader2 className="size-4 animate-spin" />
                ) : (
                  <IconUpload className="size-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Remove resume"
                onClick={() => setConfirmDelete(true)}
              >
                <IconTrash className="size-4" />
              </Button>
            </div>
          </div>
        ) : (
          <Label
            htmlFor="resume-upload"
            className="flex h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-muted-foreground transition-colors hover:border-primary/60 hover:text-foreground"
          >
            {uploading ? (
              <IconLoader2 className="size-5 animate-spin" />
            ) : (
              <>
                <IconUpload className="size-5" />
                <span className="text-xs">Upload your resume (PDF, 8 MB max)</span>
              </>
            )}
          </Label>
        )}

        <Input
          ref={inputRef}
          id="resume-upload"
          type="file"
          accept="application/pdf"
          className="hidden"
          disabled={uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUpload(file);
          }}
        />
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Remove your resume?"
        description={`"${resume?.fileName ?? ""}" will be permanently deleted from your page. This can't be undone.`}
        confirmLabel="Remove resume"
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default ResumeBlock;
