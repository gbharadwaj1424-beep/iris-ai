import {
  DetectionClass,
  MetricPoint,
  ModelCard,
  PipelineStage,
  TeamMember,
  TimelineItem,
} from "@/types";

export const pipelineStages: PipelineStage[] = [
  {
    id: "ir-input",
    index: "01",
    title: "Infrared Input",
    description:
      "Raw single-band thermal/IR tiles ingested from Landsat-8 TIRS and Resourcesat LISS sensors, georeferenced and tiled to 512² patches.",
    metric: "12-bit · 30m GSD",
  },
  {
    id: "preprocess",
    index: "02",
    title: "Preprocessing",
    description:
      "Radiometric calibration, atmospheric correction and histogram equalization normalize sensor noise before the network sees a single pixel.",
    metric: "CLAHE · destriping",
  },
  {
    id: "super-res",
    index: "03",
    title: "Super Resolution",
    description:
      "A SwinIR transformer backbone upsamples low-fidelity IR tiles 4×, recovering edges and texture lost to sensor resolution limits.",
    metric: "SwinIR ×4",
  },
  {
    id: "segmentation",
    index: "04",
    title: "Semantic Segmentation",
    description:
      "SegFormer assigns a land-cover class to every pixel — water, forest, urban, road, agriculture, snow — to guide plausible colorization.",
    metric: "SegFormer-B3",
  },
  {
    id: "semantic-guidance",
    index: "05",
    title: "Semantic Guidance",
    description:
      "Class probability maps are encoded as conditioning signals, constraining the color prior so the diffusion model can't hallucinate impossible scenes.",
    metric: "Mask-conditioned",
  },
  {
    id: "diffusion",
    index: "06",
    title: "Diffusion Colorization",
    description:
      "A ControlNet-guided latent diffusion model converts the enhanced IR + semantic mask into a physically-plausible RGB reconstruction.",
    metric: "ControlNet + LDM",
  },
  {
    id: "refinement",
    index: "07",
    title: "Refinement",
    description:
      "A lightweight GAN discriminator pass removes diffusion artifacts and sharpens boundaries between adjacent land-cover classes.",
    metric: "Artifact removal",
  },
  {
    id: "detection",
    index: "08",
    title: "Detection Validation",
    description:
      "YOLOv9 runs on the reconstructed RGB to confirm object counts and boundaries stayed consistent with the source IR signal.",
    metric: "YOLOv9 · mAP 94.3",
  },
  {
    id: "output",
    index: "09",
    title: "Output",
    description:
      "Final RGB tile, confidence heatmap, segmentation overlay and a structured metrics report are packaged for export.",
    metric: "PNG · GeoTIFF · PDF",
  },
];

export const modelCards: ModelCard[] = [
  {
    id: "swinir",
    name: "SwinIR",
    role: "Super Resolution",
    description:
      "Shifted-window transformer for image restoration. Upsamples degraded IR tiles while preserving high-frequency structural detail.",
    params: "11.8M",
    latency: "42ms / tile",
    accuracy: "37.5 PSNR",
    tags: ["Transformer", "Restoration", "x4 upscale"],
  },
  {
    id: "segformer",
    name: "SegFormer",
    role: "Semantic Segmentation",
    description:
      "Hierarchical transformer encoder with a lightweight MLP decoder, fine-tuned on 6 land-cover classes across Indian subcontinent tiles.",
    params: "47.2M",
    latency: "58ms / tile",
    accuracy: "91.4 mIoU",
    tags: ["Transformer", "Dense prediction"],
  },
  {
    id: "controlnet",
    name: "ControlNet + LDM",
    role: "Conditional Colorization",
    description:
      "Latent diffusion model conditioned on semantic masks and edge maps, producing physically-consistent RGB from single-band IR input.",
    params: "860M",
    latency: "1.2s / tile",
    accuracy: "14.2 FID",
    tags: ["Diffusion", "Conditional generation"],
  },
  {
    id: "yolo",
    name: "YOLOv9",
    role: "Detection Validation",
    description:
      "Real-time object detector validating that vehicles, buildings and roads remain consistent between source IR and reconstructed RGB.",
    params: "25.3M",
    latency: "18ms / tile",
    accuracy: "94.3 mAP",
    tags: ["CNN", "Real-time"],
  },
];

