import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  DEFAULT_PROGRESS,
  STORAGE_KEY,
  loadProgress,
  saveProgress,
  type ProgressState,
} from "@/lib/progress";
import { ProgressContext, type ProgressContextValue } from "@/lib/progress-context";

// Fonte única de verdade do progresso. Todos os componentes leem e escrevem
// no mesmo estado, então nenhuma instância sobrescreve o que outra salvou.
export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(loadProgress());
    setLoaded(true);
    // Mantém abas diferentes sincronizadas.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setState(loadProgress());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const update = useCallback((fn: (s: ProgressState) => ProgressState) => {
    setState((prev) => {
      const next = fn(prev);
      saveProgress(next);
      return next;
    });
  }, []);

  const value = useMemo<ProgressContextValue>(
    () => ({
      state,
      loaded,
      toggleLesson: (id) =>
        update((s) => ({
          ...s,
          completedLessons: s.completedLessons.includes(id)
            ? s.completedLessons.filter((l) => l !== id)
            : [...s.completedLessons, id],
        })),
      recordQuiz: (score, total) =>
        update((s) => ({
          ...s,
          quizHistory: [...s.quizHistory, { date: new Date().toISOString(), score, total }],
        })),
      setChecklistItem: (id, checked) =>
        update((s) => ({ ...s, checklist: { ...s.checklist, [id]: checked } })),
      resetChecklist: () => update((s) => ({ ...s, checklist: {} })),
      setReduceMotion: (reduceMotion) => update((s) => ({ ...s, reduceMotion })),
    }),
    [state, loaded, update],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
