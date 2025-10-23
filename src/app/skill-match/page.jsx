"use client";

import SkillMatchQuiz from "@/components/skillmatch/SkillMatchQuiz";

export default function Page() {
  return (
    <main className="section">
      <h1 className="section-title text-center mb-2">Kuis Skill Match</h1>
      <p className="text-center text-neutral-600">Pilih angka 1–5 untuk tiap pernyataan di bawah ini.</p>
      <SkillMatchQuiz />
    </main>
  );
}
