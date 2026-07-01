"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import { liveMetrics } from "@/lib/mockData";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";
import { GlowButton } from "@/components/ui/GlowButton";

const Earth3D = dynamic(() => import("./Earth3D"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-panel/40 rounded-full" />,
});

export function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-void">
      {/* ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-aurora" />
      <div className="pointer-events-none absolute inset-0 grid-overlay noise-mask opacity-60" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 pt-28">
        <div className="grid flex-1 grid-cols-1 items-center gap-10 lg:grid-cols-2">
          {/* Copy */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-white/[0.03] px-3 py-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green" />
              </span>
              <span className="font-mono text-[11px] tracking-wide text-ink-dim">
                LIVE · MISSION TELEMETRY NOMINAL
              </span>
            </div>

            <h1 className="font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-[3.4rem]">
              Transform infrared satellite imagery into{" "}
              <span className="text-gradient">high-fidelity RGB intelligence</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-ink/70">
              AI-powered enhancement, semantic-guided colorization, and explainable
              computer vision for next-generation Earth observation — built for
              analysts who need clarity, not guesswork.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link href="/platform">
                <GlowButton icon={<ArrowRight size={16} />}>
                  Launch Platform
                </GlowButton>
              </Link>
              <a href="#pipeline">
                <GlowButton variant="ghost" icon={<PlayCircle size={16} />}>
                  Watch Pipeline
                </GlowButton>
              </a>
            </div>

            <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {liveMetrics.map((m) => (
                <div key={m.label}>
                  <p className="font-mono text-2xl font-medium text-ink sm:text-3xl">
                    <AnimatedCounter value={m.value} decimals={1} suffix={m.suffix} />
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-ink-faint">
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 3D Earth + HUD */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="relative mx-auto aspect-square w-full max-w-[34rem]"
          >
            <Earth3D />

            {/* HUD reticle overlay */}
            <svg
              viewBox="0 0 400 400"
              className="pointer-events-none absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              <circle
                cx="200"
                cy="200"
                r="188"
                fill="none"
                stroke="rgba(46,230,255,0.18)"
                strokeWidth="1"
                strokeDasharray="2 6"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 200 200"
                  to="360 200 200"
                  dur="40s"
                  repeatCount="indefinite"
                />
              </circle>
              {[0, 90, 180, 270].map((deg) => (
                <line
                  key={deg}
                  x1="200"
                  y1="6"
                  x2="200"
                  y2="22"
                  stroke="rgba(46,230,255,0.5)"
                  strokeWidth="1.5"
                  transform={`rotate(${deg} 200 200)`}
                />
              ))}
              {/* corner brackets */}
              {[
                "M14,40 L14,14 L40,14",
                "M360,14 L386,14 L386,40",
                "M386,360 L386,386 L360,386",
                "M40,386 L14,386 L14,360",
              ].map((d) => (
                <path key={d} d={d} stroke="rgba(46,230,255,0.55)" strokeWidth="1.5" fill="none" />
              ))}
            </svg>

            <div className="pointer-events-none absolute left-1 top-1 font-mono text-[10px] tracking-wider text-cyan/70">
              LAT 28.61°N
              <br />
              LON 77.20°E
            </div>
            <div className="pointer-events-none absolute bottom-1 right-1 text-right font-mono text-[10px] tracking-wider text-cyan/70">
              ALT 705km
              <br />
              SENSOR · TIRS-2
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="relative mx-auto mb-8 flex flex-col items-center gap-2 text-ink-faint"
      >
        <span className="font-mono text-[10px] tracking-[0.3em]">SCROLL</span>
        <div className="h-9 w-[1px] bg-gradient-to-b from-cyan to-transparent" />
      </motion.div>
    </section>
  );
}
