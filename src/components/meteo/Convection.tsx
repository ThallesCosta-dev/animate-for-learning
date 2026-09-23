import { useRef, useState } from "react";
import { SimCanvas } from "@/components/SimCanvas";
import { Slider } from "@/components/Slider";
import { suavizar } from "@/lib/anim";

// Três superfícies lado a lado, com aquecimentos diferentes.
const SUPERFICIES = [
  { nome: "Rocha", aquecimento: 1.0, rgb: "150,130,110" },
  { nome: "Floresta", aquecimento: 0.45, rgb: "50,120,60" },
  { nome: "Água", aquecimento: 0.1, rgb: "60,130,200" },
];

interface Particula {
  x: number;
  y: number;
  vx: number;
  vy: number;
  temp: number; // 0 = frio, 1 = quente
}

// Fundamentos: sol aquece superfícies de forma desigual; o ar quente sobe,
// o frio desce e escorre pelo chão para ocupar o lugar — a convecção.
export function Convection() {
  const [sol, setSol] = useState(75);
  const particulasRef = useRef<Particula[] | null>(null);

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, _t: number, dt: number) => {
    const soloY = h - 40;
    const faixaW = w / SUPERFICIES.length;
    const intensidade = sol / 100;

    // céu
    const grad = ctx.createLinearGradient(0, 0, 0, soloY);
    grad.addColorStop(0, "rgba(140,195,240,0.5)");
    grad.addColorStop(1, "rgba(230,242,252,0.25)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, soloY);

    // sol
    ctx.fillStyle = `rgba(250,190,60,${0.35 + intensidade * 0.65})`;
    ctx.beginPath();
    ctx.arc(w - 50, 44, 16 + intensidade * 8, 0, Math.PI * 2);
    ctx.fill();

    // superfícies e "calor" do solo
    SUPERFICIES.forEach((s, i) => {
      const x0 = i * faixaW;
      ctx.fillStyle = `rgba(${s.rgb},0.85)`;
      ctx.fillRect(x0, soloY, faixaW, h - soloY);
      const calor = s.aquecimento * intensidade;
      const brilho = ctx.createLinearGradient(0, soloY - 30, 0, soloY);
      brilho.addColorStop(0, "rgba(240,140,40,0)");
      brilho.addColorStop(1, `rgba(240,140,40,${calor * 0.55})`);
      ctx.fillStyle = brilho;
      ctx.fillRect(x0, soloY - 30, faixaW, 30);
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "bold 12px Manrope, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(`${s.nome} · ${Math.round(calor * 100)}%`, x0 + faixaW / 2, h - 14);
    });

    if (!particulasRef.current) {
      const ps: Particula[] = [];
      for (let i = 0; i < 150; i++) {
        ps.push({
          x: Math.random() * w,
          y: Math.random() * soloY,
          vx: 0,
          vy: 0,
          temp: 0.3,
        });
      }
      particulasRef.current = ps;
    }

    for (const p of particulasRef.current) {
      const faixa = Math.min(SUPERFICIES.length - 1, Math.max(0, Math.floor(p.x / faixaW)));
      const calorSolo = SUPERFICIES[faixa]!.aquecimento * intensidade;
      const pertoDoSolo = p.y > soloY - 40;

      // junto ao solo, a partícula assume a temperatura da superfície; no alto, esfria
      const alvoTemp = pertoDoSolo ? calorSolo : 0.1;
      p.temp = suavizar(p.temp, alvoTemp, pertoDoSolo ? 2.5 : 0.35, dt);

      // empuxo: quente sobe, frio desce (velocidade proporcional à diferença de temperatura)
      const alvoVy = (0.35 - p.temp) * 110;
      p.vy = suavizar(p.vy, alvoVy, 2, dt);

      // circulação: no chão o ar escorre para a superfície mais quente; no alto, para longe dela
      const centroQuente = faixaW / 2; // rocha é a primeira faixa
      const sentido = p.x > centroQuente ? -1 : 1;
      const alvoVx = pertoDoSolo ? sentido * 28 * intensidade : -sentido * 20 * intensidade;
      p.vx = suavizar(p.vx, alvoVx, 1.2, dt);

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      if (p.y > soloY - 4) p.y = soloY - 4;
      if (p.y < 30) {
        p.y = 30;
        p.vy = 0;
      }
      if (p.x < 4) p.x = 4;
      if (p.x > w - 4) p.x = w - 4;

      const r = Math.round(60 + p.temp * 180);
      const g = Math.round(110 + (1 - p.temp) * 40);
      const b = Math.round(220 - p.temp * 180);
      ctx.fillStyle = `rgba(${r},${g},${b},0.75)`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = "rgba(40,50,60,0.9)";
    ctx.font = "bold 12px Sora, sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("laranja = ar quente subindo · azul = ar frio descendo", 12, 22);
  };

  return (
    <div>
      <SimCanvas
        draw={draw}
        height={320}
        label="Convecção: o sol aquece rocha, floresta e água de forma desigual; o ar quente sobre a rocha sobe e o ar frio desce sobre a água"
      />
      <div className="mt-4 max-w-md">
        <Slider
          label="Intensidade do sol"
          value={sol}
          min={0}
          max={100}
          unit="%"
          onChange={setSol}
        />
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Reduza o sol e veja a circulação parar. Com sol forte, o ar sobre a rocha sobe, o ar sobre a
        água desce e, junto ao chão, o ar frio escorre em direção à rocha: nasce um vento local.
        Valores ilustrativos.
      </p>
    </div>
  );
}
