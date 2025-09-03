import type { UserSchema, Login } from "@/models/auth/authTypes";

import { toast } from "sonner";
import { createAppSlice } from "@/app/createAppSlice";
import api from "../refresh";
import { jwtDecode } from "jwt-decode";

interface UserState {
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
    }),
    signup: create.asyncThunk(
      async (data: UserSchema, { dispatch, rejectWithValue }) => {
        try {
          const res = await api.post(`/auth/signup`, data);
          const { token } = res.data;
          scheduleAutoLogout(token, dispatch);
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
      async (data: Login, { dispatch, rejectWithValue }) => {
        try {
          const res = await api.post(`/auth/login`, data);
          const { token } = res.data;
          scheduleAutoLogout(token, dispatch);
          return res.data;
        } catch (error: any) {
          console.log("Caught error:", error);

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
    logout: create.asyncThunk(
      async (_, { rejectWithValue }) => {
        try {
          // Optional: Call logout API endpoint if your backend requires it
          // const token = localStorage.getItem("token");
          // if (token) {
          //   await axios.post(`${API_URL}/auth/logout`, {}, {
          //     headers: { Authorization: `Bearer ${token}` }
          //   });
          // }

          return { message: "Logged out successfully" };
        } catch (error: any) {
          console.log("Logout error:", error.response?.data);
          // Even if API call fails, we should still clear local storage
          return { message: "Logged out successfully" };
        }
      },
      {
        pending: (state) => {
          state.loading = true;
        },
        rejected: (state) => {
          state.loading = false;
          // Clear state and localStorage even on rejection
          state.user = null;
          state.token = null;
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          localStorage.removeItem("firstName");
          localStorage.removeItem("lastName");
          toast.error("Logout failed, but you've been logged out locally");
        },
        fulfilled: (state, action) => {
          state.loading = false;
          state.user = null;
          state.token = null;
          localStorage.removeItem("token");
          localStorage.removeItem("email");
          localStorage.removeItem("firstName");
          localStorage.removeItem("lastName");
          toast.success(action.payload.message);
        },
      }
    ),
  }),
});

function scheduleAutoLogout(token: string, dispatch: any) {
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const expiry = decoded.exp * 1000 - Date.now();

    if (expiry > 0) {
      setTimeout(() => {
        dispatch(logout()); // use your slice logout
      }, expiry);
    } else {
      dispatch(logout());
    }
  } catch (err) {
    console.error("Invalid token:", err);
    dispatch(logout());
  }
}

export const { signup, login, logout } = authSlice.actions;
export default authSlice.reducer;
