// hooks/useDISCRIASEC.js
// Hook untuk Skill Match Assessment (DISC + RIASEC) dengan endpoint baru
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentAPI } from '@/lib/api';
import { formatApiError } from '@/lib/utils/errorHandler';
import { 
  normalizeQuestions, 
  areAllQuestionsAnswered, 
  formatAssessmentResponses,
  countAnsweredQuestions,
  calculateProgress 
} from '@/lib/utils/assessment';
import { logInfo, logError, logWarning } from '@/lib/utils/logger';
import { STORAGE_KEYS, ASSESSMENT } from '@/lib/config/constants';
import { setWithExpiry } from '@/lib/utils/storage';

/**
 * Main hook untuk Skill Match Assessment flow (DISC + RIASEC)
 * Flow: Load questions → User jawab → Submit → Get results (DISC profile, RIASEC profile, job recommendations)
 */
export function useDISCRIASEC() {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);

  // Load questions dari endpoint baru /assessment/start
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        logInfo('📚 Loading Skill Match questions from /assessment/start...');
        const res = await assessmentAPI.startAssessment();

        // Backend response format: { success: true, data: { questions: [...] }, message: ... }
        // Axios unwraps to: res.data = { success: true, data: { questions: [...] }, ... }
        const questions = res.data?.data?.questions || res.data?.questions || null;

        if (questions && Array.isArray(questions) && questions.length > 0) {
          const normalized = normalizeQuestions(questions);
          logInfo(`✅ Loaded ${normalized.length} questions (DISC + RIASEC)`);
          setQuestions(normalized);
          setError('');
        } else {
          logError('❌ Invalid response format or empty questions:', res.data);
          // Check if backend returned empty array
          if (Array.isArray(questions) && questions.length === 0) {
            setError('Database belum memiliki data pertanyaan. Silakan hubungi administrator untuk seed data assessment questions.');
          } else {
            setError('Format response tidak valid dari backend. Response: ' + JSON.stringify(res.data?.data || res.data).substring(0, 200));
          }
          setQuestions([]);
        }
      } catch (err) {
        logError('❌ Error loading questions:', err);
        const userFriendlyMsg = formatApiError(err, 'Gagal memuat pertanyaan');
        setError(userFriendlyMsg);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  // Handle answer update (Likert scale 1-5)
  const handleAnswer = (questionId, score) => {
    if (score < ASSESSMENT.MIN_SCORE || score > ASSESSMENT.MAX_SCORE) return;
    
    setAnswers(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  // Submit assessment dan dapatkan hasil
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // 1. Validate semua pertanyaan terjawab
      if (!areAllQuestionsAnswered(questions, answers)) {
        setError('Mohon jawab semua pertanyaan terlebih dahulu');
        setSubmitting(false);
        return;
      }

      // 2. Format responses untuk endpoint baru (simplified format)
      const responses = formatAssessmentResponses(questions, answers);
      logInfo('📤 Submitting assessment...', { totalResponses: responses.length });

      // 3. Submit ke endpoint baru
      const submitRes = await assessmentAPI.submitAssessment({ responses });
      logInfo('✅ Assessment submitted:', submitRes);

      // Handle response - can be direct data or wrapped in data property
      const resultData = submitRes.data?.data || submitRes.data;
      
      if (!resultData) {
        throw new Error('Response tidak valid dari backend');
      }

      // Validate response structure
      if (!resultData.discProfile || !resultData.riasecProfile || !resultData.recommendations) {
        logWarning('⚠️ Response missing expected fields:', resultData);
        // Continue anyway - may have partial data
      }

      // Store results
      setResults(resultData);

      // Store di localStorage dengan expiry 24 jam (bukan sessionStorage)
      if (typeof window !== 'undefined') {
        try {
          // Set dengan expiry 24 jam
          setWithExpiry(STORAGE_KEYS.DISC_RIASEC_RESULTS, resultData, 24);
          setWithExpiry(STORAGE_KEYS.ASSESSMENT_TYPE, 'DISC_RIASEC', 24);
          logInfo('✅ Assessment results saved to localStorage (24h expiry)');
        } catch (storageError) {
          logWarning('⚠️ Failed to store results in localStorage:', storageError);
        }
      }

      // Auto-redirect ke hasil atau personalized page
      setTimeout(() => {
        router.push('/personalized?assessment=disc_riasec');
      }, 500);

    } catch (err) {
      logError('❌ Submit error:', err);
      const userFriendlyMsg = formatApiError(err, 'Terjadi kesalahan saat submit assessment');
      setError(userFriendlyMsg);
      setSubmitting(false);
    }
  };

  const answeredCount = countAnsweredQuestions(answers);
  const totalQuestions = questions.length;
  const progress = calculateProgress(answeredCount, totalQuestions);

  return {
    questions,
    answers,
    loading,
    submitting,
    error,
    results,
    handleAnswer,
    handleSubmit,
    answeredCount,
    totalQuestions,
    progress,
  };
}

