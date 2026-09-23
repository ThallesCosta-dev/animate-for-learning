import { useState } from "react";
import { PERGUNTAS, type AreaQuiz, type Pergunta } from "@/lib/quiz-data";
import { useProgress } from "@/hooks/use-progress";
import { embaralhar, ordemAleatoria } from "@/lib/shuffle";

const AREAS: { id: AreaQuiz | "todas"; nome: string }[] = [
  { id: "todas", nome: "Todas as áreas" },
  { id: "aerodinamica", nome: "Aerodinâmica" },
  { id: "meteorologia", nome: "Meteorologia" },
  { id: "seguranca", nome: "Segurança" },
];

const TIPO_ROTULO: Record<Pergunta["tipo"], string> = {
  multipla: "Múltipla escolha",
  vf: "Verdadeiro ou falso",
  cenario: "Cenário",
};

function contar(area: AreaQuiz | "todas") {
  return area === "todas" ? PERGUNTAS.length : PERGUNTAS.filter((p) => p.area === area).length;
}

/** Embaralha perguntas e, exceto em verdadeiro/falso, também as alternativas. */
function montarQuiz(area: AreaQuiz | "todas"): Pergunta[] {
  const base = area === "todas" ? PERGUNTAS : PERGUNTAS.filter((p) => p.area === area);
  return embaralhar(base).map((p) => {
    if (p.tipo === "vf") return p;
    const ordem = ordemAleatoria(p.alternativas.length);
    return {
      ...p,
      alternativas: ordem.map((i) => p.alternativas[i]!),
      correta: ordem.indexOf(p.correta),
    };
  });
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

// Quiz completo: seleção de área, perguntas, explicações, pontuação e histórico.
export function QuizEngine() {
  const { recordQuiz, state } = useProgress();
  const [area, setArea] = useState<AreaQuiz | "todas">("todas");
  const [perguntas, setPerguntas] = useState<Pergunta[] | null>(null);
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const [acertos, setAcertos] = useState(0);
  const [finalizado, setFinalizado] = useState(false);

  const iniciar = () => {
    setPerguntas(montarQuiz(area));
    setFinalizado(false);
    setIndice(0);
    setAcertos(0);
    setEscolha(null);
  };

  const avancar = () => {
    if (!perguntas) return;
    if (indice + 1 >= perguntas.length) {
      setFinalizado(true);
      recordQuiz(acertos, perguntas.length);
    } else {
      setIndice((i) => i + 1);
      setEscolha(null);
    }
  };

  const ultima = state.quizHistory[state.quizHistory.length - 1];

  if (!perguntas) {
    return (
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-xl font-bold">Escolha o quiz</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {PERGUNTAS.length} perguntas no total — múltipla escolha, verdadeiro ou falso e cenários —
          com explicação após cada resposta. A ordem muda a cada tentativa.
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {AREAS.map((a) => (
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
              <span className="text-sm text-muted-foreground">{contar(a.id)} perguntas</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={iniciar}
          className="mt-5 w-full rounded-xl bg-primary px-5 py-3 font-display font-bold text-primary-foreground"
        >
          Começar quiz
        </button>
        {ultima && (
          <p className="mt-3 text-sm text-muted-foreground">
            Última tentativa ({formatarData(ultima.date)}): {ultima.score} de {ultima.total}{" "}
            acertos.
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
          onClick={() => setPerguntas(null)}
          className="mt-5 rounded-xl bg-primary px-5 py-3 font-display font-bold text-primary-foreground"
        >
          Jogar novamente
        </button>
      </div>
    );
  }

  const p = perguntas[indice]!;
  const respondida = escolha !== null;
  const ultimaPergunta = indice + 1 >= perguntas.length;

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">
          Pergunta {indice + 1} de {perguntas.length}
        </p>
        <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground">
          {TIPO_ROTULO[p.tipo]}
        </span>
      </div>
      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-border" aria-hidden>
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((indice + 1) / perguntas.length) * 100}%` }}
        />
      </div>
      {p.situacao && (
        <p className="mt-4 rounded-lg bg-accent/60 p-3 text-sm text-foreground/90">{p.situacao}</p>
      )}
      <h2 className="mt-4 font-display text-xl font-bold">{p.enunciado}</h2>
      <ul className="mt-4 space-y-2">
        {p.alternativas.map((alt, i) => {
          let cor = "border-border hover:bg-accent/40";
          if (respondida) {
            if (i === p.correta) cor = "border-forest bg-forest/15";
            else if (i === escolha) cor = "border-destructive bg-destructive/10";
            else cor = "border-border opacity-60";
          }
          return (
            <li key={alt}>
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
          <p className="font-semibold">
            {escolha === p.correta ? "✅ Correto!" : "❌ Não foi dessa vez."}
          </p>
          <p className="mt-1 text-sm text-foreground/90">{p.explicacao}</p>
          <button
            type="button"
            onClick={avancar}
            className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
          >
            {ultimaPergunta ? "Ver resultado" : "Próxima pergunta"}
          </button>
        </div>
      )}
    </div>
  );
}
