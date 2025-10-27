// hooks/useSkillMatch.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { skillQuestionsAPI, personalizedAPI, recPekerjaanAPI, pekerjaanAPI } from '@/lib/api';
import {
  computeScore,
  computeFit,
  topStrengths,
  mapSkillGaps,
  buildPersonalizedRecord,
  getRoleCode
} from '@/lib/skill/score';

/**
 * Main hook untuk SkillMatch flow
 */
export function useSkillMatch(roleCategory) {
  const router = useRouter();
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const userId = typeof window !== 'undefined' 
    ? localStorage.getItem('user_id') 
    : null;

  // Load questions by role category
  useEffect(() => {
    const loadQuestions = async () => {
      try {
        if (!roleCategory) {
          setError('Role category tidak ditemukan');
          setLoading(false);
          return;
        }

        console.log('Loading questions for role:', roleCategory);
        const res = await skillQuestionsAPI.getByRole(roleCategory);
        
        console.log('API Response:', res.data);
        
        if (res.data.success) {
          // Handle different response structures from API
          const questionsData = res.data.questions || res.data.data?.questions || [];
          console.log('Parsed questions:', questionsData);
          
          if (Array.isArray(questionsData) && questionsData.length > 0) {
            setQuestions(questionsData);
            setError('');
          } else {
            setError('Tidak ada pertanyaan ditemukan untuk role: ' + roleCategory);
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

  // Submit quiz
  const handleSubmit = async (e) => {
    e?.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Validate all questions answered
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

      // Calculate scores
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

      // Build personalized record
      const personalizedRecord = buildPersonalizedRecord(
        scoreData,
        fitScore,
        strengthsList
      );
      console.log('Personalized record:', personalizedRecord);

      // Create personalized record in database
      const personalizedRes = await personalizedAPI.create(personalizedRecord);
      console.log('Personalized response:', personalizedRes.data);

      if (!personalizedRes.data.success) {
        throw new Error('Gagal menyimpan hasil quiz: ' + (personalizedRes.data.error || 'Unknown error'));
      }

      // Extract rec_id dengan safe handling berbagai response structure
      let recId = null;
      
      if (personalizedRes.data.data?.personalized?.rec_id) {
        recId = personalizedRes.data.data.personalized.rec_id;
      } else if (personalizedRes.data.data?.rec_id) {
        recId = personalizedRes.data.data.rec_id;
      } else if (personalizedRes.data.personalized?.rec_id) {
        recId = personalizedRes.data.personalized.rec_id;
      }

      console.log('RecId created:', recId);

      if (!recId) {
        throw new Error('rec_id tidak ditemukan di response: ' + JSON.stringify(personalizedRes.data));
      }

      // Store result di sessionStorage untuk reference
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('skillmatch_result', JSON.stringify({
          scoreData,
          fitScore,
          strengthsList,
          recId,
          roleCategory: scoreData.roleCategory
        }));
      }

      // Create job recommendations in background (don't wait)
      createJobRecommendations(recId, scoreData, personalizedRecord, strengthsList)
        .catch(err => {
          console.error('Error creating job recommendations:', err);
        });

      // Redirect to personalized dashboard
      console.log('✅ Redirecting to personalized with rec_id:', recId);
      setTimeout(() => {
        router.push(`/personalized?rec_id=${recId}`);
      }, 500);

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
 */
async function createJobRecommendations(recId, scoreData, personalizedRecord, strengthsList) {
  try {
    console.log('Starting job recommendations creation...');

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
    
    // Match jobs dengan profile user
    const matched = jobs
      .map(job => matchJobWithProfile(job, strength, skillGaps, scoreData.roleCategory, scoreData.traitAvg))
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 5);

    console.log(`Matched ${matched.length} jobs:`, matched.map(j => ({ name: j.nama_pekerjaan, score: j.finalScore })));

    // Add recommendations to rec_pekerjaan
    let addedCount = 0;
    for (const job of matched) {
      try {
        await recPekerjaanAPI.add({
          rec_id: recId,
          pekerjaan_id: job.pekerjaan_id
        });
        addedCount++;
        console.log(`Added job recommendation: ${job.nama_pekerjaan}`);
      } catch (err) {
        console.error(`Error adding job ${job.pekerjaan_id}:`, err);
      }
    }

    console.log(`Successfully added ${addedCount} job recommendations`);

  } catch (err) {
    console.error('Error in createJobRecommendations:', err);
  }
}

/**
 * Match individual job dengan user profile
 * Score: 40% role match, 40% skill match, 20% experience match
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