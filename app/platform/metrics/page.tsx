"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { generateTrainingCurve } from "@/lib/mockData";

const benchmarks = [
  { metric: "SSIM", value: 98.7, decimals: 1, suffix: "%" },
  { metric: "PSNR", value: 37.5, decimals: 1, suffix: " dB" },
  { metric: "FID", value: 14.2, decimals: 1, suffix: "" },
  { metric: "LPIPS", value: 0.087, decimals: 3, suffix: "" },
  { metric: "mAP", value: 94.3, decimals: 1, suffix: "%" },
  { metric: "mIoU", value: 91.4, decimals: 1, suffix: "%" },
];

const radarData = [
  { axis: "SSIM", val: 98.7 },
  { axis: "PSNR", val: 75 },
  { axis: "FID", val: 86 },
  { axis: "mAP", val: 94.3 },
  { axis: "mIoU", val: 91.4 },
  { axis: "LPIPS", val: 91.3 },
];

const compareData = [
  { model: "IRIS AI", ssim: 98.7, psnr: 37.5, map: 94.3 },
  { model: "pix2pix", ssim: 88.2, psnr: 29.1, map: 71.4 },
  { model: "CycleGAN", ssim: 84.6, psnr: 27.8, map: 68.9 },
  { model: "Colorformer", ssim: 91.3, psnr: 31.4, map: 79.2 },
  { model: "DDColor", ssim: 93.8, psnr: 33.9, map: 85.6 },
];

export default function MetricsPage() {
  const data = useMemo(() => generateTrainingCurve(40), []);

  return (
    <div className="space-y-6">
      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {benchmarks.map((b) => (
          <GlassCard key={b.metric} className="p-4">
            <p className="font-mono text-xl font-medium text-ink">
              <AnimatedCounter value={b.value} decimals={b.decimals} suffix={b.suffix} />
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint">{b.metric}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1fr]">
        {/* Radar */}
        <ChartCard title="Multi-axis performance" subtitle="Normalised scores across all benchmark dimensions">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="rgba(167,192,230,0.1)" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "#8FA3C2", fontSize: 11 }} />
                <Radar
                  dataKey="val"
                  stroke="#2EE6FF"
                  strokeWidth={2}
                  fill="#2EE6FF"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Model comparison */}
        <ChartCard title="Comparison vs baselines" subtitle="SSIM (%) — higher is better">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData} margin={{ left: -20 }}>
                <CartesianGrid stroke="rgba(167,192,230,0.08)" vertical={false} />
                <XAxis dataKey="model" stroke="#5A6C8C" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#5A6C8C" fontSize={10} tickLine={false} axisLine={false} domain={[80, 100]} />
                <Tooltip
                  contentStyle={{ background: "#0A0E18", border: "1px solid rgba(167,192,230,0.15)", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="ssim" name="SSIM" radius={[4, 4, 0, 0]}>
                  {compareData.map((entry, i) => (
                    <Cell key={i} fill={entry.model === "IRIS AI" ? "#2EE6FF" : "#7C5CFF"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* PSNR over training */}
      <ChartCard title="PSNR over training epochs" subtitle="Peak signal-to-noise ratio · dB">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: -20 }}>
              <CartesianGrid stroke="rgba(167,192,230,0.08)" vertical={false} />
              <XAxis dataKey="epoch" stroke="#5A6C8C" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="#5A6C8C" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: "#0A0E18", border: "1px solid rgba(167,192,230,0.15)", borderRadius: 8, fontSize: 12 }}
              />
              <Line type="monotone" dataKey="psnr" name="PSNR (dB)" stroke="#34F5A8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </ChartCard>
    </div>
  );
}
