"use client";

import { useState } from "react";
import type { DossierDetail } from "@/data/types";
import { Modal } from "@/components/ui/Modal";
import { Icon } from "@/components/ui/Icon";
import { buttonClass, Badge } from "@/components/ui/primitives";
import { cx } from "@/lib/format";

const STP_OPTIONS = [
  "Move to A-Book (SOP Recommended · 85.1% Match)",
  "Keep B-Book",
  "Surya B-Book-Full",
];

const STATUS_OPTIONS = ["Pantau (Watch)", "Baru (New)", "Aman (Safe)"];

const REASON_CODES = [
  "TOXIC SCALPING",
  "TOXIC MAHI",
  "TOXIC LATENCY",
  "ARBITRASE SWAP",
  "AVERAGING MARTINGALE",
  "BIG LOT",
];

export function DecisionModal({
  open,
  onClose,
  detail,
}: {
  open: boolean;
  onClose: () => void;
  detail: DossierDetail;
}) {
  const [stp, setStp] = useState(STP_OPTIONS[0]);
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [reasons, setReasons] = useState<string[]>(["TOXIC MAHI"]);
  const [reasonQuery, setReasonQuery] = useState("");
  const [notes, setNotes] = useState("");

  const toggleReason = (code: string) =>
    setReasons((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );

  const available = REASON_CODES.filter(
    (c) => !reasons.includes(c) && c.toLowerCase().includes(reasonQuery.toLowerCase())
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Decision Execution Workbench"
      subtitle={`Account ${detail.account.login} · Desk ${detail.account.server} · DEV / SURYA`}
      footer={
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-line-strong px-4 py-2 text-[13px] font-semibold text-ink-soft hover:bg-surface-muted"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className={cx(buttonClass("primary"), "px-4 py-2 text-[13px] uppercase tracking-wider")}
          >
            Confirm
            <Icon name="arrow-right" width={15} height={15} />
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <Field label="STP Status">
          <SelectRaw value={stp} onChange={setStp} options={STP_OPTIONS} />
        </Field>

        <Field label="Operational Status">
          <SelectRaw value={status} onChange={setStatus} options={STATUS_OPTIONS} />
        </Field>

        <Field label="Classification Reason Codes">
          <div className="rounded-md border border-line bg-surface-subtle p-2.5">
            {reasons.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {reasons.map((code) => (
                  <button
                    key={code}
                    onClick={() => toggleReason(code)}
                    className="inline-flex items-center gap-1 rounded-md border border-danger-200 bg-danger-50 px-2 py-0.5 font-mono text-[11px] font-semibold text-danger-700 hover:bg-danger-100"
                  >
                    {code}
                    <Icon name="close" width={11} height={11} />
                  </button>
                ))}
              </div>
            )}
            <div className="relative">
              <Icon name="search" width={14} height={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <input
                value={reasonQuery}
                onChange={(e) => setReasonQuery(e.target.value)}
                placeholder="Search reason codes…"
                className="w-full rounded border border-line bg-surface py-1.5 pl-8 pr-2 text-[13px] text-ink outline-none focus:border-brand-500"
              />
            </div>
            {available.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {available.map((code) => (
                  <button
                    key={code}
                    onClick={() => toggleReason(code)}
                    className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-2 py-0.5 font-mono text-[11px] font-medium text-ink-soft hover:border-brand-300 hover:text-brand-700"
                  >
                    <Icon name="plus" width={11} height={11} />
                    {code}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Field>

        <Field label="Dealer Audit Notes & Risk Justification">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value.slice(0, 5000))}
            rows={5}
            placeholder="Write compliance notes, dealer commentary, or SOP routing justification…"
            className="w-full resize-none rounded-md border border-line bg-surface-subtle p-3 text-[13px] text-ink outline-none focus:border-brand-500"
          />
          <div className="mt-1 text-right font-mono text-[10px] text-ink-faint">
            {notes.length} / 5000
          </div>
        </Field>

        <div className="flex items-center gap-2 rounded-md border border-brand-200 bg-brand-50 px-3 py-2">
          <Badge tone="safe" dot>SOP MATCH 85.1%</Badge>
          <span className="text-[12px] text-brand-800">
            Selected route aligns with the deterministic SOP recommendation.
          </span>
        </div>
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block font-mono text-mono-label uppercase text-ink-muted">
        {label}
      </label>
      {children}
    </div>
  );
}

function SelectRaw({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none rounded-md border border-line bg-surface-subtle py-2 pl-3 pr-9 text-[13px] font-medium text-ink outline-none focus:border-brand-500"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <Icon name="chevron-down" width={15} height={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-faint" />
    </div>
  );
}
