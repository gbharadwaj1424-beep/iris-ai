"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pipelineStages } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export function ArchitecturePipeline() {
  const [active, setActive] = useState(pipelineStages[0].id);
  const activeStage = pipelineStages.find((s) => s.id === active)!;

  return (
    <section id="pipeline" className="relative mx-auto max-w-7xl px-6 py-28">
      <SectionHeading
        eyebrow="System Architecture"
        title="A nine-stage pipeline, each model earning its place"
        description="Hover or tap a stage to see what it does and why it sits where it does in the chain."
      />

      <div className="mt-16 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr]">
        {/* Stage list */}
        <div className="flex flex-col">
          {pipelineStages.map((stage, i) => (
            <button
              key={stage.id}
              onMouseEnter={() => setActive(stage.id)}
              onFocus={() => setActive(stage.id)}
              onClick={() => setActive(stage.id)}
              className={cn(
                "group relative flex items-center gap-4 border-l py-4 pl-6 text-left transition-colors",
                active === stage.id
                  ? "border-cyan"
                  : "border-hairline hover:border-cyan/40"
              )}
            >
              <span
                className={cn(
                  "font-mono text-xs",
                  active === stage.id ? "text-cyan" : "text-ink-faint"
                )}
              >
                {stage.index}
              </span>
              <span
                className={cn(
                  "font-medium transition-colors",
                  active === stage.id ? "text-ink" : "text-ink/60"
                )}
              >
                {stage.title}
              </span>
              {active === stage.id && (
                <motion.span
                  layoutId="pipeline-dot"
                  className="absolute -left-[3px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-cyan shadow-glow"
                />
              )}
              {i < pipelineStages.length - 1 && (
                <ChevronDown
                  size={12}
                  className="absolute -bottom-1 left-2 text-ink-faint/0 lg:hidden"
                />
              )}
            </button>
          ))}
        </div>

        {/* Detail panel */}
        <motion.div
          key={activeStage.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="glass corner-frame relative flex min-h-[20rem] flex-col justify-between rounded-2xl p-8"
        >
          <div className="absolute right-6 top-6 h-2 w-2 animate-pulse rounded-full bg-cyan" />
          <div>
            <span className="label-eyebrow">Stage {activeStage.index}</span>
            <h3 className="mt-3 font-display text-2xl font-medium text-ink">
              {activeStage.title}
            </h3>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/70">
              {activeStage.description}
            </p>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-cyan/40 to-transparent" />
            <span className="font-mono text-xs text-cyan">{activeStage.metric}</span>
          </div>

          {/* mini progress strip across all stages */}
          <div className="mt-6 flex gap-1">
            {pipelineStages.map((s) => (
              <span
                key={s.id}
                className={cn(
                  "h-1 flex-1 rounded-full transition-colors",
                  s.id === activeStage.id ? "bg-cyan" : "bg-white/[0.06]"
                )}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
