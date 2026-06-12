import prisma from "../lib/prisma.js";
import { imagekit } from "../utils/helper.js";
import {
  MAX_PROJECTS,
  type AddProjectPayload,
  type UpdateProjectPayload,
} from "@hokori/types";

/** Best-effort ImageKit cleanup — an orphaned file never blocks the request. */
const deleteImageQuietly = async (fileId: string | null) => {
  if (!fileId) return;
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.log("ImageKit cleanup failed for file", fileId, error);
  }
};

export const projectService = {
  getProjects: async (userId: string) => {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { id: "asc" },
    });
  },

  addProject: async (data: AddProjectPayload, userId: string) => {
    const count = await prisma.project.count({ where: { userId } });
    if (count >= MAX_PROJECTS) {
      throw {
        status: 400,
        message: `You can add up to ${MAX_PROJECTS} projects`,
      };
    }

    return prisma.project.create({
      data: {
        userId,
        title: data.title,
        desc: data.desc,
        longDesc: data.longDesc || null,
        link: data.link || null,
        thumbnail: data.thumbnail || null,
        thumbnailFileId: data.thumbnailFileId || null,
      },
    });
  },

  updateProject: async (
    projectId: string,
    data: UpdateProjectPayload,
    userId: string
  ) => {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project || project.userId !== userId) {
      throw { status: 404, message: "Project not found" };
    }

    const updateData: Record<string, string | null> = {};
    if (data.title !== undefined) updateData.title = data.title;
    if (data.desc !== undefined) updateData.desc = data.desc;
    if (data.longDesc !== undefined) {
      updateData.longDesc = data.longDesc || null;
    }
    if (data.link !== undefined) updateData.link = data.link || null;
    if (data.thumbnail !== undefined) {
      updateData.thumbnail = data.thumbnail || null;
    }
    if (data.thumbnailFileId !== undefined) {
      updateData.thumbnailFileId = data.thumbnailFileId || null;
    }
    if (Object.keys(updateData).length === 0) {
      throw new Error("No project fields provided for update");
    }

    // The banner changed or was removed: clean up the old file in ImageKit.
    if (
      updateData.thumbnailFileId !== undefined &&
      project.thumbnailFileId &&
      updateData.thumbnailFileId !== project.thumbnailFileId
    ) {
      await deleteImageQuietly(project.thumbnailFileId);
    }

    return prisma.project.update({ where: { id: projectId }, data: updateData });
  },

  deleteProject: async (projectId: string, userId: string) => {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });
    if (!project || project.userId !== userId) {
      throw { status: 404, message: "Project not found" };
    }
    await deleteImageQuietly(project.thumbnailFileId);
    return prisma.project.delete({ where: { id: projectId } });
  },
};
