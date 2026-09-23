import { useRef, useState } from "react";
import { SimCanvas } from "@/components/SimCanvas";
import { Slider } from "@/components/Slider";
import { CORES, rgba } from "@/lib/colors";

type Terreno = "campo" | "rocha" | "floresta" | "agua";

const TERRENOS: { id: Terreno; nome: string; aquecimento: number; rgb: string }[] = [
  { id: "rocha", nome: "Rocha / solo seco", aquecimento: 1.3, rgb: "150,130,110" },
  { id: "campo", nome: "Campo de grama", aquecimento: 1.0, rgb: "110,160,80" },
  { id: "floresta", nome: "Floresta", aquecimento: 0.7, rgb: "50,120,60" },
  { id: "agua", nome: "Água", aquecimento: 0.3, rgb: "60,130,200" },
];

interface Bolha {
  x: number;
  y: number;
  r: number;
  vy: number; // px/s
  vida: number;
}

/** Fator solar pelo horário: nasce às 6h, pico às 13h (o solo demora a aquecer), zera às 20h. */
function fatorSolar(hora: number): number {
  return Math.max(0, Math.sin(((hora - 6) / 14) * Math.PI));
}

// Animação de térmica: sol aquece o solo, bolhas de ar quente sobem e formam nuvem.
export function ThermalSim() {
  const [sol, setSol] = useState(70); // intensidade do aquecimento %
  const [hora, setHora] = useState(13);
  const [vento, setVento] = useState(8); // km/h
  const [umidade, setUmidade] = useState(60); // %
  const [terrenoId, setTerrenoId] = useState<Terreno>("campo");
  const bolhasRef = useRef<Bolha[]>([]);

  const terreno = TERRENOS.find((t) => t.id === terrenoId)!;
  const fatorHora = fatorSolar(hora);
  const forca = (sol / 100) * fatorHora * terreno.aquecimento;

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number) => {
    const soloY = h - 46;

    // Céu muda com o horário
    const luz = 0.25 + fatorHora * 0.75;
    const grad = ctx.createLinearGradient(0, 0, 0, soloY);
    grad.addColorStop(
      0,
      `rgba(${Math.round(120 * luz + 40)},${Math.round(180 * luz + 40)},${Math.round(240 * luz + 10)},0.55)`,
    );
    grad.addColorStop(1, "rgba(235,245,255,0.25)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, soloY);

    // Sol
    const solX = (hora / 24) * w;
    const solY = 60 - fatorHora * 25;
    ctx.fillStyle = `rgba(250,190,60,${0.35 + (sol / 100) * 0.65})`;
    ctx.beginPath();
    ctx.arc(solX, solY, 18 + (sol / 100) * 8, 0, Math.PI * 2);
    ctx.fill();

    // Montanhas de fundo
    ctx.fillStyle = "rgba(120,140,160,0.35)";
    ctx.beginPath();
    ctx.moveTo(0, soloY);
    ctx.lineTo(w * 0.18, soloY - 70);
    ctx.lineTo(w * 0.36, soloY);
    ctx.lineTo(w * 0.6, soloY - 46);
    ctx.lineTo(w * 0.82, soloY);
    ctx.closePath();
    ctx.fill();

    // Terreno em faixas
    const faixaW = w / TERRENOS.length;
    TERRENOS.forEach((tr, i) => {
      ctx.fillStyle = rgba(tr.rgb, tr.id === terrenoId ? 0.8 : 0.35);
      ctx.fillRect(i * faixaW, soloY, faixaW, h - soloY);
      ctx.fillStyle = "rgba(40,50,60,0.85)";
      ctx.font = "11px Manrope, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(tr.nome, i * faixaW + faixaW / 2, h - 8);
    });

    // Zona da térmica: sobre o terreno selecionado
    const idx = TERRENOS.findIndex((tr) => tr.id === terrenoId);
    const zonaX = idx * faixaW + faixaW / 2;

    // Bolhas de ar quente (taxa de nascimento por segundo)
    const bolhas = bolhasRef.current;
    const taxaPorSegundo = forca * 21;
    if (Math.random() < taxaPorSegundo * dt && bolhas.length < 90) {
      bolhas.push({
        x: zonaX + (Math.random() - 0.5) * faixaW * 0.7,
        y: soloY - 4,
        r: 3 + Math.random() * 5,
        vy: (0.6 + forca * 2.4) * 60,
        vida: 1,
      });
    }
    const ventoPxS = (vento / 3.6) * 21;
    for (let i = bolhas.length - 1; i >= 0; i--) {
      const b = bolhas[i]!;
      b.y -= b.vy * dt;
      b.x += (ventoPxS + Math.sin(t * 2 + b.y * 0.04) * 30) * dt;
      b.vida -= 0.21 * dt;
      b.r += 1.2 * dt;
      if (b.y < 40 || b.vida <= 0) {
        bolhas.splice(i, 1);
        continue;
      }
      ctx.fillStyle = rgba(CORES.termica, 0.55 * b.vida);
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Nuvem no topo se houver térmica forte + umidade
    const nuvem = forca * (umidade / 100);
    if (nuvem > 0.35) {
      const tamanho = Math.min(1, (nuvem - 0.35) * 2.2);
      ctx.fillStyle = `rgba(250,250,252,${0.5 + tamanho * 0.4})`;
      const ny = 46;
      const nx = zonaX + ventoPxS * 0.65;
      for (const [ox, oy, r] of [
        [-26, 6, 18],
        [0, 0, 24],
        [28, 6, 18],
        [10, -10, 16],
      ] as const) {
        ctx.beginPath();
        ctx.arc(nx + ox * tamanho, ny + oy * tamanho, r * tamanho, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = "rgba(70,90,120,0.9)";
      ctx.font = "bold 11px Manrope, sans-serif";
      ctx.textAlign = "center";
      if (tamanho > 0.5) ctx.fillText("cumulus", nx, ny - 26 * tamanho);
    }

    // Rótulo de força da térmica
    ctx.fillStyle = CORES.texto;
    ctx.font = "bold 12px Sora, sans-serif";
    ctx.textAlign = "left";
    const rotulo =
      forca < 0.25
        ? "Térmica fraca ou inexistente"
        : forca < 0.6
          ? "Térmica moderada"
          : "Térmica forte";
    ctx.fillText(rotulo, 12, 22);
  };

  return (
    <div>
      <SimCanvas
        draw={draw}
        height={340}
        label="Simulação de térmica: o sol aquece o solo e bolhas de ar quente sobem formando nuvem"
      />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Slider
          label="Aquecimento do sol"
          value={sol}
          min={0}
          max={100}
          unit="%"
          onChange={setSol}
        />
        <Slider label="Horário do dia" value={hora} min={7} max={19} unit="h" onChange={setHora} />
        <Slider label="Vento" value={vento} min={0} max={40} unit="km/h" onChange={setVento} />
        <Slider label="Umidade" value={umidade} min={10} max={100} unit="%" onChange={setUmidade} />
      </div>
      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Tipo de terreno">
        {TERRENOS.map((tr) => (
          <button
            key={tr.id}
            type="button"
            aria-pressed={terrenoId === tr.id}
            onClick={() => setTerrenoId(tr.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              terrenoId === tr.id
                ? "bg-thermal text-thermal-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-accent"
            }`}
          >
            {tr.nome}
          </button>
        ))}
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        Experimente: qual terreno gera a térmica mais forte? O que acontece de manhã cedo ou com
        vento forte? O aquecimento máximo do solo vem no início da tarde, não ao meio-dia. Valores
        ilustrativos.
      </p>
    </div>
  );
}
