"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { team } from "@/lib/mockData";

export function Team() {
  return (
    <section id="team" className="relative mx-auto max-w-7xl px-6 py-28">
      <SectionHeading eyebrow="The Team" title="Built by a four-person crew, end to end" align="center" />

      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {team.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          >
            <GlassCard glow="cyan" className="flex flex-col items-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan/20 to-violet/20 font-display text-lg text-ink">
                {member.initials}
              </div>
              <h3 className="mt-4 font-medium text-ink">{member.name}</h3>
              <p className="mt-1 font-mono text-[11px] text-cyan">{member.role}</p>
              <p className="mt-2 text-xs text-ink-faint">{member.focus}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
