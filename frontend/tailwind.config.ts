import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  /**
   * todo: this doesn't actually work.
   * as of now, we preload the classnames using the `<TailwindClassPreloader />` component.
   */
  safelist: [
    "bg-red-500",
    "bg-yellow-500",
    "bg-green-500",
    "bg-orange-500",

    "border-red-500",
    "border-yellow-500",
    "border-green-500",
    "border-orange-500",
    {
      pattern: /bg-(red|green|blue|orange)-(100|500|700)/, // You can display all the colors that you need
      variants: ["lg", "hover", "focus", "lg:hover"], // Optional
    },
  ],
  important: true,
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      maxWidth: {
        "1/2": "50%",
      },
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  textColors: {
    primary: "#000000",
    secondary: "#ffffff",
  },
  colors: {
    primary: "#1370DD",
    primarylight: "#5A97F1",
    secondary: "#ffffff",
    ashberry: "#E6E9EF",
    mulberry: "#C4C9D6",
    blackberry: "#2E2E2E",
  },

  plugins: [],
};
export default config;
