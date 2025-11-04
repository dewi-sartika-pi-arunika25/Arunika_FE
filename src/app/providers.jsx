"use client";

/**
 * Providers Component
 * 
 * Wrapper untuk semua context providers yang diperlukan aplikasi.
 * 
 * Note: NextAuth SessionProvider sudah dihapus karena kita menggunakan
 * Zustand store untuk auth state management dengan backend Supabase.
 */
export default function Providers({ children }) {
  return (
    <>
      {children}
    </>
  );
}

