"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { techStack } from "@/lib/mockData";

export function TechStack() {
  const loop = [...techStack, ...techStack];

  return (
    <section id="stack" className="relative mx-auto max-w-7xl px-6 py-28">
      <SectionHeading
        eyebrow="Technology"
        title="Built on tools that scale to orbit"
        align="center"
      />

      <div className="relative mt-12 overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />
        <div className="flex w-max animate-marquee gap-4">
          {loop.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="flex items-center rounded-full border border-hairline bg-white/[0.02] px-5 py-2.5 font-mono text-sm text-ink/80"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
