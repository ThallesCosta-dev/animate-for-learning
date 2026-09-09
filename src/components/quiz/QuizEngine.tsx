import { useMemo, useState } from "react";
import { PERGUNTAS, type Pergunta } from "@/lib/quiz-data";
import { useProgress } from "@/hooks/use-progress";

const AREAS = [
  { id: "todas", nome: "Todas as áreas" },
  { id: "aerodinamica", nome: "Aerodinâmica" },
  { id: "meteorologia", nome: "Meteorologia" },
  { id: "seguranca", nome: "Segurança" },
] as const;

// Quiz completo: seleção de área, perguntas, explicações, pontuação e histórico.
export function QuizEngine() {
  const { recordQuiz, state } = useProgress();
  const [area, setArea] = useState<string>("todas");
  const [iniciado, setIniciado] = useState(false);
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const perguntas = useMemo<Pergunta[]>(
    () => (area === "todas" ? PERGUNTAS : PERGUNTAS.filter((p) => p.area === area)),
    [area]
  );

  const iniciar = () => {
    setIniciado(true);
    setFinalizado(false);
    setIndice(0);
    setAcertos(0);
    setEscolha(null);
  };

  const proxima = () => {
    if (indice + 1 >= perguntas.length) {
      setFinalizado(true);
      recordQuiz(acertos, perguntas.length);
    } else {
      setIndice((i) => i + 1);
      setEscolha(null);
    }
  };

  const finalizar = () => {
    setFinalizado(true);
    recordQuiz(acertos, perguntas.length);
  };

  if (!iniciado) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Escolha o quiz</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {PERGUNTAS.length} perguntas no total, com explicação após cada resposta.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {AREAS.map((a) => {
            const n = a.id === "todas" ? PERGUNTAS.length : PERGUNTAS.filter((p) => p.area === a.id).length;
            return (
              <button
                key={a.id}
                type="button"
                aria-pressed={area === a.id}
                onClick={() => setArea(a.id)}
                className={`rounded-xl border p-4 text-left transition-colors ${
                  area === a.id ? "border-primary bg-accent" : "border-border hover:bg-accent/40"
                }`}
              >
                <span className="block font-semibold">{a.nome}</span>
                <span className="text-sm text-muted-foreground">{n} perguntas</span>
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={iniciar}
          className="mt-5 w-full rounded-xl bg-primary px-5 py-3 font-display font-bold text-primary-foreground"
        >
          Começar quiz
        </button>
        {state.quizHistory.length > 0 && (
          <p className="mt-3 text-sm text-muted-foreground">
            Última tentativa: {state.quizHistory[state.quizHistory.length - 1]!.score} de{" "}
            {state.quizHistory[state.quizHistory.length - 1]!.total} acertos.
          </p>
        )}
      </div>
    );
  }

  if (finalizado) {
    const pct = Math.round((acertos / perguntas.length) * 100);
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center" role="status">
        <p className="font-display text-4xl font-extrabold text-primary">
          {acertos} / {perguntas.length}
        </p>
        <p className="mt-2 text-lg font-semibold">{pct}% de acertos</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {pct >= 80
            ? "Excelente! Você domina os conceitos fundamentais."
            : pct >= 50
              ? "Bom caminho! Revise as aulas das áreas em que errou."
              : "Que tal revisitar as aulas e tentar de novo? Errar faz parte do aprendizado."}
        </p>
        <button
          type="button"
          onClick={() => setIniciado(false)}
          className="mt-5 rounded-xl bg-primary px-5 py-3 font-display font-bold text-primary-foreground"
        >
          Jogar novamente
        </button>
      </div>
    );
  }

  const p = perguntas[indice]!;
  const respondida = escolha !== null;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <p className="text-sm font-medium text-muted-foreground">
        Pergunta {indice + 1} de {perguntas.length}
      </p>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-border" aria-hidden>
        <div className="h-full bg-primary transition-all" style={{ width: `${((indice + 1) / perguntas.length) * 100}%` }} />
      </div>
      <h2 className="mt-4 font-display text-xl font-bold">{p.enunciado}</h2>
      <ul className="mt-4 space-y-2">
        {p.alternativas.map((alt, i) => {
          let cor = "border-border hover:bg-accent/40";
          if (respondida) {
            if (i === p.correta) cor = "border-forest bg-forest/15";
            else if (i === escolha) cor = "border-destructive bg-destructive/10";
            else cor = "border-border opacity-60";
          } else if (escolha === i) {
            cor = "border-primary bg-accent";
          }
          return (
            <li key={i}>
              <button
                type="button"
                disabled={respondida}
                onClick={() => {
                  setEscolha(i);
                  if (i === p.correta) setAcertos((a) => a + 1);
                }}
                className={`w-full rounded-lg border p-3 text-left transition-colors ${cor}`}
              >
                {alt}
              </button>
            </li>
          );
        })}
      </ul>
      {respondida && (
        <div className="mt-4 rounded-xl bg-accent/60 p-4" role="status" aria-live="polite">
          <p className="font-semibold">{escolha === p.correta ? "✅ Correto!" : "❌ Não foi dessa vez."}</p>
          <p className="mt-1 text-sm text-foreground/90">{p.explicacao}</p>
          <button
            type="button"
            onClick={indice + 1 >= perguntas.length ? finalizar : proxima}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            {indice + 1 >= perguntas.length ? "Ver resultado" : "Próxima pergunta"}
          </button>
        </div>
      )}
    </div>
  );
}
