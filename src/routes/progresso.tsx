import { createFileRoute, Link } from "@tanstack/react-router";
import { useProgress } from "@/hooks/use-progress";
import { AREA_LABELS, LESSONS, type AreaKey } from "@/lib/lessons";
import { CHECKLIST_ITENS } from "@/lib/checklist-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/progresso")({
  head: () =>
    seo({
      titulo: "Seu progresso",
      descricao:
        "Acompanhe seu progresso nas aulas de aerodinâmica, meteorologia e segurança, além do histórico de quiz e do checklist pré-voo.",
      path: "/progresso",
    }),
  component: ProgressoPage,
});

const LINK_AREA: Record<AreaKey, "/aprender" | "/meteorologia" | "/seguranca"> = {
  aerodinamica: "/aprender",
  meteorologia: "/meteorologia",
  seguranca: "/seguranca",
};

function ProgressoPage() {
  const { state, loaded, setReduceMotion, resetChecklist } = useProgress();

  const areas = (Object.keys(AREA_LABELS) as AreaKey[]).map((id) => {
    const aulas = LESSONS.filter((l) => l.area === id);
    const feitas = aulas.filter((l) => state.completedLessons.includes(l.id)).length;
    return { id, nome: AREA_LABELS[id], feitas, total: aulas.length };
  });

  const totalFeitas = areas.reduce((s, a) => s + a.feitas, 0);
  const totalGeral = LESSONS.length;
  const pctGeral = Math.round((totalFeitas / totalGeral) * 100);

  const checklistFeitos = CHECKLIST_ITENS.filter((i) => state.checklist[i.id]).length;
  const melhorQuiz = state.quizHistory.reduce(
    (melhor, h) => Math.max(melhor, Math.round((h.score / h.total) * 100)),
    0,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold">Seu progresso</h1>
      <p className="mt-2 text-muted-foreground">
        Tudo é salvo apenas neste navegador — nada é enviado para servidores.
      </p>

      {/* Evita mostrar 0% durante a hidratação, antes de ler o localStorage. */}
      {!loaded ? (
        <p className="mt-6 text-sm text-muted-foreground" role="status">
          Carregando seu progresso…
        </p>
      ) : (
        <>
          {/* Geral */}
          <section className="mt-6 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-lg font-bold">Aulas concluídas</h2>
              <span className="font-display text-3xl font-extrabold text-primary">{pctGeral}%</span>
            </div>
            <div
              className="mt-3 h-4 overflow-hidden rounded-full bg-border"
              role="progressbar"
              aria-valuenow={pctGeral}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Progresso geral nas aulas"
            >
              <div className="h-full bg-primary transition-all" style={{ width: `${pctGeral}%` }} />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {totalFeitas} de {totalGeral} aulas concluídas
            </p>
          </section>

          {/* Por área */}
          <section className="mt-4 grid gap-4 sm:grid-cols-3">
            {areas.map((a) => {
              const pct = Math.round((a.feitas / a.total) * 100);
              return (
                <Link
                  key={a.id}
                  to={LINK_AREA[a.id]}
                  className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
                >
                  <h3 className="font-display font-bold">{a.nome}</h3>
                  <p className="mt-1 text-2xl font-extrabold text-primary">{pct}%</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-border" aria-hidden>
                    <div className="h-full bg-forest" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {a.feitas}/{a.total} aulas
                  </p>
                </Link>
              );
            })}
          </section>

          {/* Quiz e checklist */}
          <section className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display font-bold">Quiz</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {state.quizHistory.length === 0
                  ? "Você ainda não fez nenhum quiz."
                  : `${state.quizHistory.length} tentativa(s). Melhor resultado: ${melhorQuiz}%.`}
              </p>
              <Link
                to="/quiz"
                className="mt-3 inline-block rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
              >
                {state.quizHistory.length === 0 ? "Fazer o quiz" : "Tentar de novo"}
              </Link>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display font-bold">Checklist pré-voo</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {checklistFeitos} de {CHECKLIST_ITENS.length} itens verificados.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  to="/seguranca"
                  hash="checklist"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Abrir checklist
                </Link>
                <button
                  type="button"
                  onClick={resetChecklist}
                  disabled={checklistFeitos === 0}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium disabled:opacity-50"
                >
                  Limpar
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Preferências */}
      <section className="mt-4 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg font-bold">Preferências</h2>
        <label className="mt-3 flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={state.reduceMotion}
            disabled={!loaded}
            onChange={(e) => setReduceMotion(e.target.checked)}
            className="mt-1 h-5 w-5 accent-primary"
          />
          <span>
            <span className="block font-semibold">Reduzir animações</span>
            <span className="block text-sm text-muted-foreground">
              Congela as simulações em um quadro estático (os controles continuam funcionando). A
              configuração de movimento reduzido do seu sistema também é respeitada automaticamente.
            </span>
          </span>
        </label>
        <p className="mt-3 text-sm text-muted-foreground">
          O tema claro/escuro é alternado pelo botão no topo da página.
        </p>
      </section>
    </div>
  );
}
