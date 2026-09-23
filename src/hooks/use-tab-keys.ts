import type { KeyboardEvent } from "react";

/**
 * Navegação por teclado em um `role="tablist"` horizontal, conforme o padrão
 * WAI-ARIA: ← → movem, Home/End vão ao início/fim. O foco segue a seleção.
 */
export function useTabKeys(total: number, atual: number, selecionar: (i: number) => void) {
  return (e: KeyboardEvent<HTMLElement>) => {
    let proximo: number | null = null;
    if (e.key === "ArrowRight") proximo = (atual + 1) % total;
    else if (e.key === "ArrowLeft") proximo = (atual - 1 + total) % total;
    else if (e.key === "Home") proximo = 0;
    else if (e.key === "End") proximo = total - 1;
    if (proximo === null) return;
    e.preventDefault();
    selecionar(proximo);
    const lista = e.currentTarget.closest('[role="tablist"]');
    const abas = lista?.querySelectorAll<HTMLElement>('[role="tab"]');
    abas?.[proximo]?.focus();
  };
}
