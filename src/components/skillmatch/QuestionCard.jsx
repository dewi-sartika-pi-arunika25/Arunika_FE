"use client";

import Pill from "@/components/ui/Pill";
import QuestionScale from "./QuestionScale";

export default function QuestionCard({ question, value, onChange }) {
  return (
    <div className="rounded-xl border bg-white/80 shadow-sm p-4 sm:p-5">
      <p className="font-semibold mb-3">{question.id}. {question.text}</p>
      <div className="flex flex-wrap items-center gap-2">
        <QuestionScale value={value} onChange={(v)=>onChange?.(question.id, v)} />
        <div className="ml-auto flex items-center gap-3 text-xs text-neutral-600">
          <span>Tidak Setuju</span>
          <Pill>Netral</Pill>
          <span>Sangat Setuju</span>
        </div>
      </div>
    </div>
  );
}
