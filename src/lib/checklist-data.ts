export interface ChecklistItem {
  id: string;
  titulo: string;
  texto: string;
}

export const CHECKLIST_ITENS: ChecklistItem[] = [
  {
    id: "equipamento",
    titulo: "Equipamento",
    texto: "Vela, selete, capacete e reserva inspecionados e dentro das revisões.",
  },
  {
    id: "linhas",
    titulo: "Linhas e tirantes",
    texto: "Linhas sem nós, embaraços ou danos; mosquetões travados.",
  },
  {
    id: "reserva",
    titulo: "Paraquedas reserva",
    texto: "Pino no lugar, alça acessível e repack em dia.",
  },
  {
    id: "clima",
    titulo: "Condições meteorológicas",
    texto: "Vento, térmicas, nuvens e previsão analisados para o horário do voo.",
  },
  {
    id: "local",
    titulo: "Decolagem e pouso",
    texto: "Áreas livres de obstáculos, com alternativas de pouso identificadas.",
  },
  {
    id: "plano",
    titulo: "Plano de voo",
    texto: "Rota planejada, limites pessoais definidos e alguém avisado sobre o voo.",
  },
  {
    id: "saude",
    titulo: "Condição física e mental",
    texto: "Descansado, atento, sem pressa e sem pressão externa para voar.",
  },
];
