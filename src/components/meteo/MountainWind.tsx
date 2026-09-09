import { useRef, useState } from "react";
import { SimCanvas } from "@/components/SimCanvas";
import { Slider } from "@/components/Slider";

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

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
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

    const vx = (direcao === 0 ? 1 : -1) * (1 + forca / 12);
    const barlavento = direcao === 0 ? "esquerda" : "direita";
    const sotaX = direcao === 0 ? 0.72 : 0.28; // centro do rotor (lado de sotavento)

    for (const p of particulasRef.current) {
      p.x += vx;
      const solo = montanhaY(p.x, w, h);
      const alvoMin = solo - 14;

      // lado de sotavento: rotor (circulação) + turbulência
      const distSota = Math.abs(p.x / w - sotaX);
      if (distSota < 0.13 && p.y > solo - 110 && forca > 12) {
        const a = t * (2 + forca / 10) + p.x * 0.05;
        const rcx = sotaX * w;
        const rcy = solo - 60;
        const r = 24 + (p.y % 40);
        p.x = rcx + Math.cos(a) * r;
        p.y = rcy + Math.sin(a) * r * 0.7;
      } else {
        // fluxo segue o relevo: comprime e acelera na crista
        if (p.y > alvoMin) p.y += (alvoMin - p.y) * 0.06;
        else p.y += Math.sin(t + p.x * 0.02) * 0.3;
      }

      if (p.x > w + 8) {
        p.x = -8;
        p.y = Math.random() * h * 0.75;
      }
      if (p.x < -8) {
        p.x = w + 8;
        p.y = Math.random() * h * 0.75;
      }

      const turbulento = distSota < 0.13 && p.y > montanhaY(p.x, w, h) - 110 && forca > 12;
      ctx.fillStyle = turbulento ? "rgba(200,60,40,0.8)" : "rgba(30,100,200,0.55)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // rótulos
    ctx.font = "bold 13px Sora, sans-serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#0a5a30";
    ctx.fillText(`BARLAVENTO (${barlavento === "esquerda" ? "←" : "→"} vento sobe a encosta)`, direcao === 0 ? w * 0.22 : w * 0.78, 28);
    ctx.fillStyle = "#a03028";
    ctx.fillText("SOTAVENTO (rotor + turbulência)", direcao === 0 ? w * 0.76 : w * 0.24, 28);
  };

  return (
    <div>
      <SimCanvas
        draw={draw}
        height={320}
        label="Partículas de vento cruzando uma montanha: sobem na encosta de barlavento e formam rotor turbulento no lado de sotavento"
        deps={[direcao, forca]}
      />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Slider label="Intensidade do vento" value={forca} min={5} max={45} unit="km/h" onChange={setForca} />
        <div>
          <p className="mb-1 text-sm font-medium">Direção do vento</p>
          <div className="flex gap-2">
            <button
              type="button"
              aria-pressed={direcao === 0}
              onClick={() => setDirecao(0)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${direcao === 0 ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
            >
              → Da esquerda
            </button>
            <button
              type="button"
              aria-pressed={direcao === 1}
              onClick={() => setDirecao(1)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${direcao === 1 ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
            >
              Da direita ←
            </button>
          </div>
        </div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Aumente o vento e observe: o rotor de sotavento só aparece com vento mais forte. É
        por isso que cada lado da montanha pode ter condições completamente diferentes.
      </p>
    </div>
  );
}
