"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cx } from "@/lib/format";

type NavItem = {
  label: string;
  href: string;
  icon: IconName;
  children?: { label: string; href: string }[];
};

const NAV: { section?: string; items: NavItem[] }[] = [
  {
    items: [{ label: "Home", href: "/home", icon: "home" }],
  },
  {
    section: "Assessment",
    items: [
      {
        label: "Assessment",
        href: "/",
        icon: "grid",
        children: [
          { label: "Workbench", href: "/" },
          { label: "History", href: "/history" },
          { label: "Report", href: "/report" },
          { label: "Settings", href: "/settings" },
        ],
      },
    ],
  },
  {
    items: [
      { label: "User Management", href: "/users", icon: "users" },
      { label: "AI Engine · Luna v4.2", href: "/luna", icon: "cpu" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-line bg-surface">
      {/* Brand */}
      <div className="flex items-center gap-2.5 border-b border-line px-4 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-brand-600 text-white shadow-sm">
          <Icon name="shield" width={20} height={20} />
        </div>
        <div className="leading-tight">
          <div className="text-sm font-extrabold tracking-tight text-ink">
            Apex Risk Terminal
          </div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            STP Routing Engine
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="terminal-scroll flex-1 overflow-y-auto px-3 py-4">
        {NAV.map((group, gi) => (
          <div key={gi} className="mb-5">
            {group.section && (
              <div className="px-2 pb-2 font-mono text-[10px] uppercase tracking-wider text-ink-faint">
                {group.section}
              </div>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cx(
                        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-semibold transition-colors",
                        active
                          ? "bg-brand-50 text-brand-700"
                          : "text-ink-soft hover:bg-surface-muted"
                      )}
                    >
                      <Icon name={item.icon} width={18} height={18} />
                      <span className="truncate">{item.label}</span>
                    </Link>
                    {item.children && (
                      <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-line pl-3">
                        {item.children.map((child) => {
                          const cActive =
                            child.href === "/"
                              ? pathname === "/"
                              : pathname.startsWith(child.href);
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={cx(
                                  "block rounded px-2 py-1.5 text-[13px] font-medium transition-colors",
                                  cActive
                                    ? "text-brand-700"
                                    : "text-ink-muted hover:text-ink"
                                )}
                              >
                                {child.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Server status */}
      <div className="border-t border-line px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
            MT4IN3
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-600 pulse-dot" />
            ONLINE
          </span>
        </div>
      </div>
    </aside>
  );
}
