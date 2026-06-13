import { useEffect, useRef, useState } from "react";
import type { AvailabilityResult } from "@/services/publicService";

export type AvailabilityStatus =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "available"; message: string }
  | { state: "taken"; message: string };

interface UseAvailabilityOptions {
  /** Skip the network entirely while this returns false. */
  shouldCheck(value: string): boolean;
  availableMessage: string;
  debounceMs?: number;
}

/**
 * Debounced, cancellable, memoized availability check for signup fields:
 * one request per typing pause, in-flight requests aborted on new input,
 * previously-seen values answered from an in-memory cache.
 */
export function useAvailability(
  fetcher: (value: string, signal: AbortSignal) => Promise<AvailabilityResult>,
  { shouldCheck, availableMessage, debounceMs = 450 }: UseAvailabilityOptions,
) {
  const [status, setStatus] = useState<AvailabilityStatus>({ state: "idle" });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const cacheRef = useRef(new Map<string, AvailabilityResult>());

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, []);

  const applyResult = (result: AvailabilityResult) => {
    setStatus(
      result.available
        ? { state: "available", message: availableMessage }
        : { state: "taken", message: result.message },
    );
  };

  const queueCheck = (raw: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    abortRef.current?.abort();

    const value = raw.trim();
    if (!shouldCheck(value)) {
      setStatus({ state: "idle" });
      return;
    }

    const cached = cacheRef.current.get(value);
    if (cached) {
      applyResult(cached);
      return;
    }

    setStatus({ state: "checking" });
    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      try {
        const result = await fetcher(value, controller.signal);
        cacheRef.current.set(value, result);
        applyResult(result);
      } catch {
        // Aborted or network hiccup: stay quiet, signup still validates.
        if (!controller.signal.aborted) setStatus({ state: "idle" });
      }
    }, debounceMs);
  };

  return { status, queueCheck };
}
