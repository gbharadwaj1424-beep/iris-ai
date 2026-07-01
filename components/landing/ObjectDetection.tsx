"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Car, Building2, Route } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { toInfraredLook, colorize, enhance, generateDetections, DetectionBox } from "@/lib/imagePipeline";
import { seededRandom } from "@/lib/utils";

const SIZE = 360;

function buildBaseImageData(seed: number) {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  const rand = seededRandom(seed);
  const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  grad.addColorStop(0, "#26323a");
  grad.addColorStop(1, "#3d4a3f");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);
  for (let i = 0; i < 70; i++) {
    ctx.fillStyle = `rgba(${150 + rand() * 80},${150 + rand() * 80},${140 + rand() * 70},0.3)`;
    const w = 8 + rand() * 30;
    ctx.fillRect(rand() * SIZE, rand() * SIZE, w, w * (0.6 + rand() * 0.6));
  }
  return ctx.getImageData(0, 0, SIZE, SIZE);
}

function Panel({ mode, boxes, label }: { mode: "ir" | "rgb"; boxes: DetectionBox[]; label: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const base = buildBaseImageData(31);
    const frame = mode === "ir" ? toInfraredLook(base) : colorize(enhance(base));
    ctx.putImageData(frame, 0, 0);
  }, [mode]);

  return (
    <div>
      <p className="mb-2 font-mono text-[10px] uppercase tracking-wide text-ink-faint">{label}</p>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-black/40">
        <canvas ref={canvasRef} width={SIZE} height={SIZE} className="h-full w-full" />
        {mode === "rgb" &&
          boxes.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.85 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.35 }}
              className="absolute rounded-sm border"
              style={{
                left: (b.x / SIZE) * 100 + "%",
                top: (b.y / SIZE) * 100 + "%",
                width: (b.w / SIZE) * 100 + "%",
                height: (b.h / SIZE) * 100 + "%",
                borderColor: b.color,
                boxShadow: `0 0 8px ${b.color}55`,
              }}
            >
              <span
                className="absolute -top-5 left-0 whitespace-nowrap rounded-sm px-1 font-mono text-[9px]"
                style={{ backgroundColor: b.color, color: "#06080D" }}
              >
                {b.confidence}%
              </span>
            </motion.div>
          ))}
      </div>
    </div>
  );
}

export function ObjectDetection() {
  const [boxes, setBoxes] = useState<DetectionBox[]>([]);

  useEffect(() => {
    setBoxes(generateDetections(SIZE, SIZE, 31));
  }, []);

  const counts = {
    vehicle: boxes.filter((b) => b.label.includes("vehicle")).length || 14,
    structure: boxes.filter((b) => b.label.includes("structure")).length || 22,
    road: boxes.filter((b) => b.label.includes("road")).length || 6,
  };

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      <SectionHeading
        eyebrow="Detection Validation"
        title="The reconstruction has to agree with reality"
        description="YOLOv9 runs on both the source IR and the reconstructed RGB. If object counts drift between the two, the tile gets flagged for review instead of shipped."
      />

      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.8fr]">
        <GlassCard className="grid grid-cols-2 gap-6">
          <Panel mode="ir" boxes={[]} label="Source Infrared" />
          <Panel mode="rgb" boxes={boxes} label="Reconstructed RGB · Detections" />
        </GlassCard>

        <div className="flex flex-col gap-4">
          {[
            { icon: Car, label: "Vehicle clusters", value: counts.vehicle, color: "#2EE6FF" },
            { icon: Building2, label: "Structures", value: counts.structure, color: "#FFB454" },
            { icon: Route, label: "Road segments", value: counts.road, color: "#34F5A8" },
          ].map((item) => (
            <GlassCard key={item.label} className="flex items-center gap-4">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${item.color}1a`, color: item.color }}
              >
                <item.icon size={18} />
              </span>
              <div>
                <p className="font-mono text-xl text-ink">{item.value}</p>
                <p className="text-xs text-ink-faint">{item.label}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
