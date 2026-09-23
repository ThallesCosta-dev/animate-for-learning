import { useState } from "react";

interface Nuvem {
  id: string;
  nome: string;
  como: string;
  condicoes: string;
  observar: string;
  riscos: string;
  perigo: 1 | 2 | 3;
}

const NUVENS: Nuvem[] = [
  {
    id: "cumulus",
    nome: "Cumulus",
    como: "Ar quente sobe em térmicas e a umidade condensa no topo, formando nuvens brancas de base plana e contorno definido.",
    condicoes: "Dias de sol com aquecimento do solo e umidade moderada.",
    observar:
      "Cumulus pequenos e espaçados marcam térmicas usáveis. Observe se estão crescendo rápido demais.",
    riscos:
      "Crescimento vertical rápido pode evoluir para cumulonimbus. Base muito escura indica nuvem madura e sugada forte embaixo.",
    perigo: 1,
  },
  {
    id: "stratus",
    nome: "Stratus",
    como: "Camadas baixas e cinzentas que cobrem o céu como um cobertor, formadas por resfriamento ou ar úmido estável.",
    condicoes: "Ar estável, úmido, pouco aquecimento — manhãs frias e dias encobertos.",
    observar: "Céu fechado em camadas, sem sol no solo: pouca ou nenhuma térmica.",
    riscos:
      "Teto baixo pode esconder o relevo e reduzir a visibilidade. Voo geralmente fraco e sem sustentação.",
    perigo: 2,
  },
  {
    id: "cumulonimbus",
    nome: "Cumulonimbus",
    como: "Nuvem de tempestade: convecção muito forte empurra a nuvem até grandes alturas, com topo em forma de bigorna.",
    condicoes: "Ar quente e úmido, instabilidade forte, frentes ou aquecimento intenso.",
    observar:
      "Torre escura crescendo rápido, topo em bigorna, base escura, vento mudando de direção e rajadas.",
    riscos:
      "PERIGO EXTREMO: correntes ascendentes e descendentes violentas, granizo, raios e rajadas. Não voar — se estiver no ar, pousar o quanto antes em local seguro.",
    perigo: 3,
  },
];

// Nuvens clicáveis com explicações e nível de risco.
export function Clouds() {
  const [ativa, setAtiva] = useState<Nuvem>(NUVENS[0]!);

  const perigoRotulo = ["", "Atenção moderada", "Cuidado", "PERIGO — não voar"][ativa.perigo];

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="rounded-xl border border-border bg-skyblue/25 p-6">
        <svg
          viewBox="0 0 340 220"
          className="w-full"
          role="group"
          aria-label="Tipos de nuvem — clique para saber mais"
        >
          {/* Cumulus */}
          <g
            className="cursor-pointer"
            onClick={() => setAtiva(NUVENS[0]!)}
            opacity={ativa.id === "cumulus" ? 1 : 0.6}
          >
            <g
              fill="#f4f7fb"
              stroke={ativa.id === "cumulus" ? "var(--primary)" : "#9db2c8"}
              strokeWidth={ativa.id === "cumulus" ? 3 : 1.5}
            >
              <circle cx={70} cy={120} r={22} />
              <circle cx={95} cy={108} r={26} />
              <circle cx={120} cy={120} r={20} />
              <rect x={52} y={118} width={86} height={18} rx={8} stroke="none" />
            </g>
            <text x={95} y={162} textAnchor="middle" fontSize={13} fontWeight="bold" fill="#33475e">
              Cumulus
            </text>
          </g>
          {/* Stratus */}
          <g
            className="cursor-pointer"
            onClick={() => setAtiva(NUVENS[1]!)}
            opacity={ativa.id === "stratus" ? 1 : 0.6}
          >
            <g
              fill="#c9d2dc"
              stroke={ativa.id === "stratus" ? "var(--primary)" : "#8a99ab"}
              strokeWidth={ativa.id === "stratus" ? 3 : 1.5}
            >
              <ellipse cx={245} cy={70} rx={62} ry={14} />
              <ellipse cx={245} cy={86} rx={70} ry={12} />
            </g>
            <text
              x={245}
              y={120}
              textAnchor="middle"
              fontSize={13}
              fontWeight="bold"
              fill="#33475e"
            >
              Stratus
            </text>
          </g>
          {/* Cumulonimbus */}
          <g
            className="cursor-pointer"
            onClick={() => setAtiva(NUVENS[2]!)}
            opacity={ativa.id === "cumulonimbus" ? 1 : 0.6}
          >
            <g
              fill="#7d8ea3"
              stroke={ativa.id === "cumulonimbus" ? "var(--destructive)" : "#5c6b7d"}
              strokeWidth={ativa.id === "cumulonimbus" ? 3 : 1.5}
            >
              <ellipse cx={235} cy={185} rx={52} ry={16} />
              <circle cx={235} cy={160} r={24} />
              <circle cx={222} cy={140} r={18} />
              <ellipse cx={235} cy={124} rx={40} ry={10} />
            </g>
            <text
              x={235}
              y={216}
              textAnchor="middle"
              fontSize={13}
              fontWeight="bold"
              fill="#8a2020"
            >
              Cumulonimbus ⚠
            </text>
          </g>
        </svg>
      </div>

      <div className="rounded-xl border border-border bg-card p-5" aria-live="polite">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-display text-xl font-bold">{ativa.nome}</h3>
          <span
            className={`rounded-full px-3 py-1 text-xs font-bold ${
              ativa.perigo === 3
                ? "bg-destructive text-destructive-foreground"
                : ativa.perigo === 2
                  ? "bg-thermal/30 text-foreground"
                  : "bg-forest/20 text-foreground"
            }`}
          >
            {perigoRotulo}
          </span>
        </div>
        <dl className="mt-3 space-y-3 text-sm">
          <div>
            <dt className="font-semibold text-primary">Como se forma</dt>
            <dd className="mt-0.5 text-foreground/90">{ativa.como}</dd>
          </div>
          <div>
            <dt className="font-semibold text-primary">Condições associadas</dt>
            <dd className="mt-0.5 text-foreground/90">{ativa.condicoes}</dd>
          </div>
          <div>
            <dt className="font-semibold text-primary">O que o piloto observa</dt>
            <dd className="mt-0.5 text-foreground/90">{ativa.observar}</dd>
          </div>
          <div>
            <dt className="font-semibold text-destructive">Riscos</dt>
            <dd className="mt-0.5 text-foreground/90">{ativa.riscos}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
