"use client";
import { memo } from "react";

function StepChip({ children, icon }) {
  return (
    <span
      className={[
        "relative group inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full",
        "border transition-all duration-300",
        "border-[color-mix(in_oklab,var(--text)_22%,transparent)]",
        "text-[color-mix(in_oklab,var(--text)_92%,transparent)]",
        "bg-transparent",
        "hover:bg-[#ff8300] hover:text-white",
        "hover:shadow-[0_0_18px_rgba(255,131,0,0.45)]"
      ].join(" ")}
    >
      {icon ? <span className="h-4 w-4">{icon}</span> : null}
      <span className="text-sm font-semibold tracking-wide">{children}</span>
      <span className="pointer-events-none absolute -top-1 -left-1 h-1.5 w-1.5 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 animate-ping" />
      <span className="pointer-events-none absolute -bottom-1 -right-1 h-1.5 w-1.5 rounded-full bg-white/90 opacity-0 group-hover:opacity-100 animate-ping" />
    </span>
  );
}

export default memo(StepChip);
