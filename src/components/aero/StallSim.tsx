import { useRef, useState } from "react";
import { SimCanvas } from "@/components/SimCanvas";
import { Slider } from "@/components/Slider";
import {
  ANGULO_CRITICO_GRAUS,
  clDidatico,
  desenharPerfil,
  pontoSeparacaoDidatico,
  desenharFiletes,
  seta,
} from "@/lib/aero";


// Animação dedicada ao estol: separação progressiva do fluxo.
export function StallSim() {
  const [aoa, setAoa] = useState(8);
  const cl = clDidatico(aoa);
  const estol = aoa >= ANGULO_CRITICO_GRAUS;
  const proximidadeCritica = Math.min(1, aoa / ANGULO_CRITICO_GRAUS);
  const intensidadeTurbulencia = estol
    ? Math.min(1, 0.62 + (aoa - ANGULO_CRITICO_GRAUS) / 9)
    : 0.08 + proximidadeCritica * 0.18;
  const pontoSep = pontoSeparacaoDidatico(aoa);

  const fase =
    aoa < 8
      ? { texto: "Separação discreta no bordo de fuga — sem perda significativa de sustentação.", cor: "text-forest" }
      : aoa < ANGULO_CRITICO_GRAUS
        ? { texto: "A separação avança para o bordo de ataque — o ângulo crítico está próximo.", cor: "text-thermal" }
        : { texto: `ESTOL — ângulo crítico de ${ANGULO_CRITICO_GRAUS}° atingido; fluxo turbulento e sustentação reduzida.`, cor: "text-destructive" };

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const corda = Math.min(w * 0.42, 240);

    desenharFiletes(ctx, { w, h, t, cx, cy, corda, aoa, pontoSep, intensidade: intensidadeTurbulencia, velocidade: 60 });

    // Perfil
    desenharPerfil(ctx, cx, cy, corda, aoa);
    ctx.fillStyle = "rgba(40,60,90,0.92)";
    ctx.fill();
    ctx.stroke();

    // Marcador que permite acompanhar o avanço da separação pela asa.
    const sx = cx + pontoSep * (corda / 2);
    ctx.fillStyle = "#b03030";
    ctx.beginPath();
    ctx.arc(sx, cy - corda * 0.12 - pontoSep * (corda / 2) * Math.sin((aoa * Math.PI) / 180), 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.font = "bold 12px Manrope, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("ponto de separação", sx, cy - corda * 0.12 - pontoSep * (corda / 2) * Math.sin((aoa * Math.PI) / 180) - 12);

    // Vetor de sustentação encolhendo no estol
    const esc = 55;
    seta(ctx, cx, cy, cx, cy - cl * esc, "#0a7a3d", `Sustentação (CL ≈ ${cl.toFixed(2)})`);
  };

  return (
    <div>
      <SimCanvas
        draw={draw}
        height={320}
        label="Animação do estol: filetes de ar se descolam do perfil quando o ângulo de ataque passa do limite"
        deps={[aoa]}
      />
      <div className="mt-4 max-w-md">
        <Slider label="Ângulo de ataque" value={aoa} min={0} max={24} unit="°" onChange={setAoa} />
        <div className="mt-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Ângulo crítico (stall)</span>
          <strong className="text-destructive">{ANGULO_CRITICO_GRAUS}°</strong>
        </div>
      </div>
      <p className={`mt-3 font-semibold ${fase.cor}`} role="status" aria-live="polite">
        {fase.texto}
      </p>
      <div className="mt-3 rounded-lg border-2 border-thermal/60 bg-thermal/10 p-3 text-sm">
        <strong>Importante:</strong> esta é uma representação simplificada. O comportamento de
        uma asa real depende do projeto da asa, carga alar, configuração, turbulência e outras
        condições.
      </div>
    </div>
  );
}
