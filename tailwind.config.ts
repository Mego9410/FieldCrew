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
          brand: "var(--fc-brand)",
          accent: "var(--fc-accent)",
          "accent-dark": "var(--fc-accent-dark)",
          muted: "var(--fc-muted)",
          surface: "var(--fc-surface)",
          border: "var(--fc-border)",
          "border-subtle": "var(--fc-border-subtle)",
          "gradient-start": "var(--fc-gradient-start)",
          "gradient-mid": "var(--fc-gradient-mid)",
          "gradient-end": "var(--fc-gradient-end)",
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
      },
      transitionDuration: {
        "fc": "150ms",
        "fc-slow": "200ms",
      },
    },
  },
  plugins: [],
};

export default config;
