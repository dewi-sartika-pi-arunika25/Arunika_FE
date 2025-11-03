/**
 * Custom hook untuk RekomendasiPekerjaan logic
 * Memisahkan business logic dari UI presentation
 */
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { usePersonalizedProfile } from "@/hooks/usePersonalizedProfile";
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
  
  // Fallback: manual calculation jika mapping tidak menemukan role
  const discProfile = profile.disc_profile;
  const riasecProfile = profile.riasec_profile;
  const discPrimary = discProfile.primary || discProfile.dominant_type || '';
  const discSecondary = discProfile.secondary || discProfile.secondary_type || '';
  const riasecPrimary = riasecProfile.primary || riasecProfile.primary_code || '';
  const riasecSecondary = riasecProfile.secondary || riasecProfile.secondary_code || '';

  const roleScores = {
    'Frontend Developer': 0,
    'Backend Developer': 0,
    'Project Manager': 0,
    'UI/UX Designer': 0,
  };

  if (['C', 'S'].includes(discPrimary)) roleScores['Frontend Developer'] += 15;
  if (['C', 'S'].includes(discSecondary)) roleScores['Frontend Developer'] += 10;
  if (['A', 'I', 'C'].includes(riasecPrimary)) roleScores['Frontend Developer'] += 15;
  if (['A', 'I', 'C'].includes(riasecSecondary)) roleScores['Frontend Developer'] += 10;

  if (['C', 'D'].includes(discPrimary)) roleScores['Backend Developer'] += 15;
  if (['C', 'D'].includes(discSecondary)) roleScores['Backend Developer'] += 10;
  if (['I', 'R', 'C'].includes(riasecPrimary)) roleScores['Backend Developer'] += 15;
  if (['I', 'R', 'C'].includes(riasecSecondary)) roleScores['Backend Developer'] += 10;

  if (['D', 'I'].includes(discPrimary)) roleScores['Project Manager'] += 15;
  if (['D', 'I'].includes(discSecondary)) roleScores['Project Manager'] += 10;
  if (['E', 'S', 'C'].includes(riasecPrimary)) roleScores['Project Manager'] += 15;
  if (['E', 'S', 'C'].includes(riasecSecondary)) roleScores['Project Manager'] += 10;

  if (['I', 'S'].includes(discPrimary)) roleScores['UI/UX Designer'] += 15;
  if (['I', 'S'].includes(discSecondary)) roleScores['UI/UX Designer'] += 10;
  if (['A', 'S', 'I'].includes(riasecPrimary)) roleScores['UI/UX Designer'] += 15;
  if (['A', 'S', 'I'].includes(riasecSecondary)) roleScores['UI/UX Designer'] += 10;

  const sortedRoles = Object.entries(roleScores).sort((a, b) => b[1] - a[1]);
  return sortedRoles[0][1] > 50 ? sortedRoles[0][0] : null;
}

/**
 * Generate platform URLs untuk job search
 */
export function getPlatformUrl(platform, role) {
  const roleQuery = role.toLowerCase().replace(/\s+/g, '+');
  const roleQueryID = role.toLowerCase().replace(/\s+/g, '-');
  
  switch(platform) {
    case "LinkedIn":
      return `https://www.linkedin.com/jobs/search/?keywords=${roleQuery}`;
    case "JobStreet":
      return `https://www.jobstreet.co.id/id/job-search/${roleQueryID}-jobs/`;
    case "Tech-in-Asia":
      return `https://www.techinasia.com/jobs/search?query=${roleQuery}`;
    case "Sribulancer":
      return `https://www.sribulancer.com/jobs?keyword=${roleQuery}`;
    default:
      return `https://www.google.com/search?q=${roleQuery}+jobs+indonesia`;
  }
}

/**
 * Platform definitions
 */
export const PLATFORMS = [
  { name: "LinkedIn", icon: "/linkedin.svg" },
  { name: "JobStreet", icon: "/jobstreet.png" },
  { name: "Tech-in-Asia", icon: "/techinasia.png" },
  { name: "Sribulancer", icon: "/sribulancer.jpeg" },
];

export function useRekomendasiPekerjaan() {
  const searchParams = useSearchParams();
  const { formattedJobs, loading, error, profile } = usePersonalizedProfile();
  
  // Calculate recommended role
  const recommendedRole = useMemo(() => {
    return getRecommendedRoleFromProfile(profile);
  }, [profile]);
  
  // Role query dari URL atau recommendedRole
  const [roleQuery, setRoleQuery] = useState(null);

  // Get role dari URL parameter atau dari recommendedRole
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam) {
      setRoleQuery(decodeURIComponent(roleParam));
    } else if (recommendedRole && recommendedRole !== "Belum Tersedia") {
      setRoleQuery(recommendedRole);
    }
  }, [searchParams, recommendedRole]);

  // Calculate top match untuk styling
  const topMatch = useMemo(() => {
    if (!formattedJobs || formattedJobs.length === 0) return 0;
    return Math.max(...formattedJobs.map(j => j.match || 0));
  }, [formattedJobs]);

  return {
    formattedJobs,
    loading,
    error,
    profile,
    recommendedRole,
    roleQuery,
    topMatch,
  };
}

