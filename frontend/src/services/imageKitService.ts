import api from "@/models/auth/refresh";
import axios from "axios";

async function deletImage(fieldId: string) {
  try {
    const res = await api.get(`/image-kit/delete/${fieldId}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export { deletImage };
