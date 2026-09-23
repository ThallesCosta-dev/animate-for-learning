import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { GLOSSARIO } from "@/lib/glossary-data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/glossario")({
  head: () =>
    seo({
      titulo: "Glossário de parapente",
      descricao:
        "Glossário pesquisável com os termos essenciais do parapente: definição simples e explicação técnica sobre aerodinâmica, meteorologia, segurança e equipamento.",
      path: "/glossario",
    }),
  component: GlossarioPage,
});

const FILTROS = [
  { id: "todas", nome: "Todos" },
  { id: "aerodinamica", nome: "Aerodinâmica" },
  { id: "meteorologia", nome: "Meteorologia" },
  { id: "seguranca", nome: "Segurança" },
  { id: "equipamento", nome: "Equipamento" },
] as const;

type Filtro = (typeof FILTROS)[number]["id"];

function GlossarioPage() {
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todas");

  const lista = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return GLOSSARIO.filter(
      (t) =>
        (filtro === "todas" || t.area === filtro) &&
        (q === "" ||
          t.termo.toLowerCase().includes(q) ||
          t.definicao.toLowerCase().includes(q) ||
          t.tecnico.toLowerCase().includes(q)),
    ).sort((a, b) => a.termo.localeCompare(b.termo, "pt-BR"));
  }, [busca, filtro]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-extrabold">Glossário</h1>
      <p className="mt-2 text-muted-foreground">
        {GLOSSARIO.length} termos do universo do parapente: definição simples e, abaixo dela, a
        explicação técnica.
      </p>

      <label className="mt-6 block">
        <span className="text-sm font-medium">Buscar termo</span>
        <input
          type="search"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Ex.: estol, térmica, rotor…"
          className="mt-1 w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-primary"
        />
      </label>

      <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filtrar por área">
        {FILTROS.map((f) => (
          <button
            key={f.id}
            type="button"
            aria-pressed={filtro === f.id}
            onClick={() => setFiltro(f.id)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
              filtro === f.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-accent"
            }`}
          >
            {f.nome}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-muted-foreground" aria-live="polite">
        {lista.length} {lista.length === 1 ? "termo encontrado" : "termos encontrados"}
      </p>

      <dl className="mt-3 space-y-3">
        {lista.map((t) => (
          <div key={t.termo} className="rounded-xl border border-border bg-card p-4">
            <dt className="font-display font-bold text-primary">{t.termo}</dt>
            <dd className="mt-1 text-sm text-foreground/90">{t.definicao}</dd>
            <dd className="mt-2 border-l-2 border-border pl-3 text-xs leading-relaxed text-muted-foreground">
              <span className="font-semibold">Explicação técnica: </span>
              {t.tecnico}
            </dd>
          </div>
        ))}
      </dl>

      {lista.length === 0 && (
        <p className="mt-6 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          Nenhum termo encontrado. Tente outra palavra.
        </p>
      )}
    </div>
  );
}
