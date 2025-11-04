"use client";

import { Suspense } from "react";
import SkillMatchQuiz from "@/components/skillmatch/SkillMatchQuiz";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen py-4 sm:py-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 sm:mb-4">Kuis Skill Match</h1>
          <p className="text-center text-neutral-600 text-sm sm:text-base mb-4 sm:mb-6">
            Pilih angka 1–5 untuk tiap pernyataan di bawah ini.
          </p>
          <Suspense fallback={
            <div className="text-center py-8 sm:py-12">
              <div className="animate-pulse text-gray-400">Memuat kuis...</div>
            </div>
          }>
            <SkillMatchQuiz />
          </Suspense>
        </div>
      </main>
    </ProtectedRoute>
  );
}
