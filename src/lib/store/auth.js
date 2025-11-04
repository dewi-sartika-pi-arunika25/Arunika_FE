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
        if (typeof window !== 'undefined') {
          // Clear Zustand persist storage (main auth storage)
          localStorage.removeItem('auth-storage');
          
          // Clear any legacy localStorage items
          localStorage.removeItem('token');
          localStorage.removeItem('userProfile');
          localStorage.removeItem('user_id');
          
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
        return state.profile?.user_id || state.user?.id || null;
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

