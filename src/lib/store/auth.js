// lib/store/auth.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Auth Store - Centralized authentication state management
 * 
 * Features:
 * - Persistent storage (localStorage)
 * - Token management (access + refresh)
 * - User & profile data
 * - Auth status tracking
 */
export const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      profile: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      _hasHydrated: false, // Internal flag untuk track hydration

      // Actions
      login: (data) => {
        const { access_token, refresh_token, user, profile } = data;
        set({
          user,
          profile,
          accessToken: access_token,
          refreshToken: refresh_token,
          isAuthenticated: true,
          _hasHydrated: true,
        });
      },

      logout: () => {
        set({
          user: null,
          profile: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          _hasHydrated: true,
        });
        
        // Clean up all storage items
        // NOTE: has_assessment is cleared here but remains in backend database.
        // On next login, it will be fetched again from backend API.
        if (typeof window !== 'undefined') {
          // Clear Zustand persist storage (main auth storage)
          // This includes user data, profile, and has_assessment
          localStorage.removeItem('auth-storage');
          
          // Clear any legacy localStorage items
          localStorage.removeItem('token');
          localStorage.removeItem('userProfile');
          localStorage.removeItem('user_id');
          
          // Note: sessionStorage is not used for auth (using localStorage instead)
          // Assessment results may be in sessionStorage but should persist with expiry
        }
      },

      updateProfile: (profile) => set({ profile }),

      updateUser: (user) => set({ user }),

      setTokens: (accessToken, refreshToken) => 
        set({ accessToken, refreshToken, isAuthenticated: true }),

      // Helpers
      getToken: () => get().accessToken,

      getUserId: () => {
        const state = get();
        // Try multiple sources for user_id
        return state.profile?.user_id || 
               state.user?.id || 
               state.user?.user_id ||
               state.profile?.id ||
               null;
      },

      /**
       * Check if user has completed assessment
       * 
       * NOTE: has_assessment is stored in:
       * 1. Backend database (source of truth) - persists after logout
       * 2. Zustand store (localStorage) - cleared on logout for security
       * 
       * On login, has_assessment is fetched from backend and stored here.
       * On logout, this data is cleared but remains in backend database.
       * On next login, it will be fetched again from backend.
       */
      hasAssessment: () => {
        const state = get();
        // Check dari user atau profile
        return state.user?.has_assessment || 
               state.profile?.has_assessment || 
               false;
      },

      isLoggedIn: () => {
        const state = get();
        return state.isAuthenticated && !!state.accessToken;
      },
    }),
    {
      name: "auth-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // On rehydrate, mark as hydrated
      onRehydrateStorage: () => (state) => {
        if (state) {
          state._hasHydrated = true;
        }
      },
    }
  )
);

