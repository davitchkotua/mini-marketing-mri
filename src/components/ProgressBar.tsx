interface Props {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2 text-xs text-ink-muted">
        <span>
          ნაბიჯი {current} / {total}
        </span>
        <span>{pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-line overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
