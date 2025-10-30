"use client";

export default function Tabs({ items, active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className="rounded-full px-4 py-2 text-sm font-semibold border transition-all"
          style={{
            color: active === t.key ? "var(--text)" : "color-mix(in oklab, var(--text) 78%, transparent)",
            borderColor: active === t.key ? "color-mix(in oklab, var(--accent-2) 55%, transparent)" : "var(--border)",
            background: active === t.key ? "color-mix(in oklab, var(--accent-3) 22%, transparent)" : "transparent"
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
