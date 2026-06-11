import axios from "axios";
import type { PublicProfilePayload } from "@hokori/types";

// Public endpoint — no auth, no token refresh interceptor needed.
export async function getPublicProfile(
  username: string,
): Promise<PublicProfilePayload> {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/public/${encodeURIComponent(username)}`,
  );
  return result.data.data;
}
