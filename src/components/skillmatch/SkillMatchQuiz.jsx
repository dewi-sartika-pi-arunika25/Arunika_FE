"use client";

import { useMemo, useState } from "react";
import { questions } from "@/lib/skill/questions";
import { computeFit, computeScore, topStrengths } from "@/lib/skill/score";
import ProgressBar from "@/components/ui/ProgressBar";
import Modal from "@/components/ui/Modal";
import QuestionCard from "./QuestionCard";
import ResultCard from "./ResultCard";
import { Check } from "lucide-react";

export default function SkillMatchQuiz() {
  const [answers, setAnswers] = useState({});
  const [open, setOpen] = useState(false);

  const total = questions.length;
  const answered = Object.keys(answers).length;

  const { traitAvg, bestTrait, role, bestScore } = useMemo(
    () => computeScore(questions, answers),
    [answers]
  );

  const fit = useMemo(
    () => computeFit(bestScore || 0, answered, total),
    [bestScore, answered, total]
  );

  const strengths = useMemo(() => topStrengths(traitAvg), [traitAvg]);

  function submit(e) {
    e.preventDefault();
    if (answered < total) return;
    setOpen(true);
  }

  function setValue(id, v) {
    setAnswers((s) => ({ ...s, [id]: v }));
  }

  return (
    <section className="max-w-3xl mx-auto mt-8">
      <div className="p-4 sm:p-5 rounded-xl border bg-white/80 shadow-soft mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full" style={{ background: "linear-gradient(135deg,#A259FF,#FAE13C)", boxShadow: "0 6px 16px rgba(162,89,255,.25)" }} />
          <div>
            <div className="text-xs text-neutral-600">Poin</div>
            <div className="text-2xl font-extrabold">{answered}</div>
          </div>
          <div className="ml-auto w-2/3">
            <ProgressBar value={answered} max={total} />
            <div className="flex justify-between text-xs text-neutral-600 mt-1">
              <span>{answered}/{total}</span>
              <span className="font-semibold">{answered < 4 ? "Starter" : answered < 9 ? "Growing" : "Ready"}</span>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {questions.map((q) => (
          <QuestionCard key={q.id} question={q} value={answers[q.id]} onChange={setValue} />
        ))}
        <div className="flex justify-center pt-2">
          <button
            type="submit"
            disabled={answered < total}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold shadow-md disabled:opacity-40"
            style={{ background: "linear-gradient(90deg,var(--accent-1),var(--primary))" }}
          >
            <Check className="w-5 h-5" /> Cek Hasil
          </button>
        </div>
      </form>

      <Modal open={open} onClose={() => setOpen(false)}>
        <ResultCard
          score={{ role, fit }}
          strengths={strengths}
          onClose={() => setOpen(false)}
        />
      </Modal>
    </section>
  );
}
