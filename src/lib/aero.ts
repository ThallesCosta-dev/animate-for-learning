// Modelo físico SIMPLIFICADO, apenas para fins didáticos.
// Não representa uma asa real: os coeficientes são inventados para
// transmitir a intuição das relações físicas.

/** Ângulo crítico adotado em todas as simulações didáticas do app. */
export const ANGULO_CRITICO_GRAUS = 15;

/**
 * Posição didática da separação no extradorso, em fração da meia-corda.
 * 1 representa o bordo de fuga e -1, o bordo de ataque.
 */
export function pontoSeparacaoDidatico(aoaGraus: number): number {
  const progresso = Math.min(1, Math.max(0, aoaGraus) / ANGULO_CRITICO_GRAUS);
  const antesDoEstol = 0.9 - progresso * 1.65;
  const aposEstol = Math.min(0.15, Math.max(0, aoaGraus - ANGULO_CRITICO_GRAUS) / 60);
  return Math.max(-0.9, antesDoEstol - aposEstol);
}

/** Coeficiente de sustentação didático: cresce com o ângulo de ataque e
 *  despenca após a região de estol (~15°). */
export function clDidatico(aoaGraus: number): number {
  const a = Math.max(0, aoaGraus);
  if (a <= ANGULO_CRITICO_GRAUS) return 0.2 + 0.08 * a;
  // após o estol, o CL cai progressivamente
  return Math.max(0.4, 1.4 - 0.07 * (a - ANGULO_CRITICO_GRAUS));
}

