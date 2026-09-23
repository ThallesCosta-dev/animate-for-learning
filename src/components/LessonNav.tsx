interface LessonNavProps {
  label: string;
  itens: { id: string; titulo: string }[];
}

// Navegação por âncoras entre as aulas de uma página.
export function LessonNav({ label, itens }: LessonNavProps) {
  return (
    <nav aria-label={label} className="mt-6 flex flex-wrap gap-2">
      {itens.map((n) => (
        <a
          key={n.id}
          href={`#${n.id}`}
          className="rounded-full border border-border bg-card px-3 py-1.5 text-sm font-medium hover:bg-accent"
        >
          {n.titulo}
        </a>
      ))}
    </nav>
  );
}
