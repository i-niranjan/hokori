import ErrorBoundary from "./components/error-boundary";

import { Routes, Route, useNavigate } from "react-router";
import { HelmetProvider } from "react-helmet-async";
import Auth from "./models/auth/pages/auth";
import { SignupForm } from "./models/auth/components/signup-form";
import Home from "./Home";
import MainLayout from "./MainLayout";
import { LoginForm } from "./models/auth/components/login-form";
import { VerifyOtpForm } from "./models/auth/components/verify-otp-form";
import AuthGuard from "./components/AuthGuard";
import { Toaster } from "./components/ui/sonner";
import { lazy, Suspense, useEffect } from "react";
import { setNavigator } from "./lib/navigation";
import { IconLoader2 } from "@tabler/icons-react";

const Dashboard = lazy(() => import("./models/dashboard/pages/dashboard"));
const Template = lazy(() => import("@/models/template/pages/Template"));
const Insights = lazy(() => import("./models/insights/pages/Insights"));
const Settings = lazy(() => import("./models/settings/pages/Settings"));
const PublicProfile = lazy(
  () => import("./models/public/pages/PublicProfile"),
);

const RouteFallback = () => (
  <div className="flex h-dvh w-full items-center justify-center">
    <IconLoader2 className="size-6 animate-spin text-muted-foreground" />
  </div>
);

function AppRoutes() {
  return (
    <>
      <ErrorBoundary showDetails={true}>
        <Suspense fallback={<RouteFallback />}>
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
              <Route path="verify" element={<VerifyOtpForm />} />
            </Route>

            {/* Public profile — must stay last so static routes win. */}
            <Route path="/:username" element={<PublicProfile />} />
          </Routes>
        </Suspense>
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
  return (
    <HelmetProvider>
      <AppInitializer />
    </HelmetProvider>
  );
}
