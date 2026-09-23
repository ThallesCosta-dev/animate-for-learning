import { createContext } from "react";
import type { ProgressState } from "@/lib/progress";

export interface ProgressContextValue {
  state: ProgressState;
  /** false até o localStorage ser lido no cliente (evita piscar valores zerados). */
  loaded: boolean;
  toggleLesson: (id: string) => void;
  recordQuiz: (score: number, total: number) => void;
  setChecklistItem: (id: string, checked: boolean) => void;
  resetChecklist: () => void;
  setReduceMotion: (value: boolean) => void;
}

export const ProgressContext = createContext<ProgressContextValue | null>(null);
