// Modelo físico SIMPLIFICADO, apenas para fins didáticos.
// Não representa uma asa real: os coeficientes são inventados para
// transmitir a intuição das relações físicas.

/** Coeficiente de sustentação didático: cresce com o ângulo de ataque e
 *  despenca após a região de estol (~15°). */
export function clDidatico(aoaGraus: number): number {
  const a = Math.max(0, aoaGraus);
  if (a <= 15) return 0.2 + 0.08 * a;
  // após o estol, o CL cai progressivamente
  return Math.max(0.4, 1.4 - 0.07 * (a - 15));
}

/** Coeficiente de arrasto didático: mínimo em ângulos baixos, dispara no estol. */
export function cdDidatico(aoaGraus: number): number {
  const a = Math.max(0, aoaGraus);
  const base = 0.03 + 0.0012 * a * a;
  return a <= 15 ? base : base + 0.02 * (a - 15);
}

/** Sustentação (N) — L = ½ · ρ · V² · S · CL. V em m/s. */
export function sustentacao(rho: number, vMs: number, area: number, aoa: number): number {
  return 0.5 * rho * vMs * vMs * area * clDidatico(aoa);
}

/** Arrasto (N) — D = ½ · ρ · V² · S · CD. */
export function arrasto(rho: number, vMs: number, area: number, aoa: number): number {
  return 0.5 * rho * vMs * vMs * area * cdDidatico(aoa);
}

export const kmhParaMs = (kmh: number) => kmh / 3.6;
export const msParaKmh = (ms: number) => ms * 3.6;

/** Caminho de um perfil aerodinâmico simplificado (tipo gota) centrado em (cx, cy). */
export function desenharPerfil(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  corda: number,
  aoaGraus: number
) {
  const espessura = corda * 0.16;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((-aoaGraus * Math.PI) / 180);
  ctx.beginPath();
  ctx.moveTo(-corda / 2, 0);
  // extradorso (parte de cima, mais curva)
  ctx.bezierCurveTo(-corda * 0.25, -espessura, corda * 0.3, -espessura, corda / 2, 0);
  // intradorso (parte de baixo, mais plana)
  ctx.bezierCurveTo(corda * 0.3, espessura * 0.35, -corda * 0.25, espessura * 0.35, -corda / 2, 0);
  ctx.closePath();
  ctx.restore();
}

/** Desenha uma seta vetorial com rótulo. */
export function seta(
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cor: string,
  rotulo?: string,
  largura = 3
) {
  const ang = Math.atan2(y2 - y1, x2 - x1);
  ctx.strokeStyle = cor;
  ctx.fillStyle = cor;
  ctx.lineWidth = largura;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  // ponta da seta
  const p = 9;
  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - p * Math.cos(ang - 0.45), y2 - p * Math.sin(ang - 0.45));
  ctx.lineTo(x2 - p * Math.cos(ang + 0.45), y2 - p * Math.sin(ang + 0.45));
  ctx.closePath();
  ctx.fill();
  if (rotulo) {
    ctx.font = "bold 13px Manrope, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(rotulo, x2 + 12 * Math.cos(ang + Math.PI / 2), y2 + 12 * Math.sin(ang + Math.PI / 2) - 6);
  }
}
