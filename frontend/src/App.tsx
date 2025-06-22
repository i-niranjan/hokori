import ErrorBoundary from "./components/error-boundary";
import Navbar from "./components/navbar";
import Sidebar from "./components/sidebar";
import Dashboard from "./features/dashboard/pages/dashboard";
import { Routes, Route, Navigate } from "react-router";
import Template from "@/features/template/pages/Template";
import Insights from "./features/insights/pages/Insights";
import Settings from "./features/settings/pages/Settings";
import Auth from "./features/auth/pages/auth";
import { SignupForm } from "./features/auth/components/signup-form";
import Home from "./Home";
import MainLayout from "./MainLayout";
import { LoginForm } from "./features/auth/components/login-form";
function App() {
  const isLoggedIn = true;
  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route element={<MainLayout />}>
            <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard /> : <Navigate to="/auth" />}
            />
            <Route path="/dashboard" element={<Dashboard />} />
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
