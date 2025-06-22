import { isTokenExpired } from "@/helpers/helper";
import {
  createApi,
  fetchBaseQuery,
  type BaseQueryApi,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "@/app/store";
import { logout } from "./authSlice";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as RootState;
    const token = state.auth.token;
    if (token && !isTokenExpired(token)) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});
const customBaseQuery = async (
  args: Parameters<typeof baseQuery>[0],
  api: BaseQueryApi,
  extraOptions: Parameters<typeof baseQuery>[2]
) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    api.dispatch(logout());
    toast(`Session Expired. Please Try Again`);
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: customBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "api/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    getProfile: builder.query({
      query: () => "api/auth/profile",
    }),
  }),
});

export const { useLoginMutation, useGetProfileQuery } = authApi;
