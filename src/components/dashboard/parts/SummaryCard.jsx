"use client";

import {
  Target,
  Wrench,
  Sparkles,
  NotebookText,
} from "lucide-react";

/**
 * SummaryCard - tampilan ringkas bergaya dashboard.
 *
 * Props:
 * - type: "role" | "gaps" | "strengths" | "analysis"
 * - title: string
 * - items:
 *   - role:        [{ title, score?: number }]
 *   - gaps:        [{ title, tags?: string[], href?: string, onClick?: () => void }]
 *   - strengths:   [{ title, note?: string }]
 *   - analysis:    [{ label, value }]
 * - compact: boolean (default: true) -> padding lebih kecil
 * - maxItems: number (default: 2 untuk role/gaps/strengths, 3 untuk analysis)
 * - className: string
 */

const ICONS = {
  strengths: Sparkles,
  gaps: Wrench,
  analysis: NotebookText,
  role: Target,
};

function Chip({ children }) {
  return (
    <span
      className="inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-semibold"
      style={{
        color: "color-mix(in oklab, var(--text) 78%, transparent)",
        background: "color-mix(in oklab, var(--accent-3) 26%, transparent)",
      }}
    >
      {children}
    </span>
  );
}

export default function SummaryCard({
  type = "analysis",
  title = "",
  items = [],
  compact = true,
  maxItems,
  className = "",
}) {
  const Icon = ICONS[type] ?? NotebookText;

  // batas default biar ringkas
  const defaultMax = type === "analysis" ? 3 : 2;
  const limit = typeof maxItems === "number" ? maxItems : defaultMax;
  const data = Array.isArray(items) ? items.slice(0, limit) : [];

  const padCls = compact ? "p-4 sm:p-5" : "p-5 sm:p-6 lg:p-7";

  return (
    <section
      className={[
        "rounded-2xl border bg-[#FFFDF4]/92 shadow-sm",
        "transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]",
        "focus-within:ring-2 focus-within:ring-[var(--ring)]",
        padCls,
        className,
      ].join(" ")}
      style={{ borderColor: "color-mix(in oklab, var(--primary) 32%, transparent)" }}
      tabIndex={0}
      aria-label={title}
    >
      {/* header */}
      <div className="mb-3 flex items-center gap-2.5">
        <Icon className="h-4 w-4" style={{ color: "var(--primary)" }} />
        <h3 className="text-sm font-semibold" style={{ color: "var(--text)" }}>
          {title}
        </h3>
      </div>

      {/* content */}
      {type === "strengths" && (
        <ul className="space-y-3">
          {data.map((it, idx) => (
            <li
              key={idx}
              className="rounded-xl border px-3 py-2.5 transition hover:bg-[#FFF6E5]"
              style={{ borderColor: "color-mix(in oklab, var(--primary) 20%, transparent)" }}
            >
              <div className="flex items-start gap-2.5">
                <span
                  className="mt-[4px] inline-grid h-4 w-4 place-items-center rounded-full"
                  style={{ background: "var(--primary)" }}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                    {it.title}
                  </div>
                  {it.note && (
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "color-mix(in oklab, var(--text) 72%, transparent)" }}
                    >
                      {it.note}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {type === "gaps" && (
        <ul className="space-y-2.5">
          {data.map((it, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition hover:bg-[#FFF6E5]"
              style={{ borderColor: "color-mix(in oklab, var(--primary) 20%, transparent)" }}
            >
              <div>
                <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  {it.title}
                </div>
                {!!(it.tags?.length) && (
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {it.tags.map((tg, i) => (
                      <Chip key={i}>{tg}</Chip>
                    ))}
                  </div>
                )}
              </div>

              {(it.onClick || it.href) && (
                <button
                  onClick={it.onClick}
                  {...(it.href ? { as: "a", href: it.href } : {})}
                  className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white transition hover:opacity-95"
                  style={{
                    background:
                      "linear-gradient(90deg, color-mix(in oklab, var(--primary) 95%, black), var(--primary))",
                  }}
                >
                  Pelajari
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {type === "analysis" && (
        <div className="space-y-2.5">
          {data.map((row, i) => (
            <div
              key={i}
              className="rounded-xl border px-3.5 py-2.5"
              style={{
                borderColor: "color-mix(in oklab, var(--primary) 20%, transparent)",
                background: "rgba(255,165,0,0.08)", // orange wash halus
              }}
            >
              <div className="text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>
                {row.label}
              </div>
              <div className="text-sm" style={{ color: "color-mix(in oklab, var(--text) 80%, transparent)" }}>
                {row.value}
              </div>
            </div>
          ))}
        </div>
      )}

      {type === "role" && (
        <ul className="space-y-2.5">
          {data.map((it, idx) => (
            <li
              key={idx}
              className="rounded-xl border px-3.5 py-3"
              style={{ borderColor: "color-mix(in oklab, var(--primary) 20%, transparent)" }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-sm font-semibold" style={{ color: "var(--text)" }}>
                  {it.title}
                </div>
                {typeof it.score === "number" && (
                  <span
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                    style={{ background: "var(--primary)" }}
                  >
                    {it.score}%
                  </span>
                )}
              </div>
              {/* progress mini (opsional jika ada score) */}
              {typeof it.score === "number" && (
                <div className="mt-2 h-1.5 w-full rounded-full bg-black/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${it.score}%`,
                      background:
                        "linear-gradient(90deg, color-mix(in oklab, var(--primary) 95%, black), var(--primary))",
                    }}
                  />
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
