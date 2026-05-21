import ErrorBoundary from "./components/error-boundary";

import Dashboard from "./models/dashboard/pages/dashboard";
import { Routes, Route, useNavigate } from "react-router";
import Template from "@/models/template/pages/Template";
import Insights from "./models/insights/pages/Insights";
import Settings from "./models/settings/pages/Settings";
import Auth from "./models/auth/pages/auth";
import { SignupForm } from "./models/auth/components/signup-form";
import Home from "./Home";
import MainLayout from "./MainLayout";
import { LoginForm } from "./models/auth/components/login-form";
import AuthGuard from "./components/AuthGuard";
import { Toaster } from "./components/ui/sonner";
import { useEffect } from "react";
import { setNavigator } from "./lib/navigation";

function AppRoutes() {
  return (
    <>
      <ErrorBoundary showDetails={true}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AuthGuard />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/templates" element={<Template />} />
              <Route path="/insights" element={<Insights />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="/auth" element={<Auth />}>
            <Route path="login" element={<LoginForm />} />
            <Route path="signup" element={<SignupForm />} />
          </Route>
        </Routes>
        <Toaster />
      </ErrorBoundary>
    </>
  );
}
function AppInitializer() {
  const nav = useNavigate();

  useEffect(() => {
    setNavigator(nav);
  }, [nav]);

  return <AppRoutes />;
}

export default function App() {
  return <AppInitializer />;
}
