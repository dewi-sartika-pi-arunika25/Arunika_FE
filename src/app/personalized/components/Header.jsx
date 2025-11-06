"use client";
import { LogOut, Search, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { usePersonalizedProfile } from "@/hooks/usePersonalizedProfile";
import { useAuthStore } from "@/lib/store/auth";
import { FILTER_OPTIONS } from "@/hooks/useDashboardFilters";
import { useState, useEffect, useRef } from "react";

export default function Header({ 
  searchQuery = "", 
  onSearchChange = () => {},
  roleFilter = "all",
  onRoleFilterChange = () => {},
  priorityFilter = "all",
  onPriorityFilterChange = () => {},
  matchScoreFilter = "all",
  onMatchScoreFilterChange = () => {},
  onResetFilters = () => {},
  showFilter = true, // Flag untuk show/hide filter (hanya di dashboard)
}) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const authStore = useAuthStore();
  const { user } = usePersonalizedProfile();
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);
  
  const authUserName = authStore.user?.user_metadata?.name || authStore.user?.name || authStore.profile?.name;
  const displayName = authUserName || user?.name || 'Pengguna';

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const hasActiveFilters = roleFilter !== "all" || priorityFilter !== "all" || matchScoreFilter !== "all" || searchQuery.trim() !== "";

  // Close filter dropdown ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
    };

    if (showFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters]);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-4 bg-white/80 backdrop-blur-md shadow-sm rounded-b-2xl border-b border-gray-100"
    >
      {/* Judul */}
      <div className="flex-1 min-w-0">
        <h1 className="text-lg sm:text-xl font-semibold text-[#2C2C2C] truncate">
          Selamat Datang, <span className="text-[#E4B200]">{displayName}</span> 🌞
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Analisis AI & Rekomendasi Personalisasi
        </p>
      </div>

      {/* Search, Filter & Logout */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto mt-4 sm:mt-0">
        {/* Search Bar */}
        <div className="flex items-center bg-[#FFF6DC] px-3 py-2 rounded-xl shadow-inner flex-1 sm:flex-none min-w-[200px]">
          <Search size={18} className="text-gray-500 flex-shrink-0" />
          <input
            type="text"
            placeholder="Cari data..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent outline-none text-sm px-2 flex-1 min-w-0"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Button - Hanya tampil jika showFilter = true */}
        {showFilter && (
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-colors ${
                hasActiveFilters
                  ? "bg-[#E4B200] text-white border-[#E4B200]"
                  : "bg-white hover:bg-[#FFF6DC] border-[#E4B200]/30 text-[#2C2C2C]"
              }`}
            >
              <Filter size={18} />
              <span className="text-sm font-medium hidden sm:inline">Filter</span>
              {hasActiveFilters && (
                <span className="text-xs bg-white/20 px-1.5 py-0.5 rounded-full">
                  Aktif
                </span>
              )}
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-[#E4B200]/20 p-4 z-50"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#2C2C2C]">Filter Data</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Role Filter */}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Role
                  </label>
                  <select
                    value={roleFilter}
                    onChange={(e) => onRoleFilterChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B200]"
                  >
                    {FILTER_OPTIONS.role.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Filter */}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Prioritas
                  </label>
                  <select
                    value={priorityFilter}
                    onChange={(e) => onPriorityFilterChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B200]"
                  >
                    {FILTER_OPTIONS.priority.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Match Score Filter */}
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">
                    Match Score
                  </label>
                  <select
                    value={matchScoreFilter}
                    onChange={(e) => onMatchScoreFilterChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E4B200]"
                  >
                    {FILTER_OPTIONS.matchScore.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reset Button */}
                {hasActiveFilters && (
                  <button
                    onClick={() => {
                      onResetFilters();
                      setShowFilters(false);
                    }}
                    className="w-full px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    Reset Filter
                  </button>
                )}
              </div>
            </motion.div>
            )}
          </div>
        )}

        {/* Tombol Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 hover:bg-red-100 transition-colors"
          title="Keluar"
        >
          <LogOut size={20} className="text-red-500" />
          <span className="text-sm font-medium text-red-600 hidden sm:inline">Keluar</span>
        </button>
      </div>
    </motion.header>
  );
}
