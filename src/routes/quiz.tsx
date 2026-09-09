import { createFileRoute } from "@tanstack/react-router";
import { QuizEngine } from "@/components/quiz/QuizEngine";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz de parapente — Parapente Lab" },
      {
        name: "description",
        content:
          "Teste seus conhecimentos sobre aerodinâmica, meteorologia e segurança no parapente com perguntas explicadas e histórico de pontuação.",
      },
      { property: "og:title", content: "Quiz de parapente — Parapente Lab" },
      {
        property: "og:description",
        content:
          "12 perguntas com explicações para testar o que você aprendeu sobre parapente.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: QuizPage,
});

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
        <section className="mt-8 rounded-xl border border-border bg-card p-5" aria-labelledby="hist-titulo">
          <h2 id="hist-titulo" className="font-display text-lg font-bold">
            Suas últimas tentativas
          </h2>
          <ul className="mt-3 space-y-2 text-sm">
            {historico.map((h, i) => {
              const pct = Math.round((h.score / h.total) * 100);
              return (
                <li key={i} className="flex items-center justify-between gap-3 rounded-lg bg-secondary/60 px-3 py-2">
                  <span>
                    {h.score} de {h.total} acertos
                  </span>
                  <span className={`font-bold ${pct >= 80 ? "text-forest" : pct >= 50 ? "text-thermal" : "text-destructive"}`}>
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
