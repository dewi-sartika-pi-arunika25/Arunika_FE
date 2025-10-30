"use client";

import { ChevronDown } from "lucide-react";
import Progress from "./Progress";
import Collapse from "./Collapse";

export default function SkillRow({ open = false, onToggle, skill, level, tags = [], summary, learnItems = [] }) {
  return (
    <div className="flex flex-col gap-3 py-5 first:pt-0 border-t first:border-0" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h4 className="text-base font-semibold truncate" style={{ color: "var(--text)" }}>{skill}</h4>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            {tags.map((t, i) => (
              <span
                key={i}
                className="inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={{
                  color: "color-mix(in oklab, var(--text) 86%, transparent)",
                  border: "1px solid",
                  borderColor: "color-mix(in oklab, var(--text) 22%, transparent)",
                  background: "color-mix(in oklab, var(--background) 90%, transparent)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        <button
          onClick={onToggle}
          className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          style={{
            background: "linear-gradient(90deg, color-mix(in oklab, var(--primary) 95%, black), var(--primary))",
            boxShadow: "0 10px 26px -14px color-mix(in oklab, var(--primary) 75%, black)",
          }}
          aria-expanded={open}
        >
          Pelajari
          <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Progress value={level} />
        <span className="w-16 text-right text-xs" style={{ color: "color-mix(in oklab, var(--text) 70%, transparent)" }}>
          {level}%
        </span>
      </div>

      <Collapse open={open}>
        <div
          className="mt-2 rounded-xl p-4"
          style={{
            background: "linear-gradient(180deg, color-mix(in oklab, var(--accent-3) 30%, transparent), transparent)",
            border: "1px solid",
            borderColor: "color-mix(in oklab, var(--text) 14%, transparent)",
          }}
        >
          <p className="text-sm" style={{ color: "color-mix(in oklab, var(--text) 80%, transparent)" }}>{summary}</p>
          {learnItems.length > 0 && (
            <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
              {learnItems.map((li, i) => (
                <li key={i} className="flex items-start gap-2" style={{ color: "color-mix(in oklab, var(--text) 78%, transparent)" }}>
                  <span className="mt-1 h-1.5 w-1.5 rounded-full" style={{ background: "var(--primary)" }} />
                  <span>{li}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Collapse>
    </div>
  );
}
