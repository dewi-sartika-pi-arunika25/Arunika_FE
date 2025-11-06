// lib/store/toast.js
import { create } from "zustand";

/**
 * Toast Notification Store
 * 
 * Manages toast notifications (success, error, warning, info)
 * with auto-dismiss functionality
 * 
 * Usage:
 * ```jsx
 * import { useToastStore } from '@/lib/store/toast';
 * 
 * const showToast = useToastStore((state) => state.show);
 * 
 * // Success toast
 * showToast('Data berhasil disimpan!', 'success');
 * 
 * // Error toast
 * showToast('Terjadi kesalahan', 'error');
 * ```
 */

let toastId = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],

  /**
   * Show a toast notification
   * @param {string} message - Toast message
   * @param {string} type - Toast type: 'success' | 'error' | 'warning' | 'info'
   * @param {number} duration - Duration in ms (default: 3000)
   * @param {object} options - Additional options
   */
  show: (message, type = "info", duration = 3000, options = {}) => {
    const id = ++toastId;
    const toast = {
      id,
      message,
      type,
      duration,
      ...options,
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto dismiss after duration
    if (duration > 0) {
      setTimeout(() => {
        get().dismiss(id);
      }, duration);
    }

    return id;
  },

  /**
   * Show success toast
   */
  success: (message, duration = 3000, options = {}) => {
    return get().show(message, "success", duration, options);
  },

  /**
   * Show error toast
   */
  error: (message, duration = 5000, options = {}) => {
    return get().show(message, "error", duration, options);
  },

  /**
   * Show warning toast
   */
  warning: (message, duration = 4000, options = {}) => {
    return get().show(message, "warning", duration, options);
  },

  /**
   * Show info toast
   */
  info: (message, duration = 3000, options = {}) => {
    return get().show(message, "info", duration, options);
  },

  /**
   * Dismiss a specific toast by id
   */
  dismiss: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    set({ toasts: [] });
  },

  /**
   * Show loading toast
   * Returns toast id to update it later
   */
  loading: (message = "Memproses...", options = {}) => {
    return get().show(message, "loading", 0, options); // duration 0 = no auto-dismiss
  },

  /**
   * Update existing toast
   */
  update: (id, updates) => {
    set((state) => ({
      toasts: state.toasts.map((toast) =>
        toast.id === id ? { ...toast, ...updates } : toast
      ),
    }));
  },

  /**
   * Show promise toast
   * Automatically shows loading -> success/error based on promise result
   */
  promise: async (promise, messages = {}) => {
    const {
      loading = "Memproses...",
      success = "Berhasil!",
      error = "Gagal!",
    } = messages;

    const loadingId = get().loading(loading);

    try {
      const result = await promise;
      get().dismiss(loadingId);
      get().success(success);
      return result;
    } catch (err) {
      get().dismiss(loadingId);
      get().error(typeof error === "function" ? error(err) : error);
      throw err;
    }
  },
}));

