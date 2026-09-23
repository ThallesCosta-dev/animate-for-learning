import { useEffect, useState } from "react";
import { SimCanvas } from "@/components/SimCanvas";
import { CORES, rgba } from "@/lib/colors";

const ETAPAS = [
  {
    nome: "1. Aquecimento do solo",
    texto: "O sol aquece o solo, e o solo aquece a camada de ar encostada nele.",
  },
  {
    nome: "2. Formação da bolha",
    texto: "O ar quente fica menos denso e se acumula como uma bolha prestes a subir.",
  },
  {
    nome: "3. Desprendimento",
    texto:
      "A bolha se desprende do solo — muitas vezes por um gatilho, como um vento local ou um desnível.",
  },
  {
    nome: "4. Ascensão",
    texto: "A bolha sobe enquanto estiver mais quente que o ar ao redor, ganhando velocidade.",
  },
  {
    nome: "5. Organização da térmica",
    texto:
      "Várias bolhas formam uma coluna ascendente contínua — a térmica que o piloto usa para ganhar altitude.",
  },
  {
    nome: "6. Formação de nuvem",
    texto:
      "Lá em cima, o ar esfria e a umidade condensa: nasce um cumulus, que marca o topo da térmica.",
  },
  {
    nome: "7. Enfraquecimento",
    texto:
      "Sem mais aquecimento (ou sob a sombra da própria nuvem), a térmica perde força e se dissolve.",
  },
];

// Ciclo de vida da térmica, passo a passo, com Play/Pause e velocidade.
export function ThermalLifecycle() {
  const [etapa, setEtapa] = useState(0);
  const [tocando, setTocando] = useState(false);
  const [velocidade, setVelocidade] = useState(1);

  useEffect(() => {
    if (!tocando) return;
    const id = window.setInterval(() => {
      setEtapa((e) => (e + 1) % ETAPAS.length);
    }, 2600 / velocidade);
    return () => window.clearInterval(id);
  }, [tocando, velocidade]);

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => {
    const soloY = h - 34;

    // céu
    const grad = ctx.createLinearGradient(0, 0, 0, soloY);
    grad.addColorStop(0, "rgba(140,195,240,0.5)");
    grad.addColorStop(1, "rgba(230,242,252,0.25)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, soloY);
    // solo
    ctx.fillStyle = "rgba(120,150,90,0.7)";
    ctx.fillRect(0, soloY, w, h - soloY);

    const cx = w / 2;
    const e = etapa;

    // sol
    ctx.fillStyle = "rgba(250,190,60,0.95)";
    ctx.beginPath();
    ctx.arc(50, 44, 20, 0, Math.PI * 2);
    ctx.fill();

    if (e === 0) {
      // ondas de calor subindo do solo
      ctx.strokeStyle = rgba(CORES.termica, 0.7);
      ctx.lineWidth = 2;
      for (let i = -2; i <= 2; i++) {
        ctx.beginPath();
        for (let y = 0; y < 34; y += 3) {
          const x = cx + i * 26 + Math.sin(t * 3 + y * 0.25) * 5;
          if (y === 0) ctx.moveTo(x, soloY - y);
          else ctx.lineTo(x, soloY - y);
        }
        ctx.stroke();
      }
    }

    if (e >= 1 && e <= 4) {
      // bolha crescendo e subindo
      const prog = e === 1 ? 0 : e === 2 ? 0.15 : e === 3 ? 0.5 : 0.75;
      const by = soloY - 12 - prog * (soloY - 90);
      const br = 16 + e * 6 + Math.sin(t * 4) * 2;
      ctx.fillStyle = rgba(CORES.termica, 0.5);
      ctx.beginPath();
      ctx.arc(cx + Math.sin(t * 2) * 4, by, br, 0, Math.PI * 2);
      ctx.fill();
      // partículas internas
      ctx.fillStyle = rgba(CORES.termica, 0.85);
      for (let i = 0; i < 10; i++) {
        const a = t * 1.5 + i * 0.63;
        ctx.beginPath();
        ctx.arc(
          cx + Math.cos(a) * br * 0.6,
          by + Math.sin(a * 1.3) * br * 0.6,
          2.4,
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
      if (e === 1) {
        ctx.fillStyle = "rgba(40,50,60,0.85)";
        ctx.font = "12px Manrope, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("bolha acumulando no solo", cx, soloY + 20);
      }
    }

    if (e === 4) {
      // coluna organizada
      ctx.strokeStyle = rgba(CORES.termica, 0.5);
      ctx.lineWidth = 26;
      ctx.beginPath();
      for (let y = soloY - 10; y > 70; y -= 6) {
        const x = cx + Math.sin(y * 0.03 + t * 2) * 14;
        if (y === soloY - 10) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    if (e >= 5) {
      // nuvem cumulus no topo
      ctx.fillStyle = "rgba(250,250,252,0.92)";
      for (const [ox, oy, r] of [
        [-30, 8, 20],
        [0, 0, 27],
        [30, 8, 20],
        [10, -12, 18],
      ] as const) {
        ctx.beginPath();
        ctx.arc(cx + ox, 66 + oy + Math.sin(t) * 2, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (e === 6) {
      // enfraquecimento: coluna dissolvendo
      ctx.strokeStyle = rgba(CORES.termica, 0.22);
      ctx.lineWidth = 30;
      ctx.beginPath();
      for (let y = soloY - 10; y > 90; y -= 8) {
        const x = cx + Math.sin(y * 0.05 + t * 3) * 26;
        if (y === soloY - 10) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  };

  const atual = ETAPAS[etapa]!;

  return (
    <div>
      <SimCanvas
        draw={draw}
        height={300}
        label={`Etapas do ciclo de vida de uma térmica. Etapa atual: ${atual.nome}`}
      />
      <div className="mt-3 rounded-xl bg-accent/60 p-4" aria-live="polite">
        <p className="font-display font-bold text-foreground">{atual.nome}</p>
        <p className="mt-1 text-sm text-foreground/90">{atual.texto}</p>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setTocando((v) => !v)}
          aria-pressed={tocando}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          {tocando ? "⏸ Pausar" : "▶ Reproduzir"}
        </button>
        <button
          type="button"
          onClick={() => setEtapa((e) => (e - 1 + ETAPAS.length) % ETAPAS.length)}
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium"
        >
          ← Voltar
        </button>
        <button
          type="button"
          onClick={() => setEtapa((e) => (e + 1) % ETAPAS.length)}
          className="rounded-lg border border-border px-3 py-2 text-sm font-medium"
        >
          Avançar →
        </button>
        <label className="ml-auto flex items-center gap-2 text-sm">
          Velocidade
          <select
            value={velocidade}
            onChange={(e) => setVelocidade(Number(e.target.value))}
            className="rounded-lg border border-border bg-card px-2 py-1.5"
            aria-label="Velocidade da animação"
          >
            <option value={0.5}>0,5×</option>
            <option value={1}>1×</option>
            <option value={2}>2×</option>
          </select>
        </label>
      </div>
      {/* Indicador de etapas */}
      <div className="mt-3 flex gap-1.5" role="group" aria-label="Ir para etapa">
        {ETAPAS.map((ep, i) => (
          <button
            key={ep.nome}
            type="button"
            aria-label={ep.nome}
            aria-current={i === etapa ? "step" : undefined}
            onClick={() => setEtapa(i)}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i === etapa ? "bg-primary" : "bg-border hover:bg-primary/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
