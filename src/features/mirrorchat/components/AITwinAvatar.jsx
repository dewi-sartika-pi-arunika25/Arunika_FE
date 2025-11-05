"use client";

export default function AITwinAvatar({ size = 40, active = false }) {
  return (
    <div
      className="rounded-full grid place-items-center relative"
      style={{ width: size, height: size }}
    >
      {/* glow */}
      <div
        className={`absolute inset-0 rounded-full blur-md transition-opacity ${
          active ? "opacity-100" : "opacity-0"
        }`}
        style={{
          background:
            "radial-gradient(60% 60% at 50% 50%, rgba(124,58,237,.7), transparent)",
        }}
      />
      {/* disc + conic ring */}
      <div
        className="relative rounded-full bg-white/70 border border-[color:var(--mc-border)] grid place-items-center shadow-sm"
        style={{ width: size - 6, height: size - 6 }}
      >
        <div
          className="absolute -inset-[2px] rounded-full"
          style={{
            background:
              "conic-gradient(from 0deg, rgba(124,58,237,.55), transparent 40%, rgba(245,158,11,.5))",
            animation: active ? "mcSpinSlow 6s linear infinite" : "none",
          }}
        />
        <div className="absolute inset-[2px] rounded-full bg-white" />
        <span className="relative text-[12px] tracking-wide">AI</span>
      </div>
    </div>
  );
}
