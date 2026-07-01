"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <span className="label-eyebrow">{eyebrow}</span>
      <h2 className="mt-3 font-display text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-ink">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-ink-dim text-ink/70 leading-relaxed">
          {description}
        </p>
      )}
    </motion.div>
  );
}
