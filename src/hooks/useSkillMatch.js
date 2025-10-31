// hooks/useSkillMatch.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { assessmentAPI, personalizedAPI, recPekerjaanAPI, pekerjaanAPI, skillQuestionsAPI } from '@/lib/api';
import {
  computeScore,
  computeFit,
  topStrengths,
  mapSkillGaps,
  buildPersonalizedRecord,
} from '@/lib/skill/score';

/**
 * Main hook untuk SkillMatch flow
 * Flow: Load questions → User jawab → Submit → Scoring → Save personalized → Create job recommendations → Redirect
 */
export function useSkillMatch(roleCategory) {
  console.log('useSkillMatch hook called with roleCategory:', roleCategory);
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const userId = typeof window !== 'undefined' 
    ? localStorage.getItem('user_id') 
    : null;

  // Load questions dari backend (balanced DISC + RIASEC)
  useEffect(() => {
    console.log('useSkillMatch useEffect triggered with roleCategory:', roleCategory);
    const loadQuestions = async () => {
      try {
        console.log('Loading questions from backend (balanced DISC + RIASEC)');
        let res;
        try {
          res = await assessmentAPI.generateQuestions();
        } catch (e) {
          // Fallback to deprecated questions endpoint if assessment route not found
          try {
            res = await skillQuestionsAPI.getAll(1, 12);
          } catch (_) {
            throw e;
          }
        }
        console.log('API Response:', res);
        console.log('API Response data:', res.data);

        if (res.data.success) {
          // Support berbagai struktur response dari backend
          const raw = res.data.data?.questions || res.data.data?.items || res.data.questions || res.data?.data || [];
          const normalized = (Array.isArray(raw) ? raw : []).map((q, idx) => {
            const backendId = q.id ?? q._id ?? q.question_id ?? idx;
            return {
              // Local unique id for UI state tracking to avoid collisions
              id: `${backendId}_${idx}`,
              // Original id expected by backend for scoring
              qid: backendId,
              text: q.text ?? q.question_text ?? q.question ?? q.content ?? '',
              trait: q.trait ?? q.category ?? q.trait_type ?? q.dimension ?? 'General',
              dimension: q.dimension ?? null,
            };
          });

          console.log('Parsed questions (normalized):', normalized);
          if (normalized.length > 0) {
            setQuestions(normalized);
            setError('');
          } else {
            setError('Tidak ada pertanyaan ditemukan dari backend');
            setQuestions([]);
          }
        } else {
          setError('Gagal memuat pertanyaan: ' + (res.data.error || 'Unknown error'));
          setQuestions([]);
        }
      } catch (err) {
        console.error('Error loading questions:', err);
        setError('Error loading questions: ' + err.message);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, [roleCategory]);

  // Handle answer update
  const handleAnswer = (questionId, score) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  // Submit quiz & create personalized profile
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // 1. Validate semua pertanyaan jawab
      const allAnswered = questions.length > 0 && 
        questions.every(q => answers[q.id]);

      if (!allAnswered) {
        setError('Mohon jawab semua pertanyaan');
        setSubmitting(false);
        return;
      }

      if (!userId) {
        setError('User tidak teridentifikasi');
        setSubmitting(false);
        return;
      }

      // 2. Calculate scores menggunakan scoring library
      console.log('📊 Calculating scores...');
      const scoreData = computeScore(questions, answers);
      console.log('Score data:', scoreData);

      const fitScore = computeFit(
        scoreData.bestScore,
        Object.keys(answers).filter(k => answers[k] > 0).length,
        questions.length
      );
      console.log('Fit score:', fitScore);

      const strengthsList = topStrengths(scoreData.traitAvg);
      console.log('Strengths:', strengthsList);

      // 3. Build personalized record
      const personalizedRecord = buildPersonalizedRecord(
        scoreData,
        fitScore,
        strengthsList
      );
      console.log('Personalized record:', personalizedRecord);

      // 4. Trigger backend assessment submit (to start AI background processing)
      try {
        const payload = {
          // Send original ids to backend so mapping works
          questions: questions.map(q => ({ id: q.qid, text: q.text, trait: q.trait, dimension: q.dimension })),
          answers: questions.map(q => ({ question_id: q.qid, score_value: answers[q.id] }))
        };
        await assessmentAPI.submitAssessment(payload);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('assessment_submitted', 'true');
        }
      } catch (submitErr) {
        console.warn('Assessment submit failed (AI may not run):', submitErr?.message);
      }

      // 5. Save ke database (personalized)
      console.log('💾 Saving personalized profile...');
      let recId = null;
      try {
        const personalizedRes = await personalizedAPI.create(personalizedRecord);
        console.log('Personalized response:', personalizedRes.data);

        if (!personalizedRes.data.success) {
          throw new Error('Gagal menyimpan hasil quiz: ' + (personalizedRes.data.error || 'Unknown error'));
        }

        // Extract rec_id dari berbagai kemungkinan struktur response
        if (personalizedRes.data.data?.personalized?.rec_id) {
          recId = personalizedRes.data.data.personalized.rec_id;
        } else if (personalizedRes.data.data?.rec_id) {
          recId = personalizedRes.data.data.rec_id;
        } else if (personalizedRes.data.personalized?.rec_id) {
          recId = personalizedRes.data.personalized.rec_id;
        }
      } catch (createErr) {
        console.warn('⚠️ Personalized create failed, using local fallback:', createErr?.message);
        // Fallback ke local rec_id jika API gagal (404, 401, 500, dll)
        recId = `local-${Date.now()}`;
      }

      console.log('✅ RecId resolved:', recId);

      // 6. Store di sessionStorage untuk reference
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('skillmatch_result', JSON.stringify({
          scoreData,
          fitScore,
          strengthsList,
          recId,
          roleCategory: scoreData.roleCategory,
          personalizedRecord
        }));
      }

      // 7. Create job recommendations di background (skip untuk local fallback)
      if (!String(recId).startsWith('local-')) {
        createJobRecommendations(recId, scoreData, personalizedRecord, strengthsList)
          .catch(err => {
            console.error('Error creating job recommendations:', err);
            // Tetap lanjut redirect meski job recommendations gagal
          });
      }

      // 8. Auto-redirect to Personalized page
      console.log('🚀 Redirecting to personalized with rec_id:', recId);
      setTimeout(() => {
        router.push(`/personalized?rec_id=${recId}`);
      }, 400);

    } catch (err) {
      console.error('❌ Submit error:', err);
      setError(err.message || 'Terjadi kesalahan saat submit');
      setSubmitting(false);
    }
  };

  return {
    questions,
    answers,
    loading,
    submitting,
    error,
    handleAnswer,
    handleSubmit,
    answeredCount: Object.keys(answers).filter(k => answers[k] > 0).length,
    totalQuestions: questions.length
  };
}

