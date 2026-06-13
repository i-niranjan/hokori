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

export interface AvailabilityResult {
  available: boolean;
  message: string;
}

export async function checkUsername(
  username: string,
  signal?: AbortSignal,
): Promise<AvailabilityResult> {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/public/username-check/${encodeURIComponent(username)}`,
    { signal },
  );
  return result.data;
}

export async function checkEmail(
  email: string,
  signal?: AbortSignal,
): Promise<AvailabilityResult> {
  const result = await axios.get(
    `${import.meta.env.VITE_API_URL}/public/email-check/${encodeURIComponent(email)}`,
    { signal },
  );
  return result.data;
}
