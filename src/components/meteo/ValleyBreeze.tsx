import { useRef, useState } from "react";
import { SimCanvas } from "@/components/SimCanvas";

interface Particula {
  x: number;
  y: number;
}

// Brisa de vale (dia) x brisa de montanha (noite).
export function ValleyBreeze() {
  const [dia, setDia] = useState(true);
  const particulasRef = useRef<Particula[] | null>(null);

  const encosta = (x: number, w: number, h: number) => {
    // vale em V: duas encostas
    const base = h - 36;
    const u = Math.abs(x / w - 0.5) * 2; // 0 no centro do vale, 1 nas bordas
    return base - u * u * h * 0.55;
  };

  const draw = (ctx: CanvasRenderingContext2D, w: number, h: number, _t: number, dt: number) => {
    // céu dia/noite
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    if (dia) {
      grad.addColorStop(0, "rgba(130,190,240,0.6)");
      grad.addColorStop(1, "rgba(235,246,255,0.3)");
    } else {
      grad.addColorStop(0, "rgba(20,30,60,0.85)");
      grad.addColorStop(1, "rgba(50,60,95,0.5)");
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // sol / lua
    ctx.fillStyle = dia ? "rgba(250,195,70,0.95)" : "rgba(235,238,245,0.9)";
    ctx.beginPath();
    ctx.arc(w - 56, 46, 18, 0, Math.PI * 2);
    ctx.fill();

    // montanhas (vale em V)
    ctx.fillStyle = dia ? "rgba(110,140,105,0.8)" : "rgba(45,60,55,0.9)";
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 6) ctx.lineTo(x, encosta(x, w, h));
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    if (!particulasRef.current) {
      const ps: Particula[] = [];
      for (let i = 0; i < 120; i++) ps.push({ x: Math.random() * w, y: Math.random() * h });
      particulasRef.current = ps;
    }

    for (const p of particulasRef.current) {
      const solo = encosta(p.x, w, h);
      const centroDist = p.x / w - 0.5;
      if (dia) {
        // ar quente sobe pelas encostas: das bordas para o centro e para cima
        p.x += (centroDist > 0 ? -54 : 54) * dt;
        p.y -= (42 + Math.random() * 24) * dt;
        if (p.y < solo - 130 || Math.abs(centroDist) < 0.03) {
          p.x = Math.random() < 0.5 ? Math.random() * w * 0.2 : w - Math.random() * w * 0.2;
          p.y = encosta(p.x, w, h) - 8;
        }
      } else {
        // ar frio desce as encostas para o fundo do vale
        p.x += (centroDist > 0 ? -42 : 42) * dt;
        p.y += (33 + Math.random() * 18) * dt;
        if (p.y > encosta(p.x, w, h) - 6 || Math.abs(centroDist) < 0.02) {
          p.x = Math.random() * w;
          p.y = Math.random() * h * 0.3;
        }
      }
      const pertoDoSolo = p.y > solo - 60;
      ctx.fillStyle = dia
        ? pertoDoSolo
          ? "rgba(240,150,50,0.75)"
          : "rgba(240,170,80,0.5)"
        : "rgba(140,180,240,0.7)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // setas de fluxo
    ctx.strokeStyle = dia ? "rgba(220,120,30,0.9)" : "rgba(120,170,245,0.9)";
    ctx.fillStyle = ctx.strokeStyle;
    ctx.lineWidth = 3;
    const setaFluxo = (x1: number, y1: number, x2: number, y2: number) => {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      const a = Math.atan2(y2 - y1, x2 - x1);
      ctx.beginPath();
      ctx.moveTo(x2, y2);
      ctx.lineTo(x2 - 9 * Math.cos(a - 0.4), y2 - 9 * Math.sin(a - 0.4));
      ctx.lineTo(x2 - 9 * Math.cos(a + 0.4), y2 - 9 * Math.sin(a + 0.4));
      ctx.closePath();
      ctx.fill();
    };
    if (dia) {
      setaFluxo(w * 0.16, encosta(w * 0.16, w, h) - 20, w * 0.34, encosta(w * 0.34, w, h) - 90);
      setaFluxo(w * 0.84, encosta(w * 0.84, w, h) - 20, w * 0.66, encosta(w * 0.66, w, h) - 90);
    } else {
      setaFluxo(w * 0.28, encosta(w * 0.28, w, h) - 70, w * 0.44, encosta(w * 0.44, w, h) - 16);
      setaFluxo(w * 0.72, encosta(w * 0.72, w, h) - 70, w * 0.56, encosta(w * 0.56, w, h) - 16);
    }

    ctx.font = "bold 14px Sora, sans-serif";
    ctx.textAlign = "left";
    ctx.fillStyle = dia ? "#7a4a08" : "#c8d6f5";
    ctx.fillText(dia ? "DIA — brisa de vale (sobe)" : "NOITE — brisa de montanha (desce)", 14, 26);
  };

  return (
    <div>
      <SimCanvas
        draw={draw}
        height={320}
        label="Animação de um vale: de dia o ar quente sobe pelas encostas; à noite o ar frio desce para o fundo do vale"
      />
      <div className="mt-4 flex gap-2">
        <button
          type="button"
          aria-pressed={dia}
          onClick={() => setDia(true)}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold ${dia ? "bg-thermal text-thermal-foreground" : "bg-secondary"}`}
        >
          ☀️ Dia
        </button>
        <button
          type="button"
          aria-pressed={!dia}
          onClick={() => setDia(false)}
          className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-semibold ${!dia ? "bg-primary text-primary-foreground" : "bg-secondary"}`}
        >
          🌙 Noite
        </button>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">
        De dia, as encostas aquecem e o ar sobe — anabático. À noite, esfriam e o ar frio desce —
        catabático. Isso muda completamente o vento em rampas de decolagem.
      </p>
    </div>
  );
}
