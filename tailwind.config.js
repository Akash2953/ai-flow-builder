/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        canvas: {
          dark: "#0b0f17",
          subtle: "#111827",
          panel: "#161f30",
          border: "#1f2e48",
          active: "#38bdf8",
        },
        brand: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
        }
      },
      boxShadow: {
        glow: "0 0 20px -5px rgba(56, 189, 248, 0.3)",
        "glow-success": "0 0 20px -5px rgba(34, 197, 94, 0.4)",
        "glow-error": "0 0 20px -5px rgba(239, 68, 68, 0.4)",
        "glow-running": "0 0 20px -5px rgba(168, 85, 247, 0.5)",
      },
      animation: {
        pulseFast: "pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      }
    },
  },
  plugins: [],
}
