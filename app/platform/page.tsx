"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { Gauge, Cpu, Layers, Clock, ArrowRight, ScanLine } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { generateTrainingCurve } from "@/lib/mockData";

const recentJobs = [
  { id: "JOB-2291", tile: "resourcesat_tile_4471.tif", status: "complete", ssim: 98.4, time: "2m ago" },
  { id: "JOB-2290", tile: "landsat8_tirs_0093.tif", status: "complete", ssim: 97.9, time: "14m ago" },
  { id: "JOB-2289", tile: "resourcesat_tile_4470.tif", status: "complete", ssim: 98.8, time: "31m ago" },
  { id: "JOB-2288", tile: "landsat8_tirs_0092.tif", status: "review", ssim: 91.2, time: "52m ago" },
  { id: "JOB-2287", tile: "resourcesat_tile_4469.tif", status: "complete", ssim: 99.1, time: "1h ago" },
];

export default function DashboardOverview() {
  const data = useMemo(() => generateTrainingCurve(24), []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Avg. SSIM" value={98.7} suffix="%" delta={1.2} icon={<Gauge size={16} />} />
        <StatCard label="GPU Utilization" value={78} decimals={0} suffix="%" delta={-3.4} icon={<Cpu size={16} />} />
        <StatCard label="Tiles processed (24h)" value={1842} decimals={0} delta={6.8} icon={<Layers size={16} />} />
        <StatCard label="Avg. inference time" value={312} decimals={0} suffix="ms" delta={-5.1} icon={<Clock size={16} />} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <ChartCard title="Reconstruction quality" subtitle="SSIM trend across the last 24 training epochs">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ left: -20 }}>
                <defs>
                  <linearGradient id="ssimFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2EE6FF" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2EE6FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(167,192,230,0.08)" vertical={false} />
                <XAxis dataKey="epoch" stroke="#5A6C8C" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#5A6C8C" fontSize={10} tickLine={false} axisLine={false} domain={[0.6, 1]} />
                <Tooltip
                  contentStyle={{ background: "#0A0E18", border: "1px solid rgba(167,192,230,0.15)", borderRadius: 8, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="ssim" stroke="#2EE6FF" strokeWidth={2} fill="url(#ssimFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <GlassCard glow="cyan" className="flex flex-col justify-between">
          <div>
            <span className="label-eyebrow">Quick action</span>
            <h3 className="mt-2 font-display text-xl text-ink">Run a new inference job</h3>
            <p className="mt-2 text-sm text-ink-faint">
              Upload an infrared tile and watch it move through all nine pipeline stages in real time.
            </p>
          </div>
          <Link href="/platform/inference" className="mt-6">
            <GlowButton className="w-full justify-center" icon={<ScanLine size={15} />}>
              Open Inference
            </GlowButton>
          </Link>
        </GlassCard>
      </div>

      <GlassCard frame={false} className="p-0">
        <div className="flex items-center justify-between px-6 py-5">
          <span className="label-eyebrow">Recent jobs</span>
          <Link href="/platform/inference" className="flex items-center gap-1 text-xs text-cyan hover:underline">
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-y border-hairline text-xs uppercase tracking-wide text-ink-faint">
                <th className="px-6 py-3 font-normal">Job</th>
                <th className="px-6 py-3 font-normal">Tile</th>
                <th className="px-6 py-3 font-normal">Status</th>
                <th className="px-6 py-3 font-normal">SSIM</th>
                <th className="px-6 py-3 font-normal">Run</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map((job) => (
                <tr key={job.id} className="border-b border-hairline/60 last:border-0">
                  <td className="px-6 py-3 font-mono text-xs text-ink-faint">{job.id}</td>
                  <td className="px-6 py-3 text-ink/90">{job.tile}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 font-mono text-[10px] ${
                        job.status === "complete" ? "bg-green/10 text-green" : "bg-amber/10 text-amber"
                      }`}
                    >
                      {job.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-mono text-ink/80">{job.ssim}%</td>
                  <td className="px-6 py-3 text-ink-faint">{job.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
