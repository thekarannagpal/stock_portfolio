import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        finance: {
          dark: "#0b0f19",
          card: "#111827",
          border: "#1f2937",
          green: "#10b981",
          greenLight: "#d1fae5",
          greenDark: "#065f46",
          red: "#f43f5e",
          redLight: "#ffe4e6",
          redDark: "#9f1239",
          blue: "#3b82f6",
          purple: "#8b5cf6",
          amber: "#f59e0b"
        }
      },
      keyframes: {
        flashGreen: {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "rgba(16, 185, 129, 0.25)" },
        },
        flashRed: {
          "0%, 100%": { backgroundColor: "transparent" },
          "50%": { backgroundColor: "rgba(244, 63, 94, 0.25)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.4" },
        }
      },
      animation: {
        flashGreen: "flashGreen 1.5s ease-in-out",
        flashRed: "flashRed 1.5s ease-in-out",
        pulseGlow: "pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
