"use client";

import { ButtonHTMLAttributes, ReactNode, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GlowButtonProps
  extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
  > {
  children: ReactNode;
  variant?: "primary" | "ghost";
  icon?: ReactNode;
}

export function GlowButton({
  children,
  variant = "primary",
  icon,
  className,
  ...props
}: GlowButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
    el.style.transform = `translate(${x}px, ${y}px)`;
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (el) el.style.transform = "translate(0px, 0px)";
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.96 }}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full px-6 py-3 font-medium text-sm transition-all duration-200 ease-out",
        variant === "primary" &&
          "bg-cyan text-void shadow-glow hover:shadow-[0_0_0_1px_rgba(46,230,255,0.4),0_0_40px_rgba(46,230,255,0.4)]",
        variant === "ghost" &&
          "border border-hairline text-ink hover:border-cyan/50 hover:text-cyan bg-white/[0.02]",
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </motion.button>
  );
}
