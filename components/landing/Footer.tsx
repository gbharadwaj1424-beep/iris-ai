"use client";

import Link from "next/link";
import { Satellite, Github, ArrowUpRight } from "lucide-react";
import { Starfield } from "@/components/ui/Starfield";

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Dashboard", href: "/platform" },
      { label: "Inference", href: "/platform/inference" },
      { label: "Training", href: "/platform/training" },
      { label: "Deployment", href: "/platform/deployment" },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "Architecture", href: "#pipeline" },
      { label: "Models", href: "#models" },
      { label: "Metrics", href: "#metrics" },
      { label: "Tech stack", href: "#stack" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-hairline bg-void pt-20">
      <div className="absolute inset-0 opacity-50">
        <Starfield density={0.00006} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan/10 text-cyan">
                <Satellite size={16} />
              </span>
              <span className="font-display text-sm font-medium text-ink">
                IRIS<span className="text-cyan"> AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-faint">
              InfraRed Intelligent Satellite Enhancement System — AI-powered Earth
              observation for analysts who need clarity at the speed of orbit.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="label-eyebrow">{col.title}</p>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="flex items-center gap-1 text-sm text-ink/70 transition-colors hover:text-cyan"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-hairline py-8 sm:flex-row">
          <p className="font-mono text-[11px] text-ink-faint">
            © {new Date().getFullYear()} IRIS AI · Built for demonstration purposes
          </p>
          <a
            href="https://github.com"
            className="flex items-center gap-1.5 text-xs text-ink-faint hover:text-cyan"
          >
            <Github size={13} /> View source <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </footer>
  );
}
