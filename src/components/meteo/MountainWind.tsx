import { useRef, useState } from "react";
import { SimCanvas } from "@/components/SimCanvas";
import { Slider } from "@/components/Slider";
import { suavizar } from "@/lib/anim";
import { CORES } from "@/lib/colors";

interface Particula {
  x: number;
  y: number;
}

// Vento e relevo: fluxo sobre a montanha, rotor e turbulência de sotavento.
export function MountainWind() {
  const [direcao, setDirecao] = useState(0); // 0 = esquerda→direita, 1 = direita→esquerda
  const [forca, setForca] = useState(20); // km/h
  const particulasRef = useRef<Particula[] | null>(null);

  const montanhaY = (x: number, w: number, h: number) => {
    const base = h - 40;
    const pico = h * 0.32;
    const u = (x / w - 0.5) * 2.4;
    return base - (base - pico) * Math.exp(-u * u);
  };

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number) => {
    // montanha
    ctx.fillStyle = "rgba(110,135,110,0.75)";
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 6) ctx.lineTo(x, montanhaY(x, w, h));
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    if (!particulasRef.current) {
      const ps: Particula[] = [];
      for (let i = 0; i < 160; i++) ps.push({ x: Math.random() * w, y: Math.random() * h * 0.8 });
      particulasRef.current = ps;
    }

    const sentido = direcao === 0 ? 1 : -1;
    const vxPxS = sentido * (1 + forca / 12) * 60;
    const sotaX = direcao === 0 ? 0.72 : 0.28; // centro do rotor (lado de sotavento)
    const temRotor = forca > 12;

    for (const p of particulasRef.current) {
      p.x += vxPxS * dt;
      const solo = montanhaY(p.x, w, h);
      const alvoMin = solo - 14;

      // lado de sotavento: rotor (circulação) + turbulência
      const distSota = Math.abs(p.x / w - sotaX);
      const noRotor = temRotor && distSota < 0.13 && p.y > solo - 110;
      if (noRotor) {
        const a = t * (2 + forca / 10) + p.x * 0.05;
        const rcx = sotaX * w;
        const rcy = solo - 60;
        const r = 24 + (p.y % 40);
        p.x = rcx + Math.cos(a) * r;
        p.y = rcy + Math.sin(a) * r * 0.7;
      } else if (p.y > alvoMin) {
        // fluxo segue o relevo: comprime e acelera na crista
        p.y = suavizar(p.y, alvoMin, 3.6, dt);
      } else {
        p.y += Math.sin(t + p.x * 0.02) * 18 * dt;
      }

      if (p.x > w + 8) {
        p.x = -8;
        p.y = Math.random() * h * 0.75;
      }
      if (p.x < -8) {
        p.x = w + 8;
        p.y = Math.random() * h * 0.75;
      }

      ctx.fillStyle = noRotor ? CORES.fluxoTurbulento : CORES.fluxoFraco;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // rótulos: a seta aponta para onde o vento sopra
    const setaVento = direcao === 0 ? "→" : "←";
    ctx.font = "bold 13px Sora, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = CORES.barlavento;
    ctx.fillText(
      `BARLAVENTO (vento ${setaVento} sobe a encosta)`,
      direcao === 0 ? w * 0.22 : w * 0.78,
      28,
    );
    ctx.fillStyle = CORES.perigo;
    ctx.fillText(
      temRotor ? "SOTAVENTO (rotor + turbulência)" : "SOTAVENTO (descendente)",
      direcao === 0 ? w * 0.76 : w * 0.24,
      28,
    );
  };

  return (
    <div>
      <SimCanvas
        draw={draw}
        height={320}
        label="Partículas de vento cruzando uma montanha: sobem na encosta de barlavento e formam rotor turbulento no lado de sotavento"
      />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Slider
          label="Intensidade do vento"
          value={forca}
          min={5}
          max={45}
          unit="km/h"
          onChange={setForca}
        />
        <div>
          <p className="mb-1 text-sm font-medium">Direção do vento</p>
          <div className="flex gap-2">
            <button
              type="button"
              aria-pressed={direcao === 0}
              onClick={() => setDirecao(0)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${direcao === 0 ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
            >
              Da esquerda →
            </button>
            <button
              type="button"
              aria-pressed={direcao === 1}
              onClick={() => setDirecao(1)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${direcao === 1 ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
            >
              ← Da direita
            </button>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Aumente o vento e observe: o rotor de sotavento só aparece com vento mais forte. É por isso
        que cada lado da montanha pode ter condições completamente diferentes.
      </p>
    </div>
  );
}
