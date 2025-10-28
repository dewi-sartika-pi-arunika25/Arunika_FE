"use client";

export default function Stat({ icon: Icon, value, label }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--primary) 84%, white), color-mix(in oklab, var(--primary) 54%, transparent))",
          boxShadow: "0 8px 22px -12px color-mix(in oklab, var(--primary) 60%, black)",
        }}
      >
        {Icon && <Icon className="h-5 w-5" />}
      </div>

      <div>
        <div className="text-2xl font-extrabold leading-none" style={{ color: "var(--text)" }}>
          {value}
        </div>
        <p
          className="mt-1 text-sm leading-relaxed"
          style={{ color: "color-mix(in oklab, var(--text) 75%, transparent)" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}
