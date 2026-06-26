import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Violet-tinted near-black base so the dark never reads as flat gray.
        ink: {
          DEFAULT: "#07060D",
          raised: "#0D0B16",
        },
        surface: "#14101F",
        // LazyType brand palette — matches the macOS app accent.
        brand: {
          DEFAULT: "#6B5CF5",
          light: "#A855F7",
          dark: "#4F46E5",
        },
        // Pulled straight from the orb shader so hero + palette agree.
        voice: "#43E0D8",
        lavender: {
          DEFAULT: "#9A93B5",
          faint: "#6E6884",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "72rem",
      },
      keyframes: {
        caret: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "0% 50%" },
          "100%": { backgroundPosition: "200% 50%" },
        },
      },
      animation: {
        caret: "caret 1.1s steps(1) infinite",
        "float-slow": "float-slow 7s ease-in-out infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
