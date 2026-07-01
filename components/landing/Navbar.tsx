"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Satellite, Command } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

const links = [
  { label: "Pipeline", href: "#pipeline" },
  { label: "Models", href: "#models" },
  { label: "Metrics", href: "#metrics" },
  { label: "Stack", href: "#stack" },
  { label: "Team", href: "#team" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { setCommandPaletteOpen } = useAppStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled ? "py-3" : "py-5"
      )}
    >
      <div
        className={cn(
          "mx-auto flex w-[min(92%,72rem)] items-center justify-between rounded-2xl px-5 py-3 transition-all duration-300",
          scrolled && "glass shadow-panel"
        )}
      >
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
            <Satellite size={16} />
          </span>
          <span className="font-display text-sm font-medium tracking-wide text-ink">
            IRIS<span className="text-cyan"> AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-ink-dim transition-colors hover:text-cyan"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-hairline px-3 py-1.5 text-xs text-ink-faint hover:border-cyan/40 hover:text-cyan sm:flex"
          >
            <Command size={12} /> K
          </button>
          <Link href="/platform">
            <GlowButton className="px-4 py-2 text-xs">Launch Platform</GlowButton>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
