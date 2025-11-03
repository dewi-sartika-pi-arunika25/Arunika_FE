"use client";

import { useState, useEffect } from "react";
import { Home, Brain, Target, BarChart3, Pencil } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { usePersonalizedProfile } from "@/hooks/usePersonalizedProfile";
import { useAuthStore } from "@/lib/store/auth";

export default function Sidebar({ activeMenu, setActiveMenu, userProfile = {}, onEditProfile }) {
  const { user } = usePersonalizedProfile();
  const authStore = useAuthStore();
  
  // ✅ Get name from auth store (user.name atau profile.name dari login)
  const authUserName = authStore.user?.user_metadata?.name || authStore.user?.name || authStore.profile?.name;
  const displayName = authUserName || user?.name || userProfile.name || "Pengguna";
  const initials = (displayName?.match(/\b\w/g) || []).slice(0,2).join('').toUpperCase() || userProfile.initials || "US";
  const photo = userProfile.photo;
  const menuItems = [
    { key: "dashboard", icon: <Home size={20} />, label: "Dashboard" },
    { key: "analisis", icon: <Brain size={20} />, label: "Analisis AI" },
    { key: "rekom-pekerjaan", icon: <Target size={20} />, label: "Rekomendasi Pekerjaan" },
    { key: "rekom-skill", icon: <BarChart3 size={20} />, label: "Skill Up" },
  ];

  return (
    <aside className="hidden lg:flex sticky top-0 h-screen w-64 bg-gradient-to-b from-yellow-50 to-yellow-100 flex-col justify-between shadow-sm">
      <div>
        {/* Logo */}
        <div className="p-6 text-left">
          <h1 className="text-2xl font-bold text-gray-800">
            <span className="text-yellow-600">Arunika</span> 
          </h1>

          {/* === Profile Section === */}
          <div className="mt-8 flex flex-col items-center relative">
            {/* Foto Profil */}
            <div className="relative">
              {photo ? (
                <Image
                  src={photo}
                  alt="Profile"
                  width={64}
                  height={64}
                  className="rounded-full object-cover w-16 h-16 shadow-inner"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xl font-bold shadow-inner">
                  {initials}
                </div>
              )}

              {/* Tombol Edit */}
              <button
                onClick={onEditProfile}
                className="absolute -bottom-1 -right-1 bg-yellow-500 hover:bg-yellow-600 text-white p-1 rounded-full shadow"
              >
                <Pencil size={14} />
              </button>
            </div>

            {/* Nama */}
            <p className="mt-3 font-semibold text-gray-800 text-center">
              {displayName}
            </p>
          </div>
        </div>

        {/* === Menu Navigasi === */}
        <nav className="mt-10 px-3">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.key;
            return (
              <motion.div
                key={item.key}
                onClick={() => setActiveMenu(item.key)}
                whileHover={{ scale: 1.02 }}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 mb-2 cursor-pointer transition-all ${
                  isActive
                    ? "bg-yellow-500 text-white shadow-md"
                    : "text-gray-700 hover:bg-yellow-200"
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.label}</span>
              </motion.div>
            );
          })}
        </nav>
      </div>

      {/* Footer */}
      <div className="p-4 text-center text-xs text-gray-400">© 2025 Arunika. All Rights Reserved</div>
    </aside>
  );
}
