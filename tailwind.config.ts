import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        ivory: "var(--ivory)",
        text: "var(--text)",
        soft: "var(--text-soft)",
        ink: "var(--ink)",
        primary: "var(--primary)",
        accent: "var(--accent)",
        line: "var(--border)",
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        script: ["var(--font-script)", "cursive"],
      },
      borderRadius: { DEFAULT: "2px" },
      maxWidth: { container: "1180px" },
    },
  },
  plugins: [],
};
export default config;
