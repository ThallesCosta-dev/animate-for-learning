import { useContext } from "react";
import { ProgressContext } from "@/lib/progress-context";

export function useProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress precisa estar dentro de <ProgressProvider>.");
  }
  return ctx;
}
