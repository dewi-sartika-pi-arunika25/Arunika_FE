// hooks/usePersonalizedProfile.js
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { personalizedAPI, recPekerjaanAPI, recSkillupAPI, skillupAPI } from '@/lib/api';

/**
 * Main hook untuk personalized dashboard
 * Pulls data dari API (rec_pekerjaan, rec_skillup, personalized)
 * Ready untuk AI integration nanti
 */
export function usePersonalizedProfile() {
  const searchParams = useSearchParams();
  const recId = searchParams.get('rec_id');
  
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [jobRecommendations, setJobRecommendations] = useState([]);
  const [skillRecommendations, setSkillRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch profile + recommendations
  useEffect(() => {
    if (!recId) {
      setError('rec_id tidak ditemukan');
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        setLoading(true);

        // 1. Fetch personalized profile
        const profileRes = await personalizedAPI.getById(recId);
        if (!profileRes.data.success) {
          throw new Error('Gagal fetch profile');
        }
        const profileData = profileRes.data.data.personalized;
        setProfile(profileData);

        // 2. Fetch job recommendations (rec_pekerjaan)
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

        // 3. Fetch skill recommendations (rec_skillup)
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

        setError('');
      } catch (err) {
        console.error('Error in fetchAll:', err);
        setError(err.message || 'Gagal load profile');
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

    // Skill gaps dengan priority
    skillGaps: profile ? parseSkillGaps(profile.skill_gap) : [],

    // Formatted job recommendations
    formattedJobs: formatJobRecommendations(jobRecommendations),

    // Formatted skill recommendations
    formattedSkills: formatSkillRecommendations(skillRecommendations),

    // AI analysis placeholder (null sekarang, akan di-populate oleh AI nanti)
    aiInsight: null,

    // Next steps recommendation
    nextSteps: profile ? generateNextSteps(profile) : []
  };

  return {
    profile,
    recId,
    loading,
    error,
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