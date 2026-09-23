export interface Termo {
  termo: string;
  /** Definição em linguagem simples. */
  definicao: string;
  /** Explicação técnica complementar. */
  tecnico: string;
  area: "aerodinamica" | "meteorologia" | "seguranca" | "equipamento";
}

export const GLOSSARIO: Termo[] = [
  // ---------- Aerodinâmica ----------
  {
    termo: "Ângulo de ataque",
    definicao:
      "Ângulo entre a corda da asa e a direção do vento relativo. Controla sustentação e arrasto; excesso causa estol.",
    tecnico:
      "Símbolo α. O coeficiente de sustentação cresce quase linearmente com α até o ângulo crítico (tipicamente 12° a 18° em perfis grossos), quando o escoamento se separa do extradorso. No parapente, α é mudado pelos freios e pelo acelerador.",
    area: "aerodinamica",
  },
  {
    termo: "Arrasto",
    definicao: "Força que resiste ao movimento da asa pelo ar, paralela ao vento relativo.",
    tecnico:
      "D = ½·ρ·V²·S·CD. Soma o arrasto de forma e de atrito (parasita, cresce com V²) ao arrasto induzido pela geração de sustentação (cai com V²). No parapente, linhas e piloto respondem por boa parte do arrasto parasita.",
    area: "aerodinamica",
  },
  {
    termo: "Bordo de ataque",
    definicao: "Borda frontal da asa, por onde o ar entra.",
    tecnico:
      "Contém as entradas de ar das células, que mantêm a pressão interna (pressão de estagnação) responsável por dar forma ao perfil. Perfis com bordo de ataque fechado (shark nose) mantêm a pressão em ângulos mais variados.",
    area: "equipamento",
  },
  {
    termo: "Bordo de fuga",
    definicao: "Borda traseira da asa, por onde o ar sai.",
    tecnico:
      "É onde o freio atua: puxar o comando deforma o bordo de fuga, aumentando a curvatura efetiva e o ângulo de ataque local, o que eleva sustentação e arrasto daquele lado.",
    area: "equipamento",
  },
  {
    termo: "Carga alar",
    definicao:
      "Peso total (piloto + equipamento) dividido pela área da asa. Valores ilustrativos no app: em kg/m².",
    tecnico:
      "Peso total de decolagem ÷ área projetada ou plana (fabricantes indicam qual). Como L = ½·ρ·V²·S·CL, para o mesmo CL a velocidade de voo cresce com a raiz quadrada da carga alar — inclusive a de estol.",
    area: "aerodinamica",
  },
  {
    termo: "Corda",
    definicao: "Linha imaginária que liga o bordo de ataque ao bordo de fuga do perfil da asa.",
    tecnico:
      "Referência para medir o ângulo de ataque e a espessura relativa do perfil. Em asas de parapente, a corda varia ao longo da envergadura (afilamento) e é maior no centro.",
    area: "aerodinamica",
  },
  {
    termo: "Estol",
    definicao:
      "Perda súbita de sustentação quando o ângulo de ataque passa do limite e o fluxo se descola da asa.",
    tecnico:
      "Separação da camada-limite no extradorso acima do α crítico: CL cai, CD dispara. No parapente pode ocorrer como estol completo (full stall, asa atrás do piloto) ou parachutal (asa aberta descendo quase na vertical, sem avanço).",
    area: "aerodinamica",
  },
  {
    termo: "Razão de planeio",
    definicao:
      "Quantos metros a asa avança na horizontal para cada metro que desce. Quanto maior, melhor o planeio.",
    tecnico:
      "Igual à razão L/D em ar calmo. Sobre o solo, é (velocidade no ar ± vento) ÷ taxa de descida: vento de frente encurta, vento de cauda estica. Asas escola ficam por volta de 8:1; competição, acima de 11:1.",
    area: "aerodinamica",
  },
  {
    termo: "Sustentação",
    definicao: "Força gerada pela asa, perpendicular ao vento relativo, que sustenta o voo.",
    tecnico:
      "L = ½·ρ·V²·S·CL. Surge da diferença de pressão entre extradorso e intradorso, resultado de a asa curvar o escoamento e defleti-lo para baixo (não de o ar 'percorrer um caminho mais longo por cima').",
    area: "aerodinamica",
  },
  {
    termo: "Velocidade no ar (airspeed)",
    definicao: "Velocidade da asa em relação ao ar ao redor — é ela que gera sustentação.",
    tecnico:
      "É a velocidade que entra na equação da sustentação. Em um parapente, é definida pela carga alar e pelo ângulo de ataque (freios/acelerador) e é independente do vento. Típica: 22 a 55 km/h.",
    area: "aerodinamica",
  },
  {
    termo: "Velocidade no solo (groundspeed)",
    definicao:
      "Velocidade da asa em relação ao solo; soma vetorial da velocidade no ar com o vento.",
    tecnico:
      "Vetor solo = vetor ar + vetor vento. É o que um GPS mede. Pode ser menor que zero (a asa recua) se o vento de frente superar a velocidade no ar — situação a evitar em relevo.",
    area: "aerodinamica",
  },
  {
    termo: "Vento relativo",
    definicao: "Fluxo de ar que a asa 'sente': igual e oposto ao movimento da asa pelo ar.",
    tecnico:
      "Direção de referência para medir o ângulo de ataque e decompor as forças: sustentação é perpendicular a ele, arrasto é paralelo. Não depende do vento meteorológico, só do movimento da asa pelo ar.",
    area: "aerodinamica",
  },

  // ---------- Meteorologia ----------
  {
    termo: "Anabático",
    definicao: "Vento que sobe a encosta durante o dia, pelo aquecimento do solo (brisa de vale).",
    tecnico:
      "Circulação térmica local: o ar junto à encosta aquece mais que o ar livre na mesma altitude, fica menos denso e sobe pela encosta. Começa poucas horas após o nascer do sol e alimenta as térmicas do dia.",
    area: "meteorologia",
  },
  {
    termo: "Barlavento",
    definicao:
      "Lado da montanha de onde o vento vem; o ar é forçado a subir (sustentação orográfica).",
    tecnico:
      "Zona de elevação dinâmica: a componente vertical do vento cresce com a intensidade e com a inclinação da encosta. É a base do voo de encosta (ridge soaring), com a asa mantida na faixa de ascendência.",
    area: "meteorologia",
  },
  {
    termo: "Catabático",
    definicao:
      "Vento frio que desce a encosta à noite, pelo resfriamento do solo (brisa de montanha).",
    tecnico:
      "O ar em contato com o solo perde calor por irradiação, fica mais denso e escorre encosta abaixo, acumulando-se no fundo dos vales (inversão noturna). Pode gerar vento de cauda inesperado em pousos ao entardecer.",
    area: "meteorologia",
  },
  {
    termo: "Convecção",
    definicao:
      "Movimento vertical do ar causado por diferenças de temperatura — o motor das térmicas.",
    tecnico:
      "Ocorre quando uma parcela de ar aquecida fica mais quente que o ambiente ao subir (atmosfera instável). A intensidade depende do gradiente térmico vertical: quanto mais rápido a temperatura cai com a altura, mais forte a convecção.",
    area: "meteorologia",
  },
  {
    termo: "Cumulonimbus",
    definicao:
      "Nuvem de tempestade, com correntes violentas, raios e granizo. Perigo extremo para o voo.",
    tecnico:
      "Abreviação Cb. Nuvem de grande desenvolvimento vertical (até a tropopausa) com topo em bigorna. Gera correntes ascendentes de dezenas de m/s, rajadas de frente de rajada (gust front) a quilômetros de distância e descargas elétricas.",
    area: "meteorologia",
  },
  {
    termo: "Cumulus",
    definicao: "Nuvem branca de base plana que marca o topo de térmicas ativas.",
    tecnico:
      "Abreviação Cu. Forma-se quando a térmica atinge o nível de condensação; a base plana marca essa altitude, semelhante em todo o céu do dia. Cumulus humilis (achatado) indica dia bom; congestus (torre alta) pede atenção.",
    area: "meteorologia",
  },
  {
    termo: "Rotor",
    definicao: "Circulação turbulenta do ar no lado de sotavento de uma montanha, sob vento forte.",
    tecnico:
      "O escoamento se separa na crista e recircula a sotavento, criando um vórtice de eixo horizontal com fortes descendentes e cisalhamento. Também aparece atrás de árvores, prédios e outros obstáculos, em escala menor.",
    area: "meteorologia",
  },
  {
    termo: "Sotavento",
    definicao: "Lado da montanha oposto ao vento; região de descida e possível turbulência.",
    tecnico:
      "Zona de descendente e, com vento mais forte, de rotor. Pousos e voos a sotavento de relevo devem ser evitados; mesmo o pouso 'atrás' da rampa de decolagem pode estar sob rotor.",
    area: "meteorologia",
  },
  {
    termo: "Stratus",
    definicao: "Nuvem em camadas, baixa e cinzenta; indica ar estável e pouca térmica.",
    tecnico:
      "Abreviação St. Forma-se por resfriamento de ar úmido estável, sem convecção. Pode reduzir a visibilidade e o teto (base baixa), criando risco de voar dentro da nuvem em relevo.",
    area: "meteorologia",
  },
  {
    termo: "Térmica",
    definicao: "Coluna ou bolha de ar quente ascendente usada pelo piloto para ganhar altitude.",
    tecnico:
      "Parcela de ar mais quente (menos densa) que o ambiente, que sobe até se equilibrar ou condensar. Taxas típicas de subida: 1 a 5 m/s. O piloto centra a térmica girando dentro do núcleo mais forte, indicado pelo variômetro.",
    area: "meteorologia",
  },

  // ---------- Segurança ----------
  {
    termo: "Checklist",
    definicao: "Lista de verificação sistemática feita antes de cada voo.",
    tecnico:
      "Barreira contra falhas de memória sob pressão. Sequências comuns cobrem equipamento, linhas, reserva, mosquetões, capacete, condições e plano. Deve ser sempre a mesma, na mesma ordem, para virar hábito.",
    area: "seguranca",
  },
  {
    termo: "Fatores humanos",
    definicao:
      "Aspectos psicológicos e físicos do piloto (cansaço, pressão social, excesso de confiança) que afetam decisões.",
    tecnico:
      "Estudados na aviação sob modelos como o 'queijo suíço' (várias barreiras falhando em sequência). Incluem fadiga, estresse, pressão de grupo, viés de compromisso ('já vim até aqui') e subestimação de risco.",
    area: "seguranca",
  },

  // ---------- Equipamento ----------
  {
    termo: "Freios",
    definicao:
      "Comandos presos às mãos do piloto que puxam o bordo de fuga para virar e controlar a velocidade.",
    tecnico:
      "Linhas de comando ligadas ao bordo de fuga por linhas de freio. Puxar um lado aumenta o arrasto e a sustentação daquele lado (curva); os dois juntos reduzem a velocidade e aumentam o ângulo de ataque até o estol.",
    area: "equipamento",
  },
  {
    termo: "Reserva",
    definicao:
      "Paraquedas de emergência levado na selete, usado quando a asa principal não pode ser recuperada.",
    tecnico:
      "Tipos comuns: redondo, cruciforme (square) e Rogallo dirigível. Precisa de repack periódico (em geral a cada 6 a 12 meses) e altura mínima para abrir — por isso a decisão de lançar deve ser rápida.",
    area: "equipamento",
  },
  {
    termo: "Selete",
    definicao: "Cadeirinha onde o piloto voa sentado; abriga também o reserva e proteções.",
    tecnico:
      "Além do assento e das fivelas, inclui proteção dorsal (airbag ou espuma), contêiner do reserva e pontos de fixação dos mosquetões. Seletes com maior distância entre mosquetões dão mais estabilidade e menos sensibilidade.",
    area: "equipamento",
  },
  {
    termo: "Tirantes",
    definicao:
      "Fitas resistentes que reúnem os grupos de linhas (A, B, C…) e conectam a asa aos mosquetões da selete.",
    tecnico:
      "Também chamados de elevadores ou risers. É neles que ficam o sistema de acelerador (que encurta os tirantes A e reduz o ângulo de ataque) e os trimmers em alguns modelos. As linhas são outra peça: cordas finas que vão dos tirantes até a asa.",
    area: "equipamento",
  },
];
