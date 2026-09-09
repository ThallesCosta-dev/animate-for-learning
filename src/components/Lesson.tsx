import { useState, type ReactNode } from "react";
import { useProgress } from "@/hooks/use-progress";

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface LessonProps {
  id: string;
  number: string;
  title: string;
  pergunta: string;
  explicacao: ReactNode;
  children: ReactNode; // simulação / animação
  resumo: string[];
  quiz?: QuizQuestion;
  nota?: string;
}

// Formato pedagógico padrão: pergunta → animação → explicação → experimentação → resumo → mini quiz
export function Lesson({
  id,
  number,
  title,
  pergunta,
  explicacao,
  children,
  resumo,
  quiz,
  nota,
}: LessonProps) {
  const { state, toggleLesson } = useProgress();
  const done = state.completedLessons.includes(id);

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-24 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8"
    >
      <p className="text-xs font-semibold tracking-widest text-primary uppercase">
        Aula {number}
      </p>
      <h2 id={`${id}-title`} className="mt-1 text-2xl font-bold text-foreground">
        {title}
      </h2>

      <div className="mt-4 rounded-xl bg-accent/60 p-4">
        <p className="text-sm font-semibold text-accent-foreground">
          💭 Pergunta para começar
        </p>
        <p className="mt-1 text-lg font-medium text-foreground">{pergunta}</p>
      </div>

      <div className="mt-6">{children}</div>

      <div className="mt-6 space-y-3 text-base leading-relaxed text-foreground/90">
        {explicacao}
      </div>

      {nota && (
        <p className="mt-4 rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground">
          {nota}
        </p>
      )}

      <div className="mt-6 rounded-xl bg-secondary p-4">
        <p className="text-sm font-semibold text-secondary-foreground">
          📌 Resumo — o que lembrar
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-foreground">
          {resumo.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      {quiz && <MiniQuiz quiz={quiz} />}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => toggleLesson(id)}
          aria-pressed={done}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            done
              ? "bg-forest text-forest-foreground"
              : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {done ? "✓ Aula concluída" : "Marcar como concluída"}
        </button>
        {done && (
          <span className="text-sm text-forest">Salvo no seu progresso</span>
        )}
      </div>
    </section>
  );
}

export function MiniQuiz({ quiz }: { quiz: QuizQuestion }) {
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const correct = selected === quiz.answer;

  return (
    <div className="mt-6 rounded-xl border border-primary/30 bg-primary/5 p-4">
      <p className="text-sm font-semibold text-primary">✏️ Mini quiz</p>
      <p className="mt-1 font-medium text-foreground">{quiz.question}</p>
      <div className="mt-3 grid gap-2">
        {quiz.options.map((opt, i) => {
          let style = "border-border bg-card hover:border-primary/50";
          if (answered) {
            if (i === quiz.answer) style = "border-forest bg-forest/15";
            else if (i === selected) style = "border-destructive bg-destructive/10";
            else style = "border-border bg-card opacity-60";
          }
          return (
            <button
              key={opt}
              type="button"
              disabled={answered}
              onClick={() => setSelected(i)}
              className={`rounded-lg border px-3 py-2 text-left text-sm transition-colors ${style}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {answered && (
        <div
          className={`mt-3 rounded-lg p-3 text-sm ${
            correct
              ? "bg-forest/15 text-foreground"
              : "bg-destructive/10 text-foreground"
          }`}
          role="status"
        >
          <p className="font-semibold">
            {correct ? "✓ Correto!" : "✗ Ainda não — veja por quê:"}
          </p>
          <p className="mt-1">{quiz.explanation}</p>
        </div>
      )}
    </div>
  );
}
