import type { DossierRow, Recommendation } from "@/data/types";

export const FLAG_LABELS: Record<string, string> = {
  W: "Watch",
  Y: "Yesterday P&L",
  D: "Daily P&L 20%",
};

export type RecoMeta = {
  label: string;
  tone: "danger" | "warn" | "safe";
  bucket: "needs-change" | "keep" | "data";
};

export function recoMeta(reco: Recommendation): RecoMeta {
  switch (reco) {
    case "move-a":
      return { label: "MOVE TO A-BOOK", tone: "danger", bucket: "needs-change" };
    case "unsure-move":
      return { label: "UNSURE · MOVE", tone: "warn", bucket: "needs-change" };
    case "unsure-keep":
      return { label: "UNSURE · KEEP", tone: "warn", bucket: "needs-change" };
    case "keep":
    default:
      return { label: "KEEP B-BOOK", tone: "safe", bucket: "keep" };
  }
}

export function lunaMeta(row: DossierRow) {
  // Derived Luna read-out from the row's rating + recommendation.
  if (row.rating >= 8) return { label: "Keep B-Book", tone: "safe" as const };
  if (row.rating <= 4) return { label: "Luna unsure", tone: "warn" as const };
  return { label: "Keep B-Book", tone: "neutral" as const };
}

export function entityOf(row: DossierRow) {
  return row.broker ?? "Surya";
}

// Pseudo yesterday P&L derived from volume for display purposes.
export function yesterdayPnl(row: DossierRow) {
  return row.volume;
}
