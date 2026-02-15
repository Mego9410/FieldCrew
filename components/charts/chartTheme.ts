/**
 * Operational Control Board chart theme.
 * Burnt orange primary, navy secondary, thicker lines, darker grid, fewer ticks.
 * Apply to all charts across platform.
 */

export const chartTheme = {
  colors: {
    primary: "#f97316",
    primaryLight: "#fb923c",
    secondary: "#0f172a",
    success: "#059669",
    warning: "#c2410c",
    danger: "#dc2626",
    grid: "#94a3b8",
    gridSubtle: "rgba(148, 163, 184, 0.5)",
    text: "#64748b",
    textStrong: "#0f172a",
  },
  grid: {
    stroke: "#94a3b8",
    strokeDasharray: "3 3",
    strokeOpacity: 0.7,
  },
  tooltip: {
    contentStyle: {
      backgroundColor: "white",
      border: "1px solid #e2e8f0",
      borderRadius: "4px",
      boxShadow: "0 1px 3px rgb(0 0 0 / 0.08)",
      padding: "6px 10px",
      fontSize: "11px",
    },
    labelStyle: {
      color: "#0f172a",
      fontWeight: 600,
    },
  },
  axis: {
    tick: { fontSize: 10, fill: "#64748b" },
    axisLine: false,
    tickLine: false,
    tickCount: 5,
  },
  line: {
    strokeWidth: 3,
    dot: { r: 2 },
    activeDot: { r: 4 },
  },
  bar: {
    radius: [2, 2, 0, 0] as [number, number, number, number],
  },
} as const;

export const dashboardChartTheme = chartTheme;
