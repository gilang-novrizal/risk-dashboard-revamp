"use client";

import { useState } from "react";
import Link from "next/link";
import type { DossierDetail, DossierRow } from "@/data/types";
import { Icon } from "@/components/ui/Icon";
import { Badge, buttonClass } from "@/components/ui/primitives";
import { cx } from "@/lib/format";
import { ExecutiveOverview } from "./ExecutiveOverview";
import { TradeProfile } from "./TradeProfile";
import { MahiYield } from "./MahiYield";
import { HistoryComments } from "./HistoryComments";
import { DecisionModal } from "./DecisionModal";

type TabKey = "overview" | "trade" | "mahi" | "history";

const TABS: { key: TabKey; label: string }[] = [
  { key: "overview", label: "Executive Overview" },
  { key: "trade", label: "Trade Profile" },
  { key: "mahi", label: "Mahi Yield Analysis" },
  { key: "history", label: "History & Comments" },
];

export function DossierSuite({
  detail,
  row,
  caseNumber,
  caseTotal,
}: {
  detail: DossierDetail;
  row: DossierRow;
  caseNumber: number;
  caseTotal: number;
}) {
  const [tab, setTab] = useState<TabKey>("overview");
  const [modalOpen, setModalOpen] = useState(false);

  const name = row.name;
  const account = detail.account;

  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="rounded-md border border-line bg-surface p-4 shadow-xs">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-[13px] font-bold text-ink">
                #{row.id}
              </span>
              <span className="font-mono text-[12px] text-ink-muted">
                {detail.date}
              </span>
              <span className="h-3 w-px bg-line" />
              <span className="text-sm font-bold text-ink">
                Surya / {name}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <Badge tone="danger" dot>
                CRITICAL SIGNAL
              </Badge>
              <Badge tone="warn">Pantau</Badge>
              <Badge tone="neutral">{row.book}</Badge>
              <span className="font-mono text-[11px] text-ink-muted">
                {account.server} {account.login} · reg {account.registeredAt}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className={cx(buttonClass("outline"), "px-3 py-1.5 text-[13px]")}
            >
              <Icon name="chevron-left" width={14} height={14} />
              Queue
            </Link>
            <div className="flex items-center overflow-hidden rounded-md border border-line">
              <button className="px-2 py-1.5 text-ink-soft hover:bg-surface-muted" aria-label="Previous case">
                <Icon name="chevron-left" width={14} height={14} />
              </button>
              <span className="border-x border-line px-2.5 py-1.5 font-mono text-[12px] text-ink-soft">
                Case {caseNumber} of {caseTotal}
              </span>
              <button className="px-2 py-1.5 text-ink-soft hover:bg-surface-muted" aria-label="Next case">
                <Icon name="chevron-right" width={14} height={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full-width primary action trigger */}
      <button
        onClick={() => setModalOpen(true)}
        className={cx(
          buttonClass("primary"),
          "w-full px-4 py-3 text-sm uppercase tracking-wider"
        )}
      >
        Action
        <Icon name="arrow-right" width={16} height={16} />
      </button>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 border-b border-line">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cx(
              "-mb-px border-b-2 px-3.5 py-2.5 text-[13px] font-semibold transition-colors",
              tab === t.key
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-ink-muted hover:text-ink"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <ExecutiveOverview detail={detail} row={row} onAction={() => setModalOpen(true)} onGoTab={setTab} />
      )}
      {tab === "trade" && <TradeProfile detail={detail} onGoMahi={() => setTab("mahi")} />}
      {tab === "mahi" && <MahiYield detail={detail} />}
      {tab === "history" && <HistoryComments detail={detail} />}

      <DecisionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        detail={detail}
      />
    </div>
  );
}
