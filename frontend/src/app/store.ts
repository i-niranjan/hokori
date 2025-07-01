import { configureStore } from "@reduxjs/toolkit";
import authSlice from "@/models/auth/features/authSlice";
import { useDispatch } from "react-redux";
import profileSlice from "@/models/blocks/features/profileSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    profile: profileSlice,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
