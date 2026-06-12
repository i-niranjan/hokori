import api from "@/models/auth/refresh";
import type { ResumeData, SetResumePayload } from "@hokori/types";

export async function getResume(): Promise<ResumeData | null> {
  const result = await api.get("/component/resume");
  return result.data.data;
}

export async function setResumeApi(
  payload: SetResumePayload,
): Promise<ResumeData> {
  const result = await api.put("/component/resume", payload);
  return result.data.data;
}

export async function deleteResumeApi(): Promise<void> {
  await api.delete("/component/resume");
}
