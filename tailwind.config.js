/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: {
          dark: "#080c14",
          subtle: "#0d131f",
          panel: "#121b2b",
          border: "#1e293b",
          borderSubtle: "#172234",
          active: "#38bdf8",
        },
        node: {
          trigger: "#f59e0b",
          llm: "#8b5cf6",
          condition: "#0ea5e9",
          transform: "#10b981",
          http: "#3b82f6",
          output: "#f43f5e",
        },
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        }
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.4)",
        card: "0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)",
        glow: "0 0 25px -5px rgba(56, 189, 248, 0.35)",
        "glow-trigger": "0 0 20px -4px rgba(245, 158, 11, 0.35)",
        "glow-llm": "0 0 20px -4px rgba(139, 92, 246, 0.35)",
        "glow-condition": "0 0 20px -4px rgba(14, 165, 233, 0.35)",
        "glow-transform": "0 0 20px -4px rgba(16, 185, 129, 0.35)",
        "glow-http": "0 0 20px -4px rgba(59, 130, 246, 0.35)",
        "glow-output": "0 0 20px -4px rgba(244, 63, 94, 0.35)",
        "glow-success": "0 0 20px -4px rgba(34, 197, 94, 0.4)",
        "glow-error": "0 0 20px -4px rgba(239, 68, 68, 0.4)",
        "glow-running": "0 0 20px -4px rgba(56, 189, 248, 0.5)",
      },
      animation: {
        pulseFast: "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        borderFlow: "borderFlow 2s ease infinite",
      }
    },
  },
  plugins: [],
}

