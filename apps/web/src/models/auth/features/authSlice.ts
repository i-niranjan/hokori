import type { UserSchema, Login } from "@/models/auth/authTypes";

import { toast } from "sonner";
import { createAppSlice } from "@/app/createAppSlice";
import { AxiosError } from "axios";
import api from "../refresh";

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.message ?? fallback;
  }
  return fallback;
}

interface UserState {
  userId: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}
interface AuthState {
  loading: boolean;
  user: UserState | null;
  token: string | null;
}

const initialUser = {
  userId: localStorage.getItem("userId") ?? null,
  email: localStorage.getItem("email") ?? null,
  firstName: localStorage.getItem("firstName") ?? null,
  lastName: localStorage.getItem("lastName") ?? null,
};

const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    user: initialUser,
    loading: false,
    token: localStorage.getItem("token") ?? null,
  } satisfies AuthState as AuthState,
  reducers: (create) => ({
    tokenRefreshed: create.reducer((state, action: { payload: string }) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    }),
    signup: create.asyncThunk(
      async (data: UserSchema, { rejectWithValue }) => {
        try {
          const res = await api.post(`/auth/signup`, data);
          const token = res.data.accessToken ?? res.data.token;

          return { ...res.data, token };
        } catch (error: unknown) {
          return rejectWithValue(getApiErrorMessage(error, "Signup failed"));
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
          state.user = user
            ? {
                userId: user.id,
                firstName: user.firstName ?? null,
                lastName: user.lastName ?? null,
                email: user.email ?? null,
              }
            : null;

          state.token = token ?? null;
          localStorage.setItem("token", token);
          localStorage.setItem("userId", user.id);
          localStorage.setItem("email", user.email);
          localStorage.setItem("firstName", user.firstName);
          localStorage.setItem("lastName", user.lastName);
          if (message) toast(message);
        },
      }
    ),
    login: create.asyncThunk(
      async (data: Login, { rejectWithValue }) => {
        try {
          const res = await api.post(`/auth/login`, data);
          const token = res.data.accessToken ?? res.data.token;

          return { ...res.data, token };
        } catch (error: unknown) {
          return rejectWithValue(getApiErrorMessage(error, "Login Failed"));
        }
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        rejected: (state, action) => {
          state.loading = false;
          console.log("FROm Payload", action.payload);

          toast.error(action.payload as string);
        },
        fulfilled: (state, action) => {
          state.loading = false;
          const { message, token, user } = action.payload;

          state.user = user
            ? {
                userId: user.id,
                firstName: user.firstName ?? null,
                lastName: user.lastName ?? null,
                email: user.email ?? null,
              }
            : null;

          state.token = token ?? null;
          localStorage.setItem("token", token);
          localStorage.setItem("userId", user.id);
          localStorage.setItem("email", user.email);
          localStorage.setItem("firstName", user.firstName);
          localStorage.setItem("lastName", user.lastName);
          if (message) toast(message);
        },
      }
    ),
    logout: create.asyncThunk(
      async () => {
        try {
          await api.post(`/auth/logout`);

          return { message: "Logged out successfully" };
        } catch {
          return { message: "Logged out successfully" };
        }
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        rejected: (state) => {
          state.loading = false;

          state.user = null;
          state.token = null;

          toast.error("Logout failed");
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.user = null;
          state.token = null;
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          localStorage.removeItem("email");
          localStorage.removeItem("firstName");
          localStorage.removeItem("lastName");
          toast.success(action.payload.message);
        },
      }
    ),
  }),
});

export const { signup, login, logout, tokenRefreshed } = authSlice.actions;
export default authSlice.reducer;
