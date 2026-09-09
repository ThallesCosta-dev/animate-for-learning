export interface Termo {
  termo: string;
  definicao: string;
  area: "aerodinamica" | "meteorologia" | "seguranca" | "equipamento";
}

export const GLOSSARIO: Termo[] = [
  { termo: "Ângulo de ataque", definicao: "Ângulo entre a corda da asa e a direção do vento relativo. Controla sustentação e arrasto; excesso causa estol.", area: "aerodinamica" },
  { termo: "Arrasto", definicao: "Força que resiste ao movimento da asa pelo ar, paralela ao vento relativo.", area: "aerodinamica" },
  { termo: "Bordo de ataque", definicao: "Borda frontal da asa, por onde o ar entra.", area: "equipamento" },
  { termo: "Bordo de fuga", definicao: "Borda traseira da asa, por onde o ar sai.", area: "equipamento" },
  { termo: "Carga alar", definicao: "Peso total (piloto + equipamento) dividido pela área da asa. Valores ilustrativos no app: em kg/m².", area: "aerodinamica" },
  { termo: "Corda", definicao: "Linha imaginária que liga o bordo de ataque ao bordo de fuga do perfil da asa.", area: "aerodinamica" },
  { termo: "Estol", definicao: "Perda súbita de sustentação quando o ângulo de ataque passa do limite e o fluxo se descola da asa.", area: "aerodinamica" },
  { termo: "Razão de planeio", definicao: "Quantos metros a asa avança na horizontal para cada metro que desce. Quanto maior, melhor o planeio.", area: "aerodinamica" },
  { termo: "Sustentação", definicao: "Força gerada pela asa, perpendicular ao vento relativo, que sustenta o voo.", area: "aerodinamica" },
  { termo: "Velocidade no ar (airspeed)", definicao: "Velocidade da asa em relação ao ar ao redor — é ela que gera sustentação.", area: "aerodinamica" },
  { termo: "Velocidade no solo (groundspeed)", definicao: "Velocidade da asa em relação ao solo; soma vetorial da velocidade no ar com o vento.", area: "aerodinamica" },
  { termo: "Vento relativo", definicao: "Fluxo de ar que a asa 'sente': igual e oposto ao movimento da asa pelo ar.", area: "aerodinamica" },
  { termo: "Anabático", definicao: "Vento que sobe a encosta durante o dia, pelo aquecimento do solo (brisa de vale).", area: "meteorologia" },
  { termo: "Barlavento", definicao: "Lado da montanha de onde o vento vem; o ar é forçado a subir (sustentação orográfica).", area: "meteorologia" },
  { termo: "Catabático", definicao: "Vento frio que desce a encosta à noite, pelo resfriamento do solo (brisa de montanha).", area: "meteorologia" },
  { termo: "Convecção", definicao: "Movimento vertical do ar causado por diferenças de temperatura — o motor das térmicas.", area: "meteorologia" },
  { termo: "Cumulonimbus", definicao: "Nuvem de tempestade, com correntes violentas, raios e granizo. Perigo extremo para o voo.", area: "meteorologia" },
  { termo: "Cumulus", definicao: "Nuvem branca de base plana que marca o topo de térmicas ativas.", area: "meteorologia" },
  { termo: "Rotor", definicao: "Circulação turbulenta do ar no lado de sotavento de uma montanha, sob vento forte.", area: "meteorologia" },
  { termo: "Sotavento", definicao: "Lado da montanha oposto ao vento; região de descida e possível turbulência.", area: "meteorologia" },
  { termo: "Stratus", definicao: "Nuvem em camadas, baixa e cinzenta; indica ar estável e pouca térmica.", area: "meteorologia" },
  { termo: "Térmica", definicao: "Coluna ou bolha de ar quente ascendente usada pelo piloto para ganhar altitude.", area: "meteorologia" },
  { termo: "Checklist", definicao: "Lista de verificação sistemática feita antes de cada voo.", area: "seguranca" },
  { termo: "Fatores humanos", definicao: "Aspectos psicológicos e físicos do piloto (cansaço, pressão social, excesso de confiança) que afetam decisões.", area: "seguranca" },
  { termo: "Freios", definicao: "Comandos presos às mãos do piloto que puxam o bordo de fuga para virar e controlar a velocidade.", area: "equipamento" },
  { termo: "Reserva", definicao: "Paraquedas de emergência levado na selete, usado quando a asa principal não pode ser recuperada.", area: "equipamento" },
  { termo: "Selete", definicao: "Cadeirinha onde o piloto voa sentado; abriga também o reserva e proteções.", area: "equipamento" },
  { termo: "Tirantes", definicao: "Conjuntos de linhas (A, B, C…) que ligam a asa aos mosquetões da selete.", area: "equipamento" },
];
