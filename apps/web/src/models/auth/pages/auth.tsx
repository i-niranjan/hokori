import { Link, Outlet } from "react-router";
import { signup, login } from "../features/authSlice";
import type { Login, UserSchema } from "../authTypes";
import { useAppDispatch } from "@/app/store";
import { navigate } from "@/lib/navigation";
import HokoriMark from "@/components/hokori-mark";
import { ModeToggle } from "@/components/mode-toggle";

export type AuthContextType = {
  handleLogin: (data: Login) => void;
  handleSignup: (data: UserSchema) => void;
};

function Auth() {
  const dispatch = useAppDispatch();

  const handleLogin = async (data: Login) => {
    try {
      await dispatch(login(data)).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Failed", error);
    }
  };
  const handleSignup = async (data: UserSchema) => {
    try {
      await dispatch(signup(data)).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.error("Signup Failed", error);
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
              小さな一歩が、
              <br />
              誇れる未来をつくる。
            </p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Small steps build a future you&apos;re proud of.
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
              <Outlet context={{ handleLogin, handleSignup }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Auth;
