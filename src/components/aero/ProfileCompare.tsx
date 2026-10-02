import { useState } from "react";
import { SimCanvas } from "@/components/SimCanvas";
import { Slider } from "@/components/Slider";
import {
  PERFIS_DIDATICOS,
  cdPerfil,
  clPerfil,
  desenharFiletes,
  desenharPerfilCom,
  pontoSeparacaoPerfil,
  type PerfilDidatico,
} from "@/lib/aero";

const CL_MAX = 1.8;
const CD_MAX = 0.6;

function Cartao({ perfil, aoa }: { perfil: PerfilDidatico; aoa: number }) {
  const cl = clPerfil(perfil, aoa);
  const cd = cdPerfil(perfil, aoa);
  const estol = aoa >= perfil.anguloCritico;
  const pontoSep = pontoSeparacaoPerfil(perfil, aoa);
  const intensidade = estol
    ? Math.min(1, 0.62 + (aoa - perfil.anguloCritico) / 9)
    : 0.08 + (Math.max(0, aoa) / perfil.anguloCritico) * 0.18;

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const cx = w / 2;
    const cy = h / 2;
    const corda = Math.min(w * 0.55, 200);
    desenharFiletes(ctx, { w, h, t, cx, cy, corda, aoa, pontoSep, intensidade });
    desenharPerfilCom(ctx, cx, cy, corda, aoa, perfil.espessura);
    ctx.fillStyle = "rgba(40,60,90,0.92)";
    ctx.fill();
  };

  return (
    <div
      className={`rounded-xl border-2 bg-card p-3 ${estol ? "border-destructive" : "border-border"}`}
    >
      <h4 className="font-bold">{perfil.nome}</h4>
      <p className="mb-2 text-xs text-muted-foreground">{perfil.descricao}</p>
      <SimCanvas draw={draw} height={170} label={`Filetes de ar em torno do ${perfil.nome}`} />
      <p className="mt-2 text-sm">
        Ângulo crítico: <strong className="text-destructive">{perfil.anguloCritico}°</strong>
      </p>
      <div className="mt-2 space-y-2 text-xs">
        <div>
          <div className="flex justify-between">
            <span>Sustentação (CL)</span>
            <strong>{cl.toFixed(2)}</strong>
          </div>
          <div className="h-2 rounded bg-muted">
            <div
              className="h-2 rounded bg-forest"
              style={{ width: `${Math.max(0, Math.min(100, (cl / CL_MAX) * 100))}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between">
            <span>Arrasto (CD)</span>
            <strong>{cd.toFixed(3)}</strong>
          </div>
          <div className="h-2 rounded bg-muted">
            <div
              className="h-2 rounded bg-thermal"
              style={{ width: `${Math.min(100, (cd / CD_MAX) * 100)}%` }}
            />
          </div>
        </div>
      </div>
      <p
        className={`mt-2 text-sm font-semibold ${estol ? "text-destructive" : "text-forest"}`}
        role="status"
        aria-live="polite"
      >
        {aoa < 0
          ? "Ângulo negativo — sustentação reduzida"
          : estol
            ? "ESTOL — fluxo descolado"
            : `Fluxo aderido (faltam ${perfil.anguloCritico - aoa}°)`}
      </p>
    </div>
  );
}

// Comparação lado a lado: mesmo ângulo de ataque em perfis diferentes.
export function ProfileCompare() {
  const [aoa, setAoa] = useState(10);
  return (
    <div>
      <div className="mb-4 max-w-md">
        <Slider
          label="Ângulo de ataque (igual para todos)"
          value={aoa}
          min={-10}
          max={24}
          unit="°"
          onChange={setAoa}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {PERFIS_DIDATICOS.map((p) => (
          <Cartao key={p.id} perfil={p} aoa={aoa} />
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Valores didáticos e simplificados: perfis reais variam conforme projeto, carga e condições.
      </p>
    </div>
  );
}
