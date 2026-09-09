import { createFileRoute } from "@tanstack/react-router";
import { FlightSimulator } from "@/components/sim/FlightSimulator";
import { Disclaimer } from "@/components/Disclaimer";

export const Route = createFileRoute("/simulador")({
  head: () => ({
    meta: [
      { title: "Simulador de voo — Parapente Lab" },
      {
        name: "description",
        content:
          "Simulador de voo de parapente educacional: explore térmicas, controle o ângulo de ataque, evite o estol e pouse suave.",
      },
      { property: "og:title", content: "Simulador de voo — Parapente Lab" },
      {
        property: "og:description",
        content:
          "Pilote um parapente virtual: ganhe altitude nas térmicas, evite o estol e pratique o pouso.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SimuladorPage,
});

function SimuladorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold">Simulador de voo</h1>
      <p className="mt-2 text-muted-foreground">
        Aplique o que aprendeu: ganhe altitude nas térmicas (colunas laranjas), controle o ângulo
        de ataque com os freios e pouse suave. Cuidado com o estol!
      </p>
      <div className="mt-6">
        <FlightSimulator />
      </div>
      <div className="mt-6">
        <Disclaimer compact />
      </div>
    </div>
  );
}
