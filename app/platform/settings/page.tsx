"use client";

import { useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { cn } from "@/lib/utils";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-6 w-11 rounded-full transition-colors",
        checked ? "bg-cyan" : "bg-white/10"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [apiKey] = useState("iris_sk_live_4a8f...c91b");
  const [copied, setCopied] = useState(false);
  const [prefs, setPrefs] = useState({
    reducedMotion: false,
    autoRun: true,
    notifications: true,
    telemetry: false,
    exportGeoRef: true,
  });

  function copy() {
    navigator.clipboard.writeText("iris_sk_live_4a8fc2d8e5b7f3a1d9e0c91b").then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const pref = (key: keyof typeof prefs) => ({
    checked: prefs[key],
    onChange: (v: boolean) => setPrefs((p) => ({ ...p, [key]: v })),
  });

  return (
    <div className="max-w-2xl space-y-6">
      {/* API credentials */}
      <GlassCard>
        <span className="label-eyebrow">API Credentials</span>
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 rounded-lg border border-hairline bg-black/30 px-3 py-2.5 font-mono text-sm text-ink-faint">
            {apiKey}
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 rounded-lg border border-hairline px-3 py-2.5 text-sm text-ink-dim hover:border-cyan/40 hover:text-cyan"
          >
            {copied ? <Check size={14} className="text-green" /> : <Copy size={14} />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            className="flex items-center gap-1.5 rounded-lg border border-hairline px-3 py-2.5 text-sm text-ink-dim hover:border-cyan/40 hover:text-cyan"
            aria-label="Regenerate API key"
          >
            <RefreshCw size={14} />
          </button>
        </div>
        <p className="mt-3 text-xs text-ink-faint">
          Keep this secret. Rotate immediately if compromised.
        </p>
      </GlassCard>

      {/* Preferences */}
      <GlassCard>
        <span className="label-eyebrow">Preferences</span>
        <div className="mt-4 space-y-4">
          {[
            { key: "reducedMotion", label: "Reduce motion", desc: "Disables non-essential animations (WCAG 2.3)" },
            { key: "autoRun", label: "Auto-run on upload", desc: "Starts the pipeline as soon as a file is detected" },
            { key: "notifications", label: "Job notifications", desc: "In-app toasts when inference jobs complete" },
            { key: "telemetry", label: "Usage telemetry", desc: "Anonymous performance data to improve the model" },
            { key: "exportGeoRef", label: "Georeferenced exports", desc: "Embed CRS metadata in GeoTIFF outputs" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-ink">{label}</p>
                <p className="mt-0.5 text-xs text-ink-faint">{desc}</p>
              </div>
              <Toggle {...pref(key as keyof typeof prefs)} />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Inference config */}
      <GlassCard>
        <span className="label-eyebrow">Inference Configuration</span>
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-xs text-ink-faint">Default upscale factor</label>
            <select className="mt-1 w-full rounded-lg border border-hairline bg-black/30 px-3 py-2.5 text-sm text-ink outline-none focus:border-cyan/50">
              <option value="2">×2</option>
              <option value="4" selected>×4</option>
              <option value="8">×8</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-ink-faint">Diffusion steps</label>
            <select className="mt-1 w-full rounded-lg border border-hairline bg-black/30 px-3 py-2.5 text-sm text-ink outline-none focus:border-cyan/50">
              <option value="20">20 (fast)</option>
              <option value="50" selected>50 (balanced)</option>
              <option value="100">100 (quality)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-ink-faint">Detection confidence threshold</label>
            <input type="range" min={30} max={95} defaultValue={50} className="mt-2 w-full accent-cyan" />
          </div>
        </div>
      </GlassCard>

      <div className="flex gap-3">
        <GlowButton className="px-6 py-2.5 text-sm">Save changes</GlowButton>
        <button className="rounded-full border border-hairline px-5 py-2.5 text-sm text-ink-dim hover:border-cyan/40 hover:text-cyan">
          Reset to defaults
        </button>
      </div>
    </div>
  );
}
