import api from "@/models/auth/refresh";
import type { SetSocialLinksPayload, SocialLinkData } from "@hokori/types";

export async function getSocialLinks(): Promise<SocialLinkData[]> {
  const result = await api.get("/component/social");
  return result.data.data;
}

export async function setSocialLinksApi(
  payload: SetSocialLinksPayload,
): Promise<SocialLinkData[]> {
  const result = await api.put("/component/social", payload);
  return result.data.data;
}
