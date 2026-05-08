import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans Georgian"', '"Inter"', "system-ui", "sans-serif"],
      },
      colors: {
        ink: {
          DEFAULT: "#FFFFFF",
          soft: "#D4D4D4",
          muted: "#6B6B6B",
        },
        paper: "#170303",
        line: "#333333",
        accent: {
          DEFAULT: "#FFB21A",
          hover: "#F7C25E",
        },
        warn: "#FFB21A",
      },
      maxWidth: {
        prose: "62ch",
      },
    },
  },
  plugins: [],
};

export default config;
