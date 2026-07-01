"use client";

import { Database, MapPin, Layers3 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";

const datasets = [
  { name: "Landsat-8 TIRS · North India", tiles: "12,480", res: "30m GSD", region: "28.6°N, 77.2°E", coverage: "94%" },
  { name: "Resourcesat-2 LISS-IV · Western Ghats", tiles: "8,210", res: "5.8m GSD", region: "10.8°N, 76.3°E", coverage: "87%" },
  { name: "Sentinel-2 MSI · Indo-Gangetic Plain", tiles: "21,940", res: "10m GSD", region: "26.4°N, 80.9°E", coverage: "99%" },
  { name: "Cartosat-3 · Coastal Gujarat", tiles: "4,012", res: "0.25m GSD", region: "22.3°N, 70.0°E", coverage: "76%" },
  { name: "Landsat-8 TIRS · Thar Desert", tiles: "6,830", res: "30m GSD", region: "27.0°N, 71.2°E", coverage: "91%" },
  { name: "Resourcesat-2 AWiFS · Himalayan Belt", tiles: "9,975", res: "56m GSD", region: "32.2°N, 77.5°E", coverage: "83%" },
];

export default function DatasetsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard className="flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan/10 text-cyan"><Database size={18} /></span>
          <div>
            <p className="font-mono text-xl text-ink">63,447</p>
            <p className="text-xs text-ink-faint">Total tiles indexed</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-green/10 text-green"><Layers3 size={18} /></span>
          <div>
            <p className="font-mono text-xl text-ink">6</p>
            <p className="text-xs text-ink-faint">Active sensor sources</p>
          </div>
        </GlassCard>
        <GlassCard className="flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet/10 text-violet"><MapPin size={18} /></span>
          <div>
            <p className="font-mono text-xl text-ink">5</p>
            <p className="text-xs text-ink-faint">Geographic regions</p>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {datasets.map((d) => (
          <GlassCard key={d.name} glow="cyan" className="flex flex-col gap-4">
            <div>
              <h3 className="font-display text-base text-ink">{d.name}</h3>
              <p className="mt-1 font-mono text-[11px] text-ink-faint">{d.region}</p>
            </div>
            <div className="flex items-center justify-between border-t border-hairline pt-3 text-xs">
              <span className="text-ink-faint">{d.tiles} tiles</span>
              <span className="text-ink-faint">{d.res}</span>
            </div>
            <div>
              <div className="flex items-center justify-between text-[10px] text-ink-faint">
                <span>Label coverage</span>
                <span>{d.coverage}</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <div className="h-full rounded-full bg-cyan" style={{ width: d.coverage }} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
