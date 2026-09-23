export type AreaQuiz = "aerodinamica" | "meteorologia" | "seguranca";

/**
 * multipla: múltipla escolha (alternativas são embaralhadas ao iniciar o quiz).
 * vf: verdadeiro ou falso (ordem fixa).
 * cenario: situação de voo seguida de opções de decisão (embaralhadas).
 */
export type TipoPergunta = "multipla" | "vf" | "cenario";

export interface Pergunta {
  id: string;
  area: AreaQuiz;
  tipo: TipoPergunta;
  enunciado: string;
  /** Texto de contexto exibido antes do enunciado (só em cenários). */
  situacao?: string;
  alternativas: string[];
  correta: number;
  explicacao: string;
}

export const PERGUNTAS: Pergunta[] = [
  // ---------- Aerodinâmica ----------
  {
    id: "q1",
    area: "aerodinamica",
    tipo: "multipla",
    enunciado: "Aumentar o ângulo de ataque (dentro do limite) faz a sustentação…",
    alternativas: ["Aumentar", "Diminuir sempre", "Ficar igual", "Zerar"],
    correta: 0,
    explicacao:
      "Até o ângulo de estol, quanto maior o ângulo de ataque, maior a sustentação — mas também maior o arrasto.",
  },
  {
    id: "q2",
    area: "aerodinamica",
    tipo: "multipla",
    enunciado: "O estol acontece quando…",
    alternativas: [
      "A velocidade fica alta demais",
      "O vento de cauda aumenta",
      "O fluxo de ar se descola da asa por ângulo de ataque excessivo",
      "A asa ganha peso",
    ],
    correta: 2,
    explicacao:
      "No estol, o ar não consegue mais acompanhar o dorso da asa, o fluxo se separa e a sustentação despenca.",
  },
  {
    id: "q3",
    area: "aerodinamica",
    tipo: "multipla",
    enunciado: "Ao dobrar a velocidade, a sustentação fica aproximadamente…",
    alternativas: ["2× maior", "Metade", "Igual", "4× maior"],
    correta: 3,
    explicacao:
      "A sustentação cresce com o quadrado da velocidade (L ∝ V²). Por isso pequenas mudanças de velocidade importam tanto.",
  },
  {
    id: "q4",
    area: "aerodinamica",
    tipo: "multipla",
    enunciado: "A carga alar é…",
    alternativas: [
      "A área da asa em metros",
      "A velocidade máxima da asa",
      "O peso total dividido pela área da asa",
      "O número de linhas",
    ],
    correta: 2,
    explicacao:
      "Carga alar = peso total ÷ área da asa. Carga maior costuma significar velocidades maiores e respostas mais rápidas.",
  },
  {
    id: "q5",
    area: "aerodinamica",
    tipo: "multipla",
    enunciado: "Voando contra o vento (vento de proa), sua velocidade em relação ao solo…",
    alternativas: ["Aumenta", "Não muda", "Zera", "Diminui"],
    correta: 3,
    explicacao:
      "Velocidade no solo = velocidade no ar menos o vento de frente. É por isso que se avança pouco contra vento forte.",
  },
  {
    id: "q13",
    area: "aerodinamica",
    tipo: "vf",
    enunciado: "Verdadeiro ou falso: o estol depende da velocidade, e não do ângulo de ataque.",
    alternativas: ["Verdadeiro", "Falso"],
    correta: 1,
    explicacao:
      "Falso. O estol é causado pelo ângulo de ataque excessivo. Velocidade baixa só é o caminho mais comum até ele, porque exige mais ângulo para sustentar o peso.",
  },
  {
    id: "q14",
    area: "aerodinamica",
    tipo: "vf",
    enunciado:
      "Verdadeiro ou falso: com vento de cauda, a asa avança mais sobre o solo para cada metro de altura perdido.",
    alternativas: ["Verdadeiro", "Falso"],
    correta: 0,
    explicacao:
      "Verdadeiro. A razão de planeio sobre o solo aumenta com vento de cauda e diminui com vento de frente — a asa continua descendo na mesma taxa, mas o ar inteiro a carrega.",
  },

  // ---------- Meteorologia ----------
  {
    id: "q6",
    area: "meteorologia",
    tipo: "multipla",
    enunciado: "Uma térmica é…",
    alternativas: [
      "Uma bolha/coluna de ar quente ascendente",
      "Uma corrente de ar frio descendo",
      "Um tipo de nuvem de tempestade",
      "Vento de vale à noite",
    ],
    correta: 0,
    explicacao:
      "O solo aquecido pelo sol esquenta o ar, que fica menos denso e sobe — é a térmica que o piloto usa para ganhar altitude.",
  },
  {
    id: "q7",
    area: "meteorologia",
    tipo: "multipla",
    enunciado: "Qual superfície tende a gerar térmicas mais fortes?",
    alternativas: ["Água", "Floresta úmida", "Rocha e solo seco", "Grama molhada"],
    correta: 2,
    explicacao:
      "Rocha e solo seco esquentam mais rápido e transferem mais calor ao ar. Água esquenta pouco — por isso quase não há térmicas sobre lagos.",
  },
  {
    id: "q8",
    area: "meteorologia",
    tipo: "multipla",
    enunciado: "Nuvens cumulus bem formadas geralmente indicam…",
    alternativas: [
      "Ar estável e sem térmicas",
      "Chuva iminente sempre",
      "Vento forte em altitude",
      "Topo de térmicas ativas",
    ],
    correta: 3,
    explicacao:
      "O cumulus marca onde a umidade da térmica condensou — ou seja, o topo de uma coluna ascendente ativa.",
  },
  {
    id: "q9",
    area: "meteorologia",
    tipo: "multipla",
    enunciado: "De dia, em um vale ensolarado, a brisa tende a…",
    alternativas: [
      "Subir as encostas",
      "Descer as encostas",
      "Ficar parada",
      "Soprar sempre do norte",
    ],
    correta: 0,
    explicacao:
      "De dia as encostas aquecem e o ar sobe (brisa de vale/anabático). À noite o ar frio desce (brisa de montanha/catabático).",
  },
  {
    id: "q15",
    area: "meteorologia",
    tipo: "vf",
    enunciado:
      "Verdadeiro ou falso: o lado de sotavento de uma montanha é o mais seguro para voar com vento forte.",
    alternativas: ["Verdadeiro", "Falso"],
    correta: 1,
    explicacao:
      "Falso. Com vento forte, o sotavento é onde se forma o rotor — circulação turbulenta e perigosa. A sustentação orográfica fica do lado de barlavento.",
  },
  {
    id: "q16",
    area: "meteorologia",
    tipo: "cenario",
    situacao:
      "São 15h, o céu tinha cumulus pequenos e espaçados. Em vinte minutos, um deles à sua frente ficou muito mais alto que os outros, com a base escura e o topo começando a se espalhar.",
    enunciado: "O que essa nuvem está dizendo?",
    alternativas: [
      "É a térmica mais forte do dia: vale entrar embaixo dela",
      "Está virando cumulonimbus: afastar-se e planejar o pouso",
      "É só um cumulus maior; nada muda",
    ],
    correta: 1,
    explicacao:
      "Crescimento vertical rápido, base escura e topo espalhando (bigorna) são sinais de evolução para cumulonimbus. A decisão segura é distância e pouso antecipado.",
  },

  // ---------- Segurança ----------
  {
    id: "q10",
    area: "seguranca",
    tipo: "multipla",
    enunciado: "Ao ver um cumulonimbus se formando, o piloto deve…",
    alternativas: [
      "Voar embaixo dele para subir rápido",
      "Ignorar, pois é só uma nuvem",
      "Afastar-se e pousar em local seguro",
      "Voar por cima da nuvem",
    ],
    correta: 2,
    explicacao:
      "Cumulonimbus = tempestade, com correntes violentas, raios e granizo. A decisão segura é se afastar e pousar o quanto antes.",
  },
  {
    id: "q11",
    area: "seguranca",
    tipo: "multipla",
    enunciado: "O checklist pré-voo serve para…",
    alternativas: [
      "Cumprir uma formalidade",
      "Substituir a inspeção anual do equipamento",
      "Impressionar outros pilotos",
      "Detectar problemas antes que virem emergências no ar",
    ],
    correta: 3,
    explicacao:
      "O checklist sistematiza a verificação de equipamento, clima, local e condição pessoal — barreiras contra falhas humanas.",
  },
  {
    id: "q12",
    area: "seguranca",
    tipo: "multipla",
    enunciado: "Seus amigos decolaram, mas você não se sente bem. A decisão correta é…",
    alternativas: [
      "Voar para não ficar de fora",
      "Não voar — a decisão é sempre individual",
      "Voar só um pouquinho",
      "Voar se alguém for junto olhando",
    ],
    correta: 1,
    explicacao:
      "Fatores humanos (cansaço, pressão social) estão entre as maiores causas de acidentes. Não voar é sempre uma decisão válida.",
  },
  {
    id: "q17",
    area: "seguranca",
    tipo: "vf",
    enunciado:
      "Verdadeiro ou falso: chegar cedo demais à área de pouso é um erro tão grave quanto chegar tarde demais.",
    alternativas: ["Verdadeiro", "Falso"],
    correta: 1,
    explicacao:
      "Falso. Pousar cedo, com margem, raramente causa acidente; chegar tarde ou baixo demais, sim. Na dúvida, a escolha conservadora é a certa.",
  },
  {
    id: "q18",
    area: "seguranca",
    tipo: "cenario",
    situacao:
      "Você está a 300 m de altura, a térmica acabou e o vento aumentou desde o planejamento. A área de pouso oficial está a favor do vento, longe; há um campo aberto e livre logo abaixo, contra o vento.",
    enunciado: "Qual é a decisão mais segura?",
    alternativas: [
      "Tentar chegar ao pouso oficial planando a favor do vento",
      "Pousar no campo aberto abaixo, contra o vento, enquanto há altura",
      "Esperar outra térmica para decidir depois",
    ],
    correta: 1,
    explicacao:
      "Condição mudou e a altura é limitada: use a alternativa segura que está ao alcance, contra o vento. Insistir no pouso oficial ou esperar pode deixar você baixo demais para escolher.",
  },
];
