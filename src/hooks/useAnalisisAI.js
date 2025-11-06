/**
 * Custom hook untuk AnalisisAI logic
 * Memisahkan business logic dari UI presentation
 */
import { useState, useMemo } from "react";
import { usePersonalizedProfile } from "@/hooks/usePersonalizedProfile";
import { useAuthStore } from "@/lib/store/auth";
import { getStaticAIAnalysis, shouldUseStaticAnalysis } from "@/data/staticAIAnalysis";

export function useAnalisisAI() {
  const {
    profile,
    user,
    loading,
    error,
    roleFit,
    summaryMetrics,
    strengths,
    skillGaps,
    nextSteps,
    formattedJobs,
    aiStatus,
    refreshAIAnalysis,
    refreshingAI,
  } = usePersonalizedProfile();

  const authStore = useAuthStore();
  const authUserName = authStore.user?.user_metadata?.name || authStore.user?.name || authStore.profile?.name;
  const userName = useMemo(() => {
    return authUserName || user?.name || "Pengguna Arunika";
  }, [authUserName, user]);

  // Expanded state untuk accordion sections
  const [expanded, setExpanded] = useState({
    personality: false,
    jobfit: false,
    potensi: false,
    development: false,
    next: false
  });

  const toggle = (key) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Check jika AI insight tersedia
  const hasAIInsight = useMemo(() => {
    return profile?.ai_insight && (
      typeof profile.ai_insight === 'object' ? 
        Object.keys(profile.ai_insight).length > 0 : 
        String(profile.ai_insight).trim().length > 0
    );
  }, [profile]);

  // Determine if should use static analysis as fallback
  const useStatic = useMemo(() => {
    return shouldUseStaticAnalysis(aiStatus, hasAIInsight);
  }, [aiStatus, hasAIInsight]);

  // Get recommended role for static analysis
  const recommendedRole = useMemo(() => {
    return roleFit?.role || null;
  }, [roleFit]);

  // Get AI insight - use static if AI not ready, otherwise use real AI insight
  const aiInsight = useMemo(() => {
    if (useStatic) {
      return getStaticAIAnalysis(recommendedRole);
    }
    return profile?.ai_insight || null;
  }, [useStatic, profile?.ai_insight, recommendedRole]);

  // Create profile with static fallback
  const profileWithFallback = useMemo(() => {
    if (useStatic && !hasAIInsight) {
      return {
        ...profile,
        ai_insight: getStaticAIAnalysis(recommendedRole),
        _isStaticFallback: true // Flag to indicate this is static data
      };
    }
    return profile;
  }, [profile, useStatic, hasAIInsight, recommendedRole]);

  return {
    profile: profileWithFallback,
    user,
    userName,
    loading,
    error,
    roleFit,
    summaryMetrics,
    strengths,
    skillGaps,
    nextSteps,
    formattedJobs,
    aiStatus,
    hasAIInsight: hasAIInsight || useStatic, // Consider static as available insight
    expanded,
    toggle,
    refreshAIAnalysis,
    refreshingAI,
    aiInsight, // Direct access to AI insight (static or real)
    isStaticFallback: useStatic, // Flag to show indicator in UI
  };
}

