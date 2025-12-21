import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { isTokenExpired } from "@/helpers/helper";
import { useAppDispatch } from "@/app/store";
import { logout } from "@/models/auth/features/authSlice";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/hooks";

const AuthGuard = () => {
  const token = useAppSelector((state) => state.auth.token);
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
