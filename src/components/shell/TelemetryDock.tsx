import { dossierDetail } from "@/data/detail";

export function TelemetryDock() {
  const { account, name } = dossierDetail;
  return (
    <footer className="sticky bottom-0 z-20 border-t border-line bg-surface/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-workspace flex-wrap items-center gap-x-6 gap-y-1 px-6 py-2 font-mono text-[11px] text-ink-muted">
        <DockItem label="ACCOUNT" value={account.login} />
        <DockItem label="SERVER" value={account.server} />
        <DockItem label="REGISTERED" value={`${account.registeredAt}:16`} />
        <div className="ml-auto flex items-center gap-2 truncate">
          <span className="uppercase tracking-wider text-ink-faint">CHECKSUM</span>
          <span className="truncate text-ink-soft">
            Account {account.server} {account.login} (Surya + {name})
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
        </div>
      </div>
    </footer>
  );
}

function DockItem({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="uppercase tracking-wider text-ink-faint">{label}</span>
      <span className="text-ink-soft">{value}</span>
    </span>
  );
}
