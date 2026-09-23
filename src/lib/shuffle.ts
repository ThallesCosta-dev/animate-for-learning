/** Embaralhamento de Fisher–Yates; devolve uma cópia. */
export function embaralhar<T>(lista: readonly T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j]!, copia[i]!];
  }
  return copia;
}

/** Devolve a ordem embaralhada dos índices [0..n). */
export function ordemAleatoria(n: number): number[] {
  return embaralhar(Array.from({ length: n }, (_, i) => i));
}
