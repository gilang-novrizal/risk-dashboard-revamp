"use client";

import type { DossierDetail, SignalStatus, WorksheetCategory, WorksheetItem } from "@/data/types";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/primitives";
import { cx } from "@/lib/format";

const CATEGORY_LABEL: Record<WorksheetCategory, string> = {
  MAHI: "Mahi Yield Gates",
  QUICK: "Quick Checks",
  TOXIC: "Toxic Flow",
  PROFILE: "Trade Profile",
  PRO: "Professional Behaviour",
  EXTRA: "Extra / Manual",
};

const CATEGORY_ORDER: WorksheetCategory[] = ["MAHI", "QUICK", "TOXIC", "PROFILE", "PRO", "EXTRA"];

const STATUS_TONE: Record<SignalStatus, "danger" | "safe" | "neutral" | "warn"> = {
  danger: "danger",
  safe: "safe",
  na: "neutral",
  open: "warn",
};

const STATUS_LABEL: Record<SignalStatus, string> = {
  danger: "DANGER",
  safe: "SAFE",
  na: "N/A",
  open: "OPEN",
};

export function WorksheetModal({
  open,
  onClose,
  detail,
}: {
  open: boolean;
  onClose: () => void;
  detail: DossierDetail;
}) {
  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    items: detail.sop_worksheet.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="SOP Rule Worksheet"
      subtitle={`${detail.recommendation.counts.danger} danger · ${detail.recommendation.counts.safe} safe · ${detail.recommendation.counts.unavailable} neutral`}
      footer={
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] text-ink-muted">
            Cumulative {detail.recommendation.cumulative}% against {detail.recommendation.threshold}% threshold
          </span>
          <button
            onClick={onClose}
            className="rounded-md border border-line-strong px-3.5 py-1.5 text-[13px] font-semibold text-ink-soft hover:bg-surface-muted"
          >
            Close
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        {grouped.map((g) => (
          <div key={g.cat}>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="font-mono text-mono-label uppercase text-ink-muted">
                {CATEGORY_LABEL[g.cat]}
              </h3>
              <span className="h-px flex-1 bg-line" />
            </div>
            <div className="overflow-hidden rounded-md border border-line">
              <table className="w-full text-left">
                <tbody>
                  {g.items.map((item, i) => (
                    <WorksheetRow key={`${item.id}-${i}`} item={item} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}

function WorksheetRow({ item }: { item: WorksheetItem }) {
  return (
    <tr className={cx("border-b border-line/70 last:border-0", item.decisive && "bg-danger-50/40")}>
      <td className="w-14 px-3 py-2.5 align-top">
        <span className="font-mono text-[11px] text-ink-muted">{item.id}</span>
      </td>
      <td className="px-3 py-2.5 align-top">
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-medium text-ink-soft">{item.label}</span>
          {item.decisive && <Badge tone="danger">decisive</Badge>}
        </div>
        {item.note && (
          <div className="mt-0.5 text-[11px] italic text-ink-faint">{item.note}</div>
        )}
        {item.weight && (
          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            {item.weight}
          </div>
        )}
      </td>
      <td className="w-20 px-3 py-2.5 text-right align-top">
        <span className="font-mono text-[13px] font-bold tabular text-ink">{item.value}</span>
      </td>
      <td className="w-20 px-3 py-2.5 text-right align-top">
        <Badge tone={STATUS_TONE[item.status]}>{STATUS_LABEL[item.status]}</Badge>
      </td>
    </tr>
  );
}
