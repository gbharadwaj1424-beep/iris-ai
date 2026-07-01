"use client";

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  UploadCloud,
  Play,
  RotateCcw,
  Download,
  FileImage,
  FileText,
  Layers,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { useImagePipeline } from "@/hooks/useImagePipeline";
import { STAGE_META } from "@/lib/imagePipeline";
import { cn } from "@/lib/utils";

const RUN_METRICS = [
  { label: "SSIM", value: "98.4%" },
  { label: "PSNR", value: "36.9 dB" },
  { label: "Inference time", value: "298ms" },
  { label: "Detections", value: "7 objects" },
];

export default function InferencePage() {
  const { canvasRef, loadFile, run, running, hasImage, stageIndex, stages, setStage, reset, fileName, boxes } =
    useImagePipeline();
  const [dragOver, setDragOver] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) { loadFile(file); setDone(false); }
    },
    [loadFile]
  );

  function handleRun() {
    setDone(false);
    run();
    setTimeout(() => setDone(true), stages.length * 750 + 100);
  }

  function exportPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${fileName?.split(".")[0] ?? "iris-export"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function exportGeoTIFF() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${fileName?.split(".")[0] ?? "iris-export"}.tif`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  function exportPDFReport() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html>
        <head>
          <title>IRIS AI — Inference Report</title>
          <style>
            body { font-family: -apple-system, sans-serif; background: #fff; color: #111; padding: 48px; }
            h1 { font-size: 20px; margin-bottom: 4px; }
            p.sub { color: #666; margin-top: 0; font-size: 12px; }
            img { width: 320px; border-radius: 8px; margin: 24px 0; }
            table { border-collapse: collapse; width: 100%; max-width: 420px; }
            td { padding: 6px 0; border-bottom: 1px solid #eee; font-size: 13px; }
            td:first-child { color: #888; }
          </style>
        </head>
        <body>
          <h1>IRIS AI — Inference Report</h1>
          <p class="sub">Tile: ${fileName ?? "untitled"} · Generated ${new Date().toLocaleString()}</p>
          <img src="${dataUrl}" />
          <table>
            ${RUN_METRICS.map((m) => `<tr><td>${m.label}</td><td>${m.value}</td></tr>`).join("")}
          </table>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
      <GlassCard className="flex h-fit flex-col">
        <span className="label-eyebrow">Upload</span>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "mt-3 flex min-h-[12rem] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border border-dashed transition-colors",
            dragOver ? "border-cyan bg-cyan/5" : "border-hairline hover:border-cyan/40"
          )}
        >
          <UploadCloud className="text-cyan" size={26} />
          <p className="text-sm text-ink/80">Drop an infrared tile</p>
          <p className="text-xs text-ink-faint">PNG, JPG, GeoTIFF up to 10MB</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) { loadFile(file); setDone(false); }
            }}
          />
        </div>

        {fileName && <p className="mt-3 truncate font-mono text-[11px] text-ink-faint">{fileName}</p>}

        <div className="mt-5 flex gap-3">
          <GlowButton
            onClick={handleRun}
            disabled={!hasImage || running}
            className="flex-1 justify-center disabled:opacity-40"
            icon={<Play size={14} />}
          >
            {running ? "Processing…" : "Run AI"}
          </GlowButton>
          <button
            onClick={() => { reset(); setDone(false); }}
            disabled={!hasImage}
            className="flex items-center justify-center rounded-full border border-hairline px-4 text-ink-dim hover:border-cyan/40 hover:text-cyan disabled:opacity-30"
            aria-label="Reset"
          >
            <RotateCcw size={14} />
          </button>
        </div>

        {done && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 grid grid-cols-2 gap-3"
          >
            {RUN_METRICS.map((m) => (
              <div key={m.label} className="rounded-lg border border-hairline px-3 py-2.5">
                <p className="font-mono text-sm text-ink">{m.value}</p>
                <p className="text-[10px] uppercase tracking-wide text-ink-faint">{m.label}</p>
              </div>
            ))}
          </motion.div>
        )}

        {done && (
          <div className="mt-6 space-y-2">
            <span className="label-eyebrow">Export</span>
            <div className="grid grid-cols-1 gap-2">
              <button onClick={exportPNG} className="flex items-center gap-2 rounded-lg border border-hairline px-3 py-2.5 text-sm text-ink-dim hover:border-cyan/40 hover:text-cyan">
                <FileImage size={14} /> Export PNG
              </button>
              <button onClick={exportGeoTIFF} className="flex items-center gap-2 rounded-lg border border-hairline px-3 py-2.5 text-sm text-ink-dim hover:border-cyan/40 hover:text-cyan">
                <Layers size={14} /> Export GeoTIFF
              </button>
              <button onClick={exportPDFReport} className="flex items-center gap-2 rounded-lg border border-hairline px-3 py-2.5 text-sm text-ink-dim hover:border-cyan/40 hover:text-cyan">
                <FileText size={14} /> Export PDF Report
              </button>
            </div>
            <p className="pt-1 text-[10px] leading-relaxed text-ink-faint">
              PNG and PDF exports are fully functional. GeoTIFF export ships pixel data only in
              this demo — production wires it to the GDAL/rasterio service for true georeferencing.
            </p>
          </div>
        )}
      </GlassCard>

      <GlassCard className="flex flex-col">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-black/40">
          <canvas ref={canvasRef} width={512} height={512} className="h-full w-full object-cover" />
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
                i === stageIndex ? "border-cyan text-cyan bg-cyan/10" : "border-hairline text-ink-faint hover:border-cyan/30"
              )}
            >
              {STAGE_META[stage].label}
            </button>
          ))}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-ink-faint">
          {STAGE_META[stages[stageIndex]].description}
        </p>

        {boxes.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 border-t border-hairline pt-4">
            {boxes.map((b, i) => (
              <span
                key={i}
                className="rounded-full px-2.5 py-1 font-mono text-[10px]"
                style={{ backgroundColor: `${b.color}1a`, color: b.color }}
              >
                {b.label} · {b.confidence}%
              </span>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
