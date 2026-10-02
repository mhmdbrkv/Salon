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
        brand: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          950: "#451a03",
        },
        barber: {
          dark: "#0F141C",
          card: "#161D2A",
          cardLight: "#1F2839",
          border: "#2A364F",
          subtle: "#94A3B8",
          text: "#F8FAFC",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        "gold-glow": "0 0 25px -5px rgba(217, 119, 6, 0.3)",
        "card-subtle": "0 4px 20px -2px rgba(0, 0, 0, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;
