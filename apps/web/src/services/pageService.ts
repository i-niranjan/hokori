import api from "@/models/auth/refresh";
import type { PageConfig, UpdatePagePayload } from "@hokori/types";

export async function getPage(): Promise<PageConfig> {
  const result = await api.get("/page");
  return result.data.data;
}

export async function updatePage(
  data: UpdatePagePayload,
): Promise<PageConfig> {
  const result = await api.put("/page", data);
  return result.data.data;
}
