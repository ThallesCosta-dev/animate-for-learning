import { useState } from "react";
import { SimCanvas } from "@/components/SimCanvas";
import { Slider } from "@/components/Slider";

// Carga alar: dois conjuntos piloto+asa com configurações diferentes.
export function WingLoading() {
  const [pesoA, setPesoA] = useState(75);
  const [areaA, setAreaA] = useState(28);
  const [pesoB, setPesoB] = useState(105);
  const [areaB, setAreaB] = useState(24);

  const cargaA = pesoA / areaA;
  const cargaB = pesoB / areaB;

  const drawGlider = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    area: number,
    cor: string,
    t: number,
    carga: number
  ) => {
    const envergadura = 60 + area * 2.4;
    const balanco = Math.sin(t * (1 + carga * 0.25)) * 2;
    // asa (arco)
    ctx.strokeStyle = cor;
    ctx.fillStyle = cor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x - envergadura / 2, y + 14);
    ctx.quadraticCurveTo(x, y - 20, x + envergadura / 2, y + 14);
    ctx.quadraticCurveTo(x, y - 4, x - envergadura / 2, y + 14);
    ctx.closePath();
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.globalAlpha = 1;
    // linhas
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(60,70,90,0.7)";
    for (const f of [-0.4, -0.15, 0.15, 0.4]) {
      ctx.beginPath();
      ctx.moveTo(x + f * envergadura, y + 4);
      ctx.lineTo(x, y + 42);
      ctx.stroke();
    }
    // piloto
    ctx.fillStyle = "#334155";
    ctx.beginPath();
    ctx.arc(x, y + 46 + balanco, 6, 0, Math.PI * 2);
    ctx.fill();
  };

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const soloY = h - 24;
    ctx.fillStyle = "rgba(90,140,90,0.4)";
    ctx.fillRect(0, soloY, w, h - soloY);

    drawGlider(ctx, w * 0.25, 70, areaA, "#1d4ed8", t, cargaA);
    drawGlider(ctx, w * 0.75, 70, areaB, "#c2500a", t, cargaB);

    // Velocidade relativa de descida (didática): carga maior ⇒ desce/planeia mais rápido
    const descA = 1 + cargaA * 0.35;
    const descB = 1 + cargaB * 0.35;
    const yA = 70 + ((t * descA * 18) % (soloY - 90));
    const yB = 70 + ((t * descB * 18) % (soloY - 90));
    ctx.fillStyle = "rgba(29,78,216,0.25)";
    ctx.fillRect(w * 0.25 - 2, 70, 4, yA - 70);
    ctx.fillStyle = "rgba(194,80,10,0.25)";
    ctx.fillRect(w * 0.75 - 2, 70, 4, yB - 70);

    ctx.fillStyle = "#1d4ed8";
    ctx.font = "bold 13px Manrope, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Piloto A — carga alar ${cargaA.toFixed(1)} kg/m²`, w * 0.25, h - 6);
    ctx.fillStyle = "#c2500a";
    ctx.fillText(`Piloto B — carga alar ${cargaB.toFixed(1)} kg/m²`, w * 0.75, h - 6);
  };

  return (
    <div>
      <SimCanvas
        draw={draw}
        height={300}
        label="Comparação visual de dois pilotos com cargas alares diferentes"
      />
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        <fieldset className="rounded-xl border border-border p-3">
          <legend className="px-1 text-sm font-semibold text-primary">Piloto A</legend>
          <Slider label="Peso total" value={pesoA} min={55} max={130} unit="kg" onChange={setPesoA} />
          <Slider label="Área da asa" value={areaA} min={18} max={34} unit="m²" onChange={setAreaA} />
        </fieldset>
        <fieldset className="rounded-xl border border-border p-3">
          <legend className="px-1 text-sm font-semibold" style={{ color: "#c2500a" }}>Piloto B</legend>
          <Slider label="Peso total" value={pesoB} min={55} max={130} unit="kg" onChange={setPesoB} />
          <Slider label="Área da asa" value={areaB} min={18} max={34} unit="m²" onChange={setAreaB} />
        </fieldset>
      </div>
      <p className="mt-3 rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground">
        Carga alar = peso total ÷ área da asa. No modelo didático, carga maior tende a voar e
        descer mais rápido. Isto NÃO é recomendação para escolher tamanho de asa — essa
        decisão depende do fabricante, do seu nível e de um instrutor.
      </p>
    </div>
  );
}
