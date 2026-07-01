"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { modelCards } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function Models() {
  const [open, setOpen] = useState<string | null>(modelCards[0].id);

  return (
    <section id="models" className="relative mx-auto max-w-7xl px-6 py-28">
      <SectionHeading
        eyebrow="The Model Stack"
        title="Four specialized models, one coherent pipeline"
        description="Each model is purpose-built and independently benchmarked — no single monolithic network is trying to do everything at once."
      />

      <div className="mt-12 grid grid-cols-1 gap-4">
        {modelCards.map((m) => {
          const isOpen = open === m.id;
          return (
            <GlassCard key={m.id} frame={false} className="overflow-hidden p-0">
              <button
                onClick={() => setOpen(isOpen ? null : m.id)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs text-cyan">{m.role}</span>
                  <h3 className="font-display text-lg text-ink">{m.name}</h3>
                </div>
                <div className="flex items-center gap-6">
                  <span className="hidden font-mono text-xs text-ink-faint sm:block">{m.accuracy}</span>
                  <ChevronDown
                    size={16}
                    className={cn("text-ink-faint transition-transform", isOpen && "rotate-180 text-cyan")}
                  />
                </div>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden border-t border-hairline"
                  >
                    <div className="grid grid-cols-1 gap-6 px-6 py-6 sm:grid-cols-[1fr_auto]">
                      <p className="text-sm leading-relaxed text-ink/70">{m.description}</p>
                      <div className="flex gap-6 font-mono text-xs">
                        <div>
                          <p className="text-ink-faint">Params</p>
                          <p className="mt-1 text-ink">{m.params}</p>
                        </div>
                        <div>
                          <p className="text-ink-faint">Latency</p>
                          <p className="mt-1 text-ink">{m.latency}</p>
                        </div>
                        <div>
                          <p className="text-ink-faint">Score</p>
                          <p className="mt-1 text-green">{m.accuracy}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 px-6 pb-6">
                      {m.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-hairline px-3 py-1 font-mono text-[10px] text-ink-faint"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}
