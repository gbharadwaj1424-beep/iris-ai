"use client";

import { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { Play, Pause } from "lucide-react";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { generateTrainingCurve } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const checkpoints = [
  { id: "ckpt-040", epoch: 40, ssim: 0.987, loss: 0.081, size: "3.4 GB", status: "best" },
  { id: "ckpt-035", epoch: 35, ssim: 0.981, loss: 0.094, size: "3.4 GB", status: "saved" },
  { id: "ckpt-030", epoch: 30, ssim: 0.974, loss: 0.112, size: "3.4 GB", status: "saved" },
  { id: "ckpt-025", epoch: 25, ssim: 0.961, loss: 0.143, size: "3.4 GB", status: "saved" },
  { id: "ckpt-020", epoch: 20, ssim: 0.942, loss: 0.198, size: "3.4 GB", status: "saved" },
];

export default function TrainingPage() {
  const data = useMemo(() => generateTrainingCurve(40), []);
  const [running, setRunning] = useState(true);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        {[
          { label: "Epoch", value: "40 / 60" },
          { label: "Optimizer", value: "AdamW" },
          { label: "Learning rate", value: data[data.length - 1].lr },
          { label: "Batch size", value: "16" },
        ].map((s) => (
          <GlassCard key={s.label}>
            <p className="text-xs uppercase tracking-wide text-ink-faint">{s.label}</p>
            <p className="mt-2 font-mono text-lg text-ink">{s.value}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard
          title="Training / validation loss"
          subtitle="Lower is better — tracked every epoch"
          action={
            <button
              onClick={() => setRunning((r) => !r)}
              className="flex items-center gap-1.5 rounded-full border border-hairline px-3 py-1 text-[11px] text-ink-faint hover:border-cyan/40 hover:text-cyan"
            >
              {running ? <Pause size={11} /> : <Play size={11} />} {running ? "Training" : "Paused"}
            </button>
          }
        >
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: -20 }}>
                <CartesianGrid stroke="rgba(167,192,230,0.08)" vertical={false} />
                <XAxis dataKey="epoch" stroke="#5A6C8C" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#5A6C8C" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#0A0E18", border: "1px solid rgba(167,192,230,0.15)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="loss" name="Train loss" stroke="#2EE6FF" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="valLoss" name="Val loss" stroke="#FFB454" strokeWidth={2} dot={false} strokeDasharray="4 3" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="GPU utilization" subtitle="Single A100 · mixed precision">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ left: -20 }}>
                <CartesianGrid stroke="rgba(167,192,230,0.08)" vertical={false} />
                <XAxis dataKey="epoch" stroke="#5A6C8C" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#5A6C8C" fontSize={10} tickLine={false} axisLine={false} domain={[0, 100]} />
                <Tooltip contentStyle={{ background: "#0A0E18", border: "1px solid rgba(167,192,230,0.15)", borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="gpu" name="GPU %" stroke="#34F5A8" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      <GlassCard frame={false} className="p-0">
        <div className="px-6 py-5">
          <span className="label-eyebrow">Checkpoint history</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-y border-hairline text-xs uppercase tracking-wide text-ink-faint">
                <th className="px-6 py-3 font-normal">Checkpoint</th>
                <th className="px-6 py-3 font-normal">Epoch</th>
                <th className="px-6 py-3 font-normal">SSIM</th>
                <th className="px-6 py-3 font-normal">Loss</th>
                <th className="px-6 py-3 font-normal">Size</th>
                <th className="px-6 py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody>
              {checkpoints.map((c) => (
                <tr key={c.id} className="border-b border-hairline/60 last:border-0">
                  <td className="px-6 py-3 font-mono text-xs text-ink-faint">{c.id}</td>
                  <td className="px-6 py-3 text-ink/90">{c.epoch}</td>
                  <td className="px-6 py-3 font-mono text-ink/80">{c.ssim}</td>
                  <td className="px-6 py-3 font-mono text-ink/80">{c.loss}</td>
                  <td className="px-6 py-3 text-ink-faint">{c.size}</td>
                  <td className="px-6 py-3">
                    <span className={cn(
                      "rounded-full px-2 py-0.5 font-mono text-[10px]",
                      c.status === "best" ? "bg-cyan/10 text-cyan" : "bg-white/5 text-ink-faint"
                    )}>
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
