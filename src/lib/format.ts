export function usd(value: number, opts: { sign?: boolean; decimals?: number } = {}) {
  const { sign = true, decimals = 2 } = opts;
  const abs = Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const prefix = value < 0 ? "-$" : sign ? "+$" : "$";
  return `${prefix}${abs}`;
}

export function compactUsd(value: number) {
  const neg = value < 0;
  const abs = Math.abs(value);
  let out: string;
  if (abs >= 1_000_000) out = `${(abs / 1_000_000).toFixed(1)}M`;
  else if (abs >= 1_000) out = `${Math.round(abs / 1_000)}k`;
  else out = `${abs}`;
  return `${neg ? "-$" : "+$"}${out}`;
}

export function num(value: number, decimals = 2) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function pct(value: number, decimals = 1) {
  return `${value.toFixed(decimals)}%`;
}

export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
