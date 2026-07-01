"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { GlowButton } from "@/components/ui/GlowButton";
import { cn } from "@/lib/utils";

const targets = [
  {
    id: "docker",
    icon: "🐳",
    label: "Docker Container",
    badge: "Ready",
    status: "green",
    description: "Pre-built multi-stage image with all CUDA deps and model weights baked in.",
    command: `docker pull irisai/inference:latest\ndocker run --gpus all -p 8000:8000 irisai/inference:latest`,
  },
  {
    id: "onnx",
    icon: "⚙️",
    label: "ONNX Export",
    badge: "Ready",
    status: "green",
    description: "All four models exported to ONNX opset 17. Drop into any ONNXRuntime environment.",
    command: `python -m iris_ai.export --format onnx \\\n  --models swinir segformer controlnet yolo \\\n  --output ./weights/onnx/`,
  },
  {
    id: "tensorrt",
    icon: "⚡",
    label: "TensorRT Engine",
    badge: "Ready",
    status: "green",
    description: "FP16 quantized TensorRT engines. ~3.4× speedup vs. PyTorch baseline on A10G.",
    command: `trtexec --onnx=swinir.onnx \\\n  --saveEngine=swinir_fp16.engine \\\n  --fp16 --optShapes=input:1x1x512x512`,
  },
  {
    id: "api",
    icon: "🌐",
    label: "REST API (FastAPI)",
    badge: "Live",
    status: "cyan",
    description: "OpenAPI-documented endpoint. POST a tile, get JSON metrics + base64 output back.",
    command: `curl -X POST https://api.iris-ai.dev/v1/infer \\\n  -H "Authorization: Bearer $TOKEN" \\\n  -F "tile=@my_tile.tif"`,
  },
  {
    id: "cloud",
    icon: "☁️",
    label: "Cloud Deployment",
    badge: "Planned",
    status: "amber",
    description: "Terraform modules for AWS Batch, GCP Vertex AI, and Azure ML batch inference.",
    command: `terraform apply -var="region=ap-south-1" \\\n  -var="instance_type=g4dn.xlarge" \\\n  modules/iris-ai-batch`,
  },
];

export default function DeploymentPage() {
  const [active, setActive] = useState("docker");

  const current = targets.find((t) => t.id === active)!;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.65fr_1.35fr]">
      <div className="flex flex-col gap-3">
        {targets.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
              active === t.id
                ? "border-cyan bg-cyan/5 shadow-glow"
                : "border-hairline hover:border-cyan/30 bg-white/[0.02]"
            )}
          >
            <span className="text-xl">{t.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{t.label}</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-[10px]",
                t.status === "green" && "bg-green/10 text-green",
                t.status === "cyan" && "bg-cyan/10 text-cyan",
                t.status === "amber" && "bg-amber/10 text-amber"
              )}
            >
              {t.badge}
            </span>
          </button>
        ))}
      </div>

      <motion.div
        key={current.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <GlassCard glow="cyan" className="h-full flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">{current.icon}</span>
                <h2 className="font-display text-xl text-ink">{current.label}</h2>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink/70">{current.description}</p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-3 py-1 font-mono text-xs",
                current.status === "green" && "bg-green/10 text-green",
                current.status === "cyan" && "bg-cyan/10 text-cyan",
                current.status === "amber" && "bg-amber/10 text-amber"
              )}
            >
              {current.badge}
            </span>
          </div>

          <div>
            <p className="mb-2 label-eyebrow">Command</p>
            <pre className="overflow-x-auto rounded-xl bg-black/40 px-5 py-4 font-mono text-xs leading-relaxed text-green/90 border border-hairline">
              {current.command}
            </pre>
          </div>

          {current.status !== "amber" && (
            <div className="flex flex-wrap gap-3">
              <GlowButton className="text-xs py-2 px-4">
                Deploy now
              </GlowButton>
              <button className="rounded-full border border-hairline px-4 py-2 text-xs text-ink-dim hover:border-cyan/40 hover:text-cyan">
                Copy command
              </button>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-2 border-t border-hairline pt-5">
            <p className="label-eyebrow">Requirements met</p>
            {["CUDA 12.1+", "Driver 525+", "16 GB VRAM (inference)", "4 GB RAM (CPU fallback)"].map((r) => (
              <div key={r} className="flex items-center gap-2 text-xs text-ink/70">
                <CheckCircle2 size={13} className="text-green shrink-0" /> {r}
              </div>
            ))}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
