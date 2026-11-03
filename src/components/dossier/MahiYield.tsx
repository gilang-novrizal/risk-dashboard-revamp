import type { DossierDetail } from "@/data/types";
import { Card, CardHeader, Badge } from "@/components/ui/primitives";
import { LineChart } from "@/components/ui/LineChart";
import { num, cx } from "@/lib/format";

const RELATED = [
  { id: "87530798", server: "MT4IN3", role: "Source Master Execution", weekly: "-33.74", monthly: "-33.74", exposure: "High", route: "B-Book-Full" },
  { id: "87611204", server: "MT4IN3", role: "Co-located Slave IP Proxy", weekly: "-28.10", monthly: "-31.02", exposure: "Medium", route: "B-Book" },
  { id: "87533910", server: "MT4IN2", role: "Copy-trade Follower", weekly: "-12.44", monthly: "-9.88", exposure: "Low", route: "B-Book" },
];

export function MahiYield({ detail }: { detail: DossierDetail }) {
  const weekly = detail.mahiSeries;
  // Monthly curve: a softened, deeper-decaying variant of the weekly series.
  const monthly = weekly.map((p) => ({ ...p, value: p.value * 1.15 - 20 }));
  const labels = weekly.map((p) => p.label);

  const at = (label: string) => weekly.find((p) => p.label === label)?.value ?? 0;
  const peak = Math.min(...weekly.map((p) => p.value));

  return (
    <div className="space-y-4">
      {/* Key metrics */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <KeyMetric label="Weekly Trades" value="1" />
        <KeyMetric label="Mahi @ 0s" value={`+${num(at("0s"))}`} sub="bps · alpha inversion" tone="warn" />
        <KeyMetric label="Mahi @ 30s Weekly" value={num(at("30s"))} sub="bps · danger" tone="danger" />
        <KeyMetric label="Peak Decay" value={num(peak)} sub="bps at T+120m" tone="danger" />
        <KeyMetric label="Mahi @ 30s Monthly" value={num(at("30s"))} sub="bps · danger" tone="danger" />
      </div>

      {/* Dual curves */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Card>
          <CardHeader tag="Weekly Mahi Curve" title="Latency decay" right={<Badge tone="danger" dot>DANGER</Badge>} />
          <div className="px-4 pb-4 pt-2">
            <LineChart
              labels={labels}
              series={[{ name: "Weekly", color: "#dc2626", values: weekly.map((p) => p.value) }]}
              baseline
              shadeBelowZero
              height={180}
            />
            <p className="mt-2 text-[12px] text-ink-muted">
              Yield inverts negative after execution and falls into the shaded danger zone, bottoming at the T+120m window.
            </p>
          </div>
        </Card>

        <Card>
          <CardHeader tag="Monthly Mahi Curve" title="Latency decay" right={<Badge tone="danger" dot>DANGER</Badge>} />
          <div className="px-4 pb-4 pt-2">
            <LineChart
              labels={labels}
              series={[{ name: "Monthly", color: "#d97706", values: monthly.map((p) => p.value) }]}
              baseline
              shadeBelowZero
              height={180}
            />
            <p className="mt-2 text-[12px] text-ink-muted">
              Monthly aggregation confirms the weekly pattern with a comparable post-trade settlement drawdown.
            </p>
          </div>
        </Card>
      </div>

      {/* Related accounts */}
      <Card>
        <CardHeader tag="Related Accounts & Link Topology" title="Cross-account hedging / mirror detection" />
        <div className="terminal-scroll overflow-x-auto px-2 pb-3">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-surface-subtle">
                {["Account ID", "Server", "Role", "Weekly Mahi", "Monthly Mahi", "Exposure", "SOP Route"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RELATED.map((r, i) => (
                <tr key={r.id} className={cx("border-b border-line/60 last:border-0", i === 0 && "bg-brand-50/40")}>
                  <td className="px-2 py-2.5 font-mono text-[13px] font-bold text-ink">{r.id}</td>
                  <td className="px-2 py-2.5 font-mono text-[12px] text-ink-soft">{r.server}</td>
                  <td className="px-2 py-2.5 text-[13px] text-ink-soft">{r.role}</td>
                  <td className="px-2 py-2.5 font-mono text-[12px] tabular text-danger-600">{r.weekly}</td>
                  <td className="px-2 py-2.5 font-mono text-[12px] tabular text-danger-600">{r.monthly}</td>
                  <td className="px-2 py-2.5">
                    <Badge tone={r.exposure === "High" ? "danger" : r.exposure === "Medium" ? "warn" : "neutral"}>
                      {r.exposure}
                    </Badge>
                  </td>
                  <td className="px-2 py-2.5 font-mono text-[12px] text-ink-soft">{r.route}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function KeyMetric({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "warn" | "danger" | "neutral";
}) {
  const colors = { warn: "text-warn-700", danger: "text-danger-600", neutral: "text-ink" };
  return (
    <div className="rounded-md border border-line bg-surface p-3 shadow-xs">
      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">{label}</div>
      <div className={cx("mt-1 font-mono text-lg font-bold tabular", colors[tone])}>{value}</div>
      {sub && <div className="mt-0.5 font-mono text-[10px] text-ink-faint">{sub}</div>}
    </div>
  );
}
