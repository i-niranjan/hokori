import prisma from "../lib/prisma.js";
import { MAX_SKILLS, type AddSkillPayload } from "@hokori/types";

export const skillService = {
  getSkills: async (userId: string) => {
    return prisma.skill.findMany({
      where: { userId },
      orderBy: { id: "asc" },
    });
  },

  addSkill: async (data: AddSkillPayload, userId: string) => {
    const count = await prisma.skill.count({ where: { userId } });
    if (count >= MAX_SKILLS) {
      throw { status: 400, message: `You can add up to ${MAX_SKILLS} skills` };
    }

    const existing = await prisma.skill.findFirst({
      where: { userId, name: { equals: data.name, mode: "insensitive" } },
    });
    if (existing) {
      throw { status: 409, message: "You already added this skill" };
    }

    return prisma.skill.create({
      data: { userId, name: data.name, icon: data.icon ?? null },
    });
  },

  deleteSkill: async (skillId: string, userId: string) => {
    const skill = await prisma.skill.findUnique({ where: { id: skillId } });
    if (!skill || skill.userId !== userId) {
      throw { status: 404, message: "Skill not found" };
    }
    return prisma.skill.delete({ where: { id: skillId } });
  },
};
