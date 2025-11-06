"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

/**
 * ProtectedRoute Component
 * 
 * Wrapper component untuk protect pages yang memerlukan authentication
 * Automatically redirect ke /login jika user belum authenticated
 * 
 * Fix: Menunggu Zustand persist hydration selesai sebelum check auth
 * 
 * Usage:
 * ```jsx
 * <ProtectedRoute>
 *   <YourProtectedContent />
 * </ProtectedRoute>
 * ```
 * 
 * Optional redirect parameter:
 * ```jsx
 * <ProtectedRoute redirectTo="/custom-login">
 *   <YourProtectedContent />
 * </ProtectedRoute>
 * ```
 */
export default function ProtectedRoute({ 
  children, 
  redirectTo = "/login",
  fallback = null 
}) {
  const router = useRouter();
  const { isAuthenticated, isLoggedIn, _hasHydrated } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  // Wait for component to mount (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if hydrated: _hasHydrated flag OR component is mounted (fallback)
  const isHydrated = typeof window !== 'undefined' && (_hasHydrated === true || isMounted);

  useEffect(() => {
    // Only check auth after hydration is complete and component is mounted
    if (!isHydrated) return;

    // Check if user is authenticated
    if (!isAuthenticated || !isLoggedIn()) {
      // Redirect to login with return URL
      const currentPath = window.location.pathname + window.location.search;
      router.push(`${redirectTo}?returnUrl=${encodeURIComponent(currentPath)}`);
    }
  }, [isHydrated, isAuthenticated, isLoggedIn, router, redirectTo]);

  // Show fallback while hydrating or checking auth
  if (!isHydrated || !isAuthenticated || !isLoggedIn()) {
    return fallback || (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
          <p className="mt-4 text-gray-600">
            {!isHydrated ? 'Memuat sesi...' : 'Memverifikasi akses...'}
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated, show protected content
  return <>{children}</>;
}

