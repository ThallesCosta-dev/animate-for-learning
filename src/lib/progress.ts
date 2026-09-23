// Persistência de progresso no navegador (localStorage).
// Todas as funções são seguras para SSR: não tocam em `window` fora de efeitos.
export const STORAGE_KEY = "parapente-lab-v1";

export interface QuizEntry {
  date: string;
  score: number;
  total: number;
}

export interface ProgressState {
  completedLessons: string[];
  quizHistory: QuizEntry[];
  checklist: Record<string, boolean>;
  reduceMotion: boolean;
}

export const DEFAULT_PROGRESS: ProgressState = {
  completedLessons: [],
  quizHistory: [],
  checklist: {},
  reduceMotion: false,
};

export function loadProgress(): ProgressState {
  if (typeof window === "undefined") return DEFAULT_PROGRESS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      quizHistory: Array.isArray(parsed.quizHistory) ? parsed.quizHistory : [],
      checklist: parsed.checklist && typeof parsed.checklist === "object" ? parsed.checklist : {},
      reduceMotion: parsed.reduceMotion === true,
    };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(state: ProgressState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // armazenamento cheio ou bloqueado: ignora silenciosamente
  }
}
