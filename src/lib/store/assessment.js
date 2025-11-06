// lib/store/assessment.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Assessment Store - Skill Match (DISC + RIASEC) state management
 * 
 * Features:
 * - Persistent storage for assessment progress
 * - Answer tracking
 * - Results caching
 * - Progress tracking
 */
export const useAssessmentStore = create(
  persist(
    (set, get) => ({
      // State
      answers: {},
      currentStep: 0,
      results: null,
      recId: null,
      isCompleted: false,
      lastUpdated: null,

      // Actions
      setAnswer: (questionId, answer) => {
        set((state) => ({
          answers: { ...state.answers, [questionId]: answer },
          lastUpdated: new Date().toISOString(),
        }));
      },

      setAnswers: (answers) => 
        set({ 
          answers, 
          lastUpdated: new Date().toISOString() 
        }),

      updateAnswers: (newAnswers) =>
        set((state) => ({
          answers: { ...state.answers, ...newAnswers },
          lastUpdated: new Date().toISOString(),
        })),

      setCurrentStep: (step) => set({ currentStep: step }),

      nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

      prevStep: () => 
        set((state) => ({ 
          currentStep: Math.max(0, state.currentStep - 1) 
        })),

      setResults: (results, recId = null) => 
        set({ 
          results, 
          recId,
          isCompleted: true,
          lastUpdated: new Date().toISOString(),
        }),

      clearResults: () => 
        set({ 
          results: null, 
          recId: null, 
          isCompleted: false 
        }),

      // Reset semua progress
      reset: () => 
        set({
          answers: {},
          currentStep: 0,
          results: null,
          recId: null,
          isCompleted: false,
          lastUpdated: null,
        }),

      // Reset hanya answers, keep results
      resetAnswers: () =>
        set({
          answers: {},
          currentStep: 0,
          lastUpdated: new Date().toISOString(),
        }),

      // Helpers
      getAnswerCount: () => Object.keys(get().answers).length,

      hasAnswer: (questionId) => !!get().answers[questionId],

      getAnswer: (questionId) => get().answers[questionId],

      getProgress: (totalQuestions) => {
        if (!totalQuestions) return 0;
        const answered = get().getAnswerCount();
        return Math.round((answered / totalQuestions) * 100);
      },
    }),
    {
      name: "assessment-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);

