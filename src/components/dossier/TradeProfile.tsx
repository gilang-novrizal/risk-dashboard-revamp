"use client";

import { useState } from "react";
import type { DossierDetail } from "@/data/types";
import { Card, CardHeader, Badge, ProgressBar } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { LineChart } from "@/components/ui/LineChart";
import { usd, num, pct, cx } from "@/lib/format";

const WINDOWS = ["1 Day", "7 Days", "30 Days", "90 Days", "1 Year", "All Time"];

const GROUP_TONE: Record<string, "warn" | "info" | "neutral" | "danger"> = {
  Gold: "warn",
  Index: "info",
  Forex: "neutral",
  Oil: "danger",
  Other: "neutral",
};

export function TradeProfile({
  detail,
  onGoMahi,
}: {
  detail: DossierDetail;
  onGoMahi: () => void;
}) {
  const [window, setWindow] = useState("30 Days");
  const { tradeProfile: tp } = detail;
  const st = tp.statement;

  const topThree = tp.symbols.slice(0, 3).reduce((a, s) => a + s.share, 0);
  const effective =
    1 / tp.symbols.reduce((a, s) => a + Math.pow(s.share / 100, 2), 0);

  // Statement rows are newest-first; reverse for chronological chart.
  const chrono = [...st.rows].reverse();

  return (
    <div className="space-y-4">
      {/* Symbol composition */}
      <Card>
        <CardHeader
          tag="Symbol Composition"
          title="Volume share breakdown"
          right={
            <div className="flex flex-wrap gap-1.5">
              <Badge tone="neutral">{tp.symbols.length} symbols</Badge>
              <Badge tone="warn">Top 3 · {num(topThree, 0)}%</Badge>
              <Badge tone="info">Effective · {num(effective, 1)}</Badge>
            </div>
          }
        />
        <div className="px-4 pb-2 pt-1">
          <p className="text-[13px] text-ink-muted">{tp.summary}</p>
        </div>
        <div className="terminal-scroll overflow-x-auto px-2 pb-3">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line">
                {["Symbol / Asset", "Volume Share", "Volume (Lots)", "Cumulative P&L", "P&L / Volume"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tp.symbols.map((s) => (
                <tr key={s.symbol} className="border-b border-line/60 last:border-0">
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[13px] font-bold text-ink">{s.symbol}</span>
                      <Badge tone={GROUP_TONE[s.group] ?? "neutral"}>{s.group}</Badge>
                    </div>
                  </td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={s.share} tone={s.share > 50 ? "warn" : "brand"} className="w-28" />
                      <span className="font-mono text-[12px] tabular text-ink-soft">{pct(s.share)}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 font-mono text-[13px] tabular text-ink-soft">{num(s.volume, 0)}</td>
                  <td className={cx("px-2 py-2.5 font-mono text-[13px] tabular", s.pnl >= 0 ? "text-brand-700" : "text-danger-600")}>
                    {usd(s.pnl, { decimals: 0 })}
                  </td>
                  <td className={cx("px-2 py-2.5 font-mono text-[13px] tabular", s.pnlPerVolume >= 0 ? "text-brand-700" : "text-danger-600")}>
                    {num(s.pnlPerVolume)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Timeframe + realtime exposure */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader
            tag="Realtime Exposure"
            right={
              <div className="flex flex-wrap gap-1">
                {WINDOWS.map((w) => (
                  <button
                    key={w}
                    onClick={() => setWindow(w)}
                    className={cx(
                      "rounded border px-2 py-0.5 font-mono text-[11px] font-semibold",
                      w === window
                        ? "border-brand-600 bg-brand-50 text-brand-700"
                        : "border-line text-ink-muted hover:bg-surface-muted"
                    )}
                  >
                    {w}
                  </button>
                ))}
              </div>
            }
          />
          <div className="grid grid-cols-2 gap-3 px-4 pb-4 pt-3 md:grid-cols-4">
            <Stat label="Open positions" value={`${tp.open.positions}`} sub={`${tp.open.positions} buy, 0 sell`} />
            <Stat label="Total lots" value={num(tp.open.lots, 1)} sub="weighted entry" />
            <Stat label="Floating P&L" value={usd(tp.open.floating, { decimals: 0 })} tone="pos" />
            <Stat label="Oldest open" value={tp.open.oldest.split(" ")[0]} sub={tp.open.oldest.split(" ")[1]} />
          </div>
        </Card>

        <Card tone="danger">
          <CardHeader tag="Mahi Risk Signal" right={<Badge tone="danger" dot>DANGER</Badge>} />
          <div className="px-4 pb-4 pt-2">
            <div className="space-y-1.5">
              {tp.mahi.map((m) => (
                <div key={m.period} className="flex items-center justify-between text-[12px]">
                  <span className="font-semibold text-ink-soft">{m.period}</span>
                  <div className="flex gap-1.5">
                    <MahiPill v={m.v30} suffix="30s" />
                    <MahiPill v={m.v120} suffix="120s" />
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={onGoMahi}
              className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-danger-200 bg-danger-50 px-3 py-1.5 text-[13px] font-semibold text-danger-700 hover:bg-danger-100"
            >
              Open Mahi curve
              <Icon name="arrow-right" width={14} height={14} />
            </button>
          </div>
        </Card>
      </div>

      {/* Statement ledger */}
      <Card>
        <CardHeader tag="Daily MT4 Statement" title={`Rolling ${window} window`} />
        <div className="grid grid-cols-2 gap-3 px-4 pb-1 pt-3 md:grid-cols-5">
          <Stat label="Balance Δ" value={usd(st.rows[0].balance, { decimals: 0 })} tone="neg" />
          <Stat label="Ending Equity" value={usd(st.endingEquity, { sign: false })} />
          <Stat label="Max Drawdown" value={st.maxDrawdown} tone="neg" />
          <Stat label="Closed P&L" value={usd(st.closedPnl, { decimals: 0 })} tone="neg" />
          <Stat label="Net Deposits" value={usd(st.netDeposits, { decimals: 0 })} tone="neg" />
        </div>

        <div className="px-4 py-3">
          <div className="mb-2 flex items-center gap-4 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-ink-soft">
              <span className="h-2 w-2 rounded-full bg-brand-600" /> Equity
            </span>
            <span className="flex items-center gap-1.5 text-ink-soft">
              <span className="h-2 w-2 rounded-full bg-slate-400" /> Balance
            </span>
          </div>
          <LineChart
            labels={chrono.map((r) => r.date.slice(5))}
            series={[
              { name: "Equity", color: "#059669", values: chrono.map((r) => r.equity) },
              { name: "Balance", color: "#94a3b8", values: chrono.map((r) => r.balance) },
            ]}
            height={170}
          />
        </div>

        <div className="terminal-scroll overflow-x-auto px-2 pb-3">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-surface-subtle">
                {["Date", "Prev Balance", "Deposit", "Closed P&L", "Balance", "Floating", "Equity", ""].map((h) => (
                  <th key={h} className="whitespace-nowrap px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {st.rows.map((r) => (
                <tr key={r.date} className="border-b border-line/60 last:border-0 hover:bg-surface-subtle">
                  <td className="px-2 py-2 font-mono text-[12px] text-ink">{r.date}</td>
                  <td className="px-2 py-2 font-mono text-[12px] tabular text-ink-soft">{num(r.prevBalance, 0)}</td>
                  <td className="px-2 py-2 font-mono text-[12px] tabular text-ink-muted">{num(r.deposit, 0)}</td>
                  <td className={cx("px-2 py-2 font-mono text-[12px] tabular", r.closedPnl < 0 ? "text-danger-600" : "text-ink-muted")}>{num(r.closedPnl, 0)}</td>
                  <td className="px-2 py-2 font-mono text-[12px] tabular text-ink-soft">{num(r.balance, 0)}</td>
                  <td className="px-2 py-2 font-mono text-[12px] tabular text-ink-soft">{num(r.floating, 0)}</td>
                  <td className="px-2 py-2 font-mono text-[12px] font-semibold tabular text-ink">{num(r.equity, 0)}</td>
                  <td className="px-2 py-2 text-right">
                    <button className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-brand-700 hover:underline">
                      VIEW <Icon name="external" width={11} height={11} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "pos" | "neg" | "neutral";
}) {
  const colors = { pos: "text-brand-700", neg: "text-danger-600", neutral: "text-ink" };
  return (
    <div className="rounded-md border border-line bg-surface-subtle p-2.5">
      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">{label}</div>
      <div className={cx("mt-1 font-mono text-[15px] font-bold tabular", colors[tone])}>{value}</div>
      {sub && <div className="mt-0.5 font-mono text-[10px] text-ink-faint">{sub}</div>}
    </div>
  );
}

function MahiPill({ v, suffix }: { v: string; suffix: string }) {
  const danger = v.toLowerCase() === "danger";
  const noData = v.toLowerCase().includes("no data");
  return (
    <Badge tone={danger ? "danger" : noData ? "neutral" : "safe"}>
      {v} · {suffix}
    </Badge>
  );
}
