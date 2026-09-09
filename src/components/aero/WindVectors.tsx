import { useState } from "react";
import { SimCanvas } from "@/components/SimCanvas";
import { Slider } from "@/components/Slider";

// Vento relativo x vento real: composição vetorial.
// vetor solo = vetor ar (proa + velocidade aerodinâmica) + vetor vento
export function WindVectors() {
  const [proa, setProa] = useState(90); // direção do voo (graus, 0=N, 90=L)
  const [velAr, setVelAr] = useState(38); // km/h
  const [dirVento, setDirVento] = useState(270); // de onde o vento VEM
  const [velVento, setVelVento] = useState(15);

  const arMs = velAr / 3.6;
  const ventoMs = velVento / 3.6;
  // componentes (x = leste, y = norte)
  const ar = {
    x: arMs * Math.sin((proa * Math.PI) / 180),
    y: arMs * Math.cos((proa * Math.PI) / 180),
  };
  const ventoPara = (dirVento + 180) % 360; // vento sopra PARA o lado oposto de onde vem
  const vento = {
    x: ventoMs * Math.sin((ventoPara * Math.PI) / 180),
    y: ventoMs * Math.cos((ventoPara * Math.PI) / 180),
  };
  const solo = { x: ar.x + vento.x, y: ar.y + vento.y };
  const velSolo = Math.hypot(solo.x, solo.y) * 3.6;
  const proaSolo = ((Math.atan2(solo.x, solo.y) * 180) / Math.PI + 360) % 360;

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const esc = 2.6; // px por m/s

    ctx.strokeStyle = "rgba(100,120,150,0.3)";
    ctx.lineWidth = 1;
    for (const r of [40, 80, 120]) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(80,100,130,0.8)";
    ctx.font = "bold 12px Manrope, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("N", cx, cy - 128);
    ctx.fillText("S", cx, cy + 140);
    ctx.fillText("L", cx + 132, cy + 4);
    ctx.fillText("O", cx - 132, cy + 4);

    const setaLocal = (x1: number, y1: number, x2: number, y2: number, cor: string, rotulo: string, largura = 3) => {
      const ang = Math.atan2(y2 - y1, x2 - x1);
      ctx.strokeStyle = cor;
      ctx.fillStyle = cor;
      ctx.lineWidth = largura;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      const p = 9;
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - p * Math.cos(ang - 0.45), y2 - p * Math.sin(ang - 0.45));
      ctx.lineTo(x2 - p * Math.cos(ang + 0.45), y2 - p * Math.sin(ang + 0.45));
      ctx.closePath();
      ctx.fill();
      ctx.font = "bold 13px Manrope, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(rotulo, x2, y2 - 10);
    };

    // Vetor ar (azul): para onde a asa aponta
    setaLocal(cx, cy, cx + ar.x * esc, cy - ar.y * esc, "#1d4ed8", "No ar");
    // Vetor vento (roxo): deslocamento da massa de ar
    setaLocal(cx + ar.x * esc, cy - ar.y * esc, cx + solo.x * esc, cy - solo.y * esc, "#7c3aed", "Vento");
    // Vetor solo (verde): resultado sobre o terreno
    setaLocal(cx, cy, cx + solo.x * esc, cy - solo.y * esc, "#0a7a3d", "No solo", 4);

    ctx.font = "22px sans-serif";
    ctx.fillText("🪂", cx, cy + 8);
  };

  return (
    <div>
      <SimCanvas
        draw={draw}
        height={340}
        label="Diagrama vetorial: velocidade no ar, vento e velocidade resultante sobre o solo"
        deps={[proa, velAr, dirVento, velVento]}
      />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Slider label="Direção do voo (proa)" value={proa} min={0} max={359} unit="°" onChange={setProa} />
        <Slider label="Velocidade no ar" value={velAr} min={20} max={55} unit="km/h" onChange={setVelAr} />
        <Slider label="Vento vem de" value={dirVento} min={0} max={359} unit="°" onChange={setDirVento} />
        <Slider label="Velocidade do vento" value={velVento} min={0} max={45} unit="km/h" onChange={setVelVento} />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3" aria-live="polite">
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="text-xs text-muted-foreground">Velocidade no ar</p>
          <p className="text-lg font-bold text-primary tabular-nums">{velAr} km/h</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="text-xs text-muted-foreground">Vento</p>
          <p className="text-lg font-bold tabular-nums" style={{ color: "#7c3aed" }}>{velVento} km/h</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-3 text-center">
          <p className="text-xs text-muted-foreground">Velocidade no solo</p>
          <p className="text-lg font-bold text-forest tabular-nums">
            {velSolo.toFixed(0)} km/h → {Math.round(proaSolo)}°
          </p>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Valores ilustrativos. Repare: com vento de cauda o solo fica mais rápido que o ar;
        com vento de frente, mais lento — e a direção sobre o terreno muda.
      </p>
    </div>
  );
}