/**
 * Create job recommendations in background
 * Matches jobs dengan skill gaps dan strengths user
 * Score: 40% role match, 40% skill match, 20% experience match
 */
async function createJobRecommendations(recId, scoreData, personalizedRecord, strengthsList) {
  try {
    console.log('🎯 Starting job recommendations creation for rec_id:', recId);

    // Get all jobs
    const jobsRes = await pekerjaanAPI.getAll(1, 100);
    
    if (!jobsRes.data.success) {
      console.warn('Could not fetch jobs');
      return;
    }

    const jobs = jobsRes.data.data.jobs || [];
    console.log(`Found ${jobs.length} jobs`);

    if (jobs.length === 0) {
      console.warn('No jobs found');
      return;
    }

    const strength = JSON.parse(personalizedRecord.strength || '{}');
    const skillGaps = JSON.parse(personalizedRecord.skill_gap || '[]');
    
    // Match & sort by score
    const matched = jobs
      .map(job => matchJobWithProfile(job, strength, skillGaps, scoreData.roleCategory, scoreData.traitAvg))
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 5);

    console.log(`Matched ${matched.length} jobs:`, matched.map(j => ({ 
      name: j.nama_pekerjaan, 
      score: j.finalScore 
    })));

    // Add recommendations ke rec_pekerjaan
    let addedCount = 0;
    for (const job of matched) {
      try {
        await recPekerjaanAPI.add({
          rec_id: recId,
          pekerjaan_id: job.pekerjaan_id
        });
        addedCount++;
        console.log(`✅ Added job recommendation: ${job.nama_pekerjaan}`);
      } catch (err) {
        console.error(`Error adding job ${job.pekerjaan_id}:`, err);
        // Continue ke job berikutnya meski satu gagal
      }
    }

    console.log(`Successfully added ${addedCount}/${matched.length} job recommendations`);

  } catch (err) {
    console.error('Error in createJobRecommendations:', err);
  }
}

