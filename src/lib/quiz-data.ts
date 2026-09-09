export interface Pergunta {
  id: string;
  area: "aerodinamica" | "meteorologia" | "seguranca";
  enunciado: string;
  alternativas: string[];
  correta: number;
  explicacao: string;
}

export const PERGUNTAS: Pergunta[] = [
  {
    id: "q1",
    area: "aerodinamica",
    enunciado: "Aumentar o ângulo de ataque (dentro do limite) faz a sustentação…",
    alternativas: ["Diminuir sempre", "Aumentar", "Ficar igual", "Zerar"],
    correta: 1,
    explicacao: "Até o ângulo de estol, quanto maior o ângulo de ataque, maior a sustentação — mas também maior o arrasto.",
  },
  {
    id: "q2",
    area: "aerodinamica",
    enunciado: "O estol acontece quando…",
    alternativas: [
      "A velocidade fica alta demais",
      "O fluxo de ar se descola da asa por ângulo de ataque excessivo",
      "O vento de cauda aumenta",
      "A asa ganha peso",
    ],
    correta: 1,
    explicacao: "No estol, o ar não consegue mais acompanhar o dorso da asa, o fluxo se separa e a sustentação despenca.",
  },
  {
    id: "q3",
    area: "aerodinamica",
    enunciado: "Ao dobrar a velocidade, a sustentação fica aproximadamente…",
    alternativas: ["2× maior", "4× maior", "Metade", "Igual"],
    correta: 1,
    explicacao: "A sustentação cresce com o quadrado da velocidade (L ∝ V²). Por isso pequenas mudanças de velocidade importam tanto.",
  },
  {
    id: "q4",
    area: "aerodinamica",
    enunciado: "A carga alar é…",
    alternativas: [
      "O peso do piloto dividido pela área da asa",
      "A área da asa em metros",
      "A velocidade máxima da asa",
      "O número de linhas",
    ],
    correta: 0,
    explicacao: "Carga alar = peso total ÷ área da asa. Carga maior costuma significar velocidades maiores e respostas mais rápidas.",
  },
  {
    id: "q5",
    area: "aerodinamica",
    enunciado: "Voando contra o vento (vento de proa), sua velocidade em relação ao solo…",
    alternativas: ["Aumenta", "Diminui", "Não muda", "Zera"],
    correta: 1,
    explicacao: "Velocidade no solo = velocidade no ar menos o vento de frente. É por isso que se avança pouco contra vento forte.",
  },
  {
    id: "q6",
    area: "meteorologia",
    enunciado: "Uma térmica é…",
    alternativas: [
      "Uma corrente de ar frio descendo",
      "Uma bolha/coluna de ar quente ascendente",
      "Um tipo de nuvem de tempestade",
      "Vento de vale à noite",
    ],
    correta: 1,
    explicacao: "O solo aquecido pelo sol esquenta o ar, que fica menos denso e sobe — é a térmica que o piloto usa para ganhar altitude.",
  },
  {
    id: "q7",
    area: "meteorologia",
    enunciado: "Qual superfície tende a gerar térmicas mais fortes?",
    alternativas: ["Água", "Floresta úmida", "Rocha e solo seco", "Grama molhada"],
    correta: 2,
    explicacao: "Rocha e solo seco esquentam mais rápido e transferem mais calor ao ar. Água esquenta pouco — por isso quase não há térmicas sobre lagos.",
  },
  {
    id: "q8",
    area: "meteorologia",
    enunciado: "Nuvens cumulus bem formadas geralmente indicam…",
    alternativas: ["Ar estável e sem térmicas", "Topo de térmicas ativas", "Chuva iminente sempre", "Vento forte em altitude"],
    correta: 1,
    explicacao: "O cumulus marca onde a umidade da térmica condensou — ou seja, o topo de uma coluna ascendente ativa.",
  },
  {
    id: "q9",
    area: "meteorologia",
    enunciado: "De dia, em um vale ensolarado, a brisa tende a…",
    alternativas: ["Descer as encostas", "Subir as encostas", "Ficar parada", "Soprar sempre do norte"],
    correta: 1,
    explicacao: "De dia as encostas aquecem e o ar sobe (brisa de vale/anabático). À noite o ar frio desce (brisa de montanha/catabático).",
  },
  {
    id: "q10",
    area: "seguranca",
    enunciado: "Ao ver um cumulonimbus se formando, o piloto deve…",
    alternativas: [
      "Voar embaixo dele para subir rápido",
      "Afastar-se e pousar em local seguro",
      "Ignorar, pois é só uma nuvem",
      "Voar por cima da nuvem",
    ],
    correta: 1,
    explicacao: "Cumulonimbus = tempestade, com correntes violentas, raios e granizo. A decisão segura é se afastar e pousar o quanto antes.",
  },
  {
    id: "q11",
    area: "seguranca",
    enunciado: "O checklist pré-voo serve para…",
    alternativas: [
      "Cumprir uma formalidade",
      "Detectar problemas antes que virem emergências no ar",
      "Substituir a inspeção anual do equipamento",
      "Impressionar outros pilotos",
    ],
    correta: 1,
    explicacao: "O checklist sistematiza a verificação de equipamento, clima, local e condição pessoal — barreiras contra falhas humanas.",
  },
  {
    id: "q12",
    area: "seguranca",
    enunciado: "Seus amigos decolaram, mas você não se sente bem. A decisão correta é…",
    alternativas: [
      "Voar para não ficar de fora",
      "Voar só um pouquinho",
      "Não voar — a decisão é sempre individual",
      "Voar se alguém for junto olhando",
    ],
    correta: 2,
    explicacao: "Fatores humanos (cansaço, pressão social) estão entre as maiores causas de acidentes. Não voar é sempre uma decisão válida.",
  },
];
