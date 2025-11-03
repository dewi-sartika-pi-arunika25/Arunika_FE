"use client";

import { useEffect } from "react";
import { useToastStore } from "@/lib/store/toast";
import { X, CheckCircle, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Toast Component - Displays toast notifications
 * 
 * This component is automatically included in the root layout
 * Use the useToastStore hook to show toasts from anywhere
 */

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
};

const toastStyles = {
  success: "bg-green-50 border-green-200 text-green-800",
  error: "bg-red-50 border-red-200 text-red-800",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
  info: "bg-blue-50 border-blue-200 text-blue-800",
  loading: "bg-gray-50 border-gray-200 text-gray-800",
};

const iconStyles = {
  success: "text-green-600",
  error: "text-red-600",
  warning: "text-yellow-600",
  info: "text-blue-600",
  loading: "text-gray-600",
};

function ToastItem({ toast }) {
  const dismiss = useToastStore((state) => state.dismiss);
  const Icon = toastIcons[toast.type] || Info;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[300px] max-w-md
        ${toastStyles[toast.type] || toastStyles.info}
      `}
    >
      <div className={`flex-shrink-0 ${iconStyles[toast.type]}`}>
        <Icon 
          className={`w-5 h-5 ${toast.type === 'loading' ? 'animate-spin' : ''}`} 
        />
      </div>
      
      <div className="flex-1 pt-0.5">
        {toast.title && (
          <p className="font-semibold text-sm mb-1">{toast.title}</p>
        )}
        <p className="text-sm">{toast.message}</p>
        {toast.description && (
          <p className="text-xs mt-1 opacity-80">{toast.description}</p>
        )}
      </div>

      {toast.duration !== 0 && (
        <button
          onClick={() => dismiss(toast.id)}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
}

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}

// Helper hook for easy toast usage
export function useToast() {
  const { show, success, error, warning, info, loading, promise, dismiss, dismissAll } = useToastStore();
  
  return {
    toast: show,
    success,
    error,
    warning,
    info,
    loading,
    promise,
    dismiss,
    dismissAll,
  };
}

export default ToastContainer;

