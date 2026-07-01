"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { heatmap } from "@/lib/imagePipeline";
import { seededRandom } from "@/lib/utils";

const LAYERS = [6, 9, 9, 7, 4];

function NeuralNetworkViz() {
  const [activeLayer, setActiveLayer] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveLayer((l) => (l + 1) % LAYERS.length), 900);
    return () => clearInterval(id);
  }, []);

  const width = 360;
  const height = 280;
  const layerX = LAYERS.map((_, i) => 30 + (i * (width - 60)) / (LAYERS.length - 1));
  const nodePositions = LAYERS.map((count, li) =>
    Array.from({ length: count }).map((_, ni) => ({
      x: layerX[li],
      y: 20 + (ni * (height - 40)) / Math.max(1, count - 1),
    }))
  );

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full">
      {nodePositions.map((layer, li) =>
        li < nodePositions.length - 1
          ? layer.map((n, ni) =>
              nodePositions[li + 1].map((n2, ni2) => (
                <line
                  key={`${li}-${ni}-${ni2}`}
                  x1={n.x} y1={n.y} x2={n2.x} y2={n2.y}
                  stroke={li === activeLayer ? "rgba(46,230,255,0.45)" : "rgba(167,192,230,0.08)"}
                  strokeWidth={li === activeLayer ? 1 : 0.5}
                />
              ))
            )
          : null
      )}
      {nodePositions.map((layer, li) =>
        layer.map((n, ni) => (
          <circle
            key={`${li}-${ni}`}
            cx={n.x}
            cy={n.y}
            r={li === activeLayer ? 4.5 : 3}
            fill={li === activeLayer ? "#2EE6FF" : "#5A6C8C"}
            className="transition-all duration-500"
          >
            {li === activeLayer && (
              <animate attributeName="opacity" values="1;0.4;1" dur="0.9s" repeatCount="1" />
            )}
          </circle>
        ))
      )}
    </svg>
  );
}

function generateTileDataUrl(seed: number, size = 320) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const rand = seededRandom(seed);
  const grad = ctx.createLinearGradient(0, 0, size, size);
  grad.addColorStop(0, "#16313f");
  grad.addColorStop(1, "#2c4a3c");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 50; i++) {
    ctx.fillStyle = `rgba(${120 + rand() * 90},${130 + rand() * 90},${110 + rand() * 80},0.35)`;
    const w = 10 + rand() * 40;
    ctx.fillRect(rand() * size, rand() * size, w, w * 0.7);
  }
  return { canvas, ctx };
}

function GradCamSlider() {
  const [blend, setBlend] = useState(55);
  const baseRef = useRef<string>("");
  const heatRef = useRef<string>("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { canvas, ctx } = generateTileDataUrl(23);
    baseRef.current = canvas.toDataURL();
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const heat = heatmap(data);
    const heatCanvas = document.createElement("canvas");
    heatCanvas.width = canvas.width;
    heatCanvas.height = canvas.height;
    heatCanvas.getContext("2d")!.putImageData(heat, 0, 0);
    heatRef.current = heatCanvas.toDataURL();
    setReady(true);
  }, []);

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black/40">
        {ready && (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={baseRef.current} alt="Reconstructed tile" className="absolute inset-0 h-full w-full object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={heatRef.current}
              alt="Model confidence heatmap"
              style={{ opacity: blend / 100 }}
              className="absolute inset-0 h-full w-full object-cover mix-blend-screen transition-opacity"
            />
          </>
        )}
      </div>
      <div className="mt-4 flex items-center gap-3">
        <span className="font-mono text-[10px] text-ink-faint">RGB</span>
        <input
          type="range"
          min={0}
          max={100}
          value={blend}
          onChange={(e) => setBlend(Number(e.target.value))}
          className="flex-1 accent-cyan"
          aria-label="GradCAM blend"
        />
        <span className="font-mono text-[10px] text-cyan">GradCAM</span>
      </div>
    </div>
  );
}

export function Explainability() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      <SectionHeading
        eyebrow="Explainable AI"
        title="Every prediction comes with a reason"
        description="Attention maps, GradCAM overlays and per-pixel confidence scores ship with every inference run — so analysts can trust the output, not just accept it."
      />

      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <GlassCard glow="cyan">
          <span className="label-eyebrow">Feature Extraction</span>
          <h3 className="mt-2 font-display text-xl text-ink">Transformer attention, live</h3>
          <div className="mt-4 h-64">
            <NeuralNetworkViz />
          </div>
        </GlassCard>

        <GlassCard glow="cyan">
          <span className="label-eyebrow">GradCAM Overlay</span>
          <h3 className="mt-2 font-display text-xl text-ink">Drag to reveal model confidence</h3>
          <div className="mt-4">
            <GradCamSlider />
          </div>
        </GlassCard>
      </div>
    </section>
  );
}
