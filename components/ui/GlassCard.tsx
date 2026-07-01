"use client";

import { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  frame?: boolean;
  glow?: "cyan" | "green" | "none";
}

export function GlassCard({
  children,
  className,
  frame = true,
  glow = "none",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-6 transition-shadow duration-300",
        frame && "corner-frame",
        glow === "cyan" && "hover:shadow-glow",
        glow === "green" && "hover:shadow-glow-green",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
