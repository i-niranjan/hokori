import { useEffect, useRef, useState } from "react";
import { Link, useOutletContext, useSearchParams } from "react-router";
import { toast } from "sonner";
import { IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useAppDispatch } from "@/app/store";
import { useAppSelector } from "@/lib/hooks";
import { verifyOtp } from "../features/authSlice";
import api from "../refresh";
import { navigate } from "@/lib/navigation";
import type { AuthContextType } from "../pages/auth";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

export function VerifyOtpForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [params] = useSearchParams();
  const email = params.get("email") ?? "";
  const { pendingSignup: signupData } = useOutletContext<AuthContextType>();
  const dispatch = useAppDispatch();
  const loading = useAppSelector((state) => state.auth.loading);

  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [cooldown, setCooldown] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((s) => s - 1), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const submit = async (code: string) => {
    if (!signupData || signupData.email !== email) {
      toast.error("Please sign up again before verifying your email");
      navigate("/auth/signup", { replace: true });
      return;
    }
    try {
      await dispatch(verifyOtp({ ...signupData, code })).unwrap();
      navigate("/dashboard");
    } catch {
      setDigits(Array(CODE_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    }
  };

  const setDigit = (index: number, value: string) => {
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    if (value && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
    const code = next.join("");
    if (code.length === CODE_LENGTH && next.every(Boolean)) {
      submit(code);
    }
  };

  const handleChange = (index: number, raw: string) => {
    const value = raw.replace(/\D/g, "");
    if (!value) {
      setDigit(index, "");
      return;
    }
    if (value.length === 1) {
      setDigit(index, value);
      return;
    }
    // Pasted a longer string: spread it across the boxes.
    const next = [...digits];
    value
      .slice(0, CODE_LENGTH - index)
      .split("")
      .forEach((char, offset) => {
        next[index + offset] = char;
      });
    setDigits(next);
    const lastFilled = Math.min(index + value.length, CODE_LENGTH) - 1;
    inputsRef.current[lastFilled]?.focus();
    if (next.every(Boolean)) submit(next.join(""));
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    try {
      const res = await api.post("/auth/resend-otp", { email });
      toast(res.data.message);
      setCooldown(RESEND_SECONDS);
    } catch {
      toast.error("Couldn't resend the code, try again in a moment");
    } finally {
      setResending(false);
    }
  };

  if (!email || !signupData || signupData.email !== email) {
    return (
      <div className="flex flex-col gap-3 text-center">
        <h1 className="font-display text-2xl font-semibold">
          Something's missing
        </h1>
        <p className="text-sm text-muted-foreground">
          Please sign up again so we can create your account after verification.{" "}
          <Link to="/auth/signup" className="text-foreground underline">
            Sign up again
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-8", className)} {...props}>
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Check your email
        </h1>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>. It
          expires in 10 minutes.
        </p>
      </div>

      <div className="flex justify-between gap-2">
        {digits.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onFocus={(e) => e.target.select()}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            aria-label={`Digit ${index + 1}`}
            disabled={loading}
            className="size-12 p-0 text-center !text-xl font-semibold"
          />
        ))}
      </div>

      <Button
        className="w-full"
        disabled={loading || digits.some((d) => !d)}
        onClick={() => submit(digits.join(""))}
      >
        {loading && <IconLoader2 className="size-4 animate-spin" />}
        Verify email
      </Button>

      <div className="text-center text-sm text-muted-foreground">
        Didn't get it?{" "}
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0 || resending}
          className="text-foreground underline-offset-4 enabled:hover:underline disabled:cursor-not-allowed disabled:opacity-60"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
        </button>
      </div>
    </div>
  );
}
