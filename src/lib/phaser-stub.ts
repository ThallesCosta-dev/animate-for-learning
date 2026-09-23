// Substitui o pacote "phaser" no bundle de servidor (ver vite.config.ts).
// O simulador só importa o Phaser dentro de um useEffect, que nunca roda no SSR,
// então o servidor não precisa carregar os 7 MB da biblioteca.
export default {};
