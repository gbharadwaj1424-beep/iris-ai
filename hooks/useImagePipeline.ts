"use client";

import { useCallback, useRef, useState } from "react";
import {
  STAGE_ORDER,
  StageId,
  toInfraredLook,
  enhance,
  segment,
  colorize,
  heatmap,
  generateDetections,
  DetectionBox,
} from "@/lib/imagePipeline";

const CANVAS_SIZE = 512;

export function useImagePipeline() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const baseImageDataRef = useRef<ImageData | null>(null);
  const seedRef = useRef(1);
  const [hasImage, setHasImage] = useState(false);
  const [running, setRunning] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [fileName, setFileName] = useState<string | null>(null);
  const [boxes, setBoxes] = useState<DetectionBox[]>([]);

  const drawStage = useCallback((stage: StageId) => {
    const canvas = canvasRef.current;
    const base = baseImageDataRef.current;
    if (!canvas || !base) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = base;
    if (stage === "enhanced") frame = enhance(base);
    else if (stage === "segmentation") frame = segment(base);
    else if (stage === "colorized") frame = colorize(enhance(base));
    else if (stage === "detection") frame = colorize(enhance(base));
    else if (stage === "heatmap") frame = heatmap(base);

    ctx.putImageData(frame, 0, 0);

    if (stage === "detection") {
      const dets = generateDetections(canvas.width, canvas.height, seedRef.current);
      setBoxes(dets);
      ctx.lineWidth = 2;
      ctx.font = "11px monospace";
      dets.forEach((b) => {
        ctx.strokeStyle = b.color;
        ctx.strokeRect(b.x, b.y, b.w, b.h);
        ctx.fillStyle = b.color;
        const text = `${b.label} ${b.confidence}%`;
        const textWidth = ctx.measureText(text).width;
        ctx.fillRect(b.x, b.y - 16, textWidth + 8, 16);
        ctx.fillStyle = "#06080D";
        ctx.fillText(text, b.x + 4, b.y - 4);
      });
    } else {
      setBoxes([]);
    }
  }, []);

  const loadFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          canvas.width = CANVAS_SIZE;
          canvas.height = CANVAS_SIZE;
          const ctx = canvas.getContext("2d");
          if (!ctx) return;

          // cover-fit draw
          const scale = Math.max(CANVAS_SIZE / img.width, CANVAS_SIZE / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
          ctx.drawImage(img, (CANVAS_SIZE - w) / 2, (CANVAS_SIZE - h) / 2, w, h);

          const raw = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
          const irLook = toInfraredLook(raw);
          baseImageDataRef.current = irLook;
          seedRef.current = Array.from(file.name).reduce((a, c) => a + c.charCodeAt(0), file.size);

          ctx.putImageData(irLook, 0, 0);
          setStageIndex(0);
          setHasImage(true);
          setBoxes([]);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
      setFileName(file.name);
    },
    []
  );

  const run = useCallback(() => {
    if (!hasImage || running) return;
    setRunning(true);
    let i = 0;
    setStageIndex(0);
    const interval = setInterval(() => {
      i += 1;
      if (i >= STAGE_ORDER.length) {
        clearInterval(interval);
        setRunning(false);
        return;
      }
      setStageIndex(i);
      drawStage(STAGE_ORDER[i]);
    }, 750);
  }, [hasImage, running, drawStage]);

  const setStage = useCallback(
    (index: number) => {
      setStageIndex(index);
      drawStage(STAGE_ORDER[index]);
    },
    [drawStage]
  );

  const reset = useCallback(() => {
    baseImageDataRef.current = null;
    setHasImage(false);
    setStageIndex(0);
    setFileName(null);
    setBoxes([]);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, []);

  return {
    canvasRef,
    loadFile,
    run,
    running,
    hasImage,
    stageIndex,
    currentStage: STAGE_ORDER[stageIndex],
    stages: STAGE_ORDER,
    setStage,
    reset,
    fileName,
    boxes,
  };
}
