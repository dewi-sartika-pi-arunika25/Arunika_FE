/**
 * Custom hook untuk dashboard filters
 * Mengelola state dan logic untuk filtering data dashboard
 */
import { useState, useMemo } from "react";

export const FILTER_OPTIONS = {
  role: [
    { value: "all", label: "Semua Role" },
    { value: "Frontend Developer", label: "Frontend" },
    { value: "Backend Developer", label: "Backend" },
    { value: "Project Manager", label: "PM" },
    { value: "UI/UX Designer", label: "UI/UX" },
  ],
  priority: [
    { value: "all", label: "Semua Prioritas" },
    { value: "urgent", label: "Urgent" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ],
  matchScore: [
    { value: "all", label: "Semua Score" },
    { value: "90+", label: "90%+" },
    { value: "80+", label: "80%+" },
    { value: "70+", label: "70%+" },
    { value: "60+", label: "60%+" },
  ],
  competenceLevel: [
    { value: "all", label: "Semua Level" },
    { value: "Pro", label: "Pro" },
    { value: "Menengah", label: "Menengah" },
    { value: "Junior", label: "Junior" },
  ],
};

export function useDashboardFilters() {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [matchScoreFilter, setMatchScoreFilter] = useState("all");

  // Filter jobs berdasarkan search query, role, dan match score
  const filterJobs = (jobs) => {
    if (!jobs || jobs.length === 0) return [];

    let filtered = [...jobs];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.name?.toLowerCase().includes(query) ||
          job.badge?.toLowerCase().includes(query)
      );
    }

    // Filter by role (if job has role property)
    if (roleFilter !== "all") {
      filtered = filtered.filter((job) => {
        const jobRole = job.name || job.role || "";
        return jobRole.toLowerCase().includes(roleFilter.toLowerCase());
      });
    }

    // Filter by match score
    if (matchScoreFilter !== "all") {
      const minScore = parseInt(matchScoreFilter);
      filtered = filtered.filter((job) => (job.match || 0) >= minScore);
    }

    return filtered;
  };

  // Filter skill gaps berdasarkan search query dan priority
  const filterSkillGaps = (skillGaps) => {
    if (!skillGaps || skillGaps.length === 0) return [];

    let filtered = [...skillGaps];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (skill) =>
          skill.skill?.toLowerCase().includes(query) ||
          skill.skillFull?.toLowerCase().includes(query) ||
          skill.name?.toLowerCase().includes(query)
      );
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter((skill) => {
        const priority = skill.priority;
        const priorityLabel = skill.priorityLabel?.toLowerCase() || "";
        
        if (priorityFilter === "urgent") {
          return priority === 5 || priorityLabel.includes("urgent");
        } else if (priorityFilter === "high") {
          return priority === 4 || priorityLabel.includes("high");
        } else if (priorityFilter === "medium") {
          return priority === 3 || priorityLabel.includes("medium");
        } else if (priorityFilter === "low") {
          return priority < 3 || priorityLabel.includes("low");
        }
        return true;
      });
    }

    return filtered;
  };

  // Filter next steps berdasarkan search query dan priority
  const filterNextSteps = (nextSteps) => {
    if (!nextSteps || nextSteps.length === 0) return [];

    let filtered = [...nextSteps];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (step) =>
          step.title?.toLowerCase().includes(query) ||
          step.description?.toLowerCase().includes(query)
      );
    }

    // Filter by priority
    if (priorityFilter !== "all") {
      filtered = filtered.filter((step) => {
        const priority = step.priority?.toUpperCase() || "";
        return priority === priorityFilter.toUpperCase();
      });
    }

    return filtered;
  };

  // Filter strengths berdasarkan search query
  const filterStrengths = (strengths) => {
    if (!strengths || strengths.length === 0) return [];

    let filtered = [...strengths];

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (strength) =>
          strength.name?.toLowerCase().includes(query) ||
          strength.code?.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const resetFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setPriorityFilter("all");
    setMatchScoreFilter("all");
  };

  return {
    // State
    searchQuery,
    roleFilter,
    priorityFilter,
    matchScoreFilter,

    // Setters
    setSearchQuery,
    setRoleFilter,
    setPriorityFilter,
    setMatchScoreFilter,

    // Filter functions
    filterJobs,
    filterSkillGaps,
    filterNextSteps,
    filterStrengths,

    // Utils
    resetFilters,
  };
}

