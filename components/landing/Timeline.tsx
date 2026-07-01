"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { timeline } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const statusStyle = {
  done: { dot: "bg-green", text: "text-green", label: "Shipped" },
  active: { dot: "bg-cyan animate-pulse", text: "text-cyan", label: "In progress" },
  upcoming: { dot: "bg-ink-faint", text: "text-ink-faint", label: "Planned" },
};

export function Timeline() {
  return (
    <section className="relative mx-auto max-w-5xl px-6 py-28">
      <SectionHeading eyebrow="Roadmap" title="Where the build stands today" />

      <div className="mt-14 flex flex-col">
        {timeline.map((item, i) => {
          const s = statusStyle[item.status];
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative flex gap-6 pb-10 last:pb-0"
            >
              <div className="flex flex-col items-center">
                <span className={cn("h-3 w-3 rounded-full", s.dot)} />
                {i < timeline.length - 1 && (
                  <span className="mt-2 w-px flex-1 bg-hairline" />
                )}
              </div>
              <div className="-mt-1">
                <div className="flex items-center gap-3">
                  <span className="label-eyebrow">{item.phase}</span>
                  <span className={cn("font-mono text-[10px] uppercase tracking-wide", s.text)}>
                    {s.label}
                  </span>
                </div>
                <h3 className="mt-2 font-display text-lg text-ink">{item.title}</h3>
                <p className="mt-1 max-w-xl text-sm text-ink/65">{item.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
