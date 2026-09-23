import { useState } from "react";
import { useTabKeys } from "@/hooks/use-tab-keys";

interface Cenario {
  id: string;
  titulo: string;
  situacao: string;
  opcoes: { texto: string; correta: boolean; explicacao: string }[];
}

const CENARIOS: Cenario[] = [
  {
    id: "vento-aumentando",
    titulo: "O vento está aumentando na decolagem",
    situacao:
      "Você chegou à rampa e o vento era de 12 km/h. Enquanto preparava o equipamento, as rajadas passaram a balançar as árvores com força e o vento parece bem mais forte agora.",
    opcoes: [
      {
        texto: "Decolar logo, antes que piore ainda mais",
        correta: false,
        explicacao:
          "Pressa com condição piorando é uma combinação perigosa. O vento já está acima do previsto — a tendência é piorar, não melhorar.",
      },
      {
        texto: "Esperar, reavaliar o vento e, se continuar forte, não voar",
        correta: true,
        explicacao:
          "Correto. O vento mudou depois do planejado — reavalie. Não voar é sempre uma decisão válida: a montanha continua lá amanhã.",
      },
      {
        texto: "Pedir para alguém segurar a vela e decolar mesmo assim",
        correta: false,
        explicacao:
          "Decolar com vento acima do seu limite aumenta muito o risco de ser arrastado ou de fechamentos logo após a decolagem.",
      },
    ],
  },
  {
    id: "nuvem-crescendo",
    titulo: "Uma nuvem escura cresce rápido sobre a térmica",
    situacao:
      "Você está voando e nota que um cumulus à sua frente escureceu na base e está crescendo verticalmente muito rápido, puxando ar de todos os lados.",
    opcoes: [
      {
        texto: "Entrar na térmica embaixo da nuvem para subir rápido",
        correta: false,
        explicacao:
          "A sucção embaixo de uma nuvem em crescimento pode ser forte e incontrolável — você pode ser 'engolido' pela nuvem, perdendo visão e orientação.",
      },
      {
        texto: "Afastar-se da nuvem, buscar área de descida e planejar o pouso",
        correta: true,
        explicacao:
          "Correto. Crescimento rápido e base escura indicam possível evolução para tempestade. Distância e pouso antecipado são a escolha segura.",
      },
      {
        texto: "Continuar o voo normalmente, a nuvem ainda está longe",
        correta: false,
        explicacao:
          "Nuvens convectivas se movem e crescem rápido. O que está 'longe' agora pode estar sobre você em minutos.",
      },
    ],
  },
  {
    id: "pressao-amigos",
    titulo: "Todos estão voando, mas você não se sente bem",
    situacao:
      "O dia está bom e seus amigos já decolaram. Mas você dormiu mal, está com dor de cabeça e sente que não está 100% concentrado.",
    opcoes: [
      {
        texto: "Voar assim mesmo, para não ficar de fora",
        correta: false,
        explicacao:
          "Pressão social é um fator humano clássico em acidentes. Ninguém decide por você — e ninguém voa por você.",
      },
      {
        texto: "Voar só um voo curto de trenó",
        correta: false,
        explicacao:
          "Com a atenção comprometida, até um voo curto exige decisões rápidas na decolagem e no pouso — os momentos mais críticos.",
      },
      {
        texto: "Não voar hoje e aproveitar para observar e aprender no chão",
        correta: true,
        explicacao:
          "Correto. Reconhecer seus limites é sinal de maturidade, não de fraqueza. Observar os outros voando também é aprendizado.",
      },
    ],
  },
];

// Cenários de decisão: escolha a resposta e veja a explicação.
export function Scenarios() {
  const [indice, setIndice] = useState(0);
  const [escolha, setEscolha] = useState<number | null>(null);
  const cenario = CENARIOS[indice]!;

  const mudar = (i: number) => {
    setIndice(i);
    setEscolha(null);
  };
  const onKeyDown = useTabKeys(CENARIOS.length, indice, mudar);

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2" role="tablist" aria-label="Cenários de decisão">
        {CENARIOS.map((c, i) => (
          <button
            key={c.id}
            id={`cenario-tab-${c.id}`}
            type="button"
            role="tab"
            aria-selected={indice === i}
            aria-controls={`cenario-painel-${c.id}`}
            tabIndex={indice === i ? 0 : -1}
            onClick={() => mudar(i)}
            onKeyDown={onKeyDown}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              indice === i
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {c.titulo}
          </button>
        ))}
      </div>

      <div
        id={`cenario-painel-${cenario.id}`}
        role="tabpanel"
        aria-labelledby={`cenario-tab-${cenario.id}`}
        className="rounded-xl border border-border bg-card p-5"
      >
        <h3 className="font-display text-lg font-bold">{cenario.titulo}</h3>
        <p className="mt-2 text-foreground/90">{cenario.situacao}</p>
        <p className="mt-3 text-sm font-semibold text-primary">O que você faz?</p>
        <ul className="mt-2 space-y-2">
          {cenario.opcoes.map((op, i) => {
            const escolhida = escolha === i;
            const cor = escolhida
              ? op.correta
                ? "border-forest bg-forest/15"
                : "border-destructive bg-destructive/10"
              : "border-border hover:bg-accent/40";
            return (
              <li key={op.texto}>
                <button
                  type="button"
                  onClick={() => setEscolha(i)}
                  aria-pressed={escolhida}
                  className={`w-full rounded-lg border p-3 text-left text-sm transition-colors ${cor}`}
                >
                  {op.texto}
                </button>
              </li>
            );
          })}
        </ul>
        {escolha !== null && (
          <div
            className={`mt-4 rounded-xl p-4 text-sm ${
              cenario.opcoes[escolha]!.correta ? "bg-forest/15" : "bg-destructive/10"
            }`}
            role="status"
            aria-live="polite"
          >
            <p className="font-bold">
              {cenario.opcoes[escolha]!.correta
                ? "✅ Boa decisão!"
                : "⚠️ Atenção — essa escolha tem riscos."}
            </p>
            <p className="mt-1 text-foreground/90">{cenario.opcoes[escolha]!.explicacao}</p>
          </div>
        )}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Estes cenários são didáticos e simplificados. Situações reais exigem julgamento treinado com
        um instrutor habilitado.
      </p>
    </div>
  );
}
