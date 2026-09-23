/**
 * Aproxima `atual` de `alvo` de forma independente da taxa de quadros.
 * `k` é a "velocidade" da suavização (1/s); `dt` é o delta do frame em s.
 */
export function suavizar(atual: number, alvo: number, k: number, dt: number): number {
  return atual + (alvo - atual) * (1 - Math.exp(-k * dt));
}
