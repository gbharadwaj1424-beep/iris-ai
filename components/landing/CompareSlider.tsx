"use client";

import { useEffect, useRef, useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { toInfraredLook, colorize, enhance } from "@/lib/imagePipeline";
import { seededRandom } from "@/lib/utils";

const SIZE = 600;

function buildPair() {
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d")!;
  const rand = seededRandom(77);
  const grad = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  grad.addColorStop(0, "#1c2f3a");
  grad.addColorStop(1, "#2f4438");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SIZE, SIZE);
  for (let i = 0; i < 140; i++) {
    ctx.fillStyle = `rgba(${150 + rand() * 80},${150 + rand() * 80},${140 + rand() * 70},0.28)`;
    const w = 10 + rand() * 50;
    ctx.fillRect(rand() * SIZE, rand() * SIZE, w, w * (0.5 + rand() * 0.8));
  }
  const base = ctx.getImageData(0, 0, SIZE, SIZE);
  const irCanvas = document.createElement("canvas");
  irCanvas.width = SIZE;
  irCanvas.height = SIZE;
  irCanvas.getContext("2d")!.putImageData(toInfraredLook(base), 0, 0);
  const rgbCanvas = document.createElement("canvas");
  rgbCanvas.width = SIZE;
  rgbCanvas.height = SIZE;
  rgbCanvas.getContext("2d")!.putImageData(colorize(enhance(base)), 0, 0);
  return { ir: irCanvas.toDataURL(), rgb: rgbCanvas.toDataURL() };
}

export function CompareSlider() {
  const [pair, setPair] = useState<{ ir: string; rgb: string } | null>(null);
  const [pos, setPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    setPair(buildPair());
  }, []);

  function updateFromClientX(clientX: number) {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.min(100, Math.max(0, pct)));
  }

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-28">
      <SectionHeading
        eyebrow="Before / After"
        title="Drag to see the gap IRIS AI closes"
        align="center"
        description="Same tile, two realities — the ambiguous IR capture on the left, the analyst-ready reconstruction on the right."
      />

      {pair && (
        <div
          ref={containerRef}
          className="relative mx-auto mt-12 aspect-[4/3] w-full max-w-3xl select-none overflow-hidden rounded-2xl border border-hairline corner-frame"
          onMouseDown={(e) => { draggingRef.current = true; updateFromClientX(e.clientX); }}
          onMouseMove={(e) => draggingRef.current && updateFromClientX(e.clientX)}
          onMouseUp={() => (draggingRef.current = false)}
          onMouseLeave={() => (draggingRef.current = false)}
          onTouchStart={(e) => updateFromClientX(e.touches[0].clientX)}
          onTouchMove={(e) => updateFromClientX(e.touches[0].clientX)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={pair.rgb} alt="Enhanced RGB reconstruction" className="absolute inset-0 h-full w-full object-cover" />
          <div
            className="absolute inset-0 h-full overflow-hidden"
            style={{ width: `${pos}%` }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pair.ir}
              alt="Source infrared"
              className="h-full object-cover"
              style={{ width: containerRef.current?.offsetWidth ?? "100%", maxWidth: "none" }}
            />
          </div>

          <div
            className="absolute top-0 h-full w-[2px] bg-cyan shadow-glow"
            style={{ left: `${pos}%` }}
          >
            <div className="absolute top-1/2 left-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cyan text-void shadow-glow">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M5 2L1 7L5 12M9 2L13 7L9 12" stroke="#06080D" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          <span className="absolute left-3 top-3 font-mono text-[10px] tracking-wide text-ink/80">IR</span>
          <span className="absolute right-3 top-3 font-mono text-[10px] tracking-wide text-ink/80">RGB</span>
        </div>
      )}
    </section>
  );
}
