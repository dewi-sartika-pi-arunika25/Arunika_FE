"use client";

import { Suspense } from "react";
import SkillMatchQuiz from "@/components/skillmatch/SkillMatchQuiz";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-center mt-10 text-neutral-500">Memuat kuis...</div>}>
      <main className="section">
        <h1 className="section-title text-center mb-2">Kuis Skill Match</h1>
        <p className="text-center text-neutral-600">
          Pilih angka 1–5 untuk tiap pernyataan di bawah ini.
        </p>
        <SkillMatchQuiz />
      </main>
    </Suspense>
  );
}
