"use client";

import { ReactNode } from "react";
import { GlassCard } from "@/components/ui/GlassCard";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, action, children, className }: ChartCardProps) {
  return (
    <GlassCard className={className}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <span className="label-eyebrow">{title}</span>
          {subtitle && <p className="mt-1 text-xs text-ink-faint">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="mt-4">{children}</div>
    </GlassCard>
  );
}
