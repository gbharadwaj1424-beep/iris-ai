"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud, Play, RotateCcw, ImagePlus } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { useImagePipeline } from "@/hooks/useImagePipeline";
import { STAGE_META } from "@/lib/imagePipeline";
import { cn } from "@/lib/utils";

function makeSampleTileFile(): Promise<File> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, 512, 512);
    grad.addColorStop(0, "#1a2a38");
    grad.addColorStop(1, "#3a4a52");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    let seed = 99;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = `rgba(${180 + rand() * 60},${180 + rand() * 60},${180 + rand() * 60},${0.15 + rand() * 0.3})`;
      const w = 14 + rand() * 60;
      ctx.fillRect(rand() * 512, rand() * 512, w, w * (0.6 + rand() * 0.8));
    }
    for (let i = 0; i < 8; i++) {
      ctx.strokeStyle = "rgba(20,20,20,0.4)";
      ctx.lineWidth = 3 + rand() * 4;
      ctx.beginPath();
      ctx.moveTo(rand() * 512, rand() * 512);
      ctx.lineTo(rand() * 512, rand() * 512);
      ctx.stroke();
    }
    canvas.toBlob((blob) => {
      resolve(new File([blob as Blob], "sample-ir-tile.png", { type: "image/png" }));
    });
  });
}

export function InteractiveDemo() {
  const { canvasRef, loadFile, run, running, hasImage, stageIndex, stages, setStage, reset, fileName } =
    useImagePipeline();
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) loadFile(file);
    },
    [loadFile]
  );

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-28">
      <SectionHeading
        eyebrow="Try It Live"
        title="Run the pipeline on your own tile"
        description="Drop an image in — IRIS AI will simulate every stage of the pipeline client-side so you can see the workflow end to end. For full-fidelity inference, use the Platform dashboard."
      />

      <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Upload zone */}
        <GlassCard className="flex flex-col">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "flex flex-1 min-h-[14rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed transition-colors",
              dragOver ? "border-cyan bg-cyan/5" : "border-hairline hover:border-cyan/40"
            )}
          >
            <UploadCloud className="text-cyan" size={28} />
            <p className="text-sm text-ink/80">Drag & drop an infrared tile</p>
            <p className="text-xs text-ink-faint">PNG, JPG up to 10MB</p>
            <input
              ref={inputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) loadFile(file);
              }}
            />
          </div>

          <button
            onClick={async (e) => {
              e.stopPropagation();
              loadFile(await makeSampleTileFile());
            }}
            className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-hairline py-2.5 text-xs text-ink-dim hover:border-cyan/40 hover:text-cyan transition-colors"
          >
            <ImagePlus size={14} /> Use a synthetic sample tile instead
          </button>

          {fileName && (
            <p className="mt-3 truncate font-mono text-[11px] text-ink-faint">{fileName}</p>
          )}

          <div className="mt-5 flex gap-3">
            <GlowButton
              onClick={run}
              disabled={!hasImage || running}
              className="flex-1 justify-center disabled:opacity-40"
              icon={<Play size={14} />}
            >
              {running ? "Processing…" : "Run AI"}
            </GlowButton>
            <button
              onClick={reset}
              disabled={!hasImage}
              className="flex items-center justify-center rounded-full border border-hairline px-4 text-ink-dim hover:border-cyan/40 hover:text-cyan disabled:opacity-30"
              aria-label="Reset"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </GlassCard>

        {/* Canvas + stage rail */}
        <GlassCard className="flex flex-col">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black/40">
            <canvas
              ref={canvasRef}
              className="h-full w-full object-cover"
              width={512}
              height={512}
            />
            {!hasImage && (
              <div className="absolute inset-0 flex items-center justify-center text-sm text-ink-faint">
                Upload a tile to begin
              </div>
            )}
            {running && (
              <motion.div
                className="absolute inset-x-0 h-px bg-cyan shadow-glow"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
              />
            )}
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
            {stages.map((stage, i) => (
              <button
                key={stage}
                disabled={!hasImage}
                onClick={() => setStage(i)}
                className={cn(
                  "rounded-lg border px-2 py-2 text-center text-[10px] uppercase tracking-wide transition-colors disabled:opacity-30",
                  i === stageIndex
                    ? "border-cyan text-cyan bg-cyan/10"
                    : "border-hairline text-ink-faint hover:border-cyan/30"
                )}
              >
                {STAGE_META[stage].label}
              </button>
            ))}
          </div>

          <p className="mt-4 text-xs leading-relaxed text-ink-faint">
            {STAGE_META[stages[stageIndex]].description}
          </p>
        </GlassCard>
      </div>
    </section>
  );
}
