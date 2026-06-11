import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "var(--bg)",
        surface: "var(--surface)",
        hairline: "var(--hairline)",
        ink: "var(--text-primary)",
        muted: "var(--text-muted)",
        accent: "var(--accent-primary)",
        risk: "var(--risk)",
      },
      fontFamily: {
        headline: ["Georgia", "Charter", "Source Serif Pro", "serif"],
        body: ["Inter", "Arial", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
