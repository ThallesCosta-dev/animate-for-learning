import { useSyncExternalStore } from "react";
import { useProgress } from "@/hooks/use-progress";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

/** true se o sistema OU a preferência salva no app pedirem menos movimento. */
export function useReducedMotion(): boolean {
  const sistema = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const { state } = useProgress();
  return sistema || state.reduceMotion;
}
