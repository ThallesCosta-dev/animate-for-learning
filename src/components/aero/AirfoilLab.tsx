import { useMemo, useRef, useState } from "react";
import { SimCanvas } from "@/components/SimCanvas";
import { Slider } from "@/components/Slider";
import {
  arrasto,
  clDidatico,
  desenharPerfil,
  kmhParaMs,
  seta,
  sustentacao,
} from "@/lib/aero";
import { MODEL_DISCLAIMER } from "@/lib/config";

interface Particula {
  x: number;
  y: number;
  y0: number; // linha de corrente original
}

// Laboratório do perfil: partículas de ar + vetores de forças em tempo real.
export function AirfoilLab() {
  const [aoa, setAoa] = useState(6);
  const [velKmh, setVelKmh] = useState(38);
  const [peso, setPeso] = useState(85);
  const [rho, setRho] = useState(1.2);
  const [area, setArea] = useState(26);
  const particulasRef = useRef<Particula[] | null>(null);

  const vMs = kmhParaMs(velKmh);
  const L = useMemo(() => sustentacao(rho, vMs, area, aoa), [rho, vMs, area, aoa]);
  const D = useMemo(() => arrasto(rho, vMs, area, aoa), [rho, vMs, area, aoa]);
  const P = peso * 9.81;
  const estol = aoa > 15;

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const corda = Math.min(w * 0.42, 240);

    // Inicializa partículas em linhas de corrente
    if (!particulasRef.current) {
      const ps: Particula[] = [];
      for (let i = 0; i < 130; i++) {
        const y0 = (Math.random() - 0.5) * h * 0.9;
        ps.push({ x: Math.random() * w, y: cy + y0, y0 });
      }
      particulasRef.current = ps;
    }
    const ps = particulasRef.current;

    const velocidadePx = (vMs * 30) / 10; // escala visual

    for (const p of ps) {
      p.x += velocidadePx * (1 / 60);
      const dx = (p.x - cx) / (corda / 2);
      let alvo = cy + p.y0;

      if (Math.abs(dx) < 1.4) {
        // Desvio causado pelo perfil: partículas de cima sobem, as de baixo descem menos
        const infl = Math.exp(-dx * dx * 2);
        const desvioBase = p.y0 >= 0 ? -1 : 0.55;
        let separacao = 0;
        if (estol && p.y0 < 0 && dx > -0.6) {
          // No estol o fluxo se descola do extradorso: partículas se afastam caoticamente
          separacao = Math.sin(t * 6 + p.y0 * 0.3 + p.x * 0.05) * 26 * (dx + 0.6);
        }
        alvo =
          cy +
          p.y0 +
          desvioBase * infl * (corda * 0.1 + aoa * 2.2) +
          infl * aoa * 2.4 + // perfil inclinado empurra o fluxo para baixo atrás
          separacao;
      } else if (dx < -1.4 && dx > -4) {
        // esteira: fluxo desviado para baixo (downwash)
        alvo = cy + p.y0 + aoa * 2.4 * Math.exp(-(dx + 1.4) * 0.4);
      }

      p.y += (alvo - p.y) * 0.08;
      if (p.x > w + 10) {
        p.x = -10;
        p.y0 = (Math.random() - 0.5) * h * 0.9;
        p.y = cy + p.y0;
      }

      const acima = p.y0 < 0;
      ctx.fillStyle = estol && acima ? "rgba(220,80,50,0.75)" : "rgba(30,100,200,0.6)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Perfil
    desenharPerfil(ctx, cx, cy, corda, aoa);
    ctx.fillStyle = "rgba(40,60,90,0.92)";
    ctx.fill();
    ctx.strokeStyle = "rgba(20,35,60,1)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Corda de referência tracejada
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((-aoa * Math.PI) / 180);
    ctx.setLineDash([6, 5]);
    ctx.strokeStyle = "rgba(20,35,60,0.5)";
    ctx.beginPath();
    ctx.moveTo(-corda * 0.75, 0);
    ctx.lineTo(corda * 0.75, 0);
    ctx.stroke();
    ctx.restore();
    ctx.setLineDash([]);

    // Vento relativo (linha horizontal de referência)
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = "rgba(30,100,200,0.6)";
    ctx.beginPath();
    ctx.moveTo(cx - corda, cy);
    ctx.lineTo(cx - corda * 0.55, cy);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(30,80,180,0.9)";
    ctx.font = "12px Manrope, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("vento relativo", cx - corda, cy - 8);

    // Vetores de força (escala visual)
    const esc = 0.06;
    seta(ctx, cx, cy, cx, cy - L * esc, "#0a7a3d", "Sustentação");
    seta(ctx, cx, cy, cx, cy + P * esc, "#7a3d0a", "Peso");
    seta(ctx, cx, cy, cx + D * esc, cy, "#b03030", "Arrasto");

    if (estol) {
      ctx.fillStyle = "rgba(180,30,30,0.95)";
      ctx.font = "bold 15px Sora, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("⚠ ESTOL — fluxo descolado do perfil", cx, 26);
    }
  };

  return (
    <div>
      <SimCanvas
        draw={draw}
        height={340}
        label="Simulação do fluxo de ar sobre o perfil da asa com vetores de sustentação, peso e arrasto"
        deps={[aoa, velKmh, estol]}
      />

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Slider label="Ângulo de ataque" value={aoa} min={0} max={22} unit="°" onChange={setAoa} />
        <Slider label="Velocidade" value={velKmh} min={15} max={65} unit="km/h" onChange={setVelKmh} />
        <Slider label="Peso total" value={peso} min={60} max={120} unit="kg" onChange={setPeso} />
        <Slider label="Densidade do ar" value={rho} min={0.9} max={1.3} step={0.01} unit="kg/m³" onChange={setRho} />
        <Slider label="Área da asa" value={area} min={20} max={32} unit="m²" onChange={setArea} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" aria-live="polite">
        <Leitura rotulo="Sustentação" valor={L} unidade="N" cor="text-forest" />
        <Leitura rotulo="Arrasto" valor={D} unidade="N" cor="text-destructive" />
        <Leitura rotulo="Peso" valor={P} unidade="N" cor="text-thermal" />
        <Leitura rotulo="CL didático" valor={clDidatico(aoa)} unidade="" cor="text-primary" decimais={2} />
      </div>

      <p className="mt-4 rounded-lg border border-border bg-muted p-3 text-xs text-muted-foreground">
        {MODEL_DISCLAIMER}
      </p>
    </div>
  );
}

export function Leitura({
  rotulo,
  valor,
  unidade,
  cor,
  decimais = 0,
}: {
  rotulo: string;
  valor: number;
  unidade: string;
  cor: string;
  decimais?: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <p className="text-xs text-muted-foreground">{rotulo}</p>
      <p className={`text-lg font-bold tabular-nums ${cor}`}>
        {valor.toFixed(decimais)} {unidade}
      </p>
    </div>
  );
}
