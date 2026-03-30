import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.mdx",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        chart: {
          "1": "var(--chart-1)",
          "2": "var(--chart-2)",
          "3": "var(--chart-3)",
          "4": "var(--chart-4)",
          "5": "var(--chart-5)",
        },
        sidebar: {
          DEFAULT: "var(--sidebar)",
          foreground: "var(--sidebar-foreground)",
          primary: "var(--sidebar-primary)",
          "primary-foreground": "var(--sidebar-primary-foreground)",
          accent: "var(--sidebar-accent)",
          "accent-foreground": "var(--sidebar-accent-foreground)",
          border: "var(--sidebar-border)",
          ring: "var(--sidebar-ring)",
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
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
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
        "console-display": ["var(--font-console-display)", "Oswald", "ui-monospace", "monospace"],
        "console-mono": ["var(--font-console-mono)", "ui-monospace", "monospace"],
      },
      transitionDuration: {
        "fc": "150ms",
        "fc-slow": "200ms",
      },
      keyframes: {
        /** Soft invite pulse for interactive demo tabs (marketing). */
        "fc-demo-tab-idle": {
          "0%, 100%": {
            boxShadow:
              "0 1px 2px rgb(15 23 42 / 0.05), 0 0 0 0 rgb(249 115 22 / 0)",
          },
          "50%": {
            boxShadow:
              "0 1px 3px rgb(15 23 42 / 0.06), 0 0 0 3px rgb(249 115 22 / 0.11)",
          },
        },
        "fc-demo-tab-active": {
          "0%, 100%": {
            boxShadow:
              "0 1px 2px rgb(15 23 42 / 0.08), 0 0 0 0 rgb(249 115 22 / 0.35)",
          },
          "50%": {
            boxShadow:
              "0 2px 8px rgb(249 115 22 / 0.28), 0 0 0 2px rgb(249 115 22 / 0.12)",
          },
        },
        /** Login page staggered reveal */
        "fc-login-left": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fc-login-right": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fc-demo-tab-idle": "fc-demo-tab-idle 2.6s ease-in-out infinite",
        "fc-demo-tab-active": "fc-demo-tab-active 2.6s ease-in-out infinite",
        "fc-login-left":
          "fc-login-left 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards",
        "fc-login-right":
          "fc-login-right 0.55s cubic-bezier(0.22, 1, 0.36, 1) 0.14s forwards",
      },
    },
  },
  plugins: [typography],
};

export default config;
