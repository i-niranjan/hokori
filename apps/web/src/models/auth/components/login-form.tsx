import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useOutletContext } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../schema";
import { useState } from "react";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import type { AuthContextType } from "../pages/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur", resolver: zodResolver(loginSchema) });

  const { handleLogin } = useOutletContext<AuthContextType>();

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    const error = await handleLogin(data);
    if (error) setServerError(error.message);
  });

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Welcome back
        </h1>
        <p className="text-sm text-muted-foreground">
          Sign in to your Hokori account.
        </p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="grid gap-1.5">
          <Label htmlFor="identifier">Username or email</Label>
          <Input
            {...register("identifier")}
            id="identifier"
            type="text"
            placeholder="@codewithjohn / john@example.com"
            required
          />
          {errors.identifier && (
            <p className="text-xs text-destructive">
              {errors.identifier.message}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="text-xs text-muted-foreground underline-offset-4 hover:underline"
            >
              Forgot?
            </a>
          </div>
          <div className="relative">
            <Input
              {...register("password")}
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((p) => !p)}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <IconEye className="size-4" />
              ) : (
                <IconEyeClosed className="size-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        {serverError && (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          >
            {serverError}
          </p>
        )}

        <Button type="submit" className="mt-1 w-full" disabled={isSubmitting}>
          Sign in
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          to="/auth/signup"
          className="text-foreground underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </div>

      <p className="text-center text-xs text-muted-foreground">
        By continuing, you agree to our{" "}
        <a href="#" className="underline-offset-4 hover:underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="underline-offset-4 hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}
