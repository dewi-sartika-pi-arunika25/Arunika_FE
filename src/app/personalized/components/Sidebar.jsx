"use client";
import { motion } from "framer-motion";
import { LayoutDashboard, Brain, History, Briefcase, BookOpen, Loader } from "lucide-react";
import { usePersonalizedProfile } from "@/hooks/usePersonalizedProfile";
import ProfileModal from "./ProfileModal";
import "../personalized.css";

export default function Sidebar({ currentPage, setCurrentPage, profile, setProfile, sidebarOpen, setSidebarOpen }) {
  const { roleFit, profile: personalizedProfile, user, loading } = usePersonalizedProfile();

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
    { name: "Analisis AI", icon: Brain, key: "ai" },
    { name: "Rekomendasi Pekerjaan", icon: Briefcase, key: "jobs" },
    { name: "Rekomendasi SkillUp", icon: BookOpen, key: "skills" },
    { name: "History", icon: History, key: "history" },
  ];

  // Get name dari user API atau fallback ke profile
  const userName = user?.name || profile?.name || "Pengguna Arunika";

  // Extract role dari profile.role_fit (e.g., "Frontend Developer (85%)")
  const extractedRole = personalizedProfile?.role_fit 
    ? personalizedProfile.role_fit.split('(')[0].trim() 
    : profile.job;

  return (
    <aside className="fixed top-0 left-0 h-screen w-72 bg-[#FFF6DC] border-r border-[#E4B200]/30 flex flex-col shadow-md overflow-y-auto">
      {/* === PROFIL === */}
      <div className="flex flex-col items-center text-center py-8 px-4 border-b border-[#E4B200]/30">
        <div className="w-20 h-20 rounded-full bg-[#E4B200] flex items-center justify-center text-white text-2xl font-bold shadow-md mb-4 overflow-hidden">
          {profile.photo ? (
            <img src={profile.photo} className="object-cover w-full h-full" alt="Profile" />
          ) : (
            profile.initials
          )}
        </div>
        <h2 className="text-lg font-semibold text-[#2C2C2C]">{profile.name}</h2>
        <p className="text-sm text-gray-600 mb-4">{profile.location}</p>

        <div className="w-full border-t border-[#E4B200]/30 my-3" />

        {/* === ROLE FIT CIRCLE === */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-24 h-24 rounded-full bg-[#FFFDF5] border-4 border-[#FF8C00]/60 flex flex-col items-center justify-center mb-3 glow-pulse relative"
        >
          {loading ? (
            <Loader className="h-6 w-6 animate-spin text-[#FF8C00]" />
          ) : (
            <>
              <span className="text-xs text-[#A14B00] font-semibold tracking-wider">ROLE FIT</span>
              <span
                className="text-2xl font-extrabold text-[#573c1a]"
                style={{ textShadow: "0 0 10px rgba(255,140,0,0.8)" }}
              >
                {roleFit || 0}%
              </span>
            </>
          )}
        </motion.div>

        {/* === JOB ROLE === */}
        <div className="bg-[#A56400] text-white text-sm font-semibold rounded-full px-5 py-2 shadow-sm mb-3 line-clamp-2 max-w-xs">
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader className="h-4 w-4 animate-spin" />
              Loading...
            </span>
          ) : (
            extractedRole || profile.job
          )}
        </div>

        <ProfileModal profile={profile} setProfile={setProfile} />
      </div>

      {/* === MENU === */}
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setCurrentPage(item.key)}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              currentPage === item.key
                ? "bg-[#FF8C00] text-white shadow-md"
                : "text-gray-700 hover:bg-[#E4B200]/30 hover:text-[#A56400]"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </button>
        ))}
      </nav>
      <div className="h-6" />
    </aside>
  );
}