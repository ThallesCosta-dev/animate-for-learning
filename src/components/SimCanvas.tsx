import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface SimCanvasProps {
  /**
   * Função de desenho. Recebe ctx, dimensões, tempo acumulado (s) e o delta do
   * frame (s). Use `dt` para todo movimento: ele é 0 quando a animação está
   * congelada (pausa, fora da tela ou movimento reduzido), o que mantém a
   * velocidade igual em qualquer taxa de quadros.
   */
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number, dt: number) => void;
  height?: number;
  label: string;
  paused?: boolean;
}

// Canvas com loop requestAnimationFrame, DPI correto e redimensionamento.
// O loop só roda enquanto o canvas está visível e o movimento não está reduzido;
// fora disso, desenha um único quadro estático.
export function SimCanvas({ draw, height = 320, label, paused = false }: SimCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;
  const reduzido = useReducedMotion();
  const congelado = paused || reduzido;
  const redesenharRef = useRef<() => void>(() => {});

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let last = performance.now();
    let rodando = false;
    let visivel = true;
    let w = 0;
    let h = 0;

    const desenhar = (dt: number) => {
      ctx.clearRect(0, 0, w, h);
      drawRef.current(ctx, w, h, t, dt);
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!rodando) desenhar(0);
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      t += dt;
      desenhar(dt);
      raf = requestAnimationFrame(frame);
    };

    const iniciar = () => {
      if (rodando) return;
      rodando = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const parar = () => {
      if (!rodando) return;
      rodando = false;
      cancelAnimationFrame(raf);
    };
    const atualizar = () => {
      if (visivel && !congelado) iniciar();
      else {
        parar();
        desenhar(0);
      }
    };

    redesenharRef.current = () => {
      if (!rodando) desenhar(0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(
      (entries) => {
        visivel = entries.some((e) => e.isIntersecting);
        atualizar();
      },
      { rootMargin: "120px" },
    );
    io.observe(canvas);
    atualizar();

    return () => {
      parar();
      ro.disconnect();
      io.disconnect();
    };
  }, [congelado]);

  // Congelado, ainda precisa refletir mudanças de controles (sliders etc.).
  useEffect(() => {
    if (congelado) redesenharRef.current();
  });

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className="w-full rounded-xl border border-border bg-skyblue/20"
      style={{ height }}
    />
  );
}
