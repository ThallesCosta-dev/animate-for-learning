import { createFileRoute } from "@tanstack/react-router";
import { FlightSimulator } from "@/components/sim/FlightSimulator";
import { Disclaimer } from "@/components/Disclaimer";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/simulador")({
  head: () =>
    seo({
      titulo: "Simulador de voo",
      descricao:
        "Simulador de voo de parapente educacional: explore térmicas, controle o ângulo de ataque, sinta o vento, evite o estol e pouse na área certa.",
      path: "/simulador",
    }),
  component: SimuladorPage,
});

function SimuladorPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold">Simulador de voo</h1>
      <p className="mt-2 text-muted-foreground">
        Aplique o que aprendeu: ganhe altitude nas térmicas (colunas laranjas), controle o ângulo de
        ataque com os freios, sinta a diferença entre velocidade no ar e no solo com o vento, e
        pouse suave na faixa amarela. Cuidado com o estol!
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
