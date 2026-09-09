import { useEffect, useRef, useState } from "react";
import type { Chart } from "chart.js";
import { Slider } from "@/components/Slider";
import { arrasto, kmhParaMs, sustentacao } from "@/lib/aero";
import { MODEL_DISCLAIMER } from "@/lib/config";

// Gráfico animado Sustentação x Arrasto em função da velocidade (Chart.js).
export function LiftDragChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart<"line", number[], number> | null>(null);
  const [aoa, setAoa] = useState(6);
  const [marcador, setMarcador] = useState(38);

  useEffect(() => {
    let disposed = false;

    import("chart.js").then((mod) => {
      if (disposed || !canvasRef.current) return;
      mod.Chart.register(...mod.registerables);

      const velocidades: number[] = [];
      for (let v = 15; v <= 65; v += 1) velocidades.push(v);

      const chart = new mod.Chart(canvasRef.current, {
        type: "line",
        data: {
          labels: velocidades,
          datasets: [
            {
              label: "Sustentação (N)",
              data: velocidades.map((v) => sustentacao(1.2, kmhParaMs(v), 26, aoa)),
              borderColor: "#0a7a3d",
              backgroundColor: "rgba(10,122,61,0.12)",
              fill: true,
              tension: 0.3,
              pointRadius: 0,
            },
            {
              label: "Arrasto (N)",
              data: velocidades.map((v) => arrasto(1.2, kmhParaMs(v), 26, aoa)),
              borderColor: "#b03030",
              backgroundColor: "rgba(176,48,48,0.08)",
              fill: true,
              tension: 0.3,
              pointRadius: 0,
            },
          ],
        },
        options: {
          responsive: true,
          animation: { duration: 400 },
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
      });
      chartRef.current = chart as Chart<"line", number[], number>;
    });

    return () => {
      disposed = true;
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, [aoa]);

  // marcador de velocidade atual
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;
    const idx = marcador - 15;
    const raios = new Array<number>(51).fill(0);
    raios[idx] = 6;
    chart.data.datasets[0]!.pointRadius = raios;
    chart.data.datasets[1]!.pointRadius = raios;
    chart.update();
  }, [marcador, aoa]);

  return (
    <div>
      <div className="rounded-xl border border-border bg-card p-4">
        <canvas ref={canvasRef} role="img" aria-label="Gráfico das curvas de sustentação e arrasto em função da velocidade" />
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Slider label="Ângulo de ataque" value={aoa} min={2} max={14} unit="°" onChange={setAoa} />
        <Slider label="Velocidade (marcador)" value={marcador} min={15} max={65} unit="km/h" onChange={setMarcador} />
      </div>
      <p className="mt-3 rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground">
        {MODEL_DISCLAIMER} Repare que as duas curvas crescem com o quadrado da velocidade —
        a relação não é linear.
      </p>
    </div>
  );
}
