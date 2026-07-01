"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X, Sparkles } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  text: string;
}

const FAQ: { match: RegExp; reply: string }[] = [
  {
    match: /ssim|psnr|fid|map|metric/i,
    reply:
      "Current benchmark run: 98.7% SSIM, 37.5 dB PSNR, 14.2 FID and 94.3% detection mAP, evaluated on the held-out Resourcesat validation split. See the Metrics page for live charts.",
  },
  {
    match: /architecture|pipeline|model|how does it work/i,
    reply:
      "IRIS AI chains 4 models: SwinIR for super-resolution, SegFormer for semantic segmentation, a ControlNet-guided diffusion model for colorization, and YOLOv9 for detection validation. Scroll to the Architecture section for the full diagram.",
  },
  {
    match: /upload|inference|run|try/i,
    reply:
      "Head to Platform → Inference, drop an infrared tile in the upload zone, and hit Run AI. You'll see the enhanced, segmented, colorized and detection outputs stream in stage by stage.",
  },
  {
    match: /export|download|tiff|pdf/i,
    reply:
      "Every inference run can be exported as PNG, GeoTIFF (for GIS tools) or a PDF report with full metrics — buttons are on the Inference results panel.",
  },
  {
    match: /deploy|docker|onnx|tensorrt|api/i,
    reply:
      "Production inference is packaged as a quantized ONNX graph served via TensorRT, fronted by a FastAPI REST gateway, containerized with Docker for cloud or edge deployment. See the Deployment page.",
  },
];

function getReply(input: string) {
  const hit = FAQ.find((f) => f.match.test(input));
  if (hit) return hit.reply;
  return "I can walk you through the IRIS AI pipeline, current benchmark metrics, how to run inference, or deployment options — what would you like to know?";
}

export function Assistant() {
  const { assistantOpen, setAssistantOpen } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "intro",
      role: "assistant",
      text: "Welcome to IRIS AI. Ask me about the pipeline, benchmark metrics, or how to run inference on your own imagery.",
    },
  ]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function send() {
    if (!input.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", text: input };
    const reply: Message = {
      id: crypto.randomUUID(),
      role: "assistant",
      text: getReply(input),
    };
    setMessages((m) => [...m, userMsg, reply]);
    setInput("");
  }

  return (
    <>
      <motion.button
        onClick={() => setAssistantOpen(!assistantOpen)}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 z-50 flex h-13 w-13 items-center justify-center rounded-full bg-cyan text-void shadow-glow h-13 w-13 p-3.5"
        aria-label="Open AI assistant"
      >
        {assistantOpen ? <X size={20} /> : <Sparkles size={20} />}
      </motion.button>

      <AnimatePresence>
        {assistantOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-6 z-50 flex h-[28rem] w-[22rem] flex-col overflow-hidden rounded-2xl glass-strong shadow-glow"
          >
            <div className="flex items-center gap-2 border-b border-hairline px-4 py-3">
              <Bot size={16} className="text-cyan" />
              <p className="text-sm font-medium text-ink">IRIS Assistant</p>
              <span className="ml-auto h-1.5 w-1.5 rounded-full bg-green animate-pulse" />
            </div>

            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                    m.role === "assistant"
                      ? "bg-white/[0.04] text-ink/90"
                      : "ml-auto bg-cyan/15 text-ink"
                  )}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 border-t border-hairline p-3">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask about IRIS AI…"
                className="w-full rounded-lg bg-white/[0.04] px-3 py-2 text-sm text-ink placeholder:text-ink-faint outline-none border border-hairline focus:border-cyan/50"
              />
              <button
                onClick={send}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan text-void"
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
