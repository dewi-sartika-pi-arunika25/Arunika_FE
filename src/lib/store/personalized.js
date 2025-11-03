// lib/store/personalized.js
import { create } from "zustand";

/**
 * Personalized Dashboard Store
 * 
 * Manages personalized page UI state:
 * - Active menu navigation
 * - Profile modal state
 * - User profile data (photo, initials, etc)
 */
export const usePersonalizedStore = create((set) => ({
  // State
  activeMenu: "dashboard", // "dashboard" | "analisis" | "rekom-pekerjaan" | "rekom-skill"
  isProfileModalOpen: false,
  userProfile: {
    name: "",
    initials: "",
    photo: "",
  },

  // Actions
  setActiveMenu: (menu) => set({ activeMenu: menu }),
  
  setProfileModalOpen: (open) => set({ isProfileModalOpen: open }),
  
  openProfileModal: () => set({ isProfileModalOpen: true }),
  
  closeProfileModal: () => set({ isProfileModalOpen: false }),
  
  setUserProfile: (profile) => set({ userProfile: profile }),
  
  updateUserProfile: (updates) => 
    set((state) => ({
      userProfile: { ...state.userProfile, ...updates }
    })),

  // Reset to initial state
  reset: () => set({
    activeMenu: "dashboard",
    isProfileModalOpen: false,
    userProfile: {
      name: "",
      initials: "",
      photo: "",
    },
  }),
}));

