"use client";

export default function Progress({ value }) {
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full"
      style={{ background: "color-mix(in oklab, var(--accent-3) 35%, transparent)" }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${value}%`,
          background:
            "linear-gradient(90deg, color-mix(in oklab, var(--primary) 95%, black), var(--primary))",
          boxShadow: "0 6px 20px -8px color-mix(in oklab, var(--primary) 70%, black)",
        }}
      />
    </div>
  );
}
