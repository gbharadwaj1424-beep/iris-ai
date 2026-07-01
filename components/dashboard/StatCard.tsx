"use client";

import { ReactNode } from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number;
  decimals?: number;
  suffix?: string;
  delta?: number;
  icon?: ReactNode;
}

export function StatCard({ label, value, decimals = 1, suffix = "", delta, icon }: StatCardProps) {
  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wide text-ink-faint">{label}</span>
        {icon && <span className="text-cyan">{icon}</span>}
      </div>
      <p className="font-mono text-2xl font-medium text-ink">
        <AnimatedCounter value={value} decimals={decimals} suffix={suffix} />
      </p>
      {typeof delta === "number" && (
        <span
          className={cn(
            "flex w-fit items-center gap-1 rounded-full px-2 py-0.5 font-mono text-[10px]",
            delta >= 0 ? "bg-green/10 text-green" : "bg-amber/10 text-amber"
          )}
        >
          {delta >= 0 ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
          {Math.abs(delta)}% vs last run
        </span>
      )}
    </GlassCard>
  );
}
