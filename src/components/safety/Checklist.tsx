import { useProgress } from "@/hooks/use-progress";

export const CHECKLIST_ITENS = [
  { id: "equipamento", titulo: "Equipamento", texto: "Vela, selete, capacete e reserva inspecionados e dentro das revisões." },
  { id: "linhas", titulo: "Linhas e tirantes", texto: "Linhas sem nós, embaraços ou danos; mosquetões travados." },
  { id: "reserva", titulo: "Paraquedas reserva", texto: "Pino no lugar, alça acessível e repack em dia." },
  { id: "clima", titulo: "Condições meteorológicas", texto: "Vento, térmicas, nuvens e previsão analisados para o horário do voo." },
  { id: "local", titulo: "Decolagem e pouso", texto: "Áreas livres de obstáculos, com alternativas de pouso identificadas." },
  { id: "plano", titulo: "Plano de voo", texto: "Rota planejada, limites pessoais definidos e alguém avisado sobre o voo." },
  { id: "saude", titulo: "Condição física e mental", texto: "Descansado, atento, sem pressa e sem pressão externa para voar." },
];

// Checklist de pré-voo persistente (localStorage).
export function Checklist() {
  const { state, loaded, setChecklistItem, setReduceMotion } = useProgress();
  const checklist = state.checklist;
  const feitos = CHECKLIST_ITENS.filter((i) => checklist[i.id]).length;
  const pct = Math.round((feitos / CHECKLIST_ITENS.length) * 100);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {feitos} de {CHECKLIST_ITENS.length} itens verificados
        </p>
        <div
          className="h-3 w-40 overflow-hidden rounded-full bg-border"
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progresso do checklist"
        >
          <div
            className={`h-full rounded-full transition-all ${pct === 100 ? "bg-forest" : "bg-primary"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <ul className="space-y-2">
        {CHECKLIST_ITENS.map((item) => {
          const marcado = !!checklist[item.id];
          return (
            <li key={item.id}>
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${
                  marcado ? "border-forest/50 bg-forest/10" : "border-border bg-card hover:bg-accent/40"
                }`}
              >
                <input
                  type="checkbox"
                  checked={marcado}
                  onChange={(e) => setChecklistItem(item.id, e.target.checked)}
                  disabled={!loaded}
                  className="mt-1 h-5 w-5 accent-[#0a7a3d]"
                />
                <span>
                  <span className={`block font-semibold ${marcado ? "text-foreground/70 line-through" : "text-foreground"}`}>
                    {item.titulo}
                  </span>
                  <span className="block text-sm text-muted-foreground">{item.texto}</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {pct === 100 && (
        <p className="mt-4 rounded-xl bg-forest/15 p-4 text-sm font-semibold text-foreground" role="status">
          ✅ Checklist completo! Lembre-se: este app é educativo — no voo real, siga sempre o
          checklist do seu clube e do seu instrutor.
        </p>
      )}
      <p className="mt-3 text-xs text-muted-foreground">
        O estado do checklist fica salvo neste navegador. Preferências de redução de animações
        do sistema são respeitadas automaticamente.
      </p>
      {state.reduceMotion && (
        <p className="mt-2 text-xs text-muted-foreground" role="status">
          Preferência de movimento reduzido detectada: as animações estão simplificadas.
        </p>
      )}
    </div>
  );
}
