import api from "@/models/auth/refresh";
import type {
  AddProjectPayload,
  ProjectData,
  UpdateProjectPayload,
} from "@hokori/types";

export async function getProjects(): Promise<ProjectData[]> {
  const result = await api.get("/component/project");
  return result.data.data;
}

export async function addProject(
  data: AddProjectPayload,
): Promise<ProjectData> {
  const result = await api.post("/component/project/add", data);
  return result.data.data;
}

export async function updateProject(
  projectId: string,
  data: UpdateProjectPayload,
): Promise<ProjectData> {
  const result = await api.patch(
    `/component/project/${encodeURIComponent(projectId)}`,
    data,
  );
  return result.data.data;
}

export async function deleteProject(projectId: string): Promise<void> {
  await api.delete(`/component/project/${encodeURIComponent(projectId)}`);
}
