import { eventAddSchema } from "@/lib/schema";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function AddProfile({ data }: any) {
  try {
    const result = await axios.post(`${API_URL}/component/profile/add`, data);
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.log(error);
  }
}
