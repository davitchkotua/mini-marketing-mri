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
          DEFAULT: "#0B0F14",
          soft: "#1A1F26",
          muted: "#5B6470",
        },
        paper: "#F7F5F0",
        line: "#E5E1D8",
        accent: {
          DEFAULT: "#0E5B4F",
          hover: "#0A463C",
        },
        warn: "#B45309",
      },
      maxWidth: {
        prose: "62ch",
      },
    },
  },
  plugins: [],
};

export default config;
