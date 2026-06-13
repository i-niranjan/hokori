import type { UserSchema, Login, VerifyOtp } from "@/models/auth/authTypes";

import { toast } from "sonner";
import { createAppSlice } from "@/app/createAppSlice";
import { AxiosError } from "axios";
import api from "../refresh";

export interface ApiAuthError {
  message: string;
  code?: string;
  email?: string;
  fields?: { email?: string; userName?: string };
}

function getApiError(error: unknown, fallback: string): ApiAuthError {
  if (error instanceof AxiosError && error.response?.data?.message) {
    return {
      message: error.response.data.message,
      code: error.response.data.code,
      email: error.response.data.email,
      fields: error.response.data.fields,
    };
  }
  return { message: fallback };
}

interface UserState {
  userId: string | null;
  userName: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}
interface AuthState {
  loading: boolean;
  user: UserState | null;
}

/* Auth itself lives in httpOnly cookies; localStorage only mirrors
   display info so the UI knows who's signed in across reloads. */
const persistUser = (user: UserState) => {
  localStorage.setItem("userId", user.userId ?? "");
  localStorage.setItem("userName", user.userName ?? "");
  localStorage.setItem("email", user.email ?? "");
  localStorage.setItem("firstName", user.firstName ?? "");
  localStorage.setItem("lastName", user.lastName ?? "");
};

const clearPersistedUser = () => {
  ["userId", "userName", "email", "firstName", "lastName", "token"].forEach(
    (key) => localStorage.removeItem(key),
  );
};

const readPersistedUser = (): UserState | null => {
  const userId = localStorage.getItem("userId");
  if (!userId) return null;
  return {
    userId,
    userName: localStorage.getItem("userName"),
    email: localStorage.getItem("email"),
    firstName: localStorage.getItem("firstName"),
    lastName: localStorage.getItem("lastName"),
  };
};

const toUserState = (user: {
  id: string;
  userName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
}): UserState => ({
  userId: user.id,
  userName: user.userName ?? null,
  firstName: user.firstName ?? null,
  lastName: user.lastName ?? null,
  email: user.email ?? null,
});

const authSlice = createAppSlice({
  name: "auth",
  initialState: {
    user: readPersistedUser(),
    loading: false,
  } satisfies AuthState as AuthState,
  reducers: (create) => ({
    signup: create.asyncThunk(
      async (data: UserSchema, { rejectWithValue }) => {
        try {
          const res = await api.post(`/auth/signup`, data);
          return res.data as { message: string; email: string };
        } catch (error: unknown) {
          return rejectWithValue(getApiError(error, "Signup failed"));
        }
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        // Errors render inline in the form; no toast here.
        rejected: (state) => {
          state.loading = false;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          toast(action.payload.message);
        },
      },
    ),
    verifyOtp: create.asyncThunk(
      async (data: VerifyOtp, { rejectWithValue }) => {
        try {
          const res = await api.post(`/auth/verify-otp`, data);
          return res.data;
        } catch (error: unknown) {
          return rejectWithValue(getApiError(error, "Verification failed"));
        }
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        rejected: (state, action) => {
          state.loading = false;
          toast.error((action.payload as ApiAuthError).message);
        },
        fulfilled: (state, action) => {
          state.loading = false;
          const { message, user } = action.payload;
          state.user = user ? toUserState(user) : null;
          if (state.user) persistUser(state.user);
          if (message) toast.success(message);
        },
      },
    ),
    login: create.asyncThunk(
      async (data: Login, { rejectWithValue }) => {
        try {
          const res = await api.post(`/auth/login`, data);
          return res.data;
        } catch (error: unknown) {
          return rejectWithValue(getApiError(error, "Login Failed"));
        }
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        // Errors render inline in the form; no toast here.
        rejected: (state) => {
          state.loading = false;
        },
        fulfilled: (state, action) => {
          state.loading = false;
          const { message, user } = action.payload;
          state.user = user ? toUserState(user) : null;
          if (state.user) persistUser(state.user);
          if (message) toast(message);
        },
      },
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
          clearPersistedUser();
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.user = null;
          clearPersistedUser();
          toast.success(action.payload.message);
        },
      },
    ),
    sessionExpired: create.reducer((state) => {
      state.user = null;
      clearPersistedUser();
    }),
  }),
});

export const { signup, verifyOtp, login, logout, sessionExpired } =
  authSlice.actions;
export default authSlice.reducer;
