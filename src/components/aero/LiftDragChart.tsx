import { useEffect, useRef, useState } from "react";
import type { Chart } from "chart.js";
import { Slider } from "@/components/Slider";
import { arrasto, kmhParaMs, sustentacao } from "@/lib/aero";
import { CORES } from "@/lib/colors";
import { MODEL_DISCLAIMER } from "@/lib/config";

const VEL_MIN = 15;
const VEL_MAX = 65;
const VELOCIDADES = Array.from({ length: VEL_MAX - VEL_MIN + 1 }, (_, i) => VEL_MIN + i);

type GraficoLinha = Chart<"line", number[], number>;

function raiosMarcador(marcador: number): number[] {
  const raios = new Array<number>(VELOCIDADES.length).fill(0);
  raios[marcador - VEL_MIN] = 6;
  return raios;
}

// Gráfico Sustentação x Arrasto em função da velocidade (Chart.js).
// O gráfico é criado uma vez; sliders só atualizam os dados no lugar.
export function LiftDragChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<GraficoLinha | null>(null);
  const [aoa, setAoa] = useState(6);
  const [marcador, setMarcador] = useState(38);
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    let disposed = false;

    import("chart.js").then((mod) => {
      if (disposed || !canvasRef.current) return;
      mod.Chart.register(...mod.registerables);

      const chart = new mod.Chart(canvasRef.current, {
        type: "line",
        data: {
          labels: VELOCIDADES,
          datasets: [
            {
              label: "Sustentação (N)",
              data: VELOCIDADES.map((v) => sustentacao(1.2, kmhParaMs(v), 26, 6)),
              borderColor: CORES.sustentacao,
              backgroundColor: "rgba(10,122,61,0.12)",
              fill: true,
              tension: 0.3,
              pointRadius: raiosMarcador(38),
            },
            {
              label: "Arrasto (N)",
              data: VELOCIDADES.map((v) => arrasto(1.2, kmhParaMs(v), 26, 6)),
              borderColor: CORES.arrasto,
              backgroundColor: "rgba(176,48,48,0.08)",
              fill: true,
              tension: 0.3,
              pointRadius: raiosMarcador(38),
            },
          ],
        },
        options: {
          responsive: true,
          animation: { duration: 250 },
          interaction: { mode: "index", intersect: false },
          plugins: {
            legend: { labels: { font: { family: "Manrope" } } },
            tooltip: {
              callbacks: {
                title: (items) => `${items[0]?.label ?? ""} km/h`,
              },
            },
          },
          scales: {
            x: { title: { display: true, text: "Velocidade (km/h)" } },
            y: { title: { display: true, text: "Força (N) — valores ilustrativos" } },
          },
        },
      }) as GraficoLinha;
      chartRef.current = chart;
      setPronto(true);
    });

    return () => {
      disposed = true;
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  // Atualiza curvas e marcador sem recriar o gráfico.
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const raios = raiosMarcador(marcador);
    chart.data.datasets[0]!.data = VELOCIDADES.map((v) => sustentacao(1.2, kmhParaMs(v), 26, aoa));
    chart.data.datasets[1]!.data = VELOCIDADES.map((v) => arrasto(1.2, kmhParaMs(v), 26, aoa));
    chart.data.datasets[0]!.pointRadius = raios;
    chart.data.datasets[1]!.pointRadius = raios;
    chart.update();
  }, [aoa, marcador, pronto]);

  return (
    <div>
      <div className="rounded-xl border border-border bg-card p-4">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Gráfico das curvas de sustentação e arrasto em função da velocidade"
        />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Slider label="Ângulo de ataque" value={aoa} min={2} max={14} unit="°" onChange={setAoa} />
        <Slider
          label="Velocidade (marcador)"
          value={marcador}
          min={VEL_MIN}
          max={VEL_MAX}
          unit="km/h"
          onChange={setMarcador}
        />
      </div>
      <p className="mt-3 rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground">
        {MODEL_DISCLAIMER} Repare que as duas curvas crescem com o quadrado da velocidade — a
        relação não é linear.
      </p>
    </div>
  );
}
