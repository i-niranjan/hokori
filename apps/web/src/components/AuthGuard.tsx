import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/lib/hooks";

/**
 * Auth lives in httpOnly cookies the client can't read; the persisted user
 * is the signal someone signed in. Expired sessions are caught by the API
 * interceptor (silent refresh, then redirect to login on failure).
 */
const AuthGuard = () => {
  const userId = useAppSelector((state) => state.auth.user?.userId);

  if (!userId) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
};

export default AuthGuard;
