import { useRef, useState } from "react";
import { SimCanvas } from "@/components/SimCanvas";
import { Slider } from "@/components/Slider";
import { clDidatico, desenharPerfil, seta } from "@/lib/aero";
import { suavizar } from "@/lib/anim";
import { CORES } from "@/lib/colors";

interface Particula {
  x: number;
  y: number;
  y0: number;
  turb: number;
}

const VELOCIDADE_PX_S = 132;

// Animação dedicada ao estol: separação progressiva do fluxo.
export function StallSim() {
  const [aoa, setAoa] = useState(8);
  const particulasRef = useRef<Particula[] | null>(null);
  const cl = clDidatico(aoa);
  const separacaoPct = aoa <= 15 ? 0 : Math.min(1, (aoa - 15) / 8);

  const fase =
    aoa <= 10
      ? { texto: "Fluxo aderido — a asa trabalha com eficiência.", cor: "text-forest" }
      : aoa <= 15
        ? {
            texto: "Ângulo alto — a sustentação cresce, mas estamos perto do limite.",
            cor: "text-thermal",
          }
        : { texto: "ESTOL — o fluxo descolou e a sustentação despencou.", cor: "text-destructive" };

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const corda = Math.min(w * 0.42, 240);

    if (!particulasRef.current) {
      const ps: Particula[] = [];
      for (let i = 0; i < 150; i++) {
        const y0 = (Math.random() - 0.5) * h * 0.9;
        ps.push({ x: Math.random() * w, y: cy + y0, y0, turb: Math.random() * 10 });
      }
      particulasRef.current = ps;
    }

    // Ponto de separação recua em direção ao bordo de ataque conforme o ângulo aumenta
    const pontoSep = -0.6 + separacaoPct * -0.3; // em fração da corda

    for (const p of particulasRef.current) {
      p.x += VELOCIDADE_PX_S * dt;
      const dx = (p.x - cx) / (corda / 2);
      const acima = p.y0 < 0;
      const dentro = Math.abs(dx) < 1.4;
      const descolado = dentro && acima && dx > pontoSep && separacaoPct > 0;
      let alvo = cy + p.y0;

      if (descolado) {
        // Turbulência: movimento caótico e afastamento do perfil
        const c = separacaoPct * (dx - pontoSep) * 120;
        alvo = cy + p.y0 - c + Math.sin(t * 7 + p.turb + p.x * 0.08) * 20 * separacaoPct;
        p.y = suavizar(p.y, alvo, 7, dt);
      } else if (dentro) {
        const infl = Math.exp(-dx * dx * 2);
        alvo = cy + p.y0 + (acima ? -1 : 0.5) * infl * (corda * 0.1 + aoa * 2) + infl * aoa * 2.2;
        p.y = suavizar(p.y, alvo, 5, dt);
      } else {
        p.y = suavizar(p.y, alvo, 3, dt);
      }

      if (p.x > w + 10) {
        p.x = -10;
        p.y0 = (Math.random() - 0.5) * h * 0.9;
        p.y = cy + p.y0;
      }

      ctx.fillStyle = descolado ? CORES.fluxoTurbulento : CORES.fluxo;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    desenharPerfil(ctx, cx, cy, corda, aoa);
    ctx.fillStyle = CORES.perfil;
    ctx.fill();
    ctx.strokeStyle = CORES.perfilBorda;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Marcador do ponto de separação
    if (separacaoPct > 0) {
      const sx = cx + pontoSep * (corda / 2);
      const sy = cy - corda * 0.12 - aoa * 1.5;
      ctx.fillStyle = CORES.arrasto;
      ctx.beginPath();
      ctx.arc(sx, sy, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "bold 12px Manrope, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("separação", sx, sy - 12);
    }

    // Vetor de sustentação encolhendo no estol
    const esc = 55;
    seta(ctx, cx, cy, cx, cy - cl * esc, CORES.sustentacao, `Sustentação (CL ≈ ${cl.toFixed(2)})`);
  };

  return (
    <div>
      <SimCanvas
        draw={draw}
        height={320}
        label="Animação do estol: partículas de ar se descolam do perfil quando o ângulo de ataque passa do limite"
      />
      <div className="mt-4 max-w-md">
        <Slider label="Ângulo de ataque" value={aoa} min={0} max={24} unit="°" onChange={setAoa} />
      </div>
      <p className={`mt-3 font-semibold ${fase.cor}`} role="status" aria-live="polite">
        {fase.texto}
      </p>
      <div className="mt-3 rounded-lg border-2 border-thermal/60 bg-thermal/10 p-3 text-sm">
        <strong>Importante:</strong> esta é uma representação simplificada. O comportamento de uma
        asa real depende do projeto da asa, carga alar, configuração, turbulência e outras
        condições.
      </div>
    </div>
  );
}
