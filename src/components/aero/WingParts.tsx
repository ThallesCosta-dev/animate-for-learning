import { useState } from "react";

interface Parte {
  id: string;
  nome: string;
  descricao: string;
}

const PARTES: Parte[] = [
  {
    id: "asa",
    nome: "Asa (velame)",
    descricao:
      "A superfície de tecido que forma o perfil aerodinâmico. O ar que passa por cima e por baixo dela gera a sustentação. É dividida em células que se enchem de ar pelas entradas frontais.",
  },
  {
    id: "linhas",
    nome: "Linhas",
    descricao:
      "Dezenas de linhas finas e muito resistentes ligam a asa aos tirantes. Elas distribuem a carga e mantêm o formato do perfil.",
  },
  {
    id: "tirantes",
    nome: "Tirantes",
    descricao:
      "Fitas que reúnem grupos de linhas (A, B, C...) e conectam a asa ao selete. É neles que ficam os aceleradores e as conexões principais.",
  },
  {
    id: "freios",
    nome: "Freios",
    descricao:
      "Comandos presos às mãos do piloto que deformam o bordo de fuga da asa. Servem para virar, controlar a velocidade e pousar. Puxar demais pode causar estol.",
  },
  {
    id: "piloto",
    nome: "Piloto / Centro de gravidade",
    descricao:
      "O peso do piloto e do equipamento fica suspenso abaixo da asa, formando um pêndulo. Isso dá estabilidade natural ao parapente e define o centro de gravidade do conjunto.",
  },
];

// Asa de parapente simplificada em SVG: clique em cada componente para ver a função.
export function WingParts() {
  const [ativa, setAtiva] = useState<Parte>(PARTES[0]!);

  const cor = (id: string) => (ativa.id === id ? "var(--primary)" : "currentColor");

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <svg
        viewBox="0 0 320 260"
        role="group"
        aria-label="Diagrama interativo de um parapente"
        className="w-full rounded-xl border border-border bg-skyblue/20 text-slate-500"
      >
        {/* Asa */}
        <path
          d="M30 70 Q160 -10 290 70 Q160 30 30 70 Z"
          fill={ativa.id === "asa" ? "rgba(37,78,180,0.35)" : "rgba(120,170,230,0.35)"}
          stroke={cor("asa")}
          strokeWidth={ativa.id === "asa" ? 4 : 2}
          className="cursor-pointer transition-all"
          onClick={() => setAtiva(PARTES[0]!)}
        >
          <title>Asa (velame)</title>
        </path>
        {/* Linhas */}
        <g
          stroke={cor("linhas")}
          strokeWidth={ativa.id === "linhas" ? 2.5 : 1}
          className="cursor-pointer"
          onClick={() => setAtiva(PARTES[1]!)}
        >
          {[60, 100, 140, 180, 220, 260].map((x) => (
            <line key={x} x1={x} y1={52} x2={160} y2={170} />
          ))}
          <title>Linhas</title>
        </g>
        {/* Tirantes */}
        <g
          stroke={cor("tirantes")}
          strokeWidth={ativa.id === "tirantes" ? 5 : 3}
          className="cursor-pointer"
          onClick={() => setAtiva(PARTES[2]!)}
        >
          <line x1={140} y1={150} x2={160} y2={185} />
          <line x1={180} y1={150} x2={160} y2={185} />
          <title>Tirantes</title>
        </g>
        {/* Freios */}
        <g
          stroke={cor("freios")}
          strokeWidth={ativa.id === "freios" ? 3.5 : 2}
          strokeDasharray="5 4"
          className="cursor-pointer"
          onClick={() => setAtiva(PARTES[3]!)}
        >
          <path d="M45 66 Q100 120 150 190" fill="none" />
          <path d="M275 66 Q220 120 170 190" fill="none" />
          <title>Freios</title>
        </g>
        {/* Piloto */}
        <g
          className="cursor-pointer"
          onClick={() => setAtiva(PARTES[4]!)}
          fill={cor("piloto")}
        >
          <circle cx={160} cy={200} r={ativa.id === "piloto" ? 13 : 10} />
          <rect x={150} y={208} width={20} height={26} rx={8} />
          <title>Piloto / centro de gravidade</title>
        </g>
      </svg>

      <div>
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Componentes do parapente">
          {PARTES.map((p) => (
            <button
              key={p.id}
              type="button"
              role="tab"
              aria-selected={ativa.id === p.id}
              onClick={() => setAtiva(p)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                ativa.id === p.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {p.nome}
            </button>
          ))}
        </div>
        <div className="mt-3 rounded-xl border border-border bg-card p-4" role="tabpanel">
          <h3 className="font-display text-lg font-bold">{ativa.nome}</h3>
          <p className="mt-2 text-sm leading-relaxed text-foreground/90">{ativa.descricao}</p>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Direção do voo, velocidade relativa do ar e velocidade em relação ao solo são
          exploradas nas próximas aulas com vetores animados.
        </p>
      </div>
    </div>
  );
}