/**
 * Match individual job dengan user profile
 * Score formula:
 * - Role Match (40%): apakah bidang job sesuai dengan roleCategory user
 * - Skill Match (40%): berapa banyak top3 skills user yang match dengan job requirements
 * - Experience Match (20%): apakah level job sesuai dengan level user
 */
function matchJobWithProfile(job, strength, skillGaps, roleCategory, traitScores) {
  // 1. Role Match (40%)
  let roleScore = 40;
  if (job.bidang && roleCategory && roleCategory.toLowerCase().includes(job.bidang.toLowerCase())) {
    roleScore = 85;
  } else if (job.bidang && job.bidang.toLowerCase() === roleCategory.toLowerCase()) {
    roleScore = 95;
  }

  // 2. Skill Match (40%)
  let skillScore = 40;
  const jobRequirements = job.requirements 
    ? job.requirements.split(",").map(r => r.trim().toLowerCase()) 
    : [];
  
  const matchedSkills = strength.topThree?.filter(s => 
    jobRequirements.some(req => 
      req.includes(s.toLowerCase()) || s.toLowerCase().includes(req)
    )
  ) || [];
  
  if (matchedSkills.length === 3) skillScore = 95;
  else if (matchedSkills.length === 2) skillScore = 80;
  else if (matchedSkills.length === 1) skillScore = 60;

  // 3. Experience Match (20%)
  let experienceScore = 40;
  if (job.level) {
    const jobLevelNum = levelToNumber(job.level);
    const userLevel = strength.level || 'Menengah';
    const userLevelNum = levelToNumber(userLevel);
    
    if (jobLevelNum <= userLevelNum) {
      experienceScore = 90;
    } else if (jobLevelNum - userLevelNum === 1) {
      experienceScore = 70;
    }
  }

  // Calculate final score
  const finalScore = Math.min(100, Math.round(
    (roleScore * 0.4) + (skillScore * 0.4) + (experienceScore * 0.2)
  ));

  return {
    pekerjaan_id: job.pekerjaan_id,
    ...job,
    roleScore,
    skillScore,
    experienceScore,
    finalScore,
    skillsMatch: matchedSkills,
    skillGapPriorities: skillGaps.slice(0, 3)
  };
}

/**
 * Convert level text to numeric value for comparison
 */
function levelToNumber(level) {
  if (!level) return 2;
  
  const normalized = level.toLowerCase();
  
  if (
    normalized.includes('pemula') || 
    normalized.includes('entry') || 
    normalized.includes('junior') || 
    normalized.includes('intern')
  ) {
    return 1;
  }
  
  if (
    normalized.includes('menengah') || 
    normalized.includes('mid') || 
    normalized.includes('associate')
  ) {
    return 2;
  }
  
  if (
    normalized.includes('lanjutan') || 
    normalized.includes('senior') || 
    normalized.includes('expert')
  ) {
    return 3;
  }
  
  return 2; // default to mid-level
}