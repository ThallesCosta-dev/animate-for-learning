import { useState } from "react";
import { SimCanvas } from "@/components/SimCanvas";
import { Slider } from "@/components/Slider";

// Planeio: trajetória sobre o terreno conforme razão de planeio e vento.
export function GlideSim() {
  const [razao, setRazao] = useState(9); // razão de planeio didática (ex.: 9:1)
  const [vento, setVento] = useState(0); // km/h: negativo = frente, positivo = cauda
  const [animar, setAnimar] = useState(true);

  // Modelo didático: velocidade horizontal ~38 km/h; o vento soma/subtrai no solo.
  const velArKmh = 38;
  const velSoloKmh = Math.max(5, velArKmh + vento);
  const alcanceRel = (velSoloKmh / velArKmh) * razao; // alcance proporcional

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const soloY = h - 40;
    const startX = 60;
    const startY = 50;

    // Céu e terreno
    const grad = ctx.createLinearGradient(0, 0, 0, soloY);
    grad.addColorStop(0, "rgba(150,200,240,0.5)");
    grad.addColorStop(1, "rgba(220,240,255,0.2)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, soloY);
    ctx.fillStyle = "rgba(90,140,90,0.55)";
    ctx.beginPath();
    ctx.moveTo(0, soloY);
    ctx.lineTo(w * 0.35, soloY - 30);
    ctx.lineTo(w * 0.6, soloY);
    ctx.lineTo(w, soloY - 12);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fill();

    // Trajetória: sobe razão de planeio em px
    const quedaPx = soloY - startY;
    const runPx = Math.min(w - startX - 20, quedaPx * (alcanceRel / 3));
    const endX = startX + runPx;

    ctx.setLineDash([8, 6]);
    ctx.strokeStyle = "rgba(30,80,180,0.8)";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, soloY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Ângulo de planeio
    ctx.strokeStyle = "rgba(80,100,130,0.6)";
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + 90, startY);
    ctx.stroke();
    ctx.fillStyle = "rgba(60,80,110,0.9)";
    ctx.font = "12px Manrope, sans-serif";
    ctx.textAlign = "left";
    const angulo = (Math.atan2(quedaPx, runPx) * 180) / Math.PI;
    ctx.fillText(`ângulo de planeio ≈ ${angulo.toFixed(0)}°`, startX + 8, startY + 18);

    // Parapente animado ao longo da trajetória
    const ciclo = animar ? (t * 0.25) % 1 : 0.35;
    const px = startX + (endX - startX) * ciclo;
    const py = startY + (soloY - startY) * ciclo;
    ctx.font = "26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("🪂", px, py);

    // Setas de distância e altitude
    ctx.strokeStyle = "#0a7a3d";
    ctx.fillStyle = "#0a7a3d";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(startX, soloY + 16);
    ctx.lineTo(endX, soloY + 16);
    ctx.stroke();
    ctx.font = "bold 12px Manrope, sans-serif";
    ctx.fillText(`distância no solo ∝ ${alcanceRel.toFixed(1)} (ilustrativo)`, (startX + endX) / 2, soloY + 32);

    ctx.strokeStyle = "#7a3d0a";
    ctx.fillStyle = "#7a3d0a";
    ctx.beginPath();
    ctx.moveTo(startX - 14, startY);
    ctx.lineTo(startX - 14, soloY);
    ctx.stroke();
    ctx.save();
    ctx.translate(startX - 22, (startY + soloY) / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("perda de altitude", 0, 0);
    ctx.restore();

    // Indicação do vento
    if (vento !== 0) {
      ctx.fillStyle = vento > 0 ? "#7c3aed" : "#b03030";
      ctx.font = "bold 13px Manrope, sans-serif";
      ctx.textAlign = "left";
      const dir = vento > 0 ? "→→→ vento de cauda" : "←←← vento de frente";
      ctx.fillText(dir, 16, 24);
    }
  };

  return (
    <div>
      <SimCanvas
        draw={draw}
        height={320}
        label="Trajetória de planeio de um parapente sobre o terreno, influenciada pelo vento"
        deps={[razao, vento, animar]}
      />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Slider label="Razão de planeio (didática)" value={razao} min={5} max={12} unit=": 1" onChange={setRazao} />
        <Slider label="Vento (− frente / + cauda)" value={vento} min={-20} max={20} unit="km/h" onChange={setVento} />
      </div>
      <button
        type="button"
        onClick={() => setAnimar((v) => !v)}
        className="mt-3 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        {animar ? "⏸ Pausar" : "▶ Animar"}
      </button>
      <p className="mt-3 text-sm text-muted-foreground">
        A razão de planeio diz quantos metros a asa avança para cada metro que desce, em ar
        calmo. Vento de frente encurta o alcance sobre o solo; vento de cauda estica — mas
        aumenta a velocidade de aproximação no pouso. Valores ilustrativos.
      </p>
    </div>
  );
}
