"use client";

import { motion } from "framer-motion";
import { CloudFog, EyeOff, ScanSearch, Sparkles, Image as ImageIcon, ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";

const flow = [
  { icon: CloudFog, label: "Infrared Image", tone: "text-ink-dim", detail: "Single-band thermal capture" },
  { icon: EyeOff, label: "Poor Visibility", tone: "text-amber", detail: "Low contrast, ambiguous edges" },
  { icon: ScanSearch, label: "Object Confusion", tone: "text-amber", detail: "Analysts misread terrain & assets" },
  { icon: Sparkles, label: "IRIS AI", tone: "text-cyan", detail: "Enhancement + semantic guidance" },
  { icon: ImageIcon, label: "Enhanced RGB", tone: "text-green", detail: "Analyst-ready, detection-validated" },
];

export function ProblemStatement() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      <SectionHeading
        eyebrow="The Problem"
        title="Raw infrared is data. It isn't yet intelligence."
        description="Single-band IR tiles are information-dense but perceptually ambiguous — two very different objects can read as the same shade of grey. That ambiguity costs analysts time, and sometimes accuracy."
      />

      <div className="mt-16 flex flex-col items-stretch gap-3 lg:flex-row lg:items-center">
        {flow.map((step, i) => (
          <motion.div
            key={step.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-1 items-center gap-3"
          >
            <GlassCard
              glow={step.label === "IRIS AI" ? "cyan" : "none"}
              className="flex w-full flex-col items-start gap-3 lg:items-center lg:text-center"
            >
              <step.icon className={step.tone} size={26} />
              <div>
                <p className="font-medium text-ink text-sm">{step.label}</p>
                <p className="mt-1 text-xs text-ink-faint leading-relaxed">{step.detail}</p>
              </div>
            </GlassCard>
            {i < flow.length - 1 && (
              <ArrowRight
                className="hidden shrink-0 text-ink-faint lg:block"
                size={18}
              />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
