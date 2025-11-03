"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";

/**
 * Higher Order Component (HOC) untuk protect pages
 * 
 * Usage:
 * ```jsx
 * function MyProtectedPage() {
 *   return <div>Protected Content</div>;
 * }
 * 
 * export default withAuth(MyProtectedPage);
 * ```
 * 
 * With custom options:
 * ```jsx
 * export default withAuth(MyProtectedPage, {
 *   redirectTo: '/custom-login',
 *   requireRole: 'admin'
 * });
 * ```
 */
export function withAuth(Component, options = {}) {
  const {
    redirectTo = "/login",
    requireRole = null,
    fallback = null,
  } = options;

  return function ProtectedComponent(props) {
    const router = useRouter();
    const { isAuthenticated, isLoggedIn, user, profile } = useAuthStore();

    useEffect(() => {
      // Check authentication
      if (!isAuthenticated || !isLoggedIn()) {
        const currentPath = window.location.pathname + window.location.search;
        router.push(`${redirectTo}?returnUrl=${encodeURIComponent(currentPath)}`);
        return;
      }

      // Check role if required
      if (requireRole) {
        const userRole = profile?.role || user?.role;
        if (userRole !== requireRole) {
          router.push("/unauthorized");
          return;
        }
      }
    }, [isAuthenticated, isLoggedIn, router, user, profile]);

    // Show fallback while checking
    if (!isAuthenticated || !isLoggedIn()) {
      return fallback || (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
            <p className="mt-4 text-gray-600">Memverifikasi akses...</p>
          </div>
        </div>
      );
    }

    // Check role authorization
    if (requireRole) {
      const userRole = profile?.role || user?.role;
      if (userRole !== requireRole) {
        return (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Akses Ditolak</h1>
              <p className="text-gray-600">Anda tidak memiliki izin untuk mengakses halaman ini.</p>
            </div>
          </div>
        );
      }
    }

    // Render protected component
    return <Component {...props} />;
  };
}

// Export default untuk backward compatibility
export default withAuth;

