// Controle deslizante acessível com rótulo e unidade.
interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export function Slider({ label, value, min, max, step = 1, unit, onChange }: SliderProps) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-sm font-medium text-foreground">
        <span>{label}</span>
        <span className="tabular-nums text-muted-foreground">
          {value}
          {unit ? ` ${unit}` : ""}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-[var(--primary)]"
        aria-label={label}
      />
    </label>
  );
}
