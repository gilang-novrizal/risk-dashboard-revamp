type Series = {
  name: string;
  color: string;
  values: number[];
};

export function LineChart({
  labels,
  series,
  height = 160,
  baseline = false,
  shadeBelowZero = false,
}: {
  labels: string[];
  series: Series[];
  height?: number;
  baseline?: boolean;
  shadeBelowZero?: boolean;
}) {
  const width = 640;
  const padX = 8;
  const padY = 12;
  const all = series.flatMap((s) => s.values);
  const rawMax = Math.max(...all, 0);
  const rawMin = Math.min(...all, 0);
  const span = rawMax - rawMin || 1;
  const max = rawMax + span * 0.08;
  const min = rawMin - span * 0.08;
  const range = max - min || 1;

  const x = (i: number) =>
    padX + (i / Math.max(1, labels.length - 1)) * (width - padX * 2);
  const y = (v: number) =>
    padY + (1 - (v - min) / range) * (height - padY * 2);

  const zeroY = y(0);

  const toPath = (values: number[]) =>
    values
      .map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`)
      .join(" ");

  return (
    <div className="w-full">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        preserveAspectRatio="none"
        role="img"
      >
        {/* gridlines */}
        {[0.25, 0.5, 0.75].map((f) => (
          <line
            key={f}
            x1={padX}
            x2={width - padX}
            y1={padY + f * (height - padY * 2)}
            y2={padY + f * (height - padY * 2)}
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        ))}

        {shadeBelowZero && (
          <rect
            x={padX}
            y={zeroY}
            width={width - padX * 2}
            height={Math.max(0, height - padY - zeroY)}
            fill="#fef2f2"
          />
        )}

        {baseline && (
          <line
            x1={padX}
            x2={width - padX}
            y1={zeroY}
            y2={zeroY}
            stroke="#94a3b8"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
        )}

        {series.map((s) => (
          <g key={s.name}>
            <path d={toPath(s.values)} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
            {s.values.map((v, i) => (
              <circle key={i} cx={x(i)} cy={y(v)} r={2.4} fill={s.color} />
            ))}
          </g>
        ))}
      </svg>

      <div className="mt-1 flex justify-between px-1 font-mono text-[10px] text-ink-faint">
        {labels.map((l, i) => (
          <span key={`${l}-${i}`}>{l}</span>
        ))}
      </div>
    </div>
  );
}