export const detectionClasses: DetectionClass[] = [
  { id: "water", label: "Water", color: "#2EE6FF", count: 12 },
  { id: "forest", label: "Forest", color: "#34F5A8", count: 41 },
  { id: "urban", label: "Urban", color: "#FFB454", count: 27 },
  { id: "road", label: "Roads", color: "#E9F1FB", count: 9 },
  { id: "agriculture", label: "Agriculture", color: "#7C5CFF", count: 33 },
  { id: "snow", label: "Snow", color: "#8FA3C2", count: 4 },
];

export function generateTrainingCurve(epochs = 40): MetricPoint[] {
  const points: MetricPoint[] = [];
  let loss = 1.85;
  let val = 1.95;
  let psnr = 21;
  let ssim = 0.62;
  for (let e = 1; e <= epochs; e++) {
    loss = Math.max(0.08, loss * 0.93 + (Math.sin(e / 3) * 0.01));
    val = Math.max(0.12, val * 0.935 + (Math.cos(e / 4) * 0.012));
    psnr = Math.min(38, psnr + 0.42 + Math.sin(e / 5) * 0.2);
    ssim = Math.min(0.987, ssim + 0.0095 + Math.cos(e / 6) * 0.002);
    points.push({
      epoch: e,
      loss: Number(loss.toFixed(3)),
      valLoss: Number(val.toFixed(3)),
      psnr: Number(psnr.toFixed(2)),
      ssim: Number(ssim.toFixed(3)),
      gpu: Math.round(72 + Math.sin(e / 2) * 14),
      lr: Number((0.0004 * Math.pow(0.95, Math.floor(e / 5))).toFixed(6)),
    });
  }
  return points;
}

export const team: TeamMember[] = [
  { id: "1", name: "Garv Bharadwaj", role: "ML Systems Lead", focus: "Diffusion & ControlNet", initials: "AM" },
  { id: "2", name: "Meghna Pant", role: "Remote Sensing Lead", focus: "Sensor calibration & GIS", initials: "PN" },
  { id: "3", name: "Rakshak Minhas", role: "Full-Stack Architect", focus: "Platform & infra", initials: "KS" },
  { id: "4", name: "Gayatri Dhasmana", role: "Computer Vision Eng.", focus: "Segmentation & detection", initials: "SI" },
];

export const timeline: TimelineItem[] = [
  {
    id: "t1",
    phase: "Phase 01",
    title: "Dataset curation & calibration",
    description: "Landsat-8 / Resourcesat tile ingestion, radiometric correction, 6-class label set.",
    status: "done",
  },
  {
    id: "t2",
    phase: "Phase 02",
    title: "Super-resolution + segmentation",
    description: "SwinIR and SegFormer trained and validated against held-out tiles.",
    status: "done",
  },
  {
    id: "t3",
    phase: "Phase 03",
    title: "Semantic-guided colorization",
    description: "ControlNet conditioning pipeline tuned for IR→RGB consistency.",
    status: "active",
  },
  {
    id: "t4",
    phase: "Phase 04",
    title: "Detection validation loop",
    description: "Closed-loop YOLO validation comparing source IR vs. reconstructed RGB.",
    status: "active",
  },
  {
    id: "t5",
    phase: "Phase 05",
    title: "TensorRT deployment & API",
    description: "Quantized inference graph served behind a FastAPI gateway with ONNX export.",
    status: "upcoming",
  },
];

export const techStack = [
  "PyTorch", "OpenCV", "Rasterio", "GDAL", "SegFormer", "ControlNet",
  "SwinIR", "YOLOv9", "FastAPI", "Docker", "TensorRT", "ONNX",
  "Next.js", "Three.js", "TypeScript",
];

export const liveMetrics = [
  { label: "SSIM", value: 98.7, suffix: "%", description: "Structural similarity vs. ground truth" },
  { label: "PSNR", value: 37.5, suffix: " dB", description: "Peak signal-to-noise ratio" },
  { label: "FID", value: 14.2, suffix: "", description: "Fréchet inception distance (lower is better)" },
  { label: "mAP", value: 94.3, suffix: "%", description: "Detection consistency after reconstruction" },
];
