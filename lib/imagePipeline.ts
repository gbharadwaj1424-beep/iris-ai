"use client";

import { seededRandom } from "@/lib/utils";

export type StageId =
  | "original"
  | "enhanced"
  | "segmentation"
  | "colorized"
  | "detection"
  | "heatmap";

function cloneImageData(data: ImageData): ImageData {
  return new ImageData(new Uint8ClampedArray(data.data), data.width, data.height);
}

function luminance(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

/** Simulated single-band infrared appearance: duotone navy → white by luminance. */
export function toInfraredLook(src: ImageData): ImageData {
  const out = cloneImageData(src);
  const d = out.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum = luminance(d[i], d[i + 1], d[i + 2]) / 255;
    d[i] = Math.round(8 + lum * 150);
    d[i + 1] = Math.round(14 + lum * 190);
    d[i + 2] = Math.round(40 + lum * 215);
  }
  return out;
}

/** Contrast stretch + brightness lift to simulate the SwinIR enhancement stage. */
export function enhance(src: ImageData): ImageData {
  const out = cloneImageData(src);
  const d = out.data;
  const contrast = 1.35;
  const brightness = 18;
  for (let i = 0; i < d.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const v = (d[i + c] - 128) * contrast + 128 + brightness;
      d[i + c] = Math.min(255, Math.max(0, v));
    }
  }
  return out;
}

const CLASS_PALETTE: [number, number, number][] = [
  [46, 230, 255], // water - cyan
  [52, 245, 168], // forest - green
  [255, 180, 84], // urban - amber
  [233, 241, 251], // road - white
  [124, 92, 255], // agriculture - violet
  [143, 163, 194], // snow/other - grey
];

/** Posterizes luminance into discrete bands mapped to land-cover class colors. */
export function segment(src: ImageData): ImageData {
  const out = cloneImageData(src);
  const d = out.data;
  const bands = CLASS_PALETTE.length;
  for (let i = 0; i < d.length; i += 4) {
    const lum = luminance(d[i], d[i + 1], d[i + 2]) / 255;
    const band = Math.min(bands - 1, Math.floor(lum * bands));
    const [r, g, b] = CLASS_PALETTE[band];
    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
    d[i + 3] = 215;
  }
  return out;
}

/** Maps luminance through a satellite-style green/brown/blue LUT. */
export function colorize(src: ImageData): ImageData {
  const out = cloneImageData(src);
  const d = out.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum = luminance(d[i], d[i + 1], d[i + 2]) / 255;
    let r: number, g: number, b: number;
    if (lum < 0.3) {
      const t = lum / 0.3;
      r = 10 + t * 30; g = 50 + t * 60; b = 80 + t * 70; // water -> shallow
    } else if (lum < 0.65) {
      const t = (lum - 0.3) / 0.35;
      r = 30 + t * 70; g = 90 + t * 90; b = 50 + t * 30; // vegetation
    } else {
      const t = (lum - 0.65) / 0.35;
      r = 130 + t * 100; g = 120 + t * 90; b = 100 + t * 80; // urban / arid
    }
    d[i] = Math.min(255, r);
    d[i + 1] = Math.min(255, g);
    d[i + 2] = Math.min(255, b);
  }
  return out;
}

const JET_STOPS: [number, number, number][] = [
  [9, 14, 64],
  [15, 184, 212],
  [52, 245, 168],
  [255, 180, 84],
  [255, 70, 70],
];

function jetColor(t: number): [number, number, number] {
  const n = JET_STOPS.length - 1;
  const scaled = Math.min(0.9999, Math.max(0, t)) * n;
  const i = Math.floor(scaled);
  const frac = scaled - i;
  const [r1, g1, b1] = JET_STOPS[i];
  const [r2, g2, b2] = JET_STOPS[Math.min(i + 1, n)];
  return [
    r1 + (r2 - r1) * frac,
    g1 + (g2 - g1) * frac,
    b1 + (b2 - b1) * frac,
  ];
}

/** Confidence heatmap using a jet-style colormap over local luminance. */
export function heatmap(src: ImageData): ImageData {
  const out = cloneImageData(src);
  const d = out.data;
  for (let i = 0; i < d.length; i += 4) {
    const lum = luminance(d[i], d[i + 1], d[i + 2]) / 255;
    const [r, g, b] = jetColor(lum);
    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
  }
  return out;
}

export interface DetectionBox {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  confidence: number;
  color: string;
}

const DETECTION_LABELS = [
  { label: "vehicle cluster", color: "#2EE6FF" },
  { label: "structure", color: "#FFB454" },
  { label: "road segment", color: "#E9F1FB" },
  { label: "vegetation block", color: "#34F5A8" },
];

/** Deterministic pseudo-detections sized relative to the canvas, seeded per image. */
export function generateDetections(
  width: number,
  height: number,
  seed: number
): DetectionBox[] {
  const rand = seededRandom(seed || 1);
  const count = 4 + Math.floor(rand() * 4);
  const boxes: DetectionBox[] = [];
  for (let i = 0; i < count; i++) {
    const w = width * (0.08 + rand() * 0.16);
    const h = height * (0.08 + rand() * 0.16);
    const x = rand() * (width - w);
    const y = rand() * (height - h);
    const meta = DETECTION_LABELS[Math.floor(rand() * DETECTION_LABELS.length)];
    boxes.push({
      x, y, w, h,
      label: meta.label,
      confidence: Math.round((72 + rand() * 26) * 10) / 10,
      color: meta.color,
    });
  }
  return boxes;
}

export const STAGE_META: Record<StageId, { label: string; description: string }> = {
  original: { label: "Infrared Input", description: "Raw single-band capture, as received from the sensor." },
  enhanced: { label: "Enhanced", description: "SwinIR contrast stretch & super-resolution applied." },
  segmentation: { label: "Semantic Mask", description: "SegFormer land-cover classes overlaid by region." },
  colorized: { label: "Colorized RGB", description: "ControlNet-guided diffusion reconstruction." },
  detection: { label: "Detection", description: "YOLOv9 validation pass on the reconstructed RGB." },
  heatmap: { label: "Confidence Heatmap", description: "Per-pixel model confidence, jet colormap." },
};

export const STAGE_ORDER: StageId[] = [
  "original",
  "enhanced",
  "segmentation",
  "colorized",
  "detection",
  "heatmap",
];
