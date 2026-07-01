"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  LayoutDashboard,
  ScanLine,
  Database,
  LineChart,
  Gauge,
  Rocket,
  Settings,
  Home,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

interface Command {
  id: string;
  label: string;
  group: string;
  icon: React.ReactNode;
  href: string;
  keywords?: string;
}

const commands: Command[] = [
  { id: "home", label: "Landing page", group: "Navigate", icon: <Home size={16} />, href: "/" },
  { id: "overview", label: "Dashboard overview", group: "Navigate", icon: <LayoutDashboard size={16} />, href: "/platform" },
  { id: "inference", label: "Run inference", group: "Navigate", icon: <ScanLine size={16} />, href: "/platform/inference", keywords: "upload run ai" },
  { id: "datasets", label: "Datasets", group: "Navigate", icon: <Database size={16} />, href: "/platform/datasets" },
  { id: "training", label: "Training curves", group: "Navigate", icon: <LineChart size={16} />, href: "/platform/training" },
  { id: "metrics", label: "Performance metrics", group: "Navigate", icon: <Gauge size={16} />, href: "/platform/metrics" },
  { id: "deployment", label: "Deployment", group: "Navigate", icon: <Rocket size={16} />, href: "/platform/deployment" },
  { id: "settings", label: "Settings", group: "Navigate", icon: <Settings size={16} />, href: "/platform/settings" },
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "Escape") setCommandPaletteOpen(false);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const filtered = useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.keywords?.toLowerCase().includes(q)
    );
  }, [query]);

  function go(href: string) {
    setCommandPaletteOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-start justify-center bg-void/70 backdrop-blur-sm pt-[14vh]"
          onClick={() => setCommandPaletteOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="w-[90vw] max-w-lg glass-strong rounded-2xl shadow-glow overflow-hidden"
          >
            <div className="flex items-center gap-3 border-b border-hairline px-4 py-3">
              <Search size={16} className="text-ink-dim shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Jump to a page or run a command…"
                className="w-full bg-transparent text-sm text-ink placeholder:text-ink-faint outline-none"
              />
              <kbd className="font-mono text-[10px] text-ink-faint border border-hairline rounded px-1.5 py-0.5">
                ESC
              </kbd>
            </div>
            <div className="max-h-[50vh] overflow-y-auto p-2">
              {filtered.length === 0 && (
                <p className="px-3 py-6 text-center text-sm text-ink-faint">
                  No matches for &ldquo;{query}&rdquo;
                </p>
              )}
              {filtered.map((c) => (
                <button
                  key={c.id}
                  onClick={() => go(c.href)}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-ink/90 hover:bg-cyan/10 hover:text-cyan transition-colors"
                >
                  <span className="text-ink-dim">{c.icon}</span>
                  {c.label}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
