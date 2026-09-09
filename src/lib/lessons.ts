// Registro de aulas usado para calcular o progresso por área.
export type AreaKey = "aerodinamica" | "meteorologia" | "seguranca";

export const AREA_LABELS: Record<AreaKey, string> = {
  aerodinamica: "Aerodinâmica",
  meteorologia: "Meteorologia",
  seguranca: "Segurança",
};

export interface LessonRef {
  id: string;
  area: AreaKey;
  title: string;
}

export const LESSONS: LessonRef[] = [
  { id: "componentes", area: "aerodinamica", title: "Componentes do parapente" },
  { id: "perfil", area: "aerodinamica", title: "Laboratório do perfil" },
  { id: "angulo", area: "aerodinamica", title: "Ângulo de ataque" },
  { id: "sustentacao-arrasto", area: "aerodinamica", title: "Sustentação e arrasto" },
  { id: "estol", area: "aerodinamica", title: "Estol" },
  { id: "carga-alar", area: "aerodinamica", title: "Peso e carga alar" },
  { id: "vento-relativo", area: "aerodinamica", title: "Vento relativo e vento real" },
  { id: "planeio", area: "aerodinamica", title: "Planeio" },
  { id: "meteo-fundamentos", area: "meteorologia", title: "Fundamentos do ar" },
  { id: "termica", area: "meteorologia", title: "Térmicas" },
  { id: "ciclo-termica", area: "meteorologia", title: "Ciclo de vida da térmica" },
  { id: "vento-relevo", area: "meteorologia", title: "Vento e relevo" },
  { id: "brisa", area: "meteorologia", title: "Brisa de vale e de montanha" },
  { id: "nuvens", area: "meteorologia", title: "Nuvens" },
  { id: "antes-voo", area: "seguranca", title: "Antes do voo" },
  { id: "durante-voo", area: "seguranca", title: "Durante o voo" },
  { id: "depois-voo", area: "seguranca", title: "Depois do voo" },
  { id: "checklist", area: "seguranca", title: "Checklist pré-voo" },
  { id: "cenarios", area: "seguranca", title: "Cenários de decisão" },
];

export function lessonsByArea(area: AreaKey): LessonRef[] {
  return LESSONS.filter((l) => l.area === area);
}
