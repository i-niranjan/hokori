import prisma from "../lib/prisma.js";
import { imagekit } from "../utils/helper.js";
import type { ResumeData, SetResumePayload } from "@hokori/types";

const deleteFileQuietly = async (fileId: string | null) => {
  if (!fileId) return;
  try {
    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.log("ImageKit cleanup failed for file", fileId, error);
  }
};

const toResumeData = (resume: {
  id: string;
  url: string;
  fileName: string;
}): ResumeData => ({
  id: resume.id,
  url: resume.url,
  fileName: resume.fileName,
});

export const resumeService = {
  getResume: async (userId: string): Promise<ResumeData | null> => {
    const resume = await prisma.resume.findUnique({ where: { userId } });
    return resume ? toResumeData(resume) : null;
  },

  setResume: async (
    data: SetResumePayload,
    userId: string
  ): Promise<ResumeData> => {
    const existing = await prisma.resume.findUnique({ where: { userId } });
    if (existing && existing.fileId !== data.fileId) {
      await deleteFileQuietly(existing.fileId);
    }

    const resume = await prisma.resume.upsert({
      where: { userId },
      update: { url: data.url, fileId: data.fileId, fileName: data.fileName },
      create: {
        userId,
        url: data.url,
        fileId: data.fileId,
        fileName: data.fileName,
      },
    });
    return toResumeData(resume);
  },

  deleteResume: async (userId: string): Promise<void> => {
    const existing = await prisma.resume.findUnique({ where: { userId } });
    if (!existing) {
      throw { status: 404, message: "No resume to delete" };
    }
    await deleteFileQuietly(existing.fileId);
    await prisma.resume.delete({ where: { userId } });
  },
};
