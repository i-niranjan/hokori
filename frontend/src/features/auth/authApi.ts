import { isTokenExpired } from "@/helpers/helper";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./authSlice";
import { toast } from "sonner";
const API_URL = import.meta.env.VITE_API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
  },
});
