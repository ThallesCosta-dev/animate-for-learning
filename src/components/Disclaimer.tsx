import { DISCLAIMER_SHORT } from "@/lib/config";

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  return (
    <aside
      role="note"
      aria-label="Aviso importante"
      className={`rounded-xl border-2 border-thermal/60 bg-thermal/10 ${
        compact ? "p-3 text-xs" : "p-4 text-sm"
      } text-foreground`}
    >
      <p className="flex items-start gap-2">
        <span aria-hidden className={compact ? "text-base" : "text-xl"}>
          ⚠️
        </span>
        <span>
          <strong className="font-semibold">Aviso importante: </strong>
          {DISCLAIMER_SHORT}
        </span>
      </p>
    </aside>
  );
}
