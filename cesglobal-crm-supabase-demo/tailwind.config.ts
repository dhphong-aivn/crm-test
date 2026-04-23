import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm parchment palette from DESIGN.md (Anthropic Claude inspired)
        parchment: "#f5f4ed",
        ivory: "#faf9f5",
        "warm-sand": "#e8e6dc",
        "near-black": "#141413",
        "dark-surface": "#30302e",
        terracotta: "#c96442",
        coral: "#d97757",
        "charcoal-warm": "#4d4c48",
        "olive-gray": "#5e5d59",
        "stone-gray": "#87867f",
        "dark-warm": "#3d3d3a",
        "warm-silver": "#b0aea5",
        "border-cream": "#f0eee6",
        "border-warm": "#e8e6dc",
        "ring-warm": "#d1cfc5",
        "focus-blue": "#3898ec",
        "error-crimson": "#b53333",
      },
      fontFamily: {
        headline: ["Newsreader", "Lora", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      borderRadius: {
        pill: "9999px",
      },
      boxShadow: {
        whisper: "rgba(0,0,0,0.05) 0px 4px 24px",
        "ring-warm": "0 0 0 1px #e8e6dc",
        "ring-deep": "0 0 0 1px #d1cfc5",
      },
    },
  },
  plugins: [],
};

export default config;
