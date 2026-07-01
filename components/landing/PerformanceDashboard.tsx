"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { generateTrainingCurve } from "@/lib/mockData";

const stats = [
  { label: "SSIM", value: 98.7, decimals: 1, suffix: "%" },
  { label: "PSNR", value: 37.5, decimals: 1, suffix: " dB" },
  { label: "FID", value: 14.2, decimals: 1, suffix: "" },
  { label: "LPIPS", value: 0.087, decimals: 3, suffix: "" },
  { label: "Inference", value: 312, decimals: 0, suffix: "ms" },
  { label: "GPU Usage", value: 78, decimals: 0, suffix: "%" },
  { label: "Memory", value: 6.4, decimals: 1, suffix: "GB" },
  { label: "FPS", value: 31, decimals: 0, suffix: "" },
];

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-strong rounded-lg px-3 py-2 text-xs">
      <p className="font-mono text-ink-faint">Epoch {label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

export function PerformanceDashboard() {
  const data = useMemo(() => generateTrainingCurve(40), []);
  const gpuData = useMemo(
    () => data.filter((_, i) => i % 4 === 0).map((d) => ({ epoch: d.epoch, gpu: d.gpu })),
    [data]
  );

  return (
    <section id="metrics" className="relative mx-auto max-w-7xl px-6 py-28">
      <SectionHeading
        eyebrow="Performance Dashboard"
        title="Benchmarked, not estimated"
        description="Every figure below comes from the held-out validation split, tracked across training and refreshed at inference time."
      />

      <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <GlassCard key={s.label} className="p-5">
            <p className="font-mono text-2xl font-medium text-ink">
              <AnimatedCounter value={s.value} decimals={s.decimals} suffix={s.suffix} />
            </p>
            <p className="mt-1 text-xs uppercase tracking-wide text-ink-faint">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]">
        <GlassCard>
          <span className="label-eyebrow">SSIM / PSNR over training</span>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: -20 }}>
                <CartesianGrid stroke="rgba(167,192,230,0.08)" vertical={false} />
                <XAxis dataKey="epoch" stroke="#5A6C8C" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#5A6C8C" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Line type="monotone" dataKey="ssim" name="SSIM" stroke="#2EE6FF" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="psnr" name="PSNR" stroke="#34F5A8" strokeWidth={2} dot={false} yAxisId={0} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <span className="label-eyebrow">GPU utilization</span>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gpuData} margin={{ left: -20 }}>
                <CartesianGrid stroke="rgba(167,192,230,0.08)" vertical={false} />
                <XAxis dataKey="epoch" stroke="#5A6C8C" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#5A6C8C" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="gpu" name="GPU %" fill="#7C5CFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
