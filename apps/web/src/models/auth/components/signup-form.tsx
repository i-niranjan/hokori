import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useOutletContext } from "react-router";
import { useForm } from "react-hook-form";
import {
  IconCircleCheck,
  IconCircleX,
  IconEye,
  IconEyeClosed,
  IconLoader2,
} from "@tabler/icons-react";
import type { AuthContextType } from "../pages/auth";
import { useState } from "react";
import { signupSchema } from "../schema";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkEmail, checkUsername } from "@/services/publicService";
import {
  useAvailability,
  type AvailabilityStatus,
} from "@/hooks/use-availability";

type FormData = z.infer<typeof signupSchema>;

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;

const availabilityInputClass = (status: AvailabilityStatus) =>
  cn(
    status.state === "available" &&
      "border-emerald-500/70 focus-visible:border-emerald-500 focus-visible:ring-emerald-500/30",
    status.state === "taken" &&
      "border-destructive/60 focus-visible:border-destructive focus-visible:ring-destructive/20",
  );

function AvailabilityIcon({ status }: { status: AvailabilityStatus }) {
  return (
    <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
      {status.state === "checking" && (
        <IconLoader2 className="size-4 animate-spin text-muted-foreground" />
      )}
      {status.state === "available" && (
        <IconCircleCheck className="size-4 text-emerald-600 dark:text-emerald-500" />
      )}
      {status.state === "taken" && (
        <IconCircleX className="size-4 text-destructive" />
      )}
    </span>
  );
}

function AvailabilityMessage({ status }: { status: AvailabilityStatus }) {
  if (status.state === "taken") {
    return <p className="text-xs text-destructive">{status.message}</p>;
  }
  if (status.state === "available") {
    return (
      <p className="text-xs text-emerald-600 dark:text-emerald-500">
        {status.message}
      </p>
    );
  }
  return null;
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const username = useAvailability(checkUsername, {
    shouldCheck: (value) => value.length >= 3,
    availableMessage: "Username is available",
  });
  const email = useAvailability(checkEmail, {
    shouldCheck: (value) => EMAIL_PATTERN.test(value),
    availableMessage: "Email is good to go",
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onBlur",
    resolver: zodResolver(signupSchema),
  });

  const { handleSignup } = useOutletContext<AuthContextType>();

  const onSubmit = handleSubmit(async (data) => {
    setServerError(null);
    const error = await handleSignup(data);
    if (!error) return;
    if (error.fields?.userName) {
      setError("userName", { message: error.fields.userName });
    }
    if (error.fields?.email) {
      setError("email", { message: error.fields.email });
    }
    if (!error.fields) {
      setServerError(error.message);
    }
  });

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

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="grid gap-1.5">
          <Label htmlFor="userName">Username</Label>
          <div className="relative">
            <Input
              {...register("userName", {
                onChange: (e) => username.queueCheck(e.target.value),
              })}
              id="userName"
              type="text"
              placeholder="@codewithjohn"
              required
              className={availabilityInputClass(username.status)}
            />
            <AvailabilityIcon status={username.status} />
          </div>
          {errors.userName ? (
            <p className="text-xs text-destructive">
              {errors.userName.message}
            </p>
          ) : (
            <AvailabilityMessage status={username.status} />
          )}
        </div>

        <div className="grid gap-1.5">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Input
              {...register("email", {
                onChange: (e) => email.queueCheck(e.target.value),
              })}
              id="email"
              type="email"
              placeholder="you@example.com"
              required
              className={availabilityInputClass(email.status)}
            />
            <AvailabilityIcon status={email.status} />
          </div>
          {errors.email ? (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          ) : email.status.state === "taken" ? (
            <p className="text-xs text-destructive">
              {email.status.message}.{" "}
              <Link
                to="/auth/login"
                className="font-medium text-foreground underline-offset-2 hover:underline"
              >
                Sign in instead
              </Link>
            </p>
          ) : (
            <AvailabilityMessage status={email.status} />
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

        {serverError && (
          <p
            role="alert"
            className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
          >
            {serverError}
          </p>
        )}

        <Button
          type="submit"
          className="mt-1 w-full"
          disabled={
            isSubmitting ||
            username.status.state === "taken" ||
            email.status.state === "taken"
          }
        >
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
