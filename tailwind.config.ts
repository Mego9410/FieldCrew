import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        landing: {
          bg: "var(--landing-bg)",
          surface: "var(--landing-surface)",
          white: "var(--landing-text)",
          muted: "var(--landing-text-muted)",
          accent: "var(--landing-accent)",
        },
        fc: {
          brand: "var(--fc-brand)",
          accent: "var(--fc-accent)",
          "accent-dark": "var(--fc-accent-dark)",
          muted: "var(--fc-muted)",
          "muted-strong": "var(--fc-muted-strong)",
          surface: "var(--fc-surface)",
          border: "var(--fc-border)",
          "border-subtle": "var(--fc-border-subtle)",
          "gradient-start": "var(--fc-gradient-start)",
          "gradient-mid": "var(--fc-gradient-mid)",
          "gradient-end": "var(--fc-gradient-end)",
          "navy-950": "var(--fc-navy-950)",
          "navy-900": "var(--fc-navy-900)",
          "navy-800": "var(--fc-navy-800)",
          "steel-500": "var(--fc-steel-500)",
          "steel-600": "var(--fc-steel-600)",
          "orange-500": "var(--fc-orange-500)",
          "orange-600": "var(--fc-orange-600)",
          "app-sidebar": "var(--fc-nav-sidebar)",
          "app-header": "#0f172a",
          "nav-sidebar": "var(--fc-nav-sidebar)",
          "app-surface": "var(--fc-bg-page)",
          success: "var(--fc-success)",
          "success-bg": "var(--fc-success-bg)",
          warning: "var(--fc-warning)",
          "warning-bg": "var(--fc-warning-bg)",
          danger: "var(--fc-danger)",
          "danger-bg": "var(--fc-danger-bg)",
          info: "var(--fc-info)",
          "info-bg": "var(--fc-info-bg)",
          neutral: "var(--fc-neutral)",
          "neutral-bg": "var(--fc-neutral-bg)",
        },
      },
      backgroundColor: {
        "fc-page": "var(--fc-bg-page)",
        "fc-surface": "var(--fc-surface)",
        "fc-surface-muted": "var(--fc-surface-muted)",
      },
      boxShadow: {
        "fc-sm": "var(--fc-shadow-sm)",
        "fc-md": "var(--fc-shadow-md)",
        "fc-lg": "var(--fc-shadow-lg)",
        "fc-hero": "var(--fc-shadow-hero)",
        "fc-panel": "var(--fc-shadow-panel)",
        "fc-panel-lg": "var(--fc-shadow-panel-lg)",
      },
      borderRadius: {
        "fc": "var(--fc-radius)",
        "fc-lg": "var(--fc-radius-lg)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, var(--fc-gradient-start) 0%, var(--fc-gradient-mid) 50%, var(--fc-gradient-end) 100%)",
        "gradient-hero": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "gradient-cta-navy": "linear-gradient(180deg, #0f172a 0%, #0a0f1a 100%)",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        "legend-display": ["var(--font-legend-display)", "var(--font-display)", "system-ui", "sans-serif"],
        "legend-body": ["var(--font-legend-body)", "system-ui", "sans-serif"],
        "console-display": ["var(--font-console-display)", "Oswald", "ui-monospace", "monospace"],
        "console-mono": ["var(--font-console-mono)", "ui-monospace", "monospace"],
      },
      transitionDuration: {
        "fc": "150ms",
        "fc-slow": "200ms",
        "legend-short": "300ms",
        "legend-medium": "600ms",
        "legend-large": "1200ms",
      },
      transitionTimingFunction: {
        legend: "var(--legend-ease)",
      },
      backgroundImage: {
        "legend-gradient-primary": "linear-gradient(135deg, var(--legend-accent-start) 0%, var(--legend-accent-end) 100%)",
        "legend-gradient-secondary": "linear-gradient(135deg, var(--legend-accent-secondary-start) 0%, var(--legend-accent-secondary-end) 100%)",
      },
      boxShadow: {
        "legend-panel": "var(--legend-shadow-panel)",
        "legend-glow": "0 0 60px rgba(91, 124, 255, 0.25)",
      },
      animation: {
        "legend-float": "legend-float 8s ease-in-out infinite",
        "legend-glow-pulse": "legend-glow-pulse 4s ease-in-out infinite",
      },
      keyframes: {
        "legend-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "legend-glow-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
