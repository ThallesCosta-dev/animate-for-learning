// Paleta única para os desenhos em canvas (que não leem classes Tailwind).
// Mantida alinhada aos tokens de src/styles.css.
export const CORES = {
  sustentacao: "#0a7a3d",
  peso: "#7a3d0a",
  arrasto: "#b03030",
  alerta: "#b03030",
  perigo: "#a03028",
  ar: "#1d4ed8",
  vento: "#7c3aed",
  solo: "#0a7a3d",
  barlavento: "#0a5a30",
  pilotoA: "#1d4ed8",
  pilotoB: "#c2500a",
  fluxo: "rgba(30,100,200,0.6)",
  fluxoFraco: "rgba(30,100,200,0.55)",
  fluxoTurbulento: "rgba(200,60,40,0.8)",
  fluxoEstol: "rgba(220,80,50,0.75)",
  perfil: "rgba(40,60,90,0.92)",
  perfilBorda: "rgba(20,35,60,1)",
  texto: "rgba(40,50,60,0.9)",
  textoSuave: "rgba(60,80,110,0.9)",
  termica: "240,140,40", // usar com `rgba(${CORES.termica},alpha)`
} as const;

export const rgba = (rgb: string, alpha: number) => `rgba(${rgb},${alpha})`;