/** Coeficiente de arrasto didático: mínimo em ângulos baixos, dispara no estol. */
export function cdDidatico(aoaGraus: number): number {
  const a = Math.max(0, aoaGraus);
  const base = 0.03 + 0.0012 * a * a;
  return a <= ANGULO_CRITICO_GRAUS
    ? base
    : base + 0.02 * (a - ANGULO_CRITICO_GRAUS);
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
  ctx.rotate((aoaGraus * Math.PI) / 180);
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

/**
 * Desenha o vento como filetes contínuos (linhas de corrente), como num túnel de vento.
 * Vento da esquerda para a direita; bordo de ataque à esquerda.
 * Atrás do ponto de separação, os filetes do extradorso se descolam e ficam turbulentos.
 */
export function desenharFiletes(
  ctx: CanvasRenderingContext2D,
  opts: {
    w: number; h: number; t: number; cx: number; cy: number; corda: number;
    aoa: number; pontoSep: number; intensidade: number; velocidade?: number;
  }
) {
  const { w, h, t, cx, cy, corda, aoa, pontoSep, intensidade, velocidade = 60 } = opts;
  const meia = corda / 2;
  const linhas = 17;
  const passo = 4;
  const rad = (aoa * Math.PI) / 180;
  ctx.save();
  ctx.lineWidth = 1.8;
  ctx.setLineDash([16, 9]);
  ctx.lineDashOffset = -t * velocidade;
  for (let i = 0; i < linhas; i++) {
    const y0 = (i / (linhas - 1) - 0.5) * h * 0.9;
    if (Math.abs(y0) < 4) continue;
    const acima = y0 < 0;
    const proximidade = Math.exp(-Math.abs(y0) / (corda * 0.45));
    let anteriorSep: boolean | null = null;
    ctx.beginPath();
    for (let x = 0; x <= w; x += passo) {
      const dx = (x - cx) / meia;
      const infl = Math.exp(-dx * dx * 1.3) * proximidade;
      // contorno do perfil inclinado (bordo de ataque para cima)
      const superficie = -dx * meia * Math.sin(rad);
      let y = cy + y0;
      if (dx > -1.6 && dx < 1.6) y += superficie * Math.exp(-dx * dx * 0.4) * proximidade;
      y += acima ? -infl * (corda * 0.1 + aoa * 1.6) : infl * corda * 0.03;
      // upwash à frente e downwash atrás da asa
      if (dx < -1) y -= aoa * 1.4 * Math.exp((dx + 1) * 0.6) * proximidade;
      if (dx > 1) y += aoa * 2 * (1 - Math.exp(-(dx - 1) * 0.5)) * proximidade;
      const separado = acima && dx > pontoSep && Math.abs(y0) < corda * 0.7;
      if (separado) {
        const ext = Math.min(2.5, dx - pontoSep);
        y -= ext * corda * 0.06 * intensidade * proximidade;
        y += Math.sin(t * 6 + x * 0.09 + i) * 16 * intensidade * Math.min(1, ext) * proximidade;
      }
      if (anteriorSep !== null && anteriorSep !== separado) {
        ctx.lineTo(x, y);
        ctx.strokeStyle = anteriorSep ? "rgba(220,80,50,0.85)" : "rgba(30,100,200,0.6)";
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
      } else if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      anteriorSep = separado;
    }
    ctx.strokeStyle = anteriorSep ? "rgba(220,80,50,0.85)" : "rgba(30,100,200,0.6)";
    ctx.stroke();
  }
  ctx.restore();
}

/** Perfis didáticos para comparação. O perfil "padrão" usa o ângulo crítico central do app. */
export interface PerfilDidatico {
  id: string;
  nome: string;
  descricao: string;
  anguloCritico: number;
  espessura: number; // fração da corda
  inclinacaoCl: number; // ganho de CL por grau
  clBase: number;
  cdBase: number;
}

export const PERFIS_DIDATICOS: PerfilDidatico[] = [
  { id: "fino", nome: "Perfil fino (asa de performance)", descricao: "Pouco arrasto, mas estola mais cedo e de forma mais brusca.", anguloCritico: ANGULO_CRITICO_GRAUS - 3, espessura: 0.1, inclinacaoCl: 0.085, clBase: 0.15, cdBase: 0.022 },
  { id: "padrao", nome: "Perfil padrão (asa escola)", descricao: "Equilíbrio entre sustentação, arrasto e tolerância ao estol.", anguloCritico: ANGULO_CRITICO_GRAUS, espessura: 0.16, inclinacaoCl: 0.08, clBase: 0.2, cdBase: 0.03 },
  { id: "espesso", nome: "Perfil espesso e curvado", descricao: "Mais sustentação e estol mais tardio, ao custo de mais arrasto.", anguloCritico: ANGULO_CRITICO_GRAUS + 3, espessura: 0.22, inclinacaoCl: 0.075, clBase: 0.3, cdBase: 0.042 },
];

export function clPerfil(p: PerfilDidatico, aoa: number): number {
  const a = Math.max(0, aoa);
  const max = p.clBase + p.inclinacaoCl * p.anguloCritico;
  if (a <= p.anguloCritico) return p.clBase + p.inclinacaoCl * a;
  return Math.max(0.35, max - 0.07 * (a - p.anguloCritico));
}

export function cdPerfil(p: PerfilDidatico, aoa: number): number {
  const a = Math.max(0, aoa);
  const base = p.cdBase + 0.0011 * a * a;
  return a <= p.anguloCritico ? base : base + 0.025 * (a - p.anguloCritico);
}

export function pontoSeparacaoPerfil(p: PerfilDidatico, aoa: number): number {
  return pontoSeparacaoDidatico((aoa / p.anguloCritico) * ANGULO_CRITICO_GRAUS);
}

export function desenharPerfilCom(ctx: CanvasRenderingContext2D, cx: number, cy: number, corda: number, aoaGraus: number, esp: number) {
  const espessura = corda * esp;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((aoaGraus * Math.PI) / 180);
  ctx.beginPath();
  ctx.moveTo(-corda / 2, 0);
  ctx.bezierCurveTo(-corda * 0.25, -espessura, corda * 0.3, -espessura, corda / 2, 0);
  ctx.bezierCurveTo(corda * 0.3, espessura * 0.35, -corda * 0.25, espessura * 0.35, -corda / 2, 0);
  ctx.closePath();
  ctx.restore();
}
