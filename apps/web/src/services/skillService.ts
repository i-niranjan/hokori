import api from "@/models/auth/refresh";
import type { AddSkillPayload, SkillData } from "@hokori/types";

export async function getSkills(): Promise<SkillData[]> {
  const result = await api.get("/component/skill");
  return result.data.data;
}

export async function addSkill(data: AddSkillPayload): Promise<SkillData> {
  const result = await api.post("/component/skill/add", data);
  return result.data.data;
}

export async function deleteSkill(skillId: string): Promise<void> {
  await api.delete(`/component/skill/${encodeURIComponent(skillId)}`);
}
