/**
 * Custom hook untuk dashboard logic
 * Memisahkan business logic dari UI presentation
 */
import { useMemo } from "react";
import { useAuthStore } from "@/lib/store/auth";
import { usePersonalizedProfile } from "@/hooks/usePersonalizedProfile";
import { getRoleFitWithWorkStyle } from "@/lib/utils/roleFitMapping";
import { getAllSkillGapsForRole, separateSkillsByCategory, categorizeSkill } from "@/lib/utils/roleSkillMapping";
import { getCompetenceLevel, getCompetenceLevelFromScores } from "@/lib/utils/competenceLevelMapping";
import { buildGeneralPersonalityDescription, getTopStrengthsFromRadar } from "@/lib/utils/dimensionDescriptions";

/**
 * Helper untuk truncate skill name yang panjang
 */
const truncateSkillName = (name, maxLength = 18) => {
  if (!name || name.length <= maxLength) return name;
  return name.substring(0, maxLength - 3) + "...";
};

export function useDashboardLogic() {
  const {
    profile,
    user,
    loading,
    error,
    roleFit,
    summaryMetrics,
    strengths,
    nextSteps,
    formattedJobs,
    skillGaps,
  } = usePersonalizedProfile();

  // Get user name from auth store
  const authStore = useAuthStore();
  const authUserName = authStore.user?.user_metadata?.name || authStore.user?.name || authStore.profile?.name;
  const userName = authUserName || user?.name || "Pengguna";

  // Calculate role recommendation dengan work style mapping
  const roleFitInfo = useMemo(() => {
    if (!profile?.disc_profile || !profile?.riasec_profile) {
      return {
        role: "Belum Tersedia",
        fit: 0,
        workStyle: null,
        personality: "Selesaikan assessment terlebih dahulu.",
        strengths: [],
        workEnvironment: ""
      };
    }
    return getRoleFitWithWorkStyle(profile.disc_profile, profile.riasec_profile);
  }, [profile]);

  const recommendedRole = roleFitInfo.role;

  // Pie chart data untuk Role Fit
  const pieData = useMemo(() => {
    const fitValue = roleFitInfo.fit || roleFit || 0;
    const value = Math.max(0, Math.min(100, Math.round(fitValue)));
    const gapValue = Math.max(5, 100 - value); // Minimum 5% gap untuk visual clarity
    const adjustedFit = 100 - gapValue;
    
    return [
      { name: "Role Fit", value: adjustedFit },
      { name: "Gap", value: gapValue },
    ];
  }, [roleFit, roleFitInfo]);

  // Radar chart data (top 5)
  const radarData = useMemo(() => {
    const maxRadarItems = 5;
    
    if (profile?.disc_profile || profile?.riasec_profile) {
      const discScores = profile.disc_profile?.scores || {};
      const riasecScores = profile.riasec_profile?.scores || {};
      
      const allScores = [
        ...Object.entries(discScores).map(([key, value]) => ({
          subject: key,
          A: value || 0,
          key: key,
          fullName: key === 'D' ? 'Dominance' : key === 'I' ? 'Influence' : key === 'S' ? 'Steadiness' : 'Conscientiousness'
        })),
        ...Object.entries(riasecScores).map(([key, value]) => ({
          subject: key,
          A: value || 0,
          key: key,
          fullName: key === 'R' ? 'Realistic' : key === 'I' ? 'Investigative' : key === 'A' ? 'Artistic' : key === 'S' ? 'Social' : key === 'E' ? 'Enterprising' : 'Conventional'
        }))
      ];
      
      return allScores
        .sort((a, b) => (b.A || 0) - (a.A || 0))
        .slice(0, maxRadarItems);
    }
    
    // Fallback: dari strengths topThree
    const subjects = strengths?.topThree || [];
    return subjects.slice(0, maxRadarItems).map((s, i) => ({
      subject: String(s).toUpperCase(),
      A: Math.max(35, 95 - i * 12),
      fullName: s
    }));
  }, [strengths, profile]);

  // Skill gap data - HANYA HARD SKILL untuk dashboard
  // Priority: hard skill assessment dari backend > hard skill assessment dari localStorage > skillGaps dari profile (filtered) > role-based mapping (filtered)
  const skillGapData = useMemo(() => {
    let allSkills = [];
    
    // Priority 1: Hard skill assessment dari backend atau localStorage
    let hardSkillAssessment = profile?.hard_skill_assessment || 
                               profile?.assessment_results?.hardSkillAssessment ||
                               null;
    
    // Check localStorage if not in profile
    if (!hardSkillAssessment && typeof window !== 'undefined') {
      try {
        const cached = getWithExpiry('disc_riasec_results');
        hardSkillAssessment = cached?.hardSkillAssessment || null;
      } catch (e) {
        // Ignore if getWithExpiry fails
      }
    }
    
    if (hardSkillAssessment && Array.isArray(hardSkillAssessment) && hardSkillAssessment.length > 0) {
      // Filter hanya hard skill (double-check)
      const hardSkillsFromAssessment = hardSkillAssessment
        .filter(skill => {
          const category = skill.category || categorizeSkill(skill.skill || skill.name, skill.description || "");
          return category === "hard";
        })
        .map((skill) => {
          const skillName = skill.skill || skill.name || "Skill";
          const userLevel = skill.userLevel || 0; // 0-5
          const requiredLevel = skill.requiredLevel || 3; // 1-5
          const gap = skill.gap || Math.max(0, requiredLevel - userLevel);
          
          // Convert level (0-5) ke persentase (0-100)
          const currentPercent = (userLevel / 5) * 100;
          const targetPercent = (requiredLevel / 5) * 100;
          
          return {
            skill: truncateSkillName(skillName, 18),
            skillFull: skillName,
            gap: currentPercent,
            target: targetPercent,
            category: "hard", // Force hard skill
            priority: requiredLevel,
            description: skill.description || "",
            gapLevel: gap,
          };
        });
      
      allSkills = hardSkillsFromAssessment;
    }
    // Priority 2: Skill gaps dari profile (FILTER HARD SKILL ONLY)
    else if (skillGaps && skillGaps.length > 0) {
      allSkills = skillGaps
        .filter(g => {
          const category = g.category || categorizeSkill(g.name || g.skill, g.description || "");
          return category === "hard"; // ✅ HANYA HARD SKILL
        })
        .map((g) => {
          const gapPercent = g.gapPercent ?? (g.priority ? (6 - g.priority) * 15 : 40);
          const currentPercent = Math.max(20, 100 - gapPercent - Math.floor(Math.random() * 20));
          const skillName = g.name || g.skill || "Skill";
          return {
            skill: truncateSkillName(skillName, 18),
            skillFull: skillName,
            gap: currentPercent,
            target: 100 - gapPercent,
            category: "hard", // Force hard skill
            priority: g.priority,
            description: g.description,
          };
        });
    }
    // Priority 3: Role-based mapping (FILTER HARD SKILL ONLY)
    else if (recommendedRole && recommendedRole !== "Belum Tersedia") {
      const roleSkills = getAllSkillGapsForRole(recommendedRole);
      allSkills = roleSkills
        .filter(skill => skill.category === "hard") // ✅ HANYA HARD SKILL
        .map((skill, idx) => {
          const gapPercent = skill.priority === 5 ? 60 : skill.priority === 4 ? 50 : 40;
          const currentPercent = Math.max(30, 100 - gapPercent - (idx * 5));
          const skillName = skill.skill || "Skill";
          return {
            skill: truncateSkillName(skillName, 18),
            skillFull: skillName,
            gap: currentPercent,
            target: Math.min(100, currentPercent + gapPercent),
            category: "hard", // Force hard skill
            priority: skill.priority,
            description: skill.description,
          };
        });
    } else {
      // Fallback: generate dummy data untuk demo (HARD SKILL ONLY)
      allSkills = [
        { skill: "Technical Skills", skillFull: "Technical Skills", gap: 45, target: 80, category: "hard", priority: 4 },
      ];
    }
    
    // Return hanya hard skills untuk dashboard
    return allSkills;
  }, [skillGaps, recommendedRole, profile]);
  
  // Separate hard skills and soft skills
  const { hardSkills, softSkills } = useMemo(() => {
    return separateSkillsByCategory(skillGapData);
  }, [skillGapData]);

  // Level kompetensi: Junior, Menengah, Pro
  const competenceLevel = useMemo(() => {
    if (profile?.level && ["Junior", "Menengah", "Pro", "Pemula", "Lanjutan"].includes(profile.level)) {
      if (profile.level === "Pemula") return "Junior";
      if (profile.level === "Lanjutan") return "Pro";
      return profile.level;
    }

    if (profile?.disc_profile?.scores || profile?.riasec_profile?.scores) {
      const discScores = profile.disc_profile?.scores || {};
      const riasecScores = profile.riasec_profile?.scores || {};
      return getCompetenceLevelFromScores(discScores, riasecScores);
    }

    const fitScore = roleFitInfo.fit || roleFit || 0;
    return getCompetenceLevel(fitScore);
  }, [profile, roleFitInfo, roleFit]);

  // Level skill gap (persentase)
  const levelSkillGap = useMemo(() => {
    if (skillGapData.length > 0) {
      const avg = Math.round(
        skillGapData.reduce((s, r) => s + (r.gap || 0), 0) / skillGapData.length
      );
      return avg;
    }
    const fitScore = roleFitInfo.fit || roleFit || 0;
    const estimatedGap = Math.max(20, 100 - fitScore);
    return estimatedGap;
  }, [skillGapData, roleFitInfo, roleFit]);

  // Role detail description
  const roleDetail = useMemo(() => {
    if (profile?.disc_profile && profile?.riasec_profile) {
      const discPrimary = profile.disc_profile.primary || profile.disc_profile.dominant_type || '';
      const discSecondary = profile.disc_profile.secondary || profile.disc_profile.secondary_type || '';
      const riasecPrimary = profile.riasec_profile.primary || profile.riasec_profile.primary_code || '';
      const riasecSecondary = profile.riasec_profile.secondary || profile.riasec_profile.secondary_code || '';
      
      const generalDescription = buildGeneralPersonalityDescription(discPrimary, discSecondary, riasecPrimary, riasecSecondary);
      
      if (roleFitInfo.role && roleFitInfo.role !== "Belum Tersedia") {
        return `${generalDescription} ${roleFitInfo.personality} ${roleFitInfo.workEnvironment ? `Lingkungan kerja yang ideal: ${roleFitInfo.workEnvironment}` : ''}`;
      }
      
      return generalDescription;
    }
    
    return profile?.roleDescription ||
      "Role ini menggambarkan kombinasi unik antara kemampuan analisis, komunikasi, dan kepemimpinan. Kamu cenderung mengelola proses secara efisien sekaligus menginspirasi tim menuju tujuan bersama.";
  }, [profile, roleFitInfo]);

  // Work style text untuk ditampilkan
  const workStyleText = useMemo(() => {
    let workStyle = roleFitInfo.workStyle;
    
    if (!workStyle && profile?.disc_profile && profile?.riasec_profile) {
      const discPrimary = profile.disc_profile.primary || profile.disc_profile.dominant_type || '';
      const discSecondary = profile.disc_profile.secondary || profile.disc_profile.secondary_type || '';
      const riasecPrimary = profile.riasec_profile.primary || profile.riasec_profile.primary_code || '';
      const riasecSecondary = profile.riasec_profile.secondary || profile.riasec_profile.secondary_code || '';
      
      const generalDesc = buildGeneralPersonalityDescription(discPrimary, discSecondary, riasecPrimary, riasecSecondary);
      workStyle = generalDesc || roleDetail;
    } else if (!workStyle) {
      workStyle = roleDetail;
    }
    
    return workStyle;
  }, [roleFitInfo, profile, roleDetail]);

  // Job data untuk job matches
  // ✅ Pastikan recommendedRole selalu di posisi pertama dengan score tertinggi
  const jobData = useMemo(() => {
    if (!formattedJobs || formattedJobs.length === 0) return [];
    
    // Map jobs dengan format yang benar
    const mappedJobs = formattedJobs.map((j) => ({
      name: j.role || j.name || "",
      role: j.role || j.name || "",
      match: j.match || 0,
      badge: j.badge || "",
      fullName: j.role || j.name || ""
    }));

    // Pastikan recommendedRole ada di posisi pertama
    if (recommendedRole && recommendedRole !== "Belum Tersedia") {
      // Cari job yang sesuai dengan recommendedRole
      const recommendedJobIndex = mappedJobs.findIndex(j => 
        j.role === recommendedRole || 
        j.name === recommendedRole ||
        j.role?.toLowerCase() === recommendedRole.toLowerCase() ||
        j.name?.toLowerCase() === recommendedRole.toLowerCase()
      );

      // Jika ditemukan, pindahkan ke posisi pertama dan update score
      if (recommendedJobIndex !== -1) {
        const recommendedJob = mappedJobs[recommendedJobIndex];
        // Update match score dengan roleFitInfo.fit (lebih akurat)
        recommendedJob.match = Math.max(recommendedJob.match, roleFitInfo.fit || roleFit || 0);
        recommendedJob.badge = recommendedJob.match >= 85 ? "Sangat Sesuai" :
                               recommendedJob.match >= 70 ? "Sesuai" :
                               recommendedJob.match >= 55 ? "Cukup Sesuai" : "Kurang Sesuai";
        
        // Hapus dari array dan tambahkan di awal
        mappedJobs.splice(recommendedJobIndex, 1);
        mappedJobs.unshift(recommendedJob);
      } else {
        // Jika tidak ditemukan, tambahkan recommendedRole di posisi pertama
        const recommendedFit = roleFitInfo.fit || roleFit || 0;
        mappedJobs.unshift({
          name: recommendedRole.length > 18 ? recommendedRole.slice(0, 18) + "..." : recommendedRole,
          role: recommendedRole,
          match: recommendedFit,
          badge: recommendedFit >= 85 ? "Sangat Sesuai" :
                 recommendedFit >= 70 ? "Sesuai" :
                 recommendedFit >= 55 ? "Cukup Sesuai" : "Kurang Sesuai",
          fullName: recommendedRole
        });
      }
    }

    // Sort berdasarkan match score (descending), dengan recommendedRole tetap di posisi pertama
    const sortedJobs = mappedJobs
      .map(j => ({
        ...j,
        name: j.role?.length > 18 ? j.role.slice(0, 18) + "..." : (j.name || j.role || "")
      }))
      .sort((a, b) => {
        // Jika salah satu adalah recommendedRole, letakkan di posisi pertama
        if (recommendedRole && recommendedRole !== "Belum Tersedia") {
          const aIsRecommended = a.role === recommendedRole || a.name === recommendedRole ||
                                a.role?.toLowerCase() === recommendedRole.toLowerCase() ||
                                a.name?.toLowerCase() === recommendedRole.toLowerCase();
          const bIsRecommended = b.role === recommendedRole || b.name === recommendedRole ||
                                b.role?.toLowerCase() === recommendedRole.toLowerCase() ||
                                b.name?.toLowerCase() === recommendedRole.toLowerCase();
          
          if (aIsRecommended && !bIsRecommended) return -1;
          if (!aIsRecommended && bIsRecommended) return 1;
        }
        
        // Sort berdasarkan match score (descending)
        return (b.match || 0) - (a.match || 0);
      });

    // Ambil top 6 jobs
    return sortedJobs.slice(0, 6);
  }, [formattedJobs, recommendedRole, roleFitInfo.fit, roleFit]);

  // Chart colors
  const chartColors = ["#E4B200", "#FFE89C"];

  // Helper function untuk format persentase
  const pct = (n) => `${Math.round(n ?? 0)}%`;

  // Top strengths untuk display
  const topStrengths = useMemo(() => {
    return getTopStrengthsFromRadar(radarData);
  }, [radarData]);

  return {
    // Profile data
    profile,
    user,
    userName,
    loading,
    error,
    
    // Role fit
    roleFitInfo,
    recommendedRole,
    pieData,
    
    // Charts data
    radarData,
    skillGapData,
    hardSkills,
    softSkills,
    topStrengths,
    
    // Metrics
    competenceLevel,
    levelSkillGap,
    
    // Descriptions
    roleDetail,
    workStyleText,
    
    // Jobs & recommendations
    jobData,
    nextSteps,
    
    // Utils
    chartColors,
    pct,
  };
}

