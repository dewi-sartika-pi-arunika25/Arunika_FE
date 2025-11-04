"use client";
export default function ThemeAdapter({ children }) {
  const style = {
    "--mc-primary": "#ff8300",
    "--mc-bg": "var(--background)",
    "--mc-text": "var(--text)",
    "--mc-muted": "color-mix(in oklab, var(--text) 72%, transparent)",
    "--mc-surface": "color-mix(in oklab, var(--background) 95%, var(--accent-3))",
    "--mc-border": "color-mix(in oklab, var(--text) 18%, transparent)",
  };
  return <div style={style}>{children}</div>;
}
