"use client";

import { ArrowRight } from "lucide-react";
import Progress from "./Progress";

export default function MatchRow({ title, company, score }) {
  return (
    <div className="flex flex-col gap-3 py-5 first:pt-0 border-t first:border-0" style={{ borderColor: "var(--border)" }}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="text-base font-semibold" style={{ color: "var(--text)" }}>{title}</h4>
          <p className="text-sm" style={{ color: "color-mix(in oklab, var(--text) 70%, transparent)" }}>{company}</p>
        </div>
        <a
          href="#"
          className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
          style={{
            background: "linear-gradient(90deg, color-mix(in oklab, var(--primary) 95%, black), var(--primary))",
            boxShadow: "0 10px 26px -14px color-mix(in oklab, var(--primary) 75%, black)"
          }}
        >
          Pelajari
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
      <div className="flex items-center gap-3">
        <Progress value={score} />
        <span className="w-16 text-right text-xs" style={{ color: "color-mix(in oklab, var(--text) 70%, transparent)" }}>
          {score}%
        </span>
      </div>
    </div>
  );
}
