import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#06080D",
        panel: "#0A0E18",
        "panel-2": "#0D1322",
        hairline: "rgba(167, 192, 230, 0.12)",
        cyan: {
          DEFAULT: "#2EE6FF",
          dim: "#0FB8D4",
        },
        green: {
          DEFAULT: "#34F5A8",
          dim: "#1FAE7B",
        },
        violet: {
          DEFAULT: "#7C5CFF",
        },
        amber: {
          DEFAULT: "#FFB454",
        },
        ink: {
          DEFAULT: "#E9F1FB",
          dim: "#8FA3C2",
          faint: "#5A6C8C",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        aurora:
          "radial-gradient(60% 50% at 20% 0%, rgba(124,92,255,0.18) 0%, transparent 60%), radial-gradient(50% 40% at 85% 10%, rgba(46,230,255,0.14) 0%, transparent 60%), radial-gradient(40% 30% at 50% 100%, rgba(52,245,168,0.08) 0%, transparent 60%)",
        grid: "linear-gradient(rgba(167,192,230,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(167,192,230,0.06) 1px, transparent 1px)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(46,230,255,0.15), 0 0 24px rgba(46,230,255,0.18)",
        "glow-green": "0 0 0 1px rgba(52,245,168,0.15), 0 0 24px rgba(52,245,168,0.18)",
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 0 0 1px rgba(167,192,230,0.08)",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.2" },
          "50%": { opacity: "1" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.8" },
          "100%": { transform: "scale(1.8)", opacity: "0" },
        },
      },
      animation: {
        twinkle: "twinkle 3.5s ease-in-out infinite",
        scan: "scan 3s linear infinite",
        "spin-slow": "spin-slow 18s linear infinite",
        "spin-slower": "spin-slow 38s linear infinite",
        marquee: "marquee 28s linear infinite",
        "pulse-ring": "pulse-ring 2.2s cubic-bezier(0.2,0.6,0.4,1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
