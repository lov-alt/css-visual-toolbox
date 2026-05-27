interface Option<T extends string> {
  value: T;
  label?: string;
}

interface SegmentedControlProps<T extends string> {
  options: Option<T>[];
  value: T;
  onChange: (v: T) => void;
  columns?: number;
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  columns,
}: SegmentedControlProps<T>) {
  return (
    <div
      className="grid gap-1"
      style={columns ? { gridTemplateColumns: `repeat(${columns}, 1fr)` } : undefined}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-2 text-xs font-medium rounded-lg border transition-all duration-200 ${
              active
                ? "border-indigo-200 bg-indigo-50 text-indigo-700 shadow-sm"
                : "border-zinc-200/60 bg-white text-zinc-500 hover:border-zinc-300 hover:text-zinc-700"
            }`}
          >
            {opt.label ?? opt.value}
          </button>
        );
      })}
    </div>
  );
}
