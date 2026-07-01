"use client";

import { useCountUp } from "@/hooks/useCountUp";

interface AnimatedCounterProps {
  value: number;
  decimals?: number;
  suffix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  decimals = 1,
  suffix = "",
  className,
}: AnimatedCounterProps) {
  const { ref, value: current } = useCountUp(value);

  return (
    <span ref={ref} className={className}>
      {current.toFixed(decimals)}
      {suffix}
    </span>
  );
}
