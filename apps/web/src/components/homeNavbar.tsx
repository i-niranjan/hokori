import { Link, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import HokoriMark from "@/components/hokori-mark";
import { useAppSelector } from "@/lib/hooks";

export default function HomeNavbar() {
  const isLoggedIn = useAppSelector((state) => !!state.auth.user?.userId);
  const navigate = useNavigate();

  return (
    <nav className="w-full">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-2">
        <Link to="/" className="flex items-center">
          <HokoriMark size="md" />
        </Link>

        <div className="flex items-center gap-2">
          <ModeToggle />
          {isLoggedIn ? (
            <Button size="sm" onClick={() => navigate("/dashboard")}>
              Launchpad
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => navigate("/auth/login")}
              >
                Sign in
              </Button>
              <Button size="sm" onClick={() => navigate("/auth/signup")}>
                Get started
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
