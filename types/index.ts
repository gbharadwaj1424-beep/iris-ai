export interface PipelineStage {
  id: string;
  index: string;
  title: string;
  description: string;
  metric?: string;
}

export interface MetricPoint {
  epoch: number;
  loss: number;
  valLoss: number;
  psnr: number;
  ssim: number;
  gpu: number;
  lr: number;
}

export interface ModelCard {
  id: string;
  name: string;
  role: string;
  description: string;
  params: string;
  latency: string;
  accuracy: string;
  tags: string[];
}

export interface DetectionClass {
  id: string;
  label: string;
  color: string;
  count: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  focus: string;
  initials: string;
}

export interface TimelineItem {
  id: string;
  phase: string;
  title: string;
  description: string;
  status: "done" | "active" | "upcoming";
}

export interface InferenceJob {
  id: string;
  fileName: string;
  status: "queued" | "processing" | "complete";
  stage: number;
  createdAt: string;
}
