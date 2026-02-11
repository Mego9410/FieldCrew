import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        fc: {
          brand: "#0f172a",
          accent: "#6366f1",
          "accent-dark": "#4f46e5",
          muted: "#64748b",
          surface: "#ffffff",
          border: "#e2e8f0",
          "gradient-start": "#6366f1",
          "gradient-mid": "#8b5cf6",
          "gradient-end": "#ec4899",
        },
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, var(--fc-gradient-start) 0%, var(--fc-gradient-mid) 50%, var(--fc-gradient-end) 100%)",
        "gradient-hero": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-cta": "linear-gradient(135deg, #667eea 0%, #f093fb 50%, #f5576c 100%)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
