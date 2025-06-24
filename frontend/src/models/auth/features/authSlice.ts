import type { User } from "@/models/auth/authTypes";
import axios from "axios";
import { toast } from "sonner";
import { createAppSlice } from "@/app/createAppSlice";

const API_URL = import.meta.env.VITE_API_URL;
interface UserState {
  firstName: String;
  lastName: String;
  email: String;
  userName: String;
}
interface AuthState {
  loading: boolean;
  user: UserState | null;
  token: string | null;
}

const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    token: null,
  } satisfies AuthState as AuthState,
  reducers: (create) => ({
    signup: create.asyncThunk(
      async (data: User, thunkApi) => {
        const res = await axios.post(`${API_URL}/signup`, data);
        return res.data;
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        rejected: (state, action) => {
          state.loading = false;
          toast.error(action.error.message || "Signup failed");
        },
        fulfilled: (state, action) => {
          const { message, token, user } = action.payload;
          state.user = user;
          state.token = token;
          toast(message);
        },
      }
    ),
    login: create.asyncThunk(
      async (data: User, thunkApi) => {
        const res = await axios.post(`${API_URL}/login`, data);
        return res.data;
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        rejected: (state, action) => {
          state.loading = false;
          toast.error(action.error.message || "Signup failed");
        },
        fulfilled: (state, action) => {
          const { message, token, user } = action.payload;
          state.user = user;
          state.token = token;
          toast(message);
        },
      }
    ),
  }),
});

export const { signup, login } = authSlice.actions;
export default authSlice.reducer;
