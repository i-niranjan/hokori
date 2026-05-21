import { navigate } from "@/lib/navigation";
import axios from "axios";

import { tokenRefreshed, logout } from "@/models/auth/features/authSlice";
import { store } from "@/app/store";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ---- attach token on each request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ---- refresh lock (prevents multiple simultaneous refreshes)
let isRefreshing = false;
let pendingQueue: Array<(t: string) => void> = [];

const processQueue = (newToken: string) => {
  pendingQueue.forEach((resolve) => resolve(newToken));
  pendingQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    if (!original) return Promise.reject(error);

    const status = error?.response?.status;

    // only handle 401 once per request
    if (status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        // queue until a refresh finishes
        return new Promise((resolve) => {
          pendingQueue.push((newToken) => {
            original.headers = original.headers ?? {};
            original.headers["Authorization"] = `Bearer ${newToken}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        // normalize field name
        const newToken: string = res.data.accessToken ?? res.data.token;

        if (!newToken) throw new Error("No accessToken in refresh response");

        // persist + set defaults
        localStorage.setItem("token", newToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

        // update Redux state
        store.dispatch(tokenRefreshed(newToken));

        // flush queue
        processQueue(newToken);
        isRefreshing = false;

        // retry original
        original.headers = original.headers ?? {};
        original.headers["Authorization"] = `Bearer ${newToken}`;
        return api(original);
      } catch (refreshErr) {
        isRefreshing = false;
        pendingQueue = [];
        console.log("Refresh failed:", refreshErr);

        // clear and route to login
        localStorage.clear();
        try {
          store.dispatch(logout());
        } catch {
          // thunk may not be available in all contexts; clearing is best-effort
        }
        navigate("/auth/login");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
