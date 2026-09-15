import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: "#090A0E", // Background foundation
          925: "#0C0F14", // Sidebar background
          900: "#10141B", // Surface
          850: "#121720", // Surface hover
          800: "#151A22", // Elevated surface
          750: "#19202B", // Elevated hover
          700: "#1D222D", // Primary Border
          600: "#28303F", // Interactive Border
          500: "#626A78", // Muted text / quiet line numbers / technical notes
          400: "#9CA3AF", // Secondary text / labels
          300: "#D1D5DB", // Body text
          200: "#E5E7EB", // High contrast text
          50:  "#F3F4F6", // Primary pure text
        },
        accent: {
          DEFAULT: "#10B981", // Disciplined Emerald accent
          glow: "#34D399",
          dark: "#059669",
          muted: "rgba(16, 185, 129, 0.12)",
          subtle: "rgba(16, 185, 129, 0.08)",
        },
        rhyme: {
          perfect: "#10B981", // Emerald
          strong: "#F59E0B",  // Amber
          near: "#8B5CF6",    // Purple
          cadence: "#06B6D4", // Cyan
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "Fira Code", "monospace"],
        devanagari: ["var(--font-devanagari)", "Noto Sans Devanagari", "Mangal", "sans-serif"],
      },
      boxShadow: {
        "glow-emerald": "0 0 20px -3px rgba(16, 185, 129, 0.2)",
        "glow-subtle": "0 0 12px -2px rgba(16, 185, 129, 0.1)",
        "panel": "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
      },
      animation: {
        'fade-in': 'fadeIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-up': 'slideUp 200ms cubic-bezier(0.16, 1, 0.3, 1)',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
