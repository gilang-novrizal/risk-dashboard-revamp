export type Recommendation =
  | "keep"
  | "unsure-keep"
  | "unsure-move"
  | "move-a";

export interface DossierRow {
  id: string;
  name: string;
  volume: number;
  book: string;
  score: number;
  rating: number;
  isActive: boolean;
  recommendation: Recommendation;
  flags: string[];
  days: number;
  broker?: string;
}

export type SignalStatus = "danger" | "safe" | "na" | "open";

export type WorksheetCategory =
  | "MAHI"
  | "QUICK"
  | "TOXIC"
  | "PROFILE"
  | "PRO"
  | "EXTRA";

export interface WorksheetItem {
  id: string;
  category: WorksheetCategory;
  label: string;
  value: string;
  status: SignalStatus;
  weight?: string;
  note?: string;
  decisive?: boolean;
}

export interface Kpi {
  label: string;
  value: number;
}

export interface Signal {
  key: string;
  label: string;
  value: number;
  detail: string;
  threshold: number;
}

export interface SymbolRow {
  symbol: string;
  group: string;
  share: number;
  volume: number;
  pnl: number;
  pnlPerVolume: number;
}

export interface StatementRow {
  date: string;
  prevBalance: number;
  deposit: number;
  closedPnl: number;
  balance: number;
  floating: number;
  equity: number;
}

export interface HistoryRow {
  updatedAt: string;
  status: string;
  stp: string;
  events: string[];
  actionBy: string;
  approvedBy: string;
}

export interface CommentRow {
  author: string;
  at: string;
  body: string;
}

export interface MahiPoint {
  label: string;
  value: number;
}

export interface DossierDetail {
  id: string;
  date: string;
  name: string;
  status: string;
  stp: string;
  registeredAt: string;
  account: { login: string; server: string; registeredAt: string };
  kpis: Kpi[];
  recommendation: {
    verdict: string;
    label: string;
    strength: string;
    stage1: number;
    cumulative: number;
    threshold: number;
    margin: number;
    summary: string;
    reasons: string[];
    counts: { danger: number; safe: number; unavailable: number };
  };
  methods: {
    sop: { label: string; detail: string };
    ml: { label: string; detail: string };
    luna: {
      label: string;
      detail: string;
      confidence: number;
      leaning: string;
    };
  };
  signals: Signal[];
  sop_worksheet: WorksheetItem[];
  luna: {
    opinion: string;
    score: number;
    confidence: number;
    distribution: { label: string; pct: number }[];
    assessment: { label: string; answer: string; pct: number }[];
  };
  tradeProfile: {
    summary: string;
    symbols: SymbolRow[];
    open: { positions: number; lots: number; floating: number; oldest: string };
    mahi: { period: string; v30: string; v120: string }[];
    statement: {
      endingEquity: number;
      maxDrawdown: string;
      closedPnl: number;
      netDeposits: number;
      worstDay: number;
      rows: StatementRow[];
    };
  };
  mahiSeries: MahiPoint[];
  history: HistoryRow[];
  comments: CommentRow[];
}
