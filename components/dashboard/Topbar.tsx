"use client";

import { usePathname } from "next/navigation";
import { Search, Bell, Command } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const titles: Record<string, string> = {
  "/platform": "Dashboard Overview",
  "/platform/inference": "Inference",
  "/platform/datasets": "Datasets",
  "/platform/training": "Training",
  "/platform/metrics": "Metrics",
  "/platform/deployment": "Deployment",
  "/platform/settings": "Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const { setCommandPaletteOpen } = useAppStore();
  const title = titles[pathname] ?? "Platform";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-hairline bg-void/80 px-6 py-4 backdrop-blur-xl">
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-faint">
          IRIS AI / Platform
        </p>
        <h1 className="mt-1 font-display text-lg font-medium text-ink">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 rounded-lg border border-hairline px-3 py-2 text-xs text-ink-faint hover:border-cyan/40 hover:text-cyan"
        >
          <Search size={13} />
          <span className="hidden sm:inline">Search</span>
          <kbd className="ml-2 hidden items-center gap-0.5 font-mono text-[10px] sm:flex">
            <Command size={10} /> K
          </kbd>
        </button>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-hairline text-ink-faint hover:border-cyan/40 hover:text-cyan"
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-green" />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-hairline px-2 py-1.5">
          <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
          <span className="font-mono text-[10px] text-ink-faint">GPU · NOMINAL</span>
        </div>
      </div>
    </header>
  );
}
