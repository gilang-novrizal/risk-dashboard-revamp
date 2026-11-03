"use client";

import { useState } from "react";
import type { DossierDetail } from "@/data/types";
import { Card, CardHeader, Badge, buttonClass } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { cx } from "@/lib/format";

const EVENT_TONE = (e: string): "danger" | "warn" | "neutral" => {
  if (/toxic|20%/i.test(e)) return "danger";
  if (/1000|mahi|1%|profit/i.test(e)) return "warn";
  return "neutral";
};

const TOOLBAR = ["B", "I", "• List", "</>", "Link", "Attach"];

export function HistoryComments({ detail }: { detail: DossierDetail }) {
  const [draft, setDraft] = useState("");

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
      {/* Audit table */}
      <Card className="lg:col-span-3">
        <CardHeader tag="State Transition Audit" title={`${detail.history.length} recorded transitions`} />
        <div className="terminal-scroll overflow-x-auto px-2 pb-3">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-line bg-surface-subtle">
                {["Updated At", "Status", "STP Routing", "Events", "Action By", "Approved By"].map((h) => (
                  <th key={h} className="whitespace-nowrap px-2 py-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detail.history.map((h, i) => (
                <tr key={i} className="border-b border-line/60 align-top last:border-0 hover:bg-surface-subtle">
                  <td className="whitespace-nowrap px-2 py-2.5 font-mono text-[12px] text-ink">{h.updatedAt}</td>
                  <td className="px-2 py-2.5"><Badge tone="warn">{h.status}</Badge></td>
                  <td className="px-2 py-2.5 font-mono text-[11px] text-ink-soft">{h.stp}</td>
                  <td className="px-2 py-2.5">
                    <div className="flex max-w-[220px] flex-wrap gap-1">
                      {h.events.length === 0 ? (
                        <span className="font-mono text-[11px] text-ink-faint">—</span>
                      ) : (
                        h.events.map((e) => (
                          <Badge key={e} tone={EVENT_TONE(e)}>{e}</Badge>
                        ))
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-[12px] font-semibold text-ink-soft">{h.actionBy}</td>
                  <td className="px-2 py-2.5 text-[12px] text-ink-muted">{h.approvedBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Discussion thread */}
      <Card className="lg:col-span-2">
        <CardHeader tag="Compliance Discussion" title="Dealer thread" />
        <div className="px-4 pb-3 pt-2">
          {/* Composer */}
          <div className="rounded-md border border-line bg-surface-subtle">
            <div className="flex flex-wrap items-center gap-1 border-b border-line px-2 py-1.5">
              {TOOLBAR.map((t) => (
                <button key={t} className="rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold text-ink-muted hover:bg-surface-muted hover:text-ink">
                  {t}
                </button>
              ))}
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value.slice(0, 5000))}
              rows={3}
              placeholder="Add a dealer observation or shift handover…"
              className="w-full resize-none bg-transparent p-2.5 text-[13px] text-ink outline-none"
            />
            <div className="flex items-center justify-between border-t border-line px-2.5 py-1.5">
              <span className="font-mono text-[10px] text-ink-faint">{draft.length} / 5000</span>
              <button className={cx(buttonClass("primary"), "px-3 py-1 text-[12px] uppercase tracking-wider")}>
                <Icon name="arrow-right" width={13} height={13} />
                Send Note
              </button>
            </div>
          </div>

          {/* Feed */}
          <div className="mt-3 space-y-3">
            {detail.comments.map((c, i) => (
              <div key={i} className="flex gap-2.5">
                <div className="mt-0.5 flex h-7 w-7 flex-none items-center justify-center rounded-full bg-ink text-[11px] font-bold uppercase text-white">
                  {c.author.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-ink">{c.author}</span>
                    <span className="font-mono text-[10px] text-ink-faint">{c.at}</span>
                  </div>
                  <div className="mt-1 rounded-md border border-line bg-surface-subtle p-2.5">
                    {c.body.split("\n").map((line, j) => {
                      const toxic = /toxic/i.test(line);
                      return (
                        <p
                          key={j}
                          className={cx(
                            "whitespace-pre-wrap font-mono text-[11px] leading-relaxed",
                            toxic ? "font-bold text-danger-600" : "text-ink-soft"
                          )}
                        >
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
