// Mostrador numérico compacto usado nas simulações.
export function Leitura({
  rotulo,
  valor,
  unidade,
  cor,
  decimais = 0,
}: {
  rotulo: string;
  valor: number;
  unidade: string;
  cor: string;
  decimais?: number;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-3 text-center">
      <p className="text-xs text-muted-foreground">{rotulo}</p>
      <p className={`text-lg font-bold tabular-nums ${cor}`}>
        {valor.toFixed(decimais)} {unidade}
      </p>
    </div>
  );
}
