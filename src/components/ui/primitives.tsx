import type { ReactNode } from "react";
import { cx } from "@/lib/format";

/* ---------------- Card ---------------- */
export function Card({
  children,
  className,
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "danger" | "safe" | "warn";
}) {
  const tones: Record<string, string> = {
    default: "border-line bg-surface",
    danger: "border-danger-200 bg-gradient-to-b from-danger-50/50 to-white",
    safe: "border-brand-200 bg-gradient-to-b from-brand-50/50 to-white",
    warn: "border-warn-300 bg-gradient-to-b from-warn-50/60 to-white",
  };
  return (
    <div className={cx("rounded-md border shadow-xs", tones[tone], className)}>
      {children}
    </div>
  );
}

export function CardHeader({
  tag,
  title,
  right,
  className,
}: {
  tag?: string;
  title?: ReactNode;
  right?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "flex items-center justify-between gap-2 px-4 pt-3.5",
        className
      )}
    >
      <div className="min-w-0">
        {tag && (
          <div className="font-mono text-mono-label uppercase text-ink-muted">
            {tag}
          </div>
        )}
        {title && (
          <div className="mt-0.5 text-sm font-bold text-ink">{title}</div>
        )}
      </div>
      {right}
    </div>
  );
}

/* ---------------- Section label ---------------- */
export function SectionTag({ children }: { children: ReactNode }) {
  return (
    <div className="font-mono text-mono-label uppercase text-ink-muted">
      {children}
    </div>
  );
}

/* ---------------- Badge / Chip ---------------- */
type BadgeTone = "danger" | "warn" | "safe" | "neutral" | "info";

const badgeTones: Record<BadgeTone, string> = {
  danger: "bg-danger-50 text-danger-700 border-danger-200",
  warn: "bg-warn-100 text-warn-800 border-warn-300",
  safe: "bg-brand-50 text-brand-800 border-brand-200",
  neutral: "bg-surface-subtle text-ink-soft border-line",
  info: "bg-slate-100 text-slate-700 border-slate-200",
};

export function Badge({
  children,
  tone = "neutral",
  mono = true,
  dot = false,
  className,
  title,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  mono?: boolean;
  dot?: boolean;
  className?: string;
  title?: string;
}) {
  return (
    <span
      title={title}
      className={cx(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold",
        mono && "font-mono tracking-wide",
        badgeTones[tone],
        className
      )}
    >
      {dot && (
        <span
          className={cx(
            "h-1.5 w-1.5 rounded-full",
            tone === "danger" && "bg-danger-600 pulse-dot",
            tone === "warn" && "bg-warn-600",
            tone === "safe" && "bg-brand-600",
            (tone === "neutral" || tone === "info") && "bg-ink-faint"
          )}
        />
      )}
      {children}
    </span>
  );
}

/* ---------------- Progress bar ---------------- */
export function ProgressBar({
  value,
  tone = "brand",
  threshold,
  className,
}: {
  value: number;
  tone?: "brand" | "danger" | "warn" | "neutral";
  threshold?: number;
  className?: string;
}) {
  const fills: Record<string, string> = {
    brand: "bg-brand-600",
    danger: "bg-danger-600",
    warn: "bg-warn-600",
    neutral: "bg-ink-faint",
  };
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cx("relative h-2 w-full rounded-full bg-slate-200", className)}>
      <div
        className={cx("h-2 rounded-full transition-all", fills[tone])}
        style={{ width: `${clamped}%` }}
      />
      {threshold != null && (
        <div
          className="absolute top-[-2px] h-3 w-px bg-ink-soft/70"
          style={{ left: `${Math.max(0, Math.min(100, threshold))}%` }}
          title={`Threshold ${threshold}%`}
        />
      )}
    </div>
  );
}

/* ---------------- Buttons ---------------- */
type BtnVariant = "primary" | "ghost" | "outline";

export function buttonClass(variant: BtnVariant = "primary") {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-colors disabled:opacity-50";
  const variants: Record<BtnVariant, string> = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
    ghost: "bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100",
    outline: "border border-line-strong text-ink-soft hover:bg-surface-muted",
  };
  return cx(base, variants[variant]);
}
