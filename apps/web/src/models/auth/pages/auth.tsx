import { Link, Outlet } from "react-router";
import { signup, login, type ApiAuthError } from "../features/authSlice";
import type { Login, UserSchema } from "../authTypes";
import { useAppDispatch } from "@/app/store";
import { navigate } from "@/lib/navigation";
import HokoriMark from "@/components/hokori-mark";
import { ModeToggle } from "@/components/mode-toggle";
import { useState } from "react";

export type AuthContextType = {
  /** Returns the API error for inline display, or null on success. */
  handleLogin: (data: Login) => Promise<ApiAuthError | null>;
  handleSignup: (data: UserSchema) => Promise<ApiAuthError | null>;
  pendingSignup: UserSchema | null;
};

function Auth() {
  const dispatch = useAppDispatch();
  const [pendingSignup, setPendingSignup] = useState<UserSchema | null>(null);

  const handleLogin = async (data: Login): Promise<ApiAuthError | null> => {
    try {
      await dispatch(login(data)).unwrap();
      navigate("/dashboard");
      return null;
    } catch (error) {
      const apiError = error as ApiAuthError;
      if (apiError?.code === "EMAIL_NOT_VERIFIED" && apiError.email) {
        navigate(`/auth/verify?email=${encodeURIComponent(apiError.email)}`);
        return null;
      }
      return apiError ?? { message: "Login failed" };
    }
  };
  const handleSignup = async (
    data: UserSchema,
  ): Promise<ApiAuthError | null> => {
    try {
      const result = await dispatch(signup(data)).unwrap();
      setPendingSignup(data);
      navigate(`/auth/verify?email=${encodeURIComponent(result.email)}`);
      return null;
    } catch (error) {
      return (error as ApiAuthError) ?? { message: "Signup failed" };
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen lg:grid-cols-2">
        <aside className="hidden flex-col justify-between border-r bg-sidebar p-10 lg:flex">
          <Link to="/" className="w-fit">
            <HokoriMark size="lg" />
          </Link>
          <div className="flex flex-col gap-4">
            <p className="font-display text-3xl leading-snug text-foreground">
              Small steps build
              <br />a future you&apos;re proud of.
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            © Hokori — Pride in your journey.
          </p>
        </aside>

        <main className="flex flex-col">
          <header className="flex items-center justify-between border-b px-6 py-4 lg:border-b-0">
            <Link to="/" className="lg:hidden">
              <HokoriMark size="sm" />
            </Link>
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
            </div>
          </header>
          <div className="flex flex-1 items-center justify-center px-6 py-12">
            <div className="w-full max-w-sm">
              <Outlet context={{ handleLogin, handleSignup, pendingSignup }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Auth;
