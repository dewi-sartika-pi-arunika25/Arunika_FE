"use client";
import { LogOut, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  // Fungsi logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userProfile");
    router.push("/login");
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm rounded-b-2xl border-b border-gray-100"
    >
      {/* Judul */}
      <div>
        <h1 className="text-xl font-semibold text-[#2C2C2C]">
          Selamat Datang, 
        </h1>
        <p className="text-sm text-gray-500">
          Analisis AI & Rekomendasi Personalisasi
        </p>
      </div>

      {/* Search & Logout */}
      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="flex items-center bg-[#FFF6DC] px-3 py-2 rounded-xl shadow-inner">
          <Search size={18} className="text-gray-500" />
          <input
            type="text"
            placeholder="Cari data..."
            className="bg-transparent outline-none text-sm px-2"
          />
        </div>

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
          title="Keluar"
        >
          <LogOut size={20} className="text-red-500" />
          <span className="text-sm font-medium text-red-600">Keluar</span>
        </button>
      </div>
    </motion.header>
  );
}
