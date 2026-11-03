import { Icon, type IconName } from "@/components/ui/Icon";

export function Placeholder({
  title,
  description,
  icon = "layers",
}: {
  title: string;
  description: string;
  icon?: IconName;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center rounded-md border border-dashed border-line-strong bg-surface text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-md bg-surface-muted text-ink-muted">
        <Icon name={icon} width={24} height={24} />
      </div>
      <h1 className="text-lg font-bold text-ink">{title}</h1>
      <p className="mt-1 max-w-md text-sm text-ink-muted">{description}</p>
      <span className="mt-4 rounded-md border border-line bg-surface-subtle px-2.5 py-1 font-mono text-[11px] uppercase tracking-wider text-ink-muted">
        Phase 2 · In Progress
      </span>
    </div>
  );
}
