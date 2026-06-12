import { IconExternalLink } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { ProjectData } from "@hokori/types";

interface ProjectDetailDialogProps {
  project: ProjectData | null;
  onClose(): void;
}

/**
 * Detail popup opened when a visitor clicks a project card. Shared by all
 * themes (and the dashboard preview) so the reading experience is
 * consistent regardless of page theme.
 */
export default function ProjectDetailDialog({
  project,
  onClose,
}: ProjectDetailDialogProps) {
  return (
    <Dialog open={!!project} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-130 p-0 gap-0 overflow-hidden">
        {project && (
          <>
            {project.thumbnail && (
              <img
                src={project.thumbnail}
                alt={`${project.title} banner`}
                className="h-44 w-full border-b object-cover"
              />
            )}
            <div className="flex flex-col gap-3 p-6">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">
                  {project.title}
                </DialogTitle>
                <DialogDescription className="text-sm">
                  {project.desc}
                </DialogDescription>
              </DialogHeader>

              {project.longDesc && (
                <ScrollArea className="max-h-56 pr-3">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/85">
                    {project.longDesc}
                  </p>
                </ScrollArea>
              )}

              {project.link && (
                <Button asChild className="mt-1 w-max">
                  <a href={project.link} target="_blank" rel="noreferrer">
                    Visit project <IconExternalLink className="size-4" />
                  </a>
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
