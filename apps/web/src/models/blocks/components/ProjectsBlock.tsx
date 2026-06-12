import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  IconExternalLink,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppSelector } from "@/lib/hooks";
import { useAppDispatch } from "@/app/store";
import { setProjects } from "../features/profileSlice";
import { deleteProject, getProjects } from "@/services/projectService";
import { MAX_PROJECTS, type ProjectData } from "@hokori/types";
import { ProjectsGlyph } from "./BlockIcons";
import ProjectForm from "../form/ProjectForm";
import ConfirmDialog from "@/components/confirm-dialog";

function ProjectsBlock() {
  const dispatch = useAppDispatch();
  const projects = useAppSelector((state) => {
    const block = state.profile.blocks.find((b) => b.type === "Projects");
    return block?.type === "Projects" ? block.data : null;
  });
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProjectData | null>(null);
  const [pendingDelete, setPendingDelete] = useState<ProjectData | null>(null);

  useEffect(() => {
    (async () => {
      try {
        dispatch(setProjects(await getProjects()));
      } catch {
        toast.error("Couldn't load your projects");
      } finally {
        setLoading(false);
      }
    })();
  }, [dispatch]);

  const atLimit = (projects?.length ?? 0) >= MAX_PROJECTS;

  const openAdd = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (project: ProjectData) => {
    setEditing(project);
    setFormOpen(true);
  };

  const handleSaved = (saved: ProjectData) => {
    const current = projects ?? [];
    const exists = current.some((p) => p.id === saved.id);
    dispatch(
      setProjects(
        exists
          ? current.map((p) => (p.id === saved.id ? saved : p))
          : [...current, saved],
      ),
    );
  };

  const handleRemove = async (projectId: string) => {
    const previous = projects ?? [];
    dispatch(setProjects(previous.filter((p) => p.id !== projectId)));
    try {
      await deleteProject(projectId);
    } catch {
      dispatch(setProjects(previous));
      toast.error("Couldn't remove that project");
    }
  };

  return (
    <div className="h-max w-full rounded-md border bg-card flex overflow-hidden">
      <div className="flex flex-col gap-3 w-full px-4 py-4">
        <div className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <ProjectsGlyph className="size-5 text-foreground" />
            <span className="font-display text-lg font-semibold text-foreground">
              Projects
            </span>
            <span className="text-xs text-muted-foreground">
              {projects?.length ?? 0}/{MAX_PROJECTS}
            </span>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-16 w-full rounded-md" />
            <Skeleton className="h-16 w-full rounded-md" />
          </div>
        ) : (
          <>
            {projects && projects.length > 0 && (
              <div className="flex flex-col gap-2">
                {projects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between gap-3 rounded-md border px-3 py-2"
                  >
                    {project.thumbnail && (
                      <img
                        src={project.thumbnail}
                        alt=""
                        className="size-12 shrink-0 rounded-md border object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {project.title}
                        </span>
                        {project.link && (
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noreferrer"
                            className="text-muted-foreground hover:text-foreground"
                            aria-label={`Open ${project.title}`}
                          >
                            <IconExternalLink className="size-4" />
                          </a>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {project.desc}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Edit ${project.title}`}
                        onClick={() => openEdit(project)}
                      >
                        <IconPencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${project.title}`}
                        onClick={() => setPendingDelete(project)}
                      >
                        <IconTrash className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              className="w-max"
              variant="outline"
              disabled={atLimit}
              onClick={openAdd}
            >
              <IconPlus className="size-4" /> Add Project
            </Button>
          </>
        )}
      </div>

      {formOpen && (
        <ProjectForm
          open={formOpen}
          onOpenChange={setFormOpen}
          initialData={editing}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        onOpenChange={(open) => !open && setPendingDelete(null)}
        title="Delete this project?"
        description={`"${pendingDelete?.title ?? ""}" and its banner will be permanently deleted. This can't be undone.`}
        confirmLabel="Delete project"
        onConfirm={() => {
          if (pendingDelete) handleRemove(pendingDelete.id);
        }}
      />
    </div>
  );
}

export default ProjectsBlock;
