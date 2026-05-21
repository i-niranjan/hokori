import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useOutletContext } from "react-router";
import { useForm } from "react-hook-form";
import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import type { AuthContextType } from "../pages/auth";
import { useState } from "react";
import { signupSchema } from "../schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof signupSchema>;

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    mode: "onBlur",
    resolver: zodResolver(signupSchema),
  });

  const { handleSignup } = useOutletContext<AuthContextType>();

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Create your Hokori
        </h1>
        <p className="text-sm text-muted-foreground">
          Start your page. It takes a minute.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleSignup)}
        className="flex flex-col gap-5"
      >
        <div className="grid gap-1.5">
          <Label htmlFor="userName">Username</Label>
          <Input
            {...register("userName")}
            id="userName"
            type="text"
            placeholder="@codewithjohn"
            required
          />
          {errors.userName && (
            <p className="text-xs text-destructive">
              {errors.userName.message}
            </p>
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            {...register("email")}
            id="email"
            type="email"
            placeholder="you@example.com"
            required
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1.5">
            <Label htmlFor="firstName">First name</Label>
            <Input
              {...register("firstName")}
              id="firstName"
              type="text"
              placeholder="John"
              required
            />
            {errors.firstName && (
              <p className="text-xs text-destructive">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="lastName">Last name</Label>
            <Input
              {...register("lastName")}
              id="lastName"
              type="text"
              placeholder="Doe"
              required
            />
            {errors.lastName && (
              <p className="text-xs text-destructive">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="password">Password</Label>
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

        <Button type="submit" className="mt-1 w-full">
          Create account
        </Button>
      </form>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-foreground underline-offset-4 hover:underline"
        >
          Sign in
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
