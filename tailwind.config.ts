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
        // NatureMama Heritage brand palette
        sage: {
          50:  "#f4f7f4",
          100: "#e6ede6",
          200: "#cddccd",
          300: "#a8c2a8",
          400: "#7da17d",
          500: "#5a825a", // primary sage green
          600: "#476847",
          700: "#3a543a",
          800: "#304430",
          900: "#293929",
        },
        earth: {
          50:  "#faf6f2",
          100: "#f2e9df",
          200: "#e4d0bc",
          300: "#d2b090",
          400: "#be8d65",
          500: "#a97248", // primary earth brown
          600: "#8f5d3a",
          700: "#764b31",
          800: "#623f2c",
          900: "#533628",
        },
        natural: {
          50:  "#fdfcfb",
          100: "#f9f6f2", // natural white / off-white
          200: "#f0ebe3",
          300: "#e4dbd0",
          400: "#d4c9ba",
          500: "#bfb09e",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
      animation: {
        "fade-up":    "fadeUp 0.8s ease-out forwards",
        "fade-in":    "fadeIn 1s ease-out forwards",
        "slide-left": "slideLeft 0.6s ease-out forwards",
        "ken-burns":  "kenBurns 20s ease-in-out infinite alternate",
        "ticker":     "ticker 30s linear infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideLeft: {
          "0%":   { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        kenBurns: {
          "0%":   { transform: "scale(1.0) translate(0%, 0%)" },
          "100%": { transform: "scale(1.08) translate(-2%, -1%)" },
        },
        ticker: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
      transitionTimingFunction: {
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
