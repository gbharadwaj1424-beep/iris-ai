"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ScanLine,
  Database,
  LineChart,
  Gauge,
  Rocket,
  Settings,
  Satellite,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/platform", icon: LayoutDashboard },
  { label: "Inference", href: "/platform/inference", icon: ScanLine },
  { label: "Datasets", href: "/platform/datasets", icon: Database },
  { label: "Training", href: "/platform/training", icon: LineChart },
  { label: "Metrics", href: "/platform/metrics", icon: Gauge },
  { label: "Deployment", href: "/platform/deployment", icon: Rocket },
  { label: "Settings", href: "/platform/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();

  return (
    <aside
      className={cn(
        "sticky top-0 flex h-svh shrink-0 flex-col border-r border-hairline bg-panel/60 backdrop-blur-xl transition-all duration-300",
        sidebarCollapsed ? "w-[4.5rem]" : "w-60"
      )}
    >
      <div className="flex items-center gap-2 px-4 py-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
          <Satellite size={16} />
        </span>
        {!sidebarCollapsed && (
          <span className="font-display text-sm font-medium text-ink">
            IRIS<span className="text-cyan"> AI</span>
          </span>
        )}
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {nav.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                active
                  ? "bg-cyan/10 text-cyan"
                  : "text-ink-dim hover:bg-white/[0.04] hover:text-ink"
              )}
            >
              <item.icon size={17} className="shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-1 border-t border-hairline px-3 py-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-faint hover:bg-white/[0.04] hover:text-ink"
        >
          <ArrowLeft size={17} className="shrink-0" />
          {!sidebarCollapsed && <span>Back to site</span>}
        </Link>
        <button
          onClick={toggleSidebar}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-faint hover:bg-white/[0.04] hover:text-ink"
        >
          {sidebarCollapsed ? <PanelLeftOpen size={17} /> : <PanelLeftClose size={17} />}
          {!sidebarCollapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
