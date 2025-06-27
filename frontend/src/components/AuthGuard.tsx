import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { isTokenExpired } from "@/helpers/helper";
import { type RootState, useAppDispatch } from "@/app/store";
import { logout } from "@/models/auth/features/authSlice";
import { toast } from "sonner";

const AuthGuard = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (token && isTokenExpired(token)) {
      toast("Session expired. Logging out.");
      dispatch(logout());
    }
  }, [token, dispatch]);

  if (!token || isTokenExpired(token)) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
};

export default AuthGuard;
