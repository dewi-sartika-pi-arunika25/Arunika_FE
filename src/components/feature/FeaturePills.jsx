"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { TAG_ICON, FEATURES } from "./data";

export default function FeaturePills({ idx, setIdx, prev, next }) {
  return (
    <div className="lg:pr-4">
      {/* Mobile: horizontal pills */}
      <div
        role="tablist"
        aria-label="Pilih keunggulan Arunika"
        className="
          lg:hidden -mx-4 px-4 overflow-x-auto pb-1.5
          flex items-center gap-2 snap-x snap-mandatory
          scrollbar-thin scrollbar-track-transparent
          scrollbar-thumb-[color:var(--accent-2)]/50
        "
      >
        {FEATURES.map((f, i) => {
          const active = i === idx;
          return (
            <button
              key={f.tag}
              role="tab"
              aria-selected={active}
              onClick={() => setIdx(i)}
              className={`
                snap-center whitespace-nowrap rounded-full border px-3.5 py-1.5 text-sm font-semibold
                transition will-change-transform
                ${active ? "scale-[1.02]" : "opacity-85 hover:opacity-100 hover:-translate-y-[1px]"}
              `}
              style={{
                color: active ? "var(--primary-foreground)" : "var(--text)",
                background: active
                  ? "linear-gradient(90deg, color-mix(in oklab, var(--primary) 95%, black), var(--primary))"
                  : "color-mix(in oklab, var(--accent-3) 18%, transparent)",
                borderColor: active
                  ? "color-mix(in oklab, var(--primary) 40%, transparent)"
                  : "color-mix(in oklab, var(--accent-2) 45%, transparent)",
              }}
            >
              <span className="inline-flex items-center gap-2">
                {TAG_ICON[f.tag]} {f.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Desktop: vertical pills + controls */}
      <div className="hidden lg:block">
        <div className="space-y-2">
          {FEATURES.map((f, i) => {
            const active = i === idx;
            return (
              <button
                key={f.tag}
                role="tab"
                aria-selected={active}
                onClick={() => setIdx(i)}
                className="
                  w-full text-left rounded-xl border px-4 py-3.5
                  transition hover:-translate-y-[1px]
                "
                style={{
                  color: "var(--text)",
                  background: active
                    ? "color-mix(in oklab, var(--accent-3) 24%, transparent)"
                    : "color-mix(in oklab, var(--background) 86%, transparent)",
                  borderColor: active
                    ? "color-mix(in oklab, var(--accent-2) 55%, transparent)"
                    : "var(--border)",
                  boxShadow: active
                    ? "0 10px 24px -14px color-mix(in oklab, var(--primary) 45%, black)"
                    : "none",
                }}
              >
                <span className="inline-flex items-center gap-3 font-semibold">
                  <span
                    className="grid h-8 w-8 place-items-center rounded-lg"
                    style={{
                      background: "color-mix(in oklab, var(--accent-3) 50%, transparent)",
                      color: "var(--primary)",
                    }}
                  >
                    {TAG_ICON[f.tag]}
                  </span>
                  <span>{f.tag}</span>
                </span>
                <div
                  className="mt-1.5 text-sm leading-relaxed"
                  style={{ color: "color-mix(in oklab, var(--text) 78%, transparent)" }}
                >
                  {f.title}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition hover:scale-[1.03] active:scale-95"
              aria-label="Sebelumnya"
              style={{
                color: "var(--text)",
                borderColor: "color-mix(in oklab, var(--text) 35%, transparent)",
                background: "color-mix(in oklab, var(--background) 85%, transparent)",
              }}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border transition hover:scale-[1.03] active:scale-95"
              aria-label="Berikutnya"
              style={{
                color: "var(--text)",
                borderColor: "color-mix(in oklab, var(--text) 35%, transparent)",
                background: "color-mix(in oklab, var(--background) 85%, transparent)",
              }}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {FEATURES.map((_, i) => (
              <span
                key={i}
                className="inline-block h-1.5 rounded-full transition-all"
                style={{
                  width: i === idx ? 18 : 6,
                  background:
                    i === idx
                      ? "linear-gradient(90deg, color-mix(in oklab, var(--primary) 95%, black), var(--primary))"
                      : "color-mix(in oklab, var(--text) 30%, transparent)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
