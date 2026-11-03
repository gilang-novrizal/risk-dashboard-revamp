"use client";

import { useState } from "react";
import type { DossierDetail, DossierRow } from "@/data/types";
import { Card, CardHeader, SectionTag, Badge, ProgressBar, buttonClass } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { usd, num, pct, cx } from "@/lib/format";
import { WorksheetModal } from "./WorksheetModal";

type TabKey = "overview" | "trade" | "mahi" | "history";

export function ExecutiveOverview({
  detail,
  row,
  onAction,
  onGoTab,
}: {
  detail: DossierDetail;
  row: DossierRow;
  onAction: () => void;
  onGoTab: (t: TabKey) => void;
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { recommendation: reco, methods, signals, kpis } = detail;

  const kpi = (label: string) => kpis.find((k) => k.label === label)?.value ?? 0;

  return (
    <div className="space-y-4">
      {/* Executive decision row */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        {/* SOP card */}
        <Card tone="danger">
          <CardHeader
            tag="SOP Recommendation"
            right={<Badge tone="danger">{reco.strength} margin</Badge>}
          />
          <div className="px-4 pb-4 pt-2">
            <div className="text-xl font-extrabold text-ink">{reco.label}</div>
            <div className="mt-3 flex items-end justify-between">
              <span className="font-mono text-3xl font-bold text-danger-600 tabular">
                {num(row.score, 1)}%
              </span>
              <span className="font-mono text-[11px] text-ink-muted">
                threshold {reco.threshold}%
              </span>
            </div>
            <ProgressBar
              className="mt-2"
              value={reco.cumulative}
              tone="danger"
              threshold={reco.threshold}
            />
            <button
              onClick={() => setSheetOpen(true)}
              className={cx(buttonClass("ghost"), "mt-3 w-full px-3 py-1.5 text-[13px]")}
            >
              <Icon name="layers" width={14} height={14} />
              Rule Inspector
            </button>
          </div>
        </Card>

        {/* Terminal risk score */}
        <Card tone="danger">
          <CardHeader
            tag="Terminal Risk Score"
            right={<Badge tone="danger" dot>HIGH DANGER</Badge>}
          />
          <div className="px-4 pb-4 pt-2">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold text-ink tabular">76</span>
              <span className="font-mono text-sm text-ink-muted">/ 100</span>
            </div>
            <ProgressBar className="mt-3" value={76} tone="danger" />
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <MiniCount label="Danger" value={reco.counts.danger} tone="danger" />
              <MiniCount label="Safe" value={reco.counts.safe} tone="safe" />
              <MiniCount label="Neutral" value={reco.counts.unavailable} tone="neutral" />
            </div>
          </div>
        </Card>

        {/* Luna AI model */}
        <Card>
          <CardHeader
            tag="Luna AI Model"
            right={<Badge tone="warn">High concentration</Badge>}
          />
          <div className="px-4 pb-4 pt-2">
            <div className="text-xl font-extrabold text-ink">{detail.luna.opinion}</div>
            <div className="mt-3 flex items-end justify-between">
              <span className="font-mono text-3xl font-bold text-warn-600 tabular">
                {methods.luna.confidence}%
              </span>
              <span className="font-mono text-[11px] text-ink-muted">confidence</span>
            </div>
            <ProgressBar className="mt-2" value={methods.luna.confidence} tone="warn" />
            <div className="mt-3 font-mono text-[11px] text-ink-muted">
              {methods.ml.label} · {methods.ml.detail}
            </div>
          </div>
        </Card>
      </div>

      {/* Verdict summary banner */}
      <Card tone="warn" className="px-4 py-3">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-warn-600">
            <Icon name="alert" width={18} height={18} />
          </div>
          <div>
            <p className="text-[13px] font-medium text-ink-soft">{reco.summary}</p>
            <ul className="mt-2 space-y-1">
              {reco.reasons.map((r) => (
                <li key={r} className="flex items-start gap-2 text-[12px] text-ink-muted">
                  <span className="mt-1.5 h-1 w-1 flex-none rounded-full bg-warn-600" />
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Core metrics grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Metric label="Lifetime P&L" value={usd(kpi("Lifetime P&L"))} tone="pos" />
        <Metric label="Today P&L" value={usd(kpi("Today"))} tone="pos" />
        <Metric label="Weekly P&L" value={usd(kpi("This week"))} tone="neg" />
        <Metric label="Toxic Flags" value={`${reco.counts.danger} / 30`} tone="danger" />
        <Metric label="Scalper (<10s)" value={pct(5.33)} tone="neutral" />
        <Metric label="Avg Profit ≥ 10%" value={pct(14.67)} tone="warn" />
      </div>

      {/* Cross-tab summaries */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <CrossTab
          tag="Trade Profile"
          title="XAUUSD concentration 75.0%"
          lines={["8 open positions · 8 buy, 0 sell", "Top 3 symbols = 89% of volume"]}
          onClick={() => onGoTab("trade")}
        />
        <CrossTab
          tag="Mahi Yield"
          title="Weekly & Monthly 30s · -33.74"
          lines={["Peak decay -4,120.00 at T+120m", "Both periods in danger zone"]}
          tone="danger"
          onClick={() => onGoTab("mahi")}
        />
        <CrossTab
          tag="Audit History"
          title="16 recorded transitions"
          lines={[`Last transition ${detail.history[0].updatedAt}`, "Group marked TOXIC"]}
          onClick={() => onGoTab("history")}
        />
      </div>

      {/* Signals + SOP rules */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader tag="Top Signals" title="Threshold meters" />
          <div className="space-y-3 px-4 pb-4 pt-3">
            {signals.map((s) => {
              const over = s.value >= s.threshold;
              return (
                <div key={s.key}>
                  <div className="mb-1 flex items-center justify-between text-[12px]">
                    <span className="font-semibold text-ink-soft">{s.label}</span>
                    <span className="font-mono text-ink-muted">
                      <span className={cx("font-bold", over ? "text-danger-600" : "text-ink")}>
                        {num(s.value)}%
                      </span>{" "}
                      · {s.detail}
                    </span>
                  </div>
                  <ProgressBar value={s.value} tone={over ? "danger" : "brand"} threshold={s.threshold} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader tag="SOP Rules Summary" title="Deterministic checklist" />
          <div className="px-4 pb-4 pt-3">
            <div className="grid grid-cols-3 gap-2">
              <RuleCount label="Danger" value={reco.counts.danger} tone="danger" />
              <RuleCount label="Safe" value={reco.counts.safe} tone="safe" />
              <RuleCount label="Neutral" value={reco.counts.unavailable} tone="neutral" />
            </div>
            <div className="mt-3 rounded-md border border-line bg-surface-subtle p-3">
              <div className="flex items-center justify-between font-mono text-[11px] text-ink-muted">
                <span>Stage 1 score</span>
                <span className="font-bold text-ink">{reco.stage1}</span>
              </div>
              <div className="mt-1 flex items-center justify-between font-mono text-[11px] text-ink-muted">
                <span>Cumulative</span>
                <span className="font-bold text-danger-600">{reco.cumulative}% / {reco.threshold}%</span>
              </div>
            </div>
            <button
              onClick={() => setSheetOpen(true)}
              className={cx(buttonClass("outline"), "mt-3 w-full px-3 py-1.5 text-[13px]")}
            >
              Open rule sheet
              <Icon name="arrow-right" width={14} height={14} />
            </button>
          </div>
        </Card>
      </div>

      <WorksheetModal open={sheetOpen} onClose={() => setSheetOpen(false)} detail={detail} />
    </div>
  );
}

function MiniCount({ label, value, tone }: { label: string; value: number; tone: "danger" | "safe" | "neutral" }) {
  const tones = {
    danger: "text-danger-600",
    safe: "text-brand-600",
    neutral: "text-ink-muted",
  };
  return (
    <div className="rounded border border-line bg-surface-subtle py-1.5">
      <div className={cx("font-mono text-base font-bold tabular", tones[tone])}>{value}</div>
      <div className="font-mono text-[9px] uppercase tracking-wider text-ink-muted">{label}</div>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "pos" | "neg" | "danger" | "warn" | "neutral";
}) {
  const colors = {
    pos: "text-brand-700",
    neg: "text-danger-600",
    danger: "text-danger-600",
    warn: "text-warn-700",
    neutral: "text-ink",
  };
  return (
    <div className="rounded-md border border-line bg-surface p-3 shadow-xs">
      <div className="font-mono text-mono-label uppercase text-ink-muted">{label}</div>
      <div className={cx("mt-1.5 font-mono text-lg font-bold tabular", colors[tone])}>
        {value}
      </div>
    </div>
  );
}

function CrossTab({
  tag,
  title,
  lines,
  tone = "default",
  onClick,
}: {
  tag: string;
  title: string;
  lines: string[];
  tone?: "default" | "danger";
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "group rounded-md border bg-surface p-4 text-left shadow-xs transition-colors hover:border-brand-300",
        tone === "danger" ? "border-danger-200" : "border-line"
      )}
    >
      <div className="flex items-center justify-between">
        <SectionTag>{tag}</SectionTag>
        <Icon name="arrow-right" width={15} height={15} className="text-ink-faint transition-colors group-hover:text-brand-600" />
      </div>
      <div className="mt-2 text-sm font-bold text-ink">{title}</div>
      <ul className="mt-1.5 space-y-0.5">
        {lines.map((l) => (
          <li key={l} className="font-mono text-[11px] text-ink-muted">{l}</li>
        ))}
      </ul>
    </button>
  );
}

function RuleCount({ label, value, tone }: { label: string; value: number; tone: "danger" | "safe" | "neutral" }) {
  const tones = {
    danger: "border-danger-200 bg-danger-50 text-danger-700",
    safe: "border-brand-200 bg-brand-50 text-brand-700",
    neutral: "border-line bg-surface-subtle text-ink-soft",
  };
  return (
    <div className={cx("rounded-md border py-2 text-center", tones[tone])}>
      <div className="font-mono text-lg font-bold tabular">{value}</div>
      <div className="font-mono text-[9px] uppercase tracking-wider opacity-80">{label}</div>
    </div>
  );
}
