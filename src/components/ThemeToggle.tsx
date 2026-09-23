import { useEffect, useState } from "react";
import { applyTheme, readTheme, type Theme } from "@/lib/theme";

const ORDEM: Theme[] = ["system", "light", "dark"];
const ROTULO: Record<Theme, string> = {
  system: "Tema: automático",
  light: "Tema: claro",
  dark: "Tema: escuro",
};
const ICONE: Record<Theme, string> = { system: "🌓", light: "☀️", dark: "🌙" };

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    setTheme(readTheme());
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (readTheme() === "system") applyTheme("system");
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const proximo = () => {
    const i = ORDEM.indexOf(theme);
    const novo = ORDEM[(i + 1) % ORDEM.length]!;
    setTheme(novo);
    applyTheme(novo);
  };

  return (
    <button
      type="button"
      onClick={proximo}
      className="rounded-lg border border-border px-2.5 py-2 text-sm hover:bg-secondary"
      aria-label={`${ROTULO[theme]} — clique para alternar`}
      title={ROTULO[theme]}
    >
      <span aria-hidden>{ICONE[theme]}</span>
    </button>
  );
}
