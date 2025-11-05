"use client";

export default function ThemeAdapter({ children }) {
  return (
    <div
      style={{
        ["--mc-bg"]: "linear-gradient(180deg,#FFFDF4 0%,#F8F4EB 100%)",
        ["--mc-panel"]: "rgba(255,255,255,0.75)",
        ["--mc-border"]: "rgba(0,0,0,0.08)",
        ["--mc-primary"]: "#FF8300",
        ["--mc-text"]: "#2B2B2B",
      }}
    >
      {children}
    </div>
  );
}
