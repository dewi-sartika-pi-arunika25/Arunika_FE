/**
 * Custom hook untuk RekomendasiSkillUp logic
 * Memisahkan business logic dari UI presentation
 */
import { useState, useMemo } from "react";
import { usePersonalizedProfile } from "@/hooks/usePersonalizedProfile";
import { getAllSkillGapsForRole } from "@/lib/utils/roleSkillMapping";
import { getRoleFitWithWorkStyle } from "@/lib/utils/roleFitMapping";

/**
 * Helper untuk mendapatkan recommended role dari profile
 */
function getRecommendedRoleFromProfile(profile) {
  if (!profile?.disc_profile || !profile?.riasec_profile) {
    return null;
  }
  
  // Gunakan getRoleFitWithWorkStyle yang sudah ada
  const roleFitInfo = getRoleFitWithWorkStyle(profile.disc_profile, profile.riasec_profile);
  
  if (roleFitInfo.role && roleFitInfo.role !== "Belum Tersedia") {
    return roleFitInfo.role;
  }
  
  return null;
}

/**
 * Academy definitions
 */
export const ACADEMIES = [
  { name: "Skillvul", src: "/skilvul.ico", link: "https://www.skilvul.com" },
  { name: "Coursera", src: "/coursera-logo.png", link: "https://www.coursera.org" },
  { name: "Google", src: "/growgoogle.jpg", link: "https://grow.google/certificates" },
  { name: "Ruang Guru", src: "/ruangguru.jpg", link: "https://www.ruangguru.com/academy" },
];

export function useRekomendasiSkillUp() {
  const { formattedSkills, skillGaps, loading, error, profile } = usePersonalizedProfile();
  const [expandedItems, setExpandedItems] = useState(new Set());
  
  // Toggle expand/collapse
  const toggleExpand = (index) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  // Get recommended role
  const recommendedRole = useMemo(() => {
    return getRecommendedRoleFromProfile(profile);
  }, [profile]);
  
  // Combine skill gaps + formatted skills + role-based skill gaps
  const recommendations = useMemo(() => {
    // Prioritaskan skillGaps dari profile
    if (skillGaps.length > 0) {
      return skillGaps;
    }
    
    // Jika ada formattedSkills, gunakan itu
    if (formattedSkills.length > 0) {
      return formattedSkills;
    }
    
    // Jika tidak ada tapi ada recommendedRole, ambil dari role mapping
    if (recommendedRole) {
      const roleBasedSkills = getAllSkillGapsForRole(recommendedRole);
      return roleBasedSkills.map(skill => ({
        name: skill.skill,
        description: skill.description,
        priority: skill.priority,
        priorityLabel: skill.priority === 5 ? "Urgent" : skill.priority === 4 ? "High" : "Medium",
        resources: skill.resources || []
      }));
    }
    
    return [];
  }, [skillGaps, formattedSkills, recommendedRole]);

  return {
    recommendations,
    loading,
    error,
    expandedItems,
    toggleExpand,
  };
}

