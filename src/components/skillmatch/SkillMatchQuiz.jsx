"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDISCRIASEC } from '@/hooks/useDISCRIASEC';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Loader, Sparkles, CheckCircle2 } from 'lucide-react';
import HardSkillAssessment from './HardSkillAssessment';
import { COLORS, TRAIT_COLORS, ASSESSMENT } from '@/lib/config/constants';
import { assessmentAPI } from '@/lib/api';
import { getWithExpiry } from '@/lib/utils/storage';
import { STORAGE_KEYS } from '@/lib/config/constants';
import { useAuthStore } from '@/lib/store/auth';

export default function SkillMatchQuiz() {
  const router = useRouter();
  const [checkingAssessment, setCheckingAssessment] = useState(true);
  const [hasExistingAssessment, setHasExistingAssessment] = useState(false);
  
  const {
    questions,
    answers,
    loading,
    submitting,
    error,
    handleAnswer,
    handleSubmit,
    answeredCount,
    totalQuestions,
    progress,
    showHardSkillAssessment,
    recommendedRole,
    handleHardSkillSubmit,
    handleHardSkillSkip,
  } = useDISCRIASEC();

  // Check if user already has assessment results
  useEffect(() => {
    const checkExistingAssessment = async () => {
      try {
        // 1. Check localStorage first (fast)
        const cachedResults = getWithExpiry(STORAGE_KEYS.DISC_RIASEC_RESULTS);
        if (cachedResults) {
          console.log('✅ Found cached assessment results in localStorage');
          setHasExistingAssessment(true);
          setCheckingAssessment(false);
          // Redirect to personalized with results
          setTimeout(() => {
            router.push('/personalized?assessment=disc_riasec');
          }, 1000);
          return;
        }

        // 2. Check backend assessment_cache
        try {
          const statusRes = await assessmentAPI.checkStatus();
          if (statusRes?.data?.success) {
            const isCompleted = statusRes.data.data?.is_completed;
            const hasResults = statusRes.data.data?.has_results;
            
            if (isCompleted || hasResults) {
              console.log('✅ Found assessment results in backend');
              // Try to get results
              try {
                const resultsRes = await assessmentAPI.getResults();
                if (resultsRes?.data?.success && resultsRes.data.data) {
                  setHasExistingAssessment(true);
                  setCheckingAssessment(false);
                  // Redirect to personalized with results
                  setTimeout(() => {
                    router.push('/personalized?assessment=disc_riasec');
                  }, 1000);
                  return;
                }
              } catch (resultsErr) {
                console.warn('Could not fetch results, continuing with quiz:', resultsErr);
              }
            }
          }
        } catch (statusErr) {
          // If checkStatus fails, continue with quiz
          console.log('No existing assessment found, continuing with quiz');
        }

        // 3. Check has_assessment from auth store
        const hasAssessment = useAuthStore.getState().hasAssessment();
        if (hasAssessment) {
          console.log('✅ User has assessment flag, redirecting to personalized');
          setHasExistingAssessment(true);
          setCheckingAssessment(false);
          setTimeout(() => {
            router.push('/personalized');
          }, 1000);
          return;
        }

        setCheckingAssessment(false);
      } catch (err) {
        console.error('Error checking existing assessment:', err);
        setCheckingAssessment(false);
      }
    };

    checkExistingAssessment();
  }, [router]);

  const allAnswered = totalQuestions > 0 && answeredCount === totalQuestions;

  // Show checking state
  if (checkingAssessment) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center" style={{ backgroundColor: COLORS.BACKGROUND }}>
        <Card className="w-full max-w-2xl shadow-lg">
          <CardContent className="p-8 text-center">
            <Loader className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: COLORS.PRIMARY }} />
            <p className="text-gray-600 text-lg">Memeriksa hasil assessment sebelumnya...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show message if has existing assessment (briefly before redirect)
  if (hasExistingAssessment) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center" style={{ backgroundColor: COLORS.BACKGROUND }}>
        <Card className="w-full max-w-2xl shadow-lg">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4" style={{ color: COLORS.PRIMARY }} />
            <p className="text-gray-600 text-lg">Anda sudah memiliki hasil assessment.</p>
            <p className="text-gray-500 text-sm mt-2">Mengarahkan ke dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center" style={{ backgroundColor: COLORS.BACKGROUND }}>
        <Card className="w-full max-w-2xl shadow-lg">
          <CardContent className="p-8 text-center">
            <Loader className="h-12 w-12 animate-spin mx-auto mb-4" style={{ color: COLORS.PRIMARY }} />
            <p className="text-gray-600 text-lg">Memuat pertanyaan...</p>
            <p className="text-gray-500 text-sm mt-2">Menyiapkan Skill Match Assessment untuk Anda</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:py-8 text-gray-900" style={{ backgroundColor: COLORS.BACKGROUND }}>
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <Card className="shadow-lg border border-gray-200">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="text-center mb-4 sm:mb-6">
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                <Brain className="h-6 w-6 sm:h-8 sm:w-8" style={{ color: COLORS.PRIMARY }} />
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.PRIMARY}, ${COLORS.ACCENT})` }}>
                  Skill Match Assessment
                </h1>
              </div>
              <p className="text-gray-600 mb-2 text-sm sm:text-base">
                Jawab {totalQuestions} pertanyaan untuk mendapatkan rekomendasi karir IT
              </p>
              
              <p className="text-xs text-gray-500 mb-3 sm:mb-4 px-2">
                Ini adalah eksplorasi awal, bukan asesmen psikologis resmi
              </p>
              
              <div className="mt-3 sm:mt-4 space-y-2">
                <div className="flex justify-between text-xs sm:text-sm text-gray-600">
                  <span>{answeredCount} / {totalQuestions} terjawab</span>
                  <span className="font-semibold" style={{ color: COLORS.PRIMARY }}>{progress}%</span>
                </div>
                <Progress 
                  value={progress} 
                  className="h-2 bg-gray-200" 
                  style={{
                    '--progress-gradient': `linear-gradient(to right, ${COLORS.PRIMARY}, ${COLORS.ACCENT})`
                  }}
                />
              </div>
            </div>

            {error && (
              <Card className="mb-4 sm:mb-6 text-xs sm:text-sm" style={{ borderColor: COLORS.PRIMARY, backgroundColor: COLORS.WARNING_BG }}>
                <CardContent className="p-3 sm:p-4" style={{ color: COLORS.WARNING_TEXT }}>{error}</CardContent>
              </Card>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {questions.map((question, idx) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={idx}
              answer={answers[question.id]}
              onAnswer={(score) => handleAnswer(question.id, score)}
            />
          ))}

          <div className="flex justify-center pt-4 sm:pt-6 sticky bottom-2 sm:bottom-4 bg-white/80 backdrop-blur-sm rounded-lg p-3 sm:p-4 shadow-lg">
            <Button 
              type="submit"
              disabled={submitting || !allAnswered}
                className={`inline-flex items-center gap-2 px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg font-semibold text-sm sm:text-base md:text-lg transition-all shadow-lg ${
                  allAnswered && !submitting 
                    ? 'text-white' 
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                }`}
                style={allAnswered && !submitting ? {
                  backgroundImage: `linear-gradient(to right, ${COLORS.PRIMARY}, ${COLORS.ACCENT})`,
                } : {}}
            >
              {submitting ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  Memproses hasil...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Lihat Hasil Assessment
                </>
              )}
            </Button>
          </div>

          {/* Warning Message */}
          {!allAnswered && (
            <div className="text-center">
              <p className="text-sm p-3 rounded-lg inline-block" style={{ color: COLORS.PRIMARY, backgroundColor: COLORS.WARNING_BG, borderColor: COLORS.WARNING_BORDER }}>
                ⚠️ Silakan jawab semua {totalQuestions} pertanyaan untuk melanjutkan
              </p>
            </div>
          )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Question Card Component
function QuestionCard({ question, index, answer, onAnswer }) {
  const getTraitStyle = (trait) => {
    const colors = TRAIT_COLORS[trait] || TRAIT_COLORS.DISC;
    return {
      backgroundColor: colors.bg,
      color: colors.text,
      borderColor: colors.border,
    };
  };

  return (
    <Card className="mb-4 shadow-md bg-white border border-gray-200 hover:shadow-lg transition-all">
      <CardContent className="p-6">
        <div className="mb-4">
          <p className="font-semibold text-gray-900 text-base leading-relaxed">
            {index + 1}. {question.text}
          </p>
        </div>

        {/* Likert Scale */}
        <div className="flex gap-2 justify-center flex-wrap">
          {Array.from({ length: ASSESSMENT.MAX_SCORE - ASSESSMENT.MIN_SCORE + 1 }, (_, i) => i + ASSESSMENT.MIN_SCORE).map(score => {
            const isSelected = answer === score;
            return (
              <button
                key={score}
                type="button"
                onClick={() => onAnswer(score)}
                className="w-14 h-14 rounded-full font-bold text-base transition-all duration-200"
                style={isSelected ? {
                  backgroundImage: `linear-gradient(to right, ${COLORS.PRIMARY}, ${COLORS.ACCENT})`,
                  color: 'white',
                  transform: 'scale(1.1)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                } : {}}
              >
                {score}
              </button>
            );
          })}
        </div>

        {/* Scale Labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-3 px-2">
          <span>{ASSESSMENT.SCALE_LABELS.MIN}</span>
          <span>{ASSESSMENT.SCALE_LABELS.MAX}</span>
        </div>
      </CardContent>
    </Card>
  );
}