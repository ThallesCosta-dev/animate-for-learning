import { useEffect, useRef } from "react";

interface SimCanvasProps {
  /** Função de desenho chamada a cada frame. Recebe ctx, dimensões e tempo (s). */
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;
  height?: number;
  label: string;
  paused?: boolean;
  /** Dependências que reiniciam o loop quando mudam */
  deps?: unknown[];
}

// Canvas com loop requestAnimationFrame, redimensionamento automático e DPI correto.
export function SimCanvas({ draw, height = 320, label, paused = false, deps = [] }: SimCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawRef = useRef(draw);
  drawRef.current = draw;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    let last = performance.now();

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!paused && !reduce) t += dt;
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);
      drawRef.current(ctx, rect.width, rect.height, t);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, ...deps]);

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
