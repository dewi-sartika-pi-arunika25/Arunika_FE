// components/skillmatch/SkillMatchQuiz.jsx
"use client";

import React, { useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSkillMatch } from '@/hooks/useSkillMatch';
import { computeScore, computeFit, topStrengths } from '@/lib/skill/score';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import  Badge  from '@/components/ui/Badge';
import { BookOpen, Loader, Sparkles, X, Check } from 'lucide-react';
import Modal from '@/components/ui/Modal';

// --- ResultCard ---
function ResultCard({ score, strengths, onExplore, onClose }) {
  const { role, fit } = score;

  return (
    <Card className="w-full max-w-md shadow-2xl">
      <div
        className="rounded-t-2xl px-6 py-5 text-center relative"
        style={{ background: "linear-gradient(180deg, rgba(250,225,60,.25), rgba(255,253,244,.0))" }}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 p-2 rounded-full hover:bg-gray-200 transition"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        <h3
          className="text-lg font-semibold"
          style={{
            background: "linear-gradient(90deg, #FAE13C, #FF8300)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            letterSpacing: ".02em",
          }}
        >
          Rekomendasi Peran Untukmu
        </h3>
      </div>

      <CardContent className="p-6">
        <div className="text-center mb-6">
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold mb-3"
            style={{ background: "rgba(250,225,60,.22)" }}
          >
            <Sparkles className="w-4 h-4" />
            {role}
          </span>

          <div className="text-6xl font-extrabold text-orange-600 leading-none">
            {fit}
            <span className="text-2xl text-gray-500 align-top ml-1">%</span>
          </div>
          <div className="text-gray-500 text-sm mt-2">Fit Score</div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Kekuatan Utamamu</h4>
          <div className="flex flex-wrap gap-2">
            {strengths.map((s) => (
              <Badge key={s} className="bg-orange-100 text-orange-700">
                {s}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">Saran Aksi</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex gap-2">
              <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              Ambil mini-project 1–2 minggu sesuai peran.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              Tulis studi kasus singkat untuk portofolio.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              Minta feedback mentor/komunitas.
            </li>
          </ul>
        </div>

        <div className="flex justify-center">
          <Button
            onClick={onExplore}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-95 text-white font-semibold px-6 py-3 rounded-lg"
          >
            Jelajahi Lab Career →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// --- SkillMatchQuiz ---
export default function SkillMatchQuiz() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const roleCategory = searchParams.get('role') || 'Frontend Developer';
  const [showModal, setShowModal] = useState(false);

  const {
    questions,
    answers,
    loading,
    submitting,
    error,
    handleAnswer,
    handleSubmit: hookSubmit,
    answeredCount,
    totalQuestions
  } = useSkillMatch(roleCategory);

  const progress = totalQuestions > 0 
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions;

  // Compute score for preview
  const scoreData = useMemo(
    () => questions.length > 0 ? computeScore(questions, answers) : { traitAvg: {}, archetype: 'The Explorer', roleCategory: 'Backend Developer', bestScore: 0 },
    [questions, answers]
  );

  const fit = useMemo(
    () => computeFit(scoreData.bestScore || 0, answeredCount, totalQuestions || 1),
    [scoreData.bestScore, answeredCount, totalQuestions]
  );

  const strengths = useMemo(() => topStrengths(scoreData.traitAvg), [scoreData.traitAvg]);

  // Submit → show modal
  async function handleSubmit(e) {
    e.preventDefault();
    if (!allAnswered || submitting) return;
    await hookSubmit(e);
    setShowModal(true);
  }

  // Redirect when button clicked
  const handleExplore = () => {
    setShowModal(false);
    router.push('/personalized');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-50 py-16 flex items-center justify-center">
        <Card className="w-full max-w-2xl">
          <CardContent className="p-8 text-center">
            <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-orange-500" />
            <p className="text-gray-600">Memuat pertanyaan...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 py-16 text-gray-900">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <BookOpen className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold">{roleCategory} Assessment</h1>
          </div>
          <p className="text-gray-600 mb-2">
            Jawab {totalQuestions} pertanyaan dengan jujur untuk mendapatkan analisis karir yang akurat
          </p>
          
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>{answeredCount} / {totalQuestions} terjawab</span>
              <span className="font-semibold text-orange-600">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-yellow-200 [&>div]:bg-orange-500" />
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-red-300 bg-red-50">
            <CardContent className="p-4 text-red-700">{error}</CardContent>
          </Card>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {questions.map((question, idx) => (
            <Card key={question.id} className="shadow-md bg-white border border-yellow-200 hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-base leading-relaxed">
                        {idx + 1}. {question.text}
                      </p>
                    </div>
                    <span className="ml-2 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full whitespace-nowrap capitalize">
                      {question.trait}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 justify-center">
                  {[1, 2, 3, 4, 5].map(score => {
                    const isSelected = answers[question.id] === score;
                    return (
                      <button
                        key={score}
                        type="button"
                        onClick={() => handleAnswer(question.id, score)}
                        className={`
                          w-12 h-12 rounded-full font-bold text-lg transition-all duration-200
                          ${isSelected
                            ? 'bg-orange-500 text-white shadow-lg scale-110'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }
                        `}
                        title={
                          score === 1 ? 'Sangat Tidak Setuju' :
                          score === 2 ? 'Tidak Setuju' :
                          score === 3 ? 'Netral' :
                          score === 4 ? 'Setuju' :
                          'Sangat Setuju'
                        }
                      >
                        {score}
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-between text-xs text-gray-500 mt-3 px-2">
                  <span>Sangat Tidak Setuju</span>
                  <span>Sangat Setuju</span>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-center pt-4">
            <Button 
              type="submit"
              disabled={submitting || !allAnswered}
              className={`
                inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all
                ${allAnswered && !submitting
                  ? 'bg-orange-500 hover:bg-orange-600 text-white'
                  : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }
              `}
            >
              {submitting ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> Cek Hasil
                </>
              )}
            </Button>
          </div>

          {!allAnswered && (
            <p className="text-center text-sm text-yellow-700 bg-yellow-50 p-3 rounded-lg">
              ⚠️ Jawab semua pertanyaan untuk melanjutkan
            </p>
          )}
        </form>
      </div>

      {/* Modal: Result Card */}
      <Modal 
        open={showModal} 
        onClose={() => setShowModal(false)}
      >
        <ResultCard
          score={{ role: scoreData.archetype, fit }}
          strengths={strengths}
          onClose={() => setShowModal(false)}
          onExplore={handleExplore}
        />
      </Modal>
    </div>
  );
}