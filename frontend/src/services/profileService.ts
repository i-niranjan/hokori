import type { EventAddPayload } from "@/lib/schema";
const API_URL = import.meta.env.VITE_API_URL;

import api from "@/models/auth/refresh";

export async function AddProfile(data: EventAddPayload) {
  try {
    const result = await api.post(`/component/profile/add`, data);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
