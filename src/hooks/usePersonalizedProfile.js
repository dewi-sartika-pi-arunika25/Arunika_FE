// hooks/usePersonalizedProfile.js
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { personalizedAPI, recPekerjaanAPI, recSkillupAPI, skillupAPI, usersAPI, assessmentAPI } from '@/lib/api';

/**
 * Main hook untuk personalized dashboard
 * Pulls data dari API (rec_pekerjaan, rec_skillup, personalized)
 * Ready untuk AI integration nanti
 */
export function usePersonalizedProfile() {
  const searchParams = useSearchParams();
  const recId = (() => {
    const fromQuery = searchParams.get('rec_id');
    if (fromQuery) return fromQuery;
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(sessionStorage.getItem('skillmatch_result') || '{}');
        return saved?.recId || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  })();
  const isLocalRec = recId && String(recId).startsWith('local-');
  
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null); // ✅ diperbaiki: hapus const userId yang salah
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [skillRecommendations, setSkillRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aiStatus, setAiStatus] = useState('');

  // Fetch profile + recommendations
  useEffect(() => {
    if (!recId) {
      // Fallback ke data lokal jika tersedia
      try {
        const saved = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('skillmatch_result') || '{}') : {};
        if (saved?.personalizedRecord) {
          setProfile(saved.personalizedRecord);
          setUser({ name: saved.personalizedRecord.user_id || 'User' });
          setJobRecommendations([]);
          setSkillRecommendations([]);
          setError('');
        } else {
          setError('rec_id tidak ditemukan. Pastikan datang dari Skillmatch atau sertakan ?rec_id=...');
        }
      } catch (e) {
        setError('rec_id tidak ditemukan. Pastikan datang dari Skillmatch atau sertakan ?rec_id=...');
      }
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);
        
        // Jika menggunakan rec_id lokal, gunakan data dari sessionStorage tanpa call API
        if (isLocalRec) {
          const saved = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('skillmatch_result') || '{}') : {};
          if (saved?.personalizedRecord) {
            setProfile(saved.personalizedRecord);
            setUser({ name: saved.personalizedRecord.user_id || 'User' });
            setJobRecommendations([]);
            setSkillRecommendations([]);
            setError('');
            return; // selesai local mode
          }
        }

        // 1. Fetch personalized profile + recommendations dari API (prefer bundled endpoint)
        let profileData = null;
        let jobRecs = [];
        let skillRecs = [];
        try {
          const bundleRes = await personalizedAPI.getWithRecs(recId);
          if (bundleRes.data?.success) {
            profileData = bundleRes.data.data.personalized;
            jobRecs = bundleRes.data.data.job_recommendations || [];
            skillRecs = bundleRes.data.data.skill_recommendations || [];
          }
        } catch (_) {
          // fallback to separate calls below
        }

        if (!profileData) {
          const profileRes = await personalizedAPI.getById(recId);
          if (!profileRes.data.success) {
            throw new Error('Gagal fetch profile');
          }
          profileData = profileRes.data.data.personalized;
        }
        setProfile(profileData);

        // 2. Resolve nama pengguna secara robust
        const userId = profileData?.user_id;
        if (userId) {
          // Jika user_id adalah objek yang sudah berisi nama/id
          if (typeof userId === 'object') {
            const name = resolveUserName(userId);
            setUser({ name, id: userId.id || userId.user_id || null });
          } else {
            try {
              const userRes = await usersAPI.getById(userId);
              if (userRes.data?.success && userRes.data.data?.user) {
                const userObj = userRes.data.data.user;
                const name = resolveUserName(userObj, userId);
                setUser({ ...userObj, name });
              } else {
                // fallback kalau user_id sudah berupa nama string
                const name = typeof userId === 'string' ? userId : 'Pengguna';
                setUser({ name });
              }
            } catch (userErr) {
              console.warn('Gagal fetch user detail, fallback ke user_id:', userErr);
              const name = typeof userId === 'string' ? userId : 'Pengguna';
              setUser({ name });
            }
          }
        } else {
          setUser({ name: 'Pengguna' });
        }

        // 3. Fetch job recommendations (rec_pekerjaan) if not provided by bundle
        if (jobRecs.length > 0) {
          setJobRecommendations(jobRecs);
        } else {
          try {
            const jobsRes = await recPekerjaanAPI.getByRecId(recId);
            if (jobsRes.data.success) {
              const jobs = jobsRes.data.data.recommendations || [];
              setJobRecommendations(jobs);
            }
          } catch (jobErr) {
            console.warn('Error fetching jobs:', jobErr);
            setJobRecommendations([]);
          }
        }

        // 4. Fetch skill recommendations (rec_skillup) if not provided by bundle
        if (skillRecs.length > 0) {
          setSkillRecommendations(skillRecs);
        } else {
          try {
            const skillsRes = await recSkillupAPI.getByRecId(recId);
            if (skillsRes.data.success) {
              const skills = skillsRes.data.data.recommendations || [];
              setSkillRecommendations(skills);
            }
          } catch (skillErr) {
            console.warn('Error fetching skills:', skillErr);
            setSkillRecommendations([]);
          }
        }

        setError('');

        // 5. Try fetch AI analysis (only when user just submitted assessment)
        try {
          const fromRecentAssessment = typeof window !== 'undefined' && sessionStorage.getItem('assessment_submitted') === 'true';
          if (fromRecentAssessment) {
            const statusRes = await assessmentAPI.checkStatus();
            const completed = statusRes?.data?.data?.is_completed;
            const status = statusRes?.data?.data?.ai_status;
            if (status) setAiStatus(status);
            if (completed) {
              try {
                const res = await assessmentAPI.getResults();
                if (res.data?.success && res.data.data?.ai_analysis) {
                  setProfile(prev => ({ ...(prev || {}), ai_insight: res.data.data.ai_analysis }));
                }
                sessionStorage.removeItem('assessment_submitted');
              } catch (resErr) {
                // ignore 404 from results
              }
            }
          }
        } catch (_) {
          // ignore status errors
        }
      } catch (err) {
        console.error('Error in fetchAll:', err);
        // Fallback ke data lokal jika 401/403 atau network error
        const status = err?.response?.status;
        if (status === 401 || status === 403 || isLocalRec) {
          try {
            const saved = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('skillmatch_result') || '{}') : {};
            if (saved?.personalizedRecord) {
              setProfile(saved.personalizedRecord);
              const fallbackName = resolveUserName(saved.personalizedRecord?.user || saved.personalizedRecord?.user_id, saved.personalizedRecord?.user_id);
              setUser({ name: fallbackName || 'Pengguna' });
              setJobRecommendations([]);
              setSkillRecommendations([]);
              setError('');
            } else {
              setError(err.message || 'Gagal load profile');
            }
          } catch (e) {
            setError(err.message || 'Gagal load profile');
          }
        } else {
          setError(err.message || 'Gagal load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [recId]);

  // ============================================
  // COMPUTED VALUES - Phase 1 (Logic-based)
  // ============================================

  const computed = {
    // Extract role fit percentage
    roleFit: profile ? extractRoleFit(profile.role_fit) : 0,

    // Summary metrics untuk dashboard card
    summaryMetrics: profile ? buildMetrics(profile) : [],

    // Top strengths
    strengths: profile ? parseStrengths(profile.strength) : [],

    // Skill gaps dengan priority (fallback synth jika kosong)
    skillGaps: (() => {
      if (!profile) return [];
      const parsed = parseSkillGaps(profile.skill_gap);
      if (parsed && parsed.length > 0) return parsed;
      const strengthParsed = parseStrengths(profile.strength);
      return synthesizeSkillGaps(strengthParsed);
    })(),

    // Formatted job recommendations
    formattedJobs: formatJobRecommendations(jobRecommendations),

    // Formatted skill recommendations
    formattedSkills: formatSkillRecommendations(skillRecommendations),

    // AI analysis (filled from backend if available)
    aiInsight: (() => {
      if (!profile) return null;
      return (
        profile.ai_insight ||
        profile.ai_summary ||
        profile.ai_analysis ||
        null
      );
    })(),

    // Next steps recommendation
    nextSteps: profile ? generateNextSteps(profile) : []
  };

  return {
    profile,
    user, // ✅ ditambahkan agar bisa digunakan di komponen (misal DashboardContent)
    recId,
    loading,
    error,
    aiStatus,
    // Raw data
    jobRecommendations,
    skillRecommendations,
    // Computed
    ...computed
  };
}

// ============================================
// PHASE 1: LOGIC-BASED HELPERS
// ============================================

// Mengambil nama pengguna dari berbagai kemungkinan field
function resolveUserName(userObjOrString, fallback) {
  if (typeof userObjOrString === 'string') return userObjOrString;
  if (!userObjOrString || typeof userObjOrString !== 'object') {
    return typeof fallback === 'string' ? fallback : 'Pengguna';
  }
  const candidates = [
    userObjOrString.name,
    userObjOrString.full_name,
    userObjOrString.nama,
    userObjOrString.username,
    typeof fallback === 'string' ? fallback : null
  ].filter(Boolean);
  return candidates[0] || 'Pengguna';
}

function extractRoleFit(roleFitStr) {
  if (!roleFitStr) return 0;
  const match = roleFitStr.match(/\((\d+)%\)/);
  return match ? parseInt(match[1]) : 0;
}

function buildMetrics(profile) {
  const roleFit = extractRoleFit(profile.role_fit);
  
  return [
    {
      title: "Role Fit",
      value: `${roleFit}%`,
      icon: "Target",
      color: "text-[#FF8C00]",
      benchmark: roleFit >= 75 ? "Excellent" : roleFit >= 55 ? "Good" : "Building"
    },
    {
      title: "Level",
      value: profile.level || "Menengah",
      icon: "TrendingUp",
      color: "text-[#E4B200]"
    },
    {
      title: "Skill Gaps",
      value: profile.gap ? extractGapCount(profile.gap) : "3",
      icon: "BookOpen",
      color: "text-gray-600"
    }
  ];
}

function extractGapCount(gapStr) {
  const match = gapStr.match(/(\d+)\s/);
  return match ? match[1] : "3";
}

function parseSkillGaps(skillGapStr) {
  if (!skillGapStr) return [];
  try {
    const gaps = JSON.parse(skillGapStr);
    return gaps
      .map(g => ({
        name: g.name,
        trait: g.trait,
        priority: g.priority,
        priorityLabel: getPriorityLabel(g.priority)
      }))
      .sort((a, b) => (b.priority || 0) - (a.priority || 0));
  } catch (e) {
    console.error('Error parsing skill gaps:', e);
    return [];
  }
}

function parseStrengths(strengthStr) {
  if (!strengthStr) return [];
  try {
    const strength = JSON.parse(strengthStr);
    return {
      archetype: strength.archetype || "The Explorer",
      topThree: strength.topThree || [],
      traits: strength.traits || {}
    };
  } catch (e) {
    console.error('Error parsing strengths:', e);
    return {
      archetype: "The Explorer",
      topThree: [],
      traits: {}
    };
  }
}

function getPriorityLabel(priority) {
  const priorityMap = {
    5: "Urgent",
    4: "High",
    3: "Medium",
    2: "Low",
    1: "Learning"
  };
  return priorityMap[priority] || "Medium";
}

function formatJobRecommendations(jobs) {
  return jobs.map(job => ({
    id: job.pekerjaan?.pekerjaan_id,
    role: job.pekerjaan?.nama_pekerjaan,
    bidang: job.pekerjaan?.bidang,
    description: job.pekerjaan?.deskripsi,
    requirements: job.pekerjaan?.requirements,
    link: job.pekerjaan?.link_pekerjaan,
    // Mock match score for now (will be calculated or from AI later)
    match: Math.floor(Math.random() * (95 - 70 + 1)) + 70,
    badge: getBadgeFromMatch(Math.floor(Math.random() * (95 - 70 + 1)) + 70)
  }));
}

function formatSkillRecommendations(skills) {
  return skills.map(skill => ({
    id: skill.skill_id || skill.skillup?.skill_id,
    name: skill.skillup?.nama_skillup,
    description: skill.skillup?.deskripsi,
    link: skill.skillup?.link_skillup,
    level: skill.skillup?.level,
    addedAt: skill.created_at
  }));
}

function getBadgeFromMatch(score) {
  if (score >= 85) return "Exact Match";
  if (score >= 75) return "Strong Match";
  if (score >= 65) return "Good Fit";
  return "Growing Path";
}

function generateNextSteps(profile) {
  const roleFit = extractRoleFit(profile.role_fit);
  const level = profile.level || "Menengah";
  const steps = [];

  // Analyze dan generate steps berdasarkan data
  if (roleFit < 60) {
    steps.push({
      id: 1,
      priority: "URGENT",
      title: "Tingkatkan Skill Gap",
      description: "Fokus pada 3 skill prioritas untuk mencapai Role Fit 75%",
      timeline: "2 minggu",
      actionUrl: "/personalized?page=skills",
      icon: "BookOpen"
    });
  }

  if (roleFit >= 75 && roleFit < 90) {
    steps.push({
      id: 2,
      priority: "HIGH",
      title: "Apply ke Posisi yang Sesuai",
      description: "Sudah waktunya untuk mulai apply ke lowongan yang match",
      timeline: "Minggu ini",
      actionUrl: "/personalized?page=jobs",
      icon: "Briefcase"
    });
  }

  if (roleFit >= 75) {
    steps.push({
      id: 3,
      priority: "RECOMMENDED",
      title: "Build Portfolio Project",
      description: "Showcase skill terbaik Anda dengan membuat mini project",
      timeline: "1 bulan",
      actionUrl: "/resources/projects",
      icon: "Code"
    });
  }

  if (level === "Pemula") {
    steps.push({
      id: 4,
      priority: "RECOMMENDED",
      title: "Cari Mentor",
      description: "Mulai network dan cari mentor di bidang Anda",
      timeline: "Ongoing",
      actionUrl: "/community",
      icon: "Users"
    });
  }

  return steps;
}

// Generate synthetic skill gaps when backend has no data
function synthesizeSkillGaps(strengthsObj) {
  const top = strengthsObj?.topThree || [];
  const traits = strengthsObj?.traits || {};
  const candidates = [
    { name: 'Leadership Communication', trait: top[0] || 'Communication', priority: 4 },
    { name: 'Problem Solving', trait: top[1] || 'Analysis', priority: 3 },
    { name: 'Stakeholder Management', trait: top[2] || 'Collaboration', priority: 3 },
  ];
  return candidates.map(c => ({
    ...c,
    priorityLabel: getPriorityLabel(c.priority)
  }));
}

// ============================================
// PHASE 2 PLACEHOLDER (untuk AI integration nanti)
// ============================================

/**
 * Placeholder untuk AI analysis
 * Nanti akan di-call oleh separate AI hook
 * Misalnya: useAIAnalysis(profile, jobRecommendations, skillRecommendations)
 */
export function useAIAnalysis(profile, jobRecommendations, skillRecommendations) {
  const [aiInsight, setAiInsight] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  // TODO: Implement AI call ke Claude/GPT
  // const generateInsight = async () => {
  //   const response = await callAI({
  //     profile,
  //     jobRecommendations,
  //     skillRecommendations
  //   });
  //   setAiInsight(response);
  // };

  return {
    aiInsight,
    aiLoading
  };
}