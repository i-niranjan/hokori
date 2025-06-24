import type { UserSchema, Login } from "@/models/auth/authTypes";
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
    token: localStorage.getItem("token") ?? null,
  } satisfies AuthState as AuthState,
  reducers: (create) => ({
    signup: create.asyncThunk(
      async (data: UserSchema, { rejectWithValue }) => {
        try {
          const res = await axios.post(`${API_URL}/auth/signup`, data);
          return res.data;
        } catch (error: any) {
          console.log("Caught error:", error.response?.data);

          return rejectWithValue(
            error.response?.data?.message || "Signup failed"
          );
        }
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        rejected: (state, action) => {
          state.loading = false;

          toast.error(action.payload as string);
        },
        fulfilled: (state, action) => {
          state.loading = false;
          const { message, token, user } = action.payload;
          state.user = user;
          state.token = token;
          localStorage.setItem("token", token);
          localStorage.setItem("email", user.email);
          localStorage.setItem("firstName", user.firstName);
          localStorage.setItem("lastName", user.lastName);
          toast(message);
        },
      }
    ),
    login: create.asyncThunk(
      async (data: Login, { rejectWithValue }) => {
        try {
          const res = await axios.post(`${API_URL}/auth/login`, data);
          return res.data;
        } catch (error: any) {
          console.log("Caught error:", error.response?.data);

          return rejectWithValue(
            error.response?.data?.message || "Login Failed"
          );
        }
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        rejected: (state, action) => {
          state.loading = false;

          toast.error(action.payload as string);
        },
        fulfilled: (state, action) => {
          const { message, token, user } = action.payload;
          state.user = user;
          state.token = token;
          localStorage.setItem("token", token);
          localStorage.setItem("email", user.email);
          localStorage.setItem("firstName", user.firstName);
          localStorage.setItem("lastName", user.lastName);
          toast(message);
        },
      }
    ),
  }),
});

export const { signup, login } = authSlice.actions;
export default authSlice.reducer;
