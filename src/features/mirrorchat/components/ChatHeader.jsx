"use client";

export default function ChatHeader({ name }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-baseline gap-2">
        <span className="text-[13px] font-semibold uppercase tracking-[.18em]"
              style={{ color: "color-mix(in oklab, var(--text) 70%, transparent)" }}>
          Arunika MirrorChat
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: "color-mix(in oklab, var(--accent-3) 55%, #fff)",
                color: "color-mix(in oklab, var(--text) 82%, transparent)",
                border: "1px solid color-mix(in oklab, var(--accent-3) 75%, transparent)"
              }}>
          {name}
        </span>
      </div>
      <div className="hidden sm:block text-sm"
           style={{ color: "color-mix(in oklab, var(--text) 70%, transparent)" }}>
        AI Twin untuk refleksi karir dan skill plan
      </div>
    </div>
  );
}
