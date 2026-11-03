import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TelemetryDock } from "./TelemetryDock";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar />
      <div className="flex min-h-screen flex-col pl-64">
        <main className="flex-1">
          <div className="mx-auto max-w-workspace px-6 py-5">{children}</div>
        </main>
        <TelemetryDock />
      </div>
    </div>
  );
}
