"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { detectionClasses } from "@/lib/mockData";
import { seededRandom, cn } from "@/lib/utils";

const GRID = 14;

export function Segmentation() {
  const [hovered, setHovered] = useState<string | null>(null);

  const cells = useMemo(() => {
    const rand = seededRandom(11);
    return Array.from({ length: GRID * GRID }).map((_, i) => {
      const weights = [0.18, 0.27, 0.18, 0.07, 0.24, 0.06];
      let r = rand();
      let idx = 0;
      for (let w = 0; w < weights.length; w++) {
        if (r < weights[w]) { idx = w; break; }
        r -= weights[w];
        idx = w;
      }
      return { id: i, classId: detectionClasses[idx].id };
    });
  }, []);

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      <SectionHeading
        eyebrow="Semantic Segmentation"
        title="Six land-cover classes, pixel-accurate"
        description="SegFormer assigns every pixel to a class before colorization even starts — that's what keeps the diffusion model from inventing terrain that isn't there."
      />

      <div className="mt-14 grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.7fr]">
        <div className="grid aspect-square w-full grid-cols-[repeat(14,1fr)] gap-[2px] overflow-hidden rounded-2xl border border-hairline p-2">
          {cells.map((cell) => {
            const cls = detectionClasses.find((c) => c.id === cell.classId)!;
            const dim = hovered && hovered !== cell.classId;
            return (
              <motion.div
                key={cell.id}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (cell.id % GRID) * 0.012 }}
                style={{ backgroundColor: cls.color }}
                className="aspect-square rounded-[2px] transition-opacity duration-300"
                animate={{ opacity: dim ? 0.12 : 0.85 }}
              />
            );
          })}
        </div>

        <div className="flex flex-col justify-center gap-3">
          {detectionClasses.map((cls) => (
            <button
              key={cls.id}
              onMouseEnter={() => setHovered(cls.id)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all",
                hovered === cls.id
                  ? "border-cyan/50 bg-cyan/5"
                  : "border-hairline bg-white/[0.02]"
              )}
            >
              <span className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: cls.color, boxShadow: `0 0 12px ${cls.color}66` }}
                />
                <span className="text-sm font-medium text-ink">{cls.label}</span>
              </span>
              <span className="font-mono text-xs text-ink-faint">{cls.count}.2% coverage</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
