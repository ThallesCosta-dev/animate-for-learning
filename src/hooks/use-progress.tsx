import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_PROGRESS,
  loadProgress,
  saveProgress,
  type ProgressState,
} from "@/lib/progress";

export function useProgress() {
  const [state, setState] = useState<ProgressState>(DEFAULT_PROGRESS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setState(loadProgress());
    setLoaded(true);
  }, []);

  const update = useCallback((fn: (s: ProgressState) => ProgressState) => {
    setState((prev) => {
      const next = fn(prev);
      saveProgress(next);
      return next;
    });
  }, []);

  const toggleLesson = useCallback(
    (id: string) => {
      update((s) => ({
        ...s,
        completedLessons: s.completedLessons.includes(id)
          ? s.completedLessons.filter((l) => l !== id)
          : [...s.completedLessons, id],
        lastLesson: id,
      }));
    },
    [update]
  );

  const recordQuiz = useCallback(
    (score: number, total: number) => {
      update((s) => ({
        ...s,
        quizHistory: [
          ...s.quizHistory,
          { date: new Date().toISOString(), score, total },
        ],
      }));
    },
    [update]
  );

  const setChecklistItem = useCallback(
    (id: string, checked: boolean) => {
      update((s) => ({ ...s, checklist: { ...s.checklist, [id]: checked } }));
    },
    [update]
  );

  const resetChecklist = useCallback(() => {
    update((s) => ({ ...s, checklist: {} }));
  }, [update]);

  const setReduceMotion = useCallback(
    (value: boolean) => {
      update((s) => ({ ...s, reduceMotion: value }));
    },
    [update]
  );

  return {
    state,
    loaded,
    toggleLesson,
    recordQuiz,
    setChecklistItem,
    resetChecklist,
    setReduceMotion,
  };
}
