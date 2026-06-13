import { navigate } from "@/lib/navigation";
import axios from "axios";

// Auth lives in httpOnly cookies; this instance just needs credentials on.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// store/authSlice are loaded lazily to break the circular import chain:
// store -> authSlice -> refresh -> store.
const expireSession = async () => {
  try {
    const [{ store }, { sessionExpired }] = await Promise.all([
      import("@/app/store"),
      import("@/models/auth/features/authSlice"),
    ]);
    store.dispatch(sessionExpired());
  } catch {
    // best-effort; localStorage is cleared below either way
  }
};

// ---- refresh lock (prevents multiple simultaneous refreshes)
let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

const processQueue = () => {
  pendingQueue.forEach((resolve) => resolve());
  pendingQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!original) return Promise.reject(error);

    const status = error?.response?.status;
    const isAuthRoute = original.url?.includes("/auth/");

    // Auth endpoints handle their own 401s (e.g. wrong password) — only
    // app requests should trigger a silent refresh.
    if (status === 401 && !original._retry && !isAuthRoute) {
      original._retry = true;

      if (isRefreshing) {
        // queue until the in-flight refresh finishes
        return new Promise((resolve) => {
          pendingQueue.push(() => resolve(api(original)));
        });
      }

      isRefreshing = true;
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true },
        );

        // The new access token cookie is set by the server.
        processQueue();
        isRefreshing = false;
        return api(original);
      } catch (refreshErr) {
        isRefreshing = false;
        pendingQueue = [];
        console.log("Refresh failed:", refreshErr);

        await expireSession();
        navigate("/auth/login");
      }
    }

    return Promise.reject(error);
  },
);

export default api;
