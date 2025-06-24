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
function App() {
  const isLoggedIn = false;
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
      </ErrorBoundary>
    </>
  );
}

export default App;
