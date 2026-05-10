import type { EventAddPayload } from "@/lib/schema";

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

export async function UpdateProfile(data: Partial<EventAddPayload>) {
  try {
    console.log("got here", data);

    const result = await api.patch(`/component/profile/update`, data);
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
