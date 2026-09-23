import { createFileRoute } from "@tanstack/react-router";
import { QuizEngine } from "@/components/quiz/QuizEngine";
import { useProgress } from "@/hooks/use-progress";
import { PERGUNTAS } from "@/lib/quiz-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/quiz")({
  head: () =>
    seo({
      titulo: "Quiz de parapente",
      descricao: `${PERGUNTAS.length} perguntas com explicações — múltipla escolha, verdadeiro ou falso e cenários — para testar o que você aprendeu sobre aerodinâmica, meteorologia e segurança no parapente.`,
      path: "/quiz",
    }),
  component: QuizPage,
});

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

function QuizPage() {
  const { state } = useProgress();
  const historico = state.quizHistory.slice(-5).reverse();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold">Quiz</h1>
      <p className="mt-2 text-muted-foreground">
        Teste o que aprendeu. Cada resposta vem com explicação — errar também ensina.
      </p>

      <div className="mt-6">
        <QuizEngine />
      </div>

      {historico.length > 0 && (
        <section
          className="mt-8 rounded-xl border border-border bg-card p-5"
          aria-labelledby="hist-titulo"
        >
          <h2 id="hist-titulo" className="font-display text-lg font-bold">
            Suas últimas tentativas
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {historico.map((h) => {
              const pct = Math.round((h.score / h.total) * 100);
              return (
                <li
                  key={h.date}
                  className="flex items-center justify-between gap-3 rounded-lg bg-secondary/60 px-3 py-2"
                >
                  <span>
                    <span className="text-muted-foreground">{formatarData(h.date)} · </span>
                    {h.score} de {h.total} acertos
                  </span>
                  <span
                    className={`font-bold ${pct >= 80 ? "text-forest" : pct >= 50 ? "text-thermal" : "text-destructive"}`}
                  >
                    {pct}%
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </div>
  );
}
