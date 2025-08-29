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
import AuthGuard from "./components/AuthGuard";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <>
      <ErrorBoundary showDetails={true}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route element={<AuthGuard />}>
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />

              <Route path="/template" element={<Template />} />
              <Route path="/insight" element={<Insights />} />
              <Route path="/setting" element={<Settings />} />
            </Route>
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
