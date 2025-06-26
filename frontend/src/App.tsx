import ErrorBoundary from "./components/error-boundary";

import Dashboard from "./models/dashboard/pages/dashboard";
import { Routes, Route, Navigate } from "react-router";
import Template from "@/models/template/pages/Template";
import Insights from "./models/insights/pages/Insights";
import Settings from "./models/settings/pages/Settings";
import Auth from "./models/auth/pages/auth";
import { SignupForm } from "./models/auth/components/signup-form";
import Home from "./Home";
import MainLayout from "./MainLayout";
import { LoginForm } from "./models/auth/components/login-form";
import { Toaster } from "./components/ui/sonner";
import { useSelector } from "react-redux";
import { useAppDispatch, type RootState } from "./app/store";
import { isTokenExpired } from "./helpers/helper";
import { useEffect, useState } from "react";
import { logout } from "./models/auth/features/authSlice";
import { toast } from "sonner";

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const dispatch = useAppDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  useEffect(() => {
    const tokenCheck = async (token: string) => {
      try {
        const expired = isTokenExpired(token);
        if (!expired) {
          setLoggedIn(true);
        } else {
          toast("Token Expired, Logging out");
          await dispatch(logout()).unwrap();
        }
      } catch (error) {
        console.error("Invalid token:", error);
      }
    };
    if (token) tokenCheck(token);
  }, [token]);

  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<MainLayout />}>
            <Route
              path="/dashboard"
              element={
                isLoggedIn ? <Dashboard /> : <Navigate to="/auth/login" />
              }
            />

            <Route path="/template" element={<Template />} />
            <Route path="/insight" element={<Insights />} />
            <Route path="/setting" element={<Settings />} />
          </Route>

          <Route path="/auth" element={<Auth />}>
            <Route path="login" element={<LoginForm className="w-1/2" />} />
            <Route path="signup" element={<SignupForm className="w-1/2" />} />
          </Route>
        </Routes>
        <Toaster />
      </ErrorBoundary>
    </>
  );
}

export default App;
