"use client";

const SCALE = [1,2,3,4,5];

export default function QuestionScale({ value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {SCALE.map((v) => {
        const active = Number(value) === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange?.(v)}
            className={`w-10 h-10 rounded-full border flex items-center justify-center text-sm font-semibold transition ${active ? "text-white" : "text-neutral-700"}`}
            style={{
              background: active ? "linear-gradient(135deg,var(--accent-1),var(--primary))" : "white",
              borderColor: active ? "transparent" : "#e5e7eb",
              boxShadow: active ? "0 6px 16px rgba(255,131,0,.25)" : "none",
            }}
            aria-pressed={active}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}
