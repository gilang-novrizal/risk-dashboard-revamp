"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { dossiers } from "@/data/dossiers";
import type { DossierRow } from "@/data/types";
import {
  recoMeta,
  lunaMeta,
  entityOf,
  yesterdayPnl,
  FLAG_LABELS,
} from "@/lib/dossier";
import { Badge, buttonClass } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { compactUsd, cx } from "@/lib/format";

type TabKey = "needs-change" | "keep" | "data" | "all";

const STP_OPTIONS = ["All STP", "Surya B-Book", "Surya B-Book-Full", "VT B-Book"];
const STATUS_OPTIONS = ["All status", "Pantau", "Baru", "Aman"];
const ENTITY_OPTIONS = ["All entities", "Surya", "Valutrades"];
const DANGER_OPTIONS = ["Any danger", "High (> 70)", "Medium (60–70)", "Low (< 60)"];
const DATE_PRESETS = ["Today", "Yesterday", "Last 7 Days", "Last 30 Days", "Month to Date"];

export function Workbench() {
  const [tab, setTab] = useState<TabKey>("needs-change");
  const [query, setQuery] = useState("");
  const [entity, setEntity] = useState(ENTITY_OPTIONS[0]);
  const [status, setStatus] = useState(STATUS_OPTIONS[0]);
  const [stp, setStp] = useState(STP_OPTIONS[0]);
  const [danger, setDanger] = useState(DANGER_OPTIONS[0]);
  const [datePreset, setDatePreset] = useState("Today");
  const [perPage, setPerPage] = useState(25);
  const [page, setPage] = useState(1);

  const counts = useMemo(() => {
    let needs = 0;
    let keep = 0;
    let data = 0;
    for (const d of dossiers) {
      const b = recoMeta(d.recommendation).bucket;
      if (b === "needs-change") needs++;
      else if (b === "keep") keep++;
      else data++;
    }
    // Scale to PRD-style volumes while keeping relative mix.
    return {
      "needs-change": 117,
      keep: 57,
      data: 13,
      all: 187,
      localNeeds: needs,
      localKeep: keep,
      localData: data,
    };
  }, []);

  const filtered = useMemo(() => {
    return dossiers.filter((d) => {
      const bucket = recoMeta(d.recommendation).bucket;
      if (tab !== "all" && bucket !== tab) return false;
      if (entity !== ENTITY_OPTIONS[0] && entityOf(d) !== entity) return false;
      if (stp !== STP_OPTIONS[0] && d.book !== stp) return false;
      if (danger === "High (> 70)" && d.score <= 70) return false;
      if (danger === "Medium (60–70)" && !(d.score > 60 && d.score <= 70)) return false;
      if (danger === "Low (< 60)" && d.score >= 60) return false;
      if (query) {
        const q = query.toLowerCase();
        if (
          !d.id.toLowerCase().includes(q) &&
          !d.name.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [tab, entity, stp, danger, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, totalPages);
  const pageRows = filtered.slice((current - 1) * perPage, current * perPage);

  const resetPage = <T,>(setter: (v: T) => void) => (v: T) => {
    setter(v);
    setPage(1);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <WorkbenchHeader query={query} setQuery={resetPage(setQuery)} />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        <Tab label="NEEDS CHANGE" count={counts["needs-change"]} active={tab === "needs-change"} onClick={() => { setTab("needs-change"); setPage(1); }} tone="danger" />
        <Tab label="KEEP" count={counts.keep} active={tab === "keep"} onClick={() => { setTab("keep"); setPage(1); }} tone="safe" />
        <Tab label="NOT ENOUGH DATA" count={counts.data} active={tab === "data"} onClick={() => { setTab("data"); setPage(1); }} tone="neutral" />
        <Tab label="ALL DOSSIERS" count={counts.all} active={tab === "all"} onClick={() => { setTab("all"); setPage(1); }} tone="neutral" />
      </div>

      {/* Filter toolbar */}
      <div className="rounded-md border border-line bg-surface p-3 shadow-xs">
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5">
          <Select label="Entity" value={entity} onChange={resetPage(setEntity)} options={ENTITY_OPTIONS} />
          <Select label="Desk Status" value={status} onChange={resetPage(setStatus)} options={STATUS_OPTIONS} />
          <Select label="STP Mode" value={stp} onChange={resetPage(setStp)} options={STP_OPTIONS} />
          <Select label="Danger Level" value={danger} onChange={resetPage(setDanger)} options={DANGER_OPTIONS} />
          <div className="flex flex-col gap-1">
            <label className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              Date Range
            </label>
            <div className="relative">
              <Icon name="calendar" width={15} height={15} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
              <select
                value={datePreset}
                onChange={(e) => setDatePreset(e.target.value)}
                className="w-full appearance-none rounded-md border border-line bg-surface-subtle py-1.5 pl-8 pr-7 text-[13px] font-medium text-ink-soft outline-none focus:border-brand-500"
              >
                {DATE_PRESETS.map((d) => (
                  <option key={d}>{d}</option>
                ))}
              </select>
              <Icon name="chevron-down" width={14} height={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-faint" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-md border border-line bg-surface shadow-xs">
        <div className="terminal-scroll overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-line bg-surface-subtle">
                {["Person / Dossier ID", "Entity", "Tags", "Yesterday P&L", "Status", "Current STP", "SOP Recommendation", "Luna ML Engine", "In Status", ""].map((h) => (
                  <th key={h} className="whitespace-nowrap px-3 py-2.5 font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <Row key={row.id} row={row} />
              ))}
              {pageRows.length === 0 && (
                <tr>
                  <td colSpan={10} className="px-4 py-10 text-center text-sm text-ink-muted">
                    No dossiers match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-3 py-2.5">
          <div className="flex items-center gap-2 text-[13px] text-ink-muted">
            <span>Rows per page</span>
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              className="rounded-md border border-line bg-surface-subtle px-2 py-1 font-mono text-[12px] font-semibold text-ink-soft outline-none focus:border-brand-500"
            >
              {[25, 50, 100].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </select>
            <span className="ml-2 font-mono">
              {filtered.length === 0 ? 0 : (current - 1) * perPage + 1}–
              {Math.min(current * perPage, filtered.length)} of {filtered.length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={current === 1}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-soft disabled:opacity-40 hover:bg-surface-muted"
              aria-label="Previous page"
            >
              <Icon name="chevron-left" width={15} height={15} />
            </button>
            {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
              const p = i + 1;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cx(
                    "h-7 min-w-7 rounded-md px-2 font-mono text-[12px] font-semibold",
                    p === current ? "bg-brand-600 text-white" : "border border-line text-ink-soft hover:bg-surface-muted"
                  )}
                >
                  {p}
                </button>
              );
            })}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={current === totalPages}
              className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line text-ink-soft disabled:opacity-40 hover:bg-surface-muted"
              aria-label="Next page"
            >
              <Icon name="chevron-right" width={15} height={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkbenchHeader({
  query,
  setQuery,
}: {
  query: string;
  setQuery: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold tracking-tight text-ink">
            Assessment Workbench
          </h1>
          <Badge tone="safe" dot>
            SYNCED 08:53:14 UTC
          </Badge>
        </div>
        <p className="mt-1 text-[13px] text-ink-muted">
          Live queue ledger · surveillance triage &amp; STP routing
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Icon name="search" width={16} height={16} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search login, name or ID"
            className="w-64 rounded-md border border-line bg-surface py-2 pl-8 pr-14 text-[13px] text-ink outline-none focus:border-brand-500"
          />
          <kbd className="absolute right-2 top-1/2 -translate-y-1/2 rounded border border-line bg-surface-subtle px-1.5 py-0.5 font-mono text-[10px] text-ink-muted">
            ⌘K
          </kbd>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-2 font-mono text-[12px] text-ink-soft">
          <Icon name="calendar" width={15} height={15} className="text-ink-faint" />
          2026-10-26
        </div>
        <button className={cx(buttonClass("primary"), "px-3.5 py-2")}>
          <Icon name="play" width={15} height={15} />
          Run Pipeline
        </button>
      </div>
    </div>
  );
}

function Row({ row }: { row: DossierRow }) {
  const reco = recoMeta(row.recommendation);
  const luna = lunaMeta(row);
  const pnl = yesterdayPnl(row);
  return (
    <tr className="border-b border-line/70 transition-colors last:border-0 hover:bg-surface-subtle">
      <td className="px-3 py-2.5">
        <div className="font-semibold text-ink">{row.name}</div>
        <div className="font-mono text-[11px] text-ink-muted">{row.id}</div>
      </td>
      <td className="px-3 py-2.5">
        <Badge tone="info">{entityOf(row)}</Badge>
      </td>
      <td className="px-3 py-2.5">
        <div className="flex flex-wrap gap-1">
          {row.flags.map((f) => (
            <Badge key={f} tone={f === "D" ? "warn" : "neutral"} title={FLAG_LABELS[f]}>
              {f}
            </Badge>
          ))}
        </div>
      </td>
      <td className="px-3 py-2.5">
        <span className={cx("font-mono text-[13px] font-semibold tabular", pnl >= 0 ? "text-brand-700" : "text-danger-600")}>
          {compactUsd(pnl)}
        </span>
      </td>
      <td className="px-3 py-2.5">
        <Badge tone="warn">Pantau</Badge>
      </td>
      <td className="px-3 py-2.5">
        <span className="font-mono text-[12px] text-ink-soft">{row.book}</span>
      </td>
      <td className="px-3 py-2.5">
        <Badge tone={reco.tone}>{reco.label}</Badge>
      </td>
      <td className="px-3 py-2.5">
        <Badge tone={luna.tone === "neutral" ? "neutral" : luna.tone}>{luna.label}</Badge>
      </td>
      <td className="px-3 py-2.5">
        <span className="font-mono text-[12px] text-ink-soft">{row.days} d</span>
      </td>
      <td className="px-3 py-2.5 text-right">
        <Link
          href={`/dossier/${row.id}`}
          className="inline-flex items-center gap-1 rounded-md border border-brand-200 bg-brand-50 px-2.5 py-1 text-[12px] font-semibold text-brand-700 hover:bg-brand-100"
        >
          Details
          <Icon name="arrow-right" width={13} height={13} />
        </Link>
      </td>
    </tr>
  );
}

function Tab({
  label,
  count,
  active,
  onClick,
  tone,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  tone: "danger" | "safe" | "neutral";
}) {
  const dotTone =
    tone === "danger" ? "bg-danger-600" : tone === "safe" ? "bg-brand-600" : "bg-ink-faint";
  return (
    <button
      onClick={onClick}
      className={cx(
        "inline-flex items-center gap-2 rounded-md border px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider transition-colors",
        active
          ? "border-ink bg-ink text-white"
          : "border-line bg-surface text-ink-soft hover:bg-surface-muted"
      )}
    >
      <span className={cx("h-1.5 w-1.5 rounded-full", active ? "bg-white/80" : dotTone)} />
      {label}
      <span className={cx("rounded px-1.5 py-0.5 text-[10px]", active ? "bg-white/20" : "bg-surface-muted text-ink-muted")}>
        {count}
      </span>
    </button>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-md border border-line bg-surface-subtle py-1.5 pl-2.5 pr-7 text-[13px] font-medium text-ink-soft outline-none focus:border-brand-500"
        >
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <Icon name="chevron-down" width={14} height={14} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-ink-faint" />
      </div>
    </div>
  );
}
